import Anthropic from "@anthropic-ai/sdk";
import { DEPARTMENTS, LOCATION_TYPES, ROLE_LEVELS } from "@/lib/constants";

// Reading a job posting off the open web and turning it into our job fields.
// Used by the /admin "Add from Link" panel and by the phone share endpoint
// (/api/share), so both paths transcribe postings identically.

export interface ExtractedJob {
  title: string;
  companyName: string;
  companyWebsite: string;
  location: string;
  locationType: string;
  department: string;
  roleLevel: string;
  salaryMin: number;
  salaryMax: number;
  description: string;
  requirements: string;
  externalApplyUrl: string;
}

// A failure we can explain to a human, rather than a stack trace.
export class ExtractError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

// LinkedIn job links show a "please sign in" wall to anything that isn't a
// logged-in browser, so a plain fetch returns no job content. LinkedIn does,
// however, expose a public "guest" endpoint that renders the same posting
// without login. If the URL is a LinkedIn job link, pull out its numeric job id
// and read that guest endpoint instead. Everything else is fetched as-is.
export function readableUrlFor(url: string): string {
  // Apple's careers site renders the posting in the browser with Javascript, so
  // the HTML we fetch is only chrome and navigation — the job text isn't in it.
  // Their site calls this JSON endpoint for the real content; read that instead.
  if (/jobs\.apple\.com/i.test(url)) {
    const m = url.match(/\/details\/(\d+-\d+)/) || url.match(/\/details\/(\d+)/);
    if (m) return `https://jobs.apple.com/api/v1/jobDetails/${m[1]}`;
  }

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

// A lot of company career pages (a16z's portfolio jobs among them) are just a
// Javascript shell that embeds a Greenhouse board: the page HTML carries no job
// content, only a `?gh_jid=<id>` in the link and a Greenhouse embed script that
// names the board. Greenhouse's public API returns the full posting as JSON, so
// when we spot that pattern we read the API instead of the empty shell. Needs
// the fetched HTML because the board token lives in the page, not the URL.
function greenhouseApiFor(url: string, html: string): string | null {
  const jid = url.match(/[?&]gh_jid=(\d+)/)?.[1];
  if (!jid) return null;
  const board =
    html.match(/greenhouse\.io\/embed\/job_board\/js\?for=([a-z0-9_-]+)/i)?.[1] ||
    html.match(/boards(?:-api)?\.greenhouse\.io\/v1\/boards\/([a-z0-9_-]+)/i)?.[1];
  if (!board) return null;
  return `https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${jid}`;
}

// Notion job pages (e.g. a small company that posts its roles as a public Notion
// doc) are drawn entirely by Javascript: the fetched HTML is just a loading
// spinner with no job text and no structured data, so the normal reader comes
// back empty. Notion does expose the real content through a public JSON endpoint
// its own web app calls — loadPageChunk — which returns every block on the page.
// When the link is a Notion page, read that endpoint and flatten the blocks into
// plain text instead of fetching the empty shell. Returns null for non-Notion
// links or if the endpoint can't be read (we then fall back to the normal fetch).
function notionPageIdFor(url: string): { origin: string; pageId: string } | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)notion\.(site|so)$/i.test(u.hostname)) return null;
  // The page id is the last run of 32 hex characters in the path.
  const hex = u.pathname.replace(/-/g, "").match(/([0-9a-f]{32})(?!.*[0-9a-f]{32})/i)?.[1];
  if (!hex) return null;
  const pageId = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
    16,
    20
  )}-${hex.slice(20)}`;
  // notion.so pages are served from www.notion.so; *.notion.site keeps its host.
  const origin = /notion\.so$/i.test(u.hostname) ? "https://www.notion.so" : u.origin;
  return { origin, pageId };
}

async function readNotionPage(url: string): Promise<string | null> {
  const target = notionPageIdFor(url);
  if (!target) return null;
  let record: Record<string, { value?: { value?: NotionBlock } }>;
  try {
    const res = await fetch(`${target.origin}/api/v3/loadPageChunk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
      },
      body: JSON.stringify({
        pageId: target.pageId,
        limit: 200,
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      recordMap?: { block?: Record<string, { value?: { value?: NotionBlock } }> };
    };
    record = data.recordMap?.block || {};
  } catch {
    return null;
  }

  const blockOf = (id: string): NotionBlock | undefined => record[id]?.value?.value;
  const rootId = Object.keys(record).find((id) => blockOf(id)?.type === "page");
  if (!rootId) return null;

  // A title property is an array of [text, ...formatting] runs; we keep the text.
  const runText = (title: unknown): string =>
    Array.isArray(title)
      ? title
          .map((run) => (Array.isArray(run) && typeof run[0] === "string" ? run[0] : ""))
          .join("")
      : "";

  const lines: string[] = [];
  const seen = new Set<string>();
  const walk = (id: string) => {
    if (seen.has(id)) return; // guard against a malformed cyclic content list
    seen.add(id);
    const b = blockOf(id);
    if (!b) return;
    const text = runText(b.properties?.title);
    if (/header/i.test(b.type || "")) {
      if (text) lines.push(`\n${text}\n`);
    } else if (/list|to_do/i.test(b.type || "")) {
      if (text) lines.push(`- ${text}`);
    } else if (text.trim()) {
      lines.push(text);
    }
    for (const child of b.content || []) walk(child);
  };
  walk(rootId);

  const out = lines.join("\n").trim();
  return out.length > 40 ? out : null;
}

interface NotionBlock {
  type?: string;
  properties?: { title?: unknown };
  content?: string[];
}

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Distill a schema.org JobPosting JSON block down to the fields we care about.
//
// Some sites (REI's careers site among them) render the whole posting through
// Javascript, so the readable body is nearly empty and the real content lives
// only inside a JSON-LD blob that can run past 100KB. Keeping just the first
// slice of that raw blob would cut off the description — and with it the salary,
// which on those pages appears as text partway down the description rather than
// in a structured field. Parsing the block and pulling the fields out keeps the
// whole description while making the prompt smaller, not larger.
function distillJobPosting(raw: string): string | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  // A block can be a single node, an array, or wrapped in an @graph.
  const nodes: Record<string, unknown>[] = Array.isArray(data)
    ? (data as Record<string, unknown>[])
    : ((data as Record<string, unknown>)["@graph"] as Record<string, unknown>[]) || [
        data as Record<string, unknown>,
      ];
  const jp = nodes.find((n) => n && /JobPosting/i.test(String(n["@type"])));
  if (!jp) return null;

  const parts: string[] = [];
  const str = (v: unknown) => (typeof v === "string" ? v : "");

  if (jp.title) parts.push(`Title: ${stripTags(str(jp.title))}`);

  const org = jp.hiringOrganization as Record<string, unknown> | string | undefined;
  const orgName = typeof org === "string" ? org : str(org?.name as string);
  if (orgName) parts.push(`Company: ${orgName}`);
  const orgUrl = typeof org === "object" ? str(org?.url as string) : "";
  if (orgUrl) parts.push(`Company website: ${orgUrl}`);

  // Only surface a structured salary when it carries real numbers. A blank
  // baseSalary (some sites emit zeros) would otherwise read as "the salary is 0"
  // and suppress the real figure that's written into the description text.
  const bs = jp.baseSalary as Record<string, unknown> | undefined;
  const val = bs?.value as Record<string, unknown> | undefined;
  const minV = Number(val?.minValue) || 0;
  const maxV = Number(val?.maxValue) || 0;
  const single = Number(val?.value) || 0;
  if (minV > 0 || maxV > 0 || single > 0) {
    const cur = str(bs?.currency) || "USD";
    parts.push(
      `Stated salary: ${cur} ${minV || single}${maxV ? ` to ${maxV}` : ""} per ${str(
        val?.unitText
      ).toLowerCase() || "year"}`
    );
  }

  const loc = jp.jobLocation as Record<string, unknown> | Record<string, unknown>[] | undefined;
  const firstLoc = Array.isArray(loc) ? loc[0] : loc;
  const addr = firstLoc?.address as Record<string, unknown> | undefined;
  if (addr) {
    const bits = [addr.addressLocality, addr.addressRegion, addr.addressCountry]
      .map((v) => str(v as string))
      .filter(Boolean);
    if (bits.length) parts.push(`Location: ${bits.join(", ")}`);
  }
  if (jp.employmentType) parts.push(`Employment type: ${stripTags(str(jp.employmentType))}`);

  if (jp.description) parts.push(`\nDescription:\n${stripTags(str(jp.description))}`);
  if (jp.qualifications) parts.push(`\nQualifications:\n${stripTags(str(jp.qualifications))}`);
  if (jp.responsibilities) parts.push(`\nResponsibilities:\n${stripTags(str(jp.responsibilities))}`);

  const out = parts.join("\n").trim();
  return out.length > 40 ? out : null;
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

  // Some boards (SmartRecruiters among them) mark the posting up with inline
  // schema.org microdata rather than a JSON-LD script block. There's no JSON to
  // lift out in that case, but the element carrying itemtype="…/JobPosting"
  // wraps the posting itself, so narrowing to it drops the surrounding page
  // furniture before the text is flattened below.
  if (jsonLdBlocks.length === 0) {
    const micro = html.match(
      /<(\w+)[^>]*itemtype=["'][^"']*schema\.org\/JobPosting["'][\s\S]*?<\/\1>/i
    );
    if (micro && micro[0].length > 500) html = micro[0];
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

  // Prefer a parsed, distilled JobPosting (keeps the full description, salary
  // included, in a fraction of the size). Fall back to the raw blocks only when
  // none parse into something usable.
  const distilled = jsonLdBlocks.map(distillJobPosting).filter(Boolean).join("\n\n");
  const jsonLd = distilled || jsonLdBlocks.join("\n\n").slice(0, 30000);

  return {
    jsonLd: jsonLd.slice(0, 30000),
    // Cap the body so we don't send an enormous prompt; the top of a job page
    // holds the relevant content.
    text: text.slice(0, 18000),
  };
}

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
    description: {
      type: "string",
      description:
        "The posting's own description of the role, copied word-for-word from the source, in plain text (no HTML/markdown).",
    },
    requirements: {
      type: "string",
      description:
        "The posting's own requirements/qualifications, copied word-for-word, one per line. Empty string if none stated.",
    },
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

// Fetches a job URL and transcribes it into our fields. Throws ExtractError with
// a human-readable message when the page can't be read.
export async function extractJobFromUrl(url: string): Promise<ExtractedJob> {
  if (!/^https?:\/\//i.test(url)) {
    throw new ExtractError("Enter a full job URL starting with http:// or https://", 400);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ExtractError(
      "The AI reader isn't set up yet. Add an ANTHROPIC_API_KEY in Vercel (see setup steps).",
      500
    );
  }

  // Notion pages carry no content in their HTML; read Notion's own content API
  // and hand the flattened blocks straight to the model as the page text.
  const notionText = await readNotionPage(url);

  // Fetch the page. Some sites block obvious bots, so send a browser-like UA.
  // LinkedIn links are swapped for their public guest endpoint (see helper);
  // the original url is still what we save as the apply link below.
  const fetchUrl = readableUrlFor(url);
  let html = "";
  let isJson = false;
  if (!notionText) try {
    const res = await fetch(fetchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/json",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new ExtractError(
        `Couldn't open that page (status ${res.status}). Try a different link or fill it in by hand.`
      );
    }
    html = await res.text();
    // Endpoints like Apple's hand back JSON, not a page. Stripping HTML tags
    // from JSON would be meaningless, so pass the body straight through as the
    // structured source instead.
    isJson = (res.headers.get("content-type") || "").includes("json");

    // If the page is a Greenhouse embed shell, the content is only in the
    // Greenhouse API. Follow it once, and use that JSON instead of the shell.
    if (!isJson) {
      const ghUrl = greenhouseApiFor(url, html);
      if (ghUrl) {
        try {
          const res2 = await fetch(ghUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
              Accept: "application/json",
            },
            redirect: "follow",
          });
          if (res2.ok) {
            html = await res2.text();
            isJson = true;
          }
        } catch {
          /* couldn't reach the API — fall back to the shell HTML we already have */
        }
      }
    }
  } catch (err) {
    if (err instanceof ExtractError) throw err;
    throw new ExtractError("Couldn't reach that page. Check the link, or fill the job in by hand.");
  }

  const { jsonLd, text } = notionText
    ? { jsonLd: "", text: notionText.slice(0, 30000) }
    : isJson
    ? { jsonLd: html.slice(0, 30000), text: "" }
    : extractReadable(html);

  const prompt = `You are transcribing a job posting onto a marketing & brand leadership job board. Your job is to COPY, not to write.

Rules:
- "description" and "requirements" must be the posting's own words, copied verbatim from the source. Do not summarize, paraphrase, condense, re-order, or improve the wording. Do not add framing sentences of your own.
- The only edits allowed on copied text: strip HTML tags, markdown and "*"/"-" bullet characters, drop navigation/cookie/footer boilerplate that isn't part of the posting, and normalize whitespace into readable lines and paragraphs.
- If the posting is long, copy all of it. Length is not a problem; losing the company's language is.
- "requirements": copy the qualifications/requirements section as written, one item per line. If the posting has no separate requirements section, leave it empty rather than inventing one by pulling lines out of the description.
- "title", "companyName", "location": copy exactly as written on the posting.
- "department", "roleLevel", "locationType": these are our board's own filing categories, so pick the closest option from the allowed list.
- Salaries: annual USD as whole numbers, only if the posting states them. If no range is stated, use 0 for both. Never estimate a salary.
- If a field is genuinely unknown, use an empty string (or 0 for salary). Never invent, infer, or fill a gap with plausible-sounding text.

Source URL: ${url}

${jsonLd ? `Structured job data found on the page (most reliable):\n${jsonLd}\n\n` : ""}Page text:\n${text}`;

  const client = new Anthropic();

  let msg;
  try {
    msg = await client.messages.create({
      model: "claude-opus-4-8",
      // Verbatim copying needs far more room than a summary did — a long posting
      // can run several thousand tokens on its own.
      max_tokens: 16000,
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema },
      },
      messages: [{ role: "user", content: prompt }],
    });
  } catch (err) {
    console.error("Curate extract failed:", err);
    throw new ExtractError("The AI reader hit an error. Try again, or fill the job in by hand.");
  }

  const textBlock = msg.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new ExtractError("The AI reader didn't return anything usable. Fill it in by hand.");
  }

  const fields = JSON.parse(textBlock.text) as ExtractedJob;
  // Default the apply link to the original posting.
  fields.externalApplyUrl = url;
  return fields;
}
