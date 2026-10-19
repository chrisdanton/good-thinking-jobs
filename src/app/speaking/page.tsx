import type { Metadata } from "next";
import {
  BOOKING_EMAIL,
  BOOKING_MAILTO,
  C,
  FORMATS,
  SITE_URL,
  SPEAKERS,
  STAGES,
  TALKS,
  TESTIMONIALS,
  VIDEOS,
} from "./data";
import { Btn, Eyebrow, HARD_SHADOW, PinnedCard, PinnedPhoto, SpeakingFooter, SpeakingNav } from "./ui";

export const metadata: Metadata = {
  title: "Keynote Speakers on Brand, Culture & the Future · Kirsten Ludwig & Chris Danton",
  description:
    "Kirsten Ludwig and Chris Danton, Co-Founders of IN GOOD CO and hosts of the GOOD THINKING newsletter and podcast, keynote on brand, marketing, culture, consumer trends, and the future of brand.",
  keywords: [
    "keynote speaker",
    "brand keynote speaker",
    "marketing keynote speaker",
    "consumer trends speaker",
    "futurist speaker",
    "culture keynote speaker",
    "Kirsten Ludwig",
    "Chris Danton",
    "IN GOOD CO",
    "GOOD THINKING",
  ],
  openGraph: {
    title: "Keynote Speakers on Brand, Culture & the Future · Kirsten Ludwig & Chris Danton",
    description:
      "Kirsten Ludwig and Chris Danton keynote on brand, marketing, culture, consumer trends, and the future of brand.",
    images: ["/speaking/duo.jpg"],
    type: "website",
  },
};


// Dinner photos. Add the menu shot as a second entry and the two will pin side by side.
const DINNER_PHOTOS = [{ src: "/speaking/dinner-1.jpg", alt: "Kirsten Ludwig and Chris Danton at a GOOD THINKING CMO dinner" }];

// Talk cards cycle through the brand colors and tilt a little, like notes pinned to a board.
const CARD_STYLES = [
  { bg: C.yellow, fg: C.black, pin: C.black, tilt: -1 },
  { bg: C.white, fg: C.black, pin: C.yellow, tilt: 1 },
  { bg: C.black, fg: C.white, pin: C.yellow, tilt: -0.75 },
  { bg: C.white, fg: C.black, pin: C.black, tilt: 1.25 },
  { bg: C.yellow, fg: C.black, pin: C.black, tilt: -1.25 },
];

// Structured data (schema.org) so search engines and AI/agentic search can
// identify Kirsten & Chris as keynote speakers, their topics, and affiliation.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#ingoodco`,
      name: "IN GOOD CO",
      url: "https://weareingoodco.com",
    },
    {
      "@type": "Person",
      name: "Kirsten Ludwig",
      jobTitle: "Keynote Speaker, Co-Founder of IN GOOD CO",
      description: SPEAKERS[0].bio,
      image: `${SITE_URL}${SPEAKERS[0].img}`,
      url: `${SITE_URL}/speaking`,
      worksFor: { "@id": `${SITE_URL}/#ingoodco` },
      knowsAbout: [
        "Brand strategy",
        "Marketing",
        "Culture",
        "Consumer trends",
        "Brand building",
        "Challenger brands",
        "The future of brand",
      ],
    },
    {
      "@type": "Person",
      name: "Chris Danton",
      jobTitle: "Keynote Speaker, Futurist, Co-Founder of IN GOOD CO",
      description: SPEAKERS[1].bio,
      image: `${SITE_URL}${SPEAKERS[1].img}`,
      url: `${SITE_URL}/speaking`,
      worksFor: { "@id": `${SITE_URL}/#ingoodco` },
      knowsAbout: [
        "Futures and foresight",
        "Brand strategy",
        "Marketing",
        "Culture",
        "Creativity",
        "The Age of Authorship",
        "Personal branding",
        "The future of brand",
      ],
    },
  ],
};

export default function SpeakingPage() {
  return (
    <div className="speaking-root min-h-screen overflow-x-hidden font-sans" style={{ background: C.cream, color: C.black }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* Global switcher bar is rendered site-wide via layout.tsx (GlobalBar). */}
      <SpeakingNav />

      {/* Hero */}
      <section style={{ background: C.yellow, color: C.black }}>
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Keynotes · Workshops · CMO Dinners</Eyebrow>
            <h1 className="speaking-display mt-5 text-[clamp(3.6rem,13vw,8.5rem)]">
              Good Thinking,<br />
              <span className="speaking-outline-dark">Out Loud.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed">
              Kirsten Ludwig &amp; Chris Danton take the ideas behind GOOD THINKING to the
              stage, helping brand and marketing teams see what&apos;s next and act on it.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Btn href={BOOKING_MAILTO}>Book us to speak</Btn>
              <Btn href="/speaking/press-kit" variant="outline">View the press kit</Btn>
            </div>
            <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.3em]">Seen &amp; heard on</p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
              {STAGES.map((s) => (
                <li key={s} className="speaking-display text-xl sm:text-2xl">{s}</li>
              ))}
            </ul>
          </div>
          <PinnedPhoto
            src="/speaking/duo.jpg"
            alt="Kirsten Ludwig and Chris Danton"
            tilt={2}
            pin={C.black}
            className="mx-auto w-full max-w-sm lg:max-w-none"
            imgClassName="aspect-[5/6] object-cover"
          />
        </div>
      </section>

      {/* Talks */}
      <section id="talks" style={{ background: C.cream }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 md:py-28">
          <Eyebrow>The Talks</Eyebrow>
          <h2 className="speaking-display mt-3 text-5xl md:text-7xl">Book us for your stage</h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed">
            Every talk is tailored to your audience and shaped with you ahead of the date. Formats
            range from a 20-minute provocation to a half-day working session.
          </p>
          <div className="mt-14 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {TALKS.map((t, i) => {
              const s = CARD_STYLES[i % CARD_STYLES.length];
              return (
                <PinnedCard key={t.no} tilt={s.tilt} bg={s.bg} fg={s.fg} pin={s.pin}>
                  <p className="speaking-display text-3xl opacity-60">{t.no}</p>
                  <h3 className="speaking-display mt-2 text-3xl sm:text-4xl">{t.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed">{t.body}</p>
                </PinnedCard>
              );
            })}
            <PinnedCard tilt={0.75} bg={C.paper} pin={C.yellow} className="flex flex-col justify-between">
              <div>
                <h3 className="speaking-display text-3xl sm:text-4xl">Something else in mind?</h3>
                <p className="mt-3 text-[15px] leading-relaxed">
                  Tell us about the room and what you want people to walk out with. We&apos;ll build the talk around it.
                </p>
              </div>
              <a href={BOOKING_MAILTO} className="mt-6 text-sm font-bold uppercase tracking-wide underline decoration-2 underline-offset-4">
                Start the conversation ↗
              </a>
            </PinnedCard>
          </div>
          <p className="mt-14 text-[15px]">
            <span className="font-bold">Formats:</span> {FORMATS.join(" · ")}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Brand",
              "Marketing",
              "Culture",
              "Consumer Trends",
              "Futures & Foresight",
              "Creativity",
              "Personal Brand",
              "The Future of Brand",
            ].map((t) => (
              <span key={t} className="border-2 border-black text-xs font-semibold uppercase tracking-wide px-3 py-1.5">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" style={{ background: C.white }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 md:py-28">
          <Eyebrow>The Speakers</Eyebrow>
          <h2 className="speaking-display mt-3 text-5xl md:text-7xl">Meet Kirsten &amp; Chris</h2>
          <div className="mt-14 grid gap-14 sm:grid-cols-2 lg:gap-20">
            {SPEAKERS.map((s, i) => (
              <div key={s.name}>
                <PinnedPhoto
                  src={s.img}
                  alt={s.name}
                  tilt={i === 0 ? -2 : 2}
                  pin={i === 0 ? C.yellow : C.black}
                  imgClassName="aspect-[4/5] object-cover object-top grayscale"
                />
                <h3 className="speaking-display mt-10 text-4xl sm:text-5xl">{s.name}</h3>
                <p className="mt-2 inline-block px-2 py-0.5 text-xs font-bold uppercase tracking-widest" style={{ background: C.yellow }}>
                  {s.role}
                </p>
                <p className="mt-4 max-w-md text-base sm:text-lg leading-relaxed">{s.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* On stage */}
      <section id="stages" style={{ background: C.black, color: C.white }}>
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 md:py-28">
          <Eyebrow color={C.yellow}>On Stage</Eyebrow>
          <h2 className="speaking-display mt-3 text-5xl md:text-7xl">See us in the room</h2>
          <div className="mt-12 border-2" style={{ borderColor: C.yellow, boxShadow: `8px 8px 0 0 ${C.yellow}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/speaking/paradigms-culture.jpg"
              alt="Kirsten Ludwig and Chris Danton on stage at Paradigms"
              className="w-full h-[320px] sm:h-[460px] lg:h-[560px] object-cover object-[center_80%]"
            />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest" style={{ color: C.yellow }}>Paradigms</p>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:gap-12">
            {VIDEOS.map((v) => (
              <div key={v.id}>
                <div className="relative w-full aspect-video border-2" style={{ borderColor: "#333" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="mt-3 text-xs font-bold uppercase tracking-widest" style={{ color: C.yellow }}>{v.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What people say (hidden until real quotes are added in data.ts) */}
      {TESTIMONIALS.length > 0 && (
        <section style={{ background: C.yellow, color: C.black }}>
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 md:py-28">
            <Eyebrow>Kind Words</Eyebrow>
            <h2 className="speaking-display mt-3 text-5xl md:text-7xl">What people say</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {TESTIMONIALS.map((t) => (
                <blockquote key={t.quote} className="border-2 border-black p-7 sm:p-9" style={{ background: C.white, boxShadow: HARD_SHADOW }}>
                  <p className="text-lg leading-relaxed">“{t.quote}”</p>
                  <footer className="mt-5 text-xs font-bold uppercase tracking-[0.15em]">{t.who}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CMO Dinners */}
      <section id="dinners" style={{ background: C.paper, color: C.black }}>
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-14 sm:px-6 sm:py-20 md:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <Eyebrow>Convenings</Eyebrow>
            <h2 className="speaking-display mt-3 text-5xl md:text-7xl">CMO Dinners</h2>
            <p className="speaking-display mt-6 text-3xl sm:text-4xl">Closed-door dinners for CMOs.</p>
            <div className="mt-8 max-w-xl space-y-5 text-base sm:text-lg leading-relaxed">
              <p>
                Invite-only, curated by GOOD THINKING. People who already trust us enough to cancel
                other plans.
              </p>
              <p>
                Closed door. No phones. No devices of any kind. Because the best conversations are
                never recorded.
              </p>
              <p>
                It&apos;s the conversation at 8pm when the agenda falls away. When someone says the
                thing you&apos;ve been thinking all week but couldn&apos;t say on stage.
              </p>
            </div>
            <p className="speaking-display mt-8 text-2xl sm:text-3xl">
              <span className="px-1.5" style={{ background: C.yellow }}>We&apos;re creating that. On purpose.</span>
            </p>
          </div>
          {DINNER_PHOTOS.length > 1 ? (
            // Two photos: pinned and overlapping, like notes on a board.
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none pb-24">
              <PinnedPhoto src={DINNER_PHOTOS[0].src} alt={DINNER_PHOTOS[0].alt} tilt={-2} pin={C.yellow} className="w-[78%]" imgClassName="aspect-[4/3] object-cover" />
              <div className="absolute bottom-0 right-0 w-[55%]">
                <PinnedPhoto src={DINNER_PHOTOS[1].src} alt={DINNER_PHOTOS[1].alt} tilt={3} pin={C.black} imgClassName="aspect-[3/4] object-cover" />
              </div>
            </div>
          ) : (
            <PinnedPhoto src={DINNER_PHOTOS[0].src} alt={DINNER_PHOTOS[0].alt} tilt={-1.5} pin={C.yellow} imgClassName="aspect-[4/3] object-cover" />
          )}
        </div>
      </section>

      {/* Booking CTA */}
      <section style={{ background: C.yellow, color: C.black }}>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          <Eyebrow>Booking</Eyebrow>
          <h2 className="speaking-display mt-5 text-5xl sm:text-8xl lg:text-[8.5rem]">
            Bring <span className="speaking-outline-dark">GOOD<br />THINKING</span> to<br />your stage.
          </h2>
          <div className="mt-10">
            <Btn href={BOOKING_MAILTO}>Book us to speak</Btn>
          </div>
          <p className="mt-6 text-sm">
            or email{" "}
            <a href={BOOKING_MAILTO} className="font-bold underline decoration-2 underline-offset-4">
              {BOOKING_EMAIL}
            </a>
          </p>
        </div>
      </section>

      {/* Press kit teaser */}
      <section style={{ background: C.cream, color: C.black }} className="border-t-2 border-black">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="speaking-display text-4xl sm:text-5xl">Writing about us?</h2>
            <p className="mt-2 text-base">Bios, approved photos, logos, and contact details, all in one place.</p>
          </div>
          <Btn href="/speaking/press-kit" variant="outline">View the press kit</Btn>
        </div>
      </section>

      <SpeakingFooter />
    </div>
  );
}
