import Link from "next/link";
import { TIERS } from "@/lib/constants";
import { Tier } from "@/lib/types";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="text-5xl sm:text-7xl font-bold uppercase font-display leading-[0.9] tracking-tight mb-8 text-white">
        Be where your next
        <br />
        hire reads
      </h1>

      <div className="space-y-10 text-white font-secondary leading-relaxed">
        <p className="text-lg">
          GOOD THINKING Jobs is the curated hiring channel from{" "}
          <a
            href="https://ingoodco.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#07FCFB] font-bold underline underline-offset-2 hover:brightness-125 transition-all"
          >
            GOOD THINKING
          </a>
          , the weekly newsletter for 17,000+ marketing and brand leaders.
        </p>

        <p>
          Hiring in marketing leadership is broken. Great roles get buried on
          generic platforms. Senior candidates don&apos;t scroll Indeed. The best
          hires happen through trusted communities. That&apos;s what we&apos;re
          building here.
        </p>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted mb-6 font-bold font-headline">
            How it works
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Post your role",
                desc: "Fill out the details. Self-serve, instant publishing. No approval queue.",
              },
              {
                step: "02",
                title: "Pick your tier",
                desc: "Based on salary range, we recommend a tier. Higher-level roles get more visibility.",
              },
              {
                step: "03",
                title: "Reach the right people",
                desc: "Your role appears immediately. Premium listings are featured in our Sunday newsletter to 17K subscribers.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="border border-white/10 p-5 flex gap-5"
              >
                <span className="text-accent font-bold text-2xl font-display">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-semibold text-white font-sans mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted mb-6 font-bold font-headline">
            Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(Object.entries(TIERS) as [Tier, (typeof TIERS)[Tier]][]).map(
              ([key, tier]) => (
                <div
                  key={key}
                  className={`p-6 border ${
                    key === "premium"
                      ? "border-accent bg-accent/[0.05]"
                      : "border-white/20"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-bold uppercase text-lg font-display text-white">
                      {tier.name}
                    </h3>
                    <span className="text-accent font-bold text-2xl font-display">
                      {tier.price === 0 ? "Free" : `$${tier.price}`}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-4 uppercase tracking-wider font-sans">
                    {tier.salaryLabel}
                  </p>
                  <ul className="space-y-2">
                    {tier.features.map((f) => (
                      <li key={f} className="text-sm flex items-start gap-2">
                        <span className="text-accent font-sans">&#10003;</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </section>

        <section className="border border-white/10 p-10 text-center">
          <h2 className="text-2xl font-bold uppercase font-display text-white mb-2">
            Ready to hire?
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto">
            Post a role in under 5 minutes and reach the most engaged community
            of marketing executives.
          </p>
          <Link
            href="/post"
            className="bg-accent text-black text-sm font-bold uppercase tracking-wider font-headline px-8 py-3 hover:bg-accent/90 transition-colors inline-block"
          >
            Post a Job
          </Link>
        </section>
      </div>
    </div>
  );
}
