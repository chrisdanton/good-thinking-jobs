import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DEPARTMENTS, LOCATION_TYPES, ROLE_LEVELS } from "@/lib/constants";

function authorized(key: string | null | undefined): boolean {
  return !!process.env.ADMIN_PASSWORD && key === process.env.ADMIN_PASSWORD;
}

// LinkedIn job links show a "please sign in" wall to anything that isn't a
// logged-in browser, so a plain fetch returns no job content. LinkedIn does,
// however, expose a public "guest" endpoint that renders the same posting
// without login. If the URL is a LinkedIn job link, pull out its numeric job id
// and read that guest endpoint instead. Everything else is fetched as-is.
function readableUrlFor(url: string): string {
  if (!/linkedin\.com/i.test(url)) return url;
  const m =
    url.match(/\/jobs\/view\/(\d+)/) ||
    url.match(/[?&](?:currentJobId|refId)=(\d+)/) ||
    url.match(/-(\d{6,})(?:\/|\?|$)/);
  const id = m?.[1];
  return id
    ? `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${id}`
    : url;
}

// Pull the human-readable content out of a fetched job page: any embedded
// schema.org JobPosting JSON (most ATS/job sites include it) plus a plain-text
// version of the body. We hand both to Claude so it can fill the form even when
// the structured data is missing.
function extractReadable(html: string): { jsonLd: string; text: string } {
  const jsonLdBlocks: string[] = [];
  const scriptRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = scriptRe.exec(html)) !== null) {
    const raw = m[1].trim();
    if (/jobposting/i.test(raw)) jsonLdBlocks.push(raw);
  }

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  return {
    jsonLd: jsonLdBlocks.join("\n\n").slice(0, 20000),
    // Cap the body so we don't send an enormous prompt; the top of a job page
    // holds the relevant content.
    text: text.slice(0, 18000),
  };
}

// POST /api/admin/curate/extract  body: { key, url }
// Fetches the job page and uses Claude to fill the posting form. Returns the
// fields for review in the admin panel; does not save anything.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (!authorized(body.key)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = String(body.url || "").trim();
  if (!/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "Enter a full job URL starting with http:// or https://" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "The AI reader isn't set up yet. Add an ANTHROPIC_API_KEY in Vercel (see setup steps)." },
      { status: 500 }
    );
  }

  // Fetch the page. Some sites block obvious bots, so send a browser-like UA.
  // LinkedIn links are swapped for their public guest endpoint (see helper);
  // the original url is still what we save as the apply link below.
  const fetchUrl = readableUrlFor(url);
  let html = "";
  try {
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Couldn't open that page (status ${res.status}). Try a different link or fill it in by hand.` },
        { status: 502 }
      );
    }
    html = await res.text();
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach that page. Check the link, or fill the job in by hand." },
      { status: 502 }
    );
  }

  const { jsonLd, text } = extractReadable(html);

  const schema = {
    type: "object",
    properties: {
      title: { type: "string", description: "The job title, e.g. 'VP of Brand Marketing'" },
      companyName: { type: "string", description: "The hiring company's name" },
      companyWebsite: { type: "string", description: "The company's website URL, or empty string if unknown" },
      location: { type: "string", description: "City/region, e.g. 'New York, NY' or 'United States'" },
      locationType: { type: "string", enum: LOCATION_TYPES },
      department: { type: "string", enum: DEPARTMENTS },
      roleLevel: { type: "string", enum: ROLE_LEVELS },
      salaryMin: { type: "integer", description: "Annual USD minimum, whole number (e.g. 150000). 0 if not stated." },
      salaryMax: { type: "integer", description: "Annual USD maximum, whole number. 0 if not stated." },
      description: { type: "string", description: "2-4 short paragraphs about the role, in plain text (no HTML/markdown)." },
      requirements: { type: "string", description: "Key requirements/qualifications as short lines. Empty string if none stated." },
    },
    required: [
      "title",
      "companyName",
      "companyWebsite",
      "location",
      "locationType",
      "department",
      "roleLevel",
      "salaryMin",
      "salaryMax",
      "description",
      "requirements",
    ],
    additionalProperties: false,
  };

  const client = new Anthropic();

  const prompt = `You are helping curate listings for a marketing & brand leadership job board. Extract the job posting below into the required fields.

Rules:
- Pick the closest "department" and "roleLevel" from the allowed options.
- Salaries: annual USD as whole numbers. If a range isn't stated, use 0 for both.
- "description" and "requirements" must be plain text (no HTML tags, no markdown, no "*" bullets — use short lines).
- If a field is genuinely unknown, use an empty string (or 0 for salary). Do not invent facts.

Source URL: ${url}

${jsonLd ? `Structured job data found on the page (most reliable):\n${jsonLd}\n\n` : ""}Page text:\n${text}`;

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 4000,
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema },
      },
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = msg.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "The AI reader didn't return anything usable. Fill it in by hand." }, { status: 502 });
    }

    const fields = JSON.parse(textBlock.text);
    // Default the apply link to the original posting.
    fields.externalApplyUrl = url;
    return NextResponse.json(fields);
  } catch (err) {
    console.error("Curate extract failed:", err);
    return NextResponse.json(
      { error: "The AI reader hit an error. Try again, or fill the job in by hand." },
      { status: 502 }
    );
  }
}
