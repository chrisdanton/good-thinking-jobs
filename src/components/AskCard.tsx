import Link from "next/link";
import { Job } from "@/lib/types";
import { ASK_TYPES } from "@/lib/marketplace";
import FeaturedBadge from "./FeaturedBadge";

// An Ask on the board: what kind of ask, the headline, who's asking, and when.
// Same frame as a JobCard so the board reads as one product.
export default function AskCard({ job }: { job: Job }) {
  const kind = ASK_TYPES.find((a) => a.type === job.askType)?.label ?? "Ask";
  const teaser = job.description.split(/\n/)[0].slice(0, 140) + (job.description.length > 140 ? "..." : "");
  const event = job.eventDate
    ? new Date(job.eventDate + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";
  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <div
        className={`relative border rounded-sm p-6 transition-all h-full flex flex-col overflow-visible ${
          job.tier === "premium" ? "border-accent bg-accent/[0.03]" : "border-white/20 hover:border-white/40"
        }`}
      >
        {job.tier === "premium" && (
          <div className="absolute -top-8 -right-5 z-10">
            <FeaturedBadge size={90} />
          </div>
        )}
        <span
          className="inline-block self-start mb-4 text-[10px] font-bold uppercase tracking-widest px-2 py-1"
          style={{ background: "#F9FF00", color: "#000" }}
        >
          Seeking: {kind}
        </span>
        <h3 className="text-2xl font-bold tracking-tight leading-tight font-display uppercase">{job.title}</h3>
        <p className="text-base font-bold mt-1 font-headline">{job.companyName}</p>
        <p className="text-xs text-muted mt-2 uppercase tracking-wider font-headline">
          {[job.location, event].filter(Boolean).join(" · ")}
        </p>
        <p className="text-sm text-muted leading-relaxed mt-4 mb-4 flex-1 font-secondary">{teaser}</p>
        <div className="flex items-center justify-end pt-3 border-t border-white/10">
          <span className="text-sm font-headline underline underline-offset-2 decoration-[#07FCFB] group-hover:decoration-2 transition-all">
            More Info
          </span>
        </div>
      </div>
    </Link>
  );
}
