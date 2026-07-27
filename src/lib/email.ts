import nodemailer from "nodemailer";
import { Job } from "./types";

// Sends mail through Gmail's SMTP. Requires GMAIL_USER (the full Gmail/Workspace
// address) and GMAIL_APP_PASSWORD (a 16-character Google "app password").
function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be set");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

async function sendMail(opts: { to: string; subject: string; html: string }) {
  const user = process.env.GMAIL_USER;
  // Gmail rewrites the From to the authenticated account, so we use it directly
  // with a friendly display name.
  await getTransport().sendMail({
    from: `"GOOD THINKING Jobs" <${user}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}

const ADMIN_EMAIL = "goodjobs@weareingoodco.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://getgoodthinking.com";

function formatSalary(min: number, max: number) {
  if (!min && !max) return "Salary not listed";
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}K`;
  if (!max) return `From ${fmt(min)}`;
  if (!min) return `Up to ${fmt(max)}`;
  return `${fmt(min)} – ${fmt(max)}`;
}

// Email 1: Admin approval request
export async function sendApprovalRequest(job: Job, referralCode?: string) {
  const approveUrl = `${BASE_URL}/api/approve?id=${job.id}&token=${job.approvalToken}`;
  const denyUrl = `${BASE_URL}/api/deny?id=${job.id}&token=${job.approvalToken}`;

  await sendMail({
    to: ADMIN_EMAIL,
    subject: `JOB FOR APPROVAL: ${job.companyName} · ${job.title}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; padding: 40px;">
        <div style="background: #F9FF00; padding: 12px 20px; margin-bottom: 32px; display: inline-block;">
          <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #111;">GOOD THINKING JOBS</span>
        </div>

        <h1 style="font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: -0.02em; margin: 0 0 8px; color: #fff;">
          New Job Submission
        </h1>
        <p style="font-size: 13px; color: rgba(255,255,255,0.5); margin: 0 0 32px; text-transform: uppercase; letter-spacing: 0.08em;">
          Awaiting your approval
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); width: 140px;">Company</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff; font-weight: 600;">${job.companyName}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Title</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff;">${job.title}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Department</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff;">${job.department}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Location</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff;">${job.location} · ${job.locationType}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Level</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff;">${job.roleLevel}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Salary</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff;">${formatSalary(job.salaryMin, job.salaryMax)}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Plan</td>
            <td style="padding: 10px 0; font-size: 14px; color: #F9FF00; font-weight: 700; text-transform: uppercase;">${job.tier}</td>
          </tr>
          ${referralCode ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Referral</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff;">${referralCode} · <span style="color: rgba(255,255,255,0.5);">posted free</span></td>
          </tr>
          ` : ""}
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Posted by</td>
            <td style="padding: 10px 0; font-size: 14px; color: #fff;">${job.posterName} · ${job.posterEmail}</td>
          </tr>
          ${job.companyWebsite ? `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
            <td style="padding: 10px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4);">Website</td>
            <td style="padding: 10px 0; font-size: 14px;"><a href="${job.companyWebsite}" style="color: #F9FF00;">${job.companyWebsite}</a></td>
          </tr>
          ` : ""}
        </table>

        <div style="background: rgba(255,255,255,0.05); padding: 20px; margin-bottom: 32px; border-left: 3px solid rgba(255,255,255,0.1);">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.4); margin: 0 0 10px;">Description</p>
          <p style="font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.7; margin: 0; white-space: pre-wrap;">${job.description}</p>
        </div>

        <div style="display: flex; gap: 16px; margin-bottom: 40px;">
          <a href="${approveUrl}" style="display: inline-block; background: #F9FF00; color: #111; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; text-decoration: none; margin-right: 12px;">
            ✓ Approve &amp; Publish
          </a>
          <a href="${denyUrl}" style="display: inline-block; background: transparent; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 14px 32px; text-decoration: none; border: 1px solid rgba(255,255,255,0.2);">
            ✗ Deny
          </a>
        </div>

        <p style="font-size: 11px; color: rgba(255,255,255,0.25); margin: 0; line-height: 1.6;">
          These links are single-use and unique to this submission. Approving will immediately publish the listing and notify the poster.
        </p>
      </div>
    `,
  });
}

// Email 2: Poster — job approved
export async function sendApprovedEmail(job: Job) {
  const jobUrl = `${BASE_URL}/jobs/${job.id}`;

  await sendMail({
    to: job.posterEmail,
    subject: `Your listing is live: ${job.title} at ${job.companyName}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111; padding: 48px 44px; border: 1px solid #eeeeee;">
        <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #111; padding-bottom: 20px; border-bottom: 2px solid #111; display: inline-block;">GOOD THINKING JOBS</div>

        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin: 36px 0 20px; color: #111; line-height: 1.2;">
          Your listing is live.
        </h1>

        <p style="font-size: 16px; color: #333333; line-height: 1.7; margin: 0 0 16px;">
          <strong>${job.title}</strong> at <strong>${job.companyName}</strong> is now published on GOOD THINKING Jobs.
        </p>
        <p style="font-size: 16px; color: #555555; line-height: 1.7; margin: 0 0 28px;">
          It's live in front of the 17,000+ brand, marketing, and creative leaders who read GOOD THINKING every Sunday.
        </p>

        <p style="margin: 0 0 36px;">
          <a href="${jobUrl}" style="font-size: 15px; font-weight: 700; color: #111; text-decoration: none; border-bottom: 2px solid #F9FF00; padding-bottom: 2px;">View your listing &rarr;</a>
        </p>

        ${job.tier === "premium" ? `
        <div style="background: #fffde6; border: 1px solid #f0ee99; padding: 20px; margin-bottom: 28px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #111; margin: 0 0 8px; font-weight: 700;">Premium · Newsletter Feature</p>
          <p style="font-size: 13px; color: #555555; line-height: 1.65; margin: 0;">
            Your listing is set to be featured in an upcoming GOOD THINKING Sunday newsletter. Listings submitted by end of day Thursday make that Sunday's letter. We'll reach out if we need anything from you before it goes out.
          </p>
        </div>
        ` : ""}

        <p style="font-size: 13px; color: #888888; line-height: 1.65; margin: 0; border-top: 1px solid #eeeeee; padding-top: 24px;">
          Active for 30 days. Questions? Reply to this email or reach us at goodjobs@weareingoodco.com.<br><br>GOOD THINKING · The weekly briefing on brand, culture, and marketing.
        </p>
      </div>
    `,
  });
}

// Email 3: Poster — job denied
export async function sendDeniedEmail(job: Job) {
  await sendMail({
    to: job.posterEmail,
    subject: `An update on your GOOD THINKING Jobs submission`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111; padding: 48px 44px; border: 1px solid #eeeeee;">
        <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #111; padding-bottom: 20px; border-bottom: 2px solid #111; display: inline-block;">GOOD THINKING JOBS</div>

        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin: 36px 0 20px; color: #111; line-height: 1.2;">
          Not quite a fit.
        </h1>

        <p style="font-size: 16px; color: #333333; line-height: 1.7; margin: 0 0 16px;">
          Thanks for submitting <strong>${job.title}</strong> at <strong>${job.companyName}</strong> to GOOD THINKING Jobs.
        </p>
        <p style="font-size: 16px; color: #555555; line-height: 1.7; margin: 0 0 36px;">
          We took a close look, and this one isn't quite right for our audience. If you think you've received this in error, though, please send us an email at <a href="mailto:goodjobs@weareingoodco.com" style="color: #111; font-weight: 600;">goodjobs@weareingoodco.com</a>.
        </p>

        <p style="font-size: 13px; color: #888888; line-height: 1.65; margin: 0; border-top: 1px solid #eeeeee; padding-top: 24px;">
          GOOD THINKING · The weekly briefing on brand, culture, and marketing.
        </p>
      </div>
    `,
  });
}

// Email 4: Friday newsletter digest — sent to Chris to prep the Sunday letter.
const DIGEST_RECIPIENT = "chris@weareingoodco.com";

function digestJobRow(job: Job): string {
  return `
    <tr style="border-bottom: 1px solid #eeeeee;">
      <td style="padding: 16px 0;">
        <div style="font-size: 16px; font-weight: 700; color: #111;">${job.title}</div>
        <div style="font-size: 13px; color: #555; margin-top: 3px;">${job.companyName} · ${job.location} · ${job.locationType}</div>
        <div style="font-size: 13px; color: #888; margin-top: 3px;">${formatSalary(job.salaryMin, job.salaryMax)} · ${job.department}</div>
        <a href="${BASE_URL}/jobs/${job.id}" style="display: inline-block; margin-top: 8px; font-size: 13px; font-weight: 700; color: #111; text-decoration: none; border-bottom: 2px solid #F9FF00; padding-bottom: 1px;">View listing</a>
      </td>
    </tr>`;
}

// Email 5: Monthly link-check report — sent to Chris after the cron sweeps
// every live listing's apply link.
interface LinkCheckItem {
  id: string;
  title: string;
  company: string;
  url: string;
  reason: string;
}

function linkCheckRows(items: LinkCheckItem[]): string {
  return items
    .map(
      (it) => `
    <tr style="border-bottom: 1px solid #eeeeee;">
      <td style="padding: 14px 0;">
        <div style="font-size: 15px; font-weight: 700; color: #111;">${it.title}</div>
        <div style="font-size: 13px; color: #555; margin-top: 3px;">${it.company}</div>
        <div style="font-size: 12px; color: #888; margin-top: 3px;">${it.reason}</div>
        <a href="${it.url}" style="font-size: 12px; color: #111; word-break: break-all;">${it.url}</a>
      </td>
    </tr>`
    )
    .join("");
}

export async function sendLinkCheckReport(report: {
  checked: number;
  aliveCount: number;
  removed: LinkCheckItem[];
  review: LinkCheckItem[];
}) {
  const { checked, aliveCount, removed, review } = report;

  const removedBlock = removed.length
    ? `<p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #111; font-weight: 700; margin: 28px 0 8px;">Removed automatically (${removed.length})</p>
       <table style="width: 100%; border-collapse: collapse;">${linkCheckRows(removed)}</table>`
    : "";

  const reviewBlock = review.length
    ? `<div style="background: #fffde6; border: 1px solid #f0ee99; padding: 20px; margin: 28px 0 0;">
         <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #111; font-weight: 700; margin: 0 0 8px;">Worth a look (${review.length})</p>
         <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 0 0 12px;">These weren't removed automatically, either because the check wasn't conclusive or because someone paid for the placement. Reason is noted against each one. Remove any that are filled from the admin panel.</p>
         <table style="width: 100%; border-collapse: collapse;">${linkCheckRows(review)}</table>
       </div>`
    : "";

  const allClear =
    removed.length === 0 && review.length === 0
      ? `<p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 8px;">All ${checked} live listings checked out. Nothing to clear.</p>`
      : "";

  await sendMail({
    to: DIGEST_RECIPIENT,
    subject: `Job board: removed ${removed.length} dead link${removed.length !== 1 ? "s" : ""}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111; padding: 48px 44px; border: 1px solid #eeeeee;">
        <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #111; padding-bottom: 20px; border-bottom: 2px solid #111; display: inline-block;">GOOD THINKING JOBS</div>

        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin: 36px 0 16px; color: #111; line-height: 1.2;">
          Weekly link check
        </h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 4px;">
          Checked ${checked} live listing${checked !== 1 ? "s" : ""}. ${aliveCount} still live.
        </p>
        ${allClear}
        ${removedBlock}
        ${reviewBlock}

        <p style="font-size: 13px; color: #888; line-height: 1.65; margin: 28px 0 0; border-top: 1px solid #eeeeee; padding-top: 24px;">
          Manage everything in the <a href="${BASE_URL}/admin" style="color: #111; border-bottom: 2px solid #F9FF00; text-decoration: none;">admin panel</a>.<br><br>GOOD THINKING · The weekly briefing on brand, culture, and marketing.
        </p>
      </div>
    `,
  });
}

// Email 6: Phone-flag result — sent to Chris after he flags a job from his
// phone. Confirms what was changed automatically, and surfaces anything the flag
// couldn't act on so it doesn't get silently dropped.
export async function sendFlagResult(params: {
  jobId: string;
  title: string;
  company: string;
  labels: string[];
  leftover: string;
  removed: boolean;
}) {
  const { jobId, title, company, labels, leftover, removed } = params;
  const jobUrl = `${BASE_URL}/jobs/${jobId}`;

  const changesBlock = labels.length
    ? `<p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 8px; font-weight: 700;">Applied</p>
       <ul style="margin: 0 0 24px; padding-left: 18px;">
         ${labels.map((l) => `<li style="font-size: 15px; color: #111; line-height: 1.7;">${l}</li>`).join("")}
       </ul>`
    : `<p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 24px;">Nothing was changed automatically.</p>`;

  const leftoverBlock = leftover
    ? `<div style="background: #fffde6; border: 1px solid #f0ee99; padding: 20px; margin: 0 0 24px;">
         <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #111; margin: 0 0 8px; font-weight: 700;">Needs your eye</p>
         <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0;">Couldn't auto-apply this part of your note: "${leftover}"</p>
       </div>`
    : "";

  await sendMail({
    to: DIGEST_RECIPIENT,
    subject: `Job flag ${removed ? "— removed" : "applied"}: ${company} · ${title}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111; padding: 48px 44px; border: 1px solid #eeeeee;">
        <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #111; padding-bottom: 20px; border-bottom: 2px solid #111; display: inline-block;">GOOD THINKING JOBS</div>

        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin: 36px 0 8px; color: #111; line-height: 1.2;">
          Flag ${removed ? "processed" : "applied"}
        </h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 28px;">
          <strong>${title}</strong> at <strong>${company}</strong>
        </p>

        ${changesBlock}
        ${leftoverBlock}

        ${removed ? "" : `<p style="margin: 0 0 8px;"><a href="${jobUrl}" style="font-size: 15px; font-weight: 700; color: #111; text-decoration: none; border-bottom: 2px solid #F9FF00; padding-bottom: 2px;">View listing &rarr;</a></p>`}

        <p style="font-size: 13px; color: #888; line-height: 1.65; margin: 28px 0 0; border-top: 1px solid #eeeeee; padding-top: 24px;">
          Sent because you flagged this from your phone.<br><br>GOOD THINKING · The weekly briefing on brand, culture, and marketing.
        </p>
      </div>
    `,
  });
}

// Email 7: Weekly usage report — sent to Chris so he can see whether the board
// is being used. Reports the activity we can measure directly from our own data
// (live listings, what's new, applications submitted through the board). Real
// visitor pageviews live in Vercel Analytics, which needs a token to read; until
// that's connected the report says so rather than pretending to have the number.
export async function sendUsageReport(params: {
  activeCount: number;
  newThisWeek: { company: string; title: string; id: string }[];
  applicationsThisWeek: number;
  applicationsTotal: number;
  traffic: {
    connected: boolean;
    pageviews7d: number;
    visitors7d: number;
    topPages: { route: string; pageviews: number }[];
  };
}) {
  const { activeCount, newThisWeek, applicationsThisWeek, applicationsTotal, traffic } = params;
  const trafficConnected = traffic.connected;

  const stat = (n: number | string, label: string) => `
    <td style="padding: 0 8px; text-align: center;">
      <div style="font-size: 34px; font-weight: 700; color: #111; line-height: 1;">${n}</div>
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-top: 6px;">${label}</div>
    </td>`;

  // Real visitor traffic (Vercel Web Analytics), shown when connected.
  const trafficConnectedBlock = trafficConnected
    ? `<p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 32px 0 12px; font-weight: 700;">Visitor traffic · last 7 days</p>
       <table style="width: 100%; border-collapse: collapse; margin: 0 0 8px;"><tr>
         ${stat(traffic.pageviews7d.toLocaleString(), "Page views")}
         ${stat(traffic.visitors7d.toLocaleString(), "Visitors")}
       </tr></table>
       ${
         traffic.topPages.length
           ? `<p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 24px 0 8px; font-weight: 700;">Most-viewed pages</p>
              <table style="width: 100%; border-collapse: collapse;">
                ${traffic.topPages
                  .map(
                    (p) => `<tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 8px 0; font-size: 14px; color: #111;">${p.route}</td>
                      <td style="padding: 8px 0; font-size: 14px; color: #666; text-align: right;">${p.pageviews.toLocaleString()} views</td>
                    </tr>`
                  )
                  .join("")}
              </table>`
           : ""
       }`
    : "";

  const newBlock = newThisWeek.length
    ? `<p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 32px 0 10px; font-weight: 700;">Added this week (${newThisWeek.length})</p>
       <table style="width: 100%; border-collapse: collapse;">
         ${newThisWeek
           .map(
             (j) => `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0;">
               <span style="font-size: 14px; font-weight: 600; color: #111;">${j.company}</span>
               <span style="font-size: 14px; color: #666;"> · ${j.title}</span>
             </td></tr>`
           )
           .join("")}
       </table>`
    : `<p style="font-size: 14px; color: #888; margin: 32px 0 0;">No new listings added in the last 7 days.</p>`;

  const trafficBlock = trafficConnected
    ? ""
    : `<div style="background: #f7f7f5; border: 1px dashed #ccc; padding: 20px; margin: 28px 0 0;">
         <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 8px; font-weight: 700;">Visitor traffic — not connected yet</p>
         <p style="font-size: 14px; color: #555; line-height: 1.6; margin: 0;">This report shows board activity from our own data. To add real page-view traffic (how many people visited, which jobs got the most views), the numbers live in Vercel Analytics and need a token to read. Ask Claude to wire it up and it'll appear here.</p>
       </div>`;

  await sendMail({
    to: DIGEST_RECIPIENT,
    subject: `Job board weekly: ${activeCount} live, ${applicationsThisWeek} application${applicationsThisWeek !== 1 ? "s" : ""} this week`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111; padding: 48px 44px; border: 1px solid #eeeeee;">
        <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #111; padding-bottom: 20px; border-bottom: 2px solid #111; display: inline-block;">GOOD THINKING JOBS</div>

        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin: 36px 0 24px; color: #111; line-height: 1.2;">
          This week on the board
        </h1>

        <table style="width: 100%; border-collapse: collapse; margin: 0 0 8px;"><tr>
          ${stat(activeCount, "Live listings")}
          ${stat(newThisWeek.length, "Added this week")}
          ${stat(applicationsThisWeek, "Applied this week")}
          ${stat(applicationsTotal, "Applied all time")}
        </tr></table>

        ${newBlock}
        ${trafficConnectedBlock}
        ${trafficBlock}

        <p style="font-size: 13px; color: #888; line-height: 1.65; margin: 32px 0 0; border-top: 1px solid #eeeeee; padding-top: 24px;">
          "Applied" counts applications sent through the board's own apply form; jobs that link out to a company site are applied to there and aren't counted. Manage everything in the <a href="${BASE_URL}/admin" style="color: #111; border-bottom: 2px solid #F9FF00; text-decoration: none;">admin panel</a>.<br><br>GOOD THINKING · The weekly briefing on brand, culture, and marketing.
        </p>
      </div>
    `,
  });
}

// Joins a list into natural English: ["a","b","c"] -> "a, b and c".
function joinNatural(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

// Friendly, lowercase category words for the copy line.
const DEPT_WORD: Record<string, string> = {
  Marketing: "marketing",
  Brand: "brand",
  Creative: "creative",
  Strategy: "strategy",
  Media: "media",
  Operations: "operations",
  "Executive/C-Suite": "executive",
};

// Builds the ready-to-copy blurb for Sunday's letter, e.g.
// "We have marketing, creative and operations jobs from Nike, Target and Ōura. Check them out."
function boardBlurb(activeJobs: Job[]): string {
  if (activeJobs.length === 0) return "";

  const depts = Array.from(
    new Set(activeJobs.map((j) => DEPT_WORD[j.department]).filter(Boolean))
  );
  const brands = Array.from(new Set(activeJobs.map((j) => j.companyName).filter(Boolean)));

  const deptPart = depts.length ? `${joinNatural(depts)} ` : "";
  return `We have ${deptPart}jobs from ${joinNatural(brands)}. Check them out at getgoodthinking.com/jobs.`;
}

export async function sendNewsletterDigest(
  featured: Job[],
  pendingPremium: Job[],
  activeJobs: Job[] = []
) {
  const blurb = boardBlurb(activeJobs);
  const blurbBlock = blurb
    ? `<div style="background: #f7f7f5; border: 1px dashed #ccc; padding: 20px; margin: 0 0 28px;">
         <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 10px; font-weight: 700;">Copy for Sunday's letter</p>
         <p style="font-size: 16px; color: #111; line-height: 1.6; margin: 0;">${blurb}</p>
       </div>`
    : "";

  const featuredBlock = featured.length
    ? `<table style="width: 100%; border-collapse: collapse; margin: 0 0 28px;">${featured.map(digestJobRow).join("")}</table>`
    : `<p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 28px;">No jobs are flagged for the newsletter this week.</p>`;

  const pendingBlock = pendingPremium.length
    ? `<div style="background: #fffde6; border: 1px solid #f0ee99; padding: 20px; margin: 0 0 28px;">
         <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #111; margin: 0 0 12px; font-weight: 700;">Premium · Awaiting your approval</p>
         <p style="font-size: 13px; color: #555; line-height: 1.6; margin: 0 0 12px;">These premium listings came in but aren't approved yet, so they won't be featured until you approve them in the admin panel.</p>
         <table style="width: 100%; border-collapse: collapse;">${pendingPremium.map(digestJobRow).join("")}</table>
       </div>`
    : "";

  await sendMail({
    to: DIGEST_RECIPIENT,
    subject: `Featured jobs for Sunday's letter (${featured.length} ready)`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111; padding: 48px 44px; border: 1px solid #eeeeee;">
        <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #111; padding-bottom: 20px; border-bottom: 2px solid #111; display: inline-block;">GOOD THINKING JOBS</div>

        <h1 style="font-size: 26px; font-weight: 700; letter-spacing: -0.01em; margin: 36px 0 16px; color: #111; line-height: 1.2;">
          Featured jobs for Sunday
        </h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin: 0 0 28px;">
          Here's what's flagged for this Sunday's letter. Listings must be submitted by EOD Thursday to make the featured section.
        </p>

        ${blurbBlock}
        ${featuredBlock}
        ${pendingBlock}

        <p style="font-size: 13px; color: #888; line-height: 1.65; margin: 0; border-top: 1px solid #eeeeee; padding-top: 24px;">
          Manage everything in the <a href="${BASE_URL}/admin" style="color: #111; border-bottom: 2px solid #F9FF00; text-decoration: none;">admin panel</a>.<br><br>GOOD THINKING · The weekly briefing on brand, culture, and marketing.
        </p>
      </div>
    `,
  });
}
