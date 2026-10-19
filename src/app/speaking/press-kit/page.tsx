import type { Metadata } from "next";
import {
  BIOS,
  BOOKING_EMAIL,
  C,
  FORMATS,
  LINKS,
  PRESS_LOGOS,
  PRESS_MAILTO,
  PRESS_PDF,
  PRESS_PHOTOS,
  PRESS_ZIP,
  TALKS,
  TESTIMONIALS,
} from "../data";
import { CopyButton } from "../buttons";
import { Btn, HARD_SHADOW_SM, PinnedPhoto, SpeakingFooter, SpeakingNav } from "../ui";

export const metadata: Metadata = {
  title: "Press Kit · Kirsten Ludwig & Chris Danton · GOOD THINKING",
  description:
    "Press kit for Kirsten Ludwig and Chris Danton, Co-Founders of IN GOOD CO and hosts of GOOD THINKING: bios in three lengths, approved photos, logos, talk topics, and press contact.",
  openGraph: {
    title: "Press Kit · Kirsten Ludwig & Chris Danton",
    description: "Bios, approved photos, logos, and contact details for Kirsten Ludwig and Chris Danton.",
    images: ["/speaking/duo.jpg"],
    type: "website",
  },
};

const FACTS = [
  ["Who", "Kirsten Ludwig & Chris Danton"],
  ["Roles", "Co-Founders, IN GOOD CO"],
  ["Pronouns", "Both she/her"],
  ["Publication", "GOOD THINKING, a weekly newsletter and podcast on brand, marketing, and culture (18K subscribers)"],
  ["Stages", "SXSW · Brands & Culture · Paradigms · Private brand & leadership summits"],
  ["Press & booking", BOOKING_EMAIL],
];

const LENGTHS = [
  { key: "oneLine", label: "One line" },
  { key: "short", label: "Short" },
  { key: "full", label: "Full" },
] as const;

function words(text: string) {
  return text.trim().split(/\s+/).length;
}

export default function PressKitPage() {
  return (
    <div className="speaking-root min-h-screen overflow-x-hidden font-sans" style={{ background: C.cream, color: C.black }}>
      <SpeakingNav active="press" />

      {/* Hero */}
      <section style={{ background: C.yellow, color: C.black }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[7fr_4fr] lg:items-center lg:gap-16">
          <div>
            <h1 className="speaking-display text-[clamp(3.6rem,12vw,8rem)]">Press Kit</h1>
            <p className="mt-7 max-w-xl text-lg sm:text-xl leading-relaxed">
              Kirsten Ludwig and Chris Danton are the Co-Founders of IN GOOD CO and the hosts of
              GOOD THINKING, a weekly newsletter and podcast on brand, marketing, and culture.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Btn href={PRESS_ZIP} download>Download photos</Btn>
              <Btn href={PRESS_PDF} variant="outline" download>Download the PDF</Btn>
            </div>
          </div>
          <PinnedPhoto
            src="/speaking/duo.jpg"
            alt="Kirsten Ludwig and Chris Danton"
            tilt={2}
            pin={C.black}
            className="mx-auto w-full max-w-xs lg:max-w-none"
            imgClassName="aspect-[4/5] object-cover"
          />
        </div>
      </section>

      {/* At a glance */}
      <section style={{ background: C.black, color: C.white }}>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="speaking-display text-4xl md:text-5xl" style={{ color: C.yellow }}>At a glance</h2>
          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACTS.map(([k, v]) => (
              <div key={k} className="border-t pt-4" style={{ borderColor: "#333" }}>
                <dt className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: C.yellow }}>{k}</dt>
                <dd className="mt-1.5 text-base leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Talks */}
      <section style={{ background: C.cream }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="speaking-display text-4xl md:text-6xl">What we talk about</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TALKS.map((t) => (
              <div key={t.no} className="border-2 border-black p-6" style={{ background: C.white, boxShadow: HARD_SHADOW_SM }}>
                <p className="speaking-display text-xl opacity-50">{t.no}</p>
                <h3 className="speaking-display mt-1 text-2xl sm:text-3xl">{t.title}</h3>
                <p className="mt-2.5 leading-relaxed">{t.short}</p>
              </div>
            ))}
          </div>
          <p className="mt-8">
            <span className="font-bold">Formats:</span> {FORMATS.join(" · ")}
          </p>
        </div>
      </section>

      {/* What people say (hidden until real quotes are added in data.ts) */}
      {TESTIMONIALS.length > 0 && (
        <section style={{ background: C.black, color: C.white }}>
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <h2 className="speaking-display text-4xl md:text-6xl" style={{ color: C.yellow }}>What people say</h2>
            <div className="mt-10 space-y-8">
              {TESTIMONIALS.map((t) => (
                <blockquote
                  key={t.quote}
                  className="p-7 sm:p-9"
                  style={{ background: C.white, color: C.black, boxShadow: `10px 10px 0 0 ${C.yellow}` }}
                >
                  <p className="text-lg leading-relaxed">“{t.quote}”</p>
                  <footer className="mt-5 text-xs font-bold uppercase tracking-[0.15em]">{t.who}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bios */}
      <section style={{ background: C.white }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="speaking-display text-4xl md:text-6xl">Bios</h2>
          <p className="mt-4 max-w-2xl" style={{ color: "#555" }}>
            Three lengths for each. Use whichever fits. Please don&apos;t paraphrase the first line.
          </p>
          <div className="mt-12 space-y-16">
            {BIOS.map((b) => (
              <div key={b.who}>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="speaking-display text-4xl sm:text-5xl">{b.who}</h3>
                  <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-widest" style={{ background: C.yellow }}>
                    {b.pronouns}
                  </span>
                </div>
                <div className="mt-6 space-y-8">
                  {LENGTHS.map(({ key, label }) => {
                    const value = b[key];
                    const text = Array.isArray(value) ? value.join("\n\n") : value;
                    const paras = Array.isArray(value) ? value : [value];
                    return (
                      <div key={key} className="border-t-2 pt-5" style={{ borderColor: "#e4e4dc" }}>
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <h4 className="speaking-display text-xl tracking-wide">
                            {label}
                            <span className="ml-2 font-sans text-sm font-normal normal-case tracking-normal" style={{ color: "#888" }}>
                              {words(text)} words
                            </span>
                          </h4>
                          <CopyButton text={text} />
                        </div>
                        <div className="mt-3 max-w-3xl space-y-4 leading-relaxed">
                          {paras.map((p) => (
                            <p key={p}>{p}</p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approved photos */}
      <section style={{ background: C.paper }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h2 className="speaking-display text-4xl md:text-6xl">Approved photos</h2>
              <p className="mt-4 max-w-xl" style={{ color: "#555" }}>
                Free to use alongside coverage of Kirsten and Chris. Need something else? Just ask.
              </p>
            </div>
            <Btn href={PRESS_ZIP} download>Download all photos ({PRESS_PHOTOS.length})</Btn>
          </div>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {PRESS_PHOTOS.map((p, i) => (
              <figure key={p.file}>
                <PinnedPhoto
                  src={p.src}
                  alt={p.caption}
                  tilt={[-1, 1, -0.5, 0.75, -1.25, 1][i % 6]}
                  pin={i % 2 ? C.black : C.yellow}
                  imgClassName={`aspect-[4/5] object-cover ${p.pos}`}
                />
                <figcaption className="mt-5 flex items-baseline justify-between gap-3 text-sm">
                  <span style={{ color: "#444" }}>{p.caption}</span>
                  <a href={p.file} download className="shrink-0 font-bold underline decoration-2 underline-offset-4">
                    Download
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>

          <h3 className="speaking-display mt-20 text-3xl md:text-4xl">Logos</h3>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {PRESS_LOGOS.map((l) => (
              <figure key={l.src}>
                <div className={`flex h-44 items-center justify-center border-2 border-black ${l.pad}`} style={{ background: l.tile }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.src} alt={`${l.brand} logo`} className="h-full w-full object-contain" />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-3 text-sm">
                  <span style={{ color: "#444" }}>{l.brand} logos (all versions)</span>
                  <a href={l.zip} download className="shrink-0 font-bold underline decoration-2 underline-offset-4">
                    Download all
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Links & contact */}
      <section style={{ background: C.white }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <h2 className="speaking-display text-4xl md:text-6xl">Links &amp; contact</h2>
          <div className="mt-10 border-2 border-black" style={{ boxShadow: HARD_SHADOW_SM }}>
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-baseline justify-between gap-4 px-5 py-4 hover:bg-[#F9FF00] transition-colors ${i ? "border-t-2 border-black" : ""}`}
              >
                <span className="speaking-display w-36 shrink-0 text-lg">{l.label}</span>
                <span className="flex-1 truncate text-sm sm:text-base">{l.handle}</span>
                <span className="shrink-0 text-sm font-bold">Open ↗</span>
              </a>
            ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="border-2 border-black p-6" style={{ background: C.yellow, boxShadow: HARD_SHADOW_SM }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em]">Press &amp; interviews</p>
              <a href={PRESS_MAILTO} className="speaking-display mt-2 block text-2xl sm:text-3xl break-all underline decoration-2 underline-offset-4">
                {BOOKING_EMAIL}
              </a>
            </div>
            <div className="border-2 border-black p-6" style={{ background: C.cream, boxShadow: HARD_SHADOW_SM }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em]">Booking a talk?</p>
              <a href="/speaking" className="speaking-display mt-2 block text-2xl sm:text-3xl underline decoration-2 underline-offset-4">
                See the speaking page ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <SpeakingFooter />
    </div>
  );
}
