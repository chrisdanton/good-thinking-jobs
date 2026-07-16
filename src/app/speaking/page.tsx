import type { Metadata } from "next";

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

const BOOKING_EMAIL = "hello@weareingoodco.com";
const BOOKING_MAILTO = `mailto:${BOOKING_EMAIL}?subject=Speaking%20inquiry%20for%20GOOD%20THINKING`;

const TALKS = [
  {
    no: "01",
    title: "The Year Ahead",
    body: "A fast, provocative tour of what's coming across culture, brand, tech, and retail, drawn from the trends work behind GOOD FUTURE. Your team leaves with a shared map of the signals that matter, and the confidence to act on them.",
  },
  {
    no: "02",
    title: "Thinking in Possibilities",
    body: "Most brands stay boxed in by their own category. This is about breaking out of the silo, thinking beyond the confines of where you're supposed to play, and taking hold of your brand's trajectory instead of letting the market decide it for you.",
  },
  {
    no: "03",
    title: "The Age of Authorship",
    body: "AI just made building almost free, so execution is no longer the advantage. The hard part is mattering. Why vision, not output, is the real differentiator now, and what it means for brands when anyone can make anything.",
  },
  {
    no: "04",
    title: "The Public CMO",
    body: "The most powerful brand asset a company has might be the person leading it. Why the next generation of CMOs and founders are becoming public figures, how to build a personal brand without the cringe, and what it unlocks for the brand behind you.",
  },
  {
    no: "05",
    title: "Live for the Unscalable",
    body: "As AI makes everything instant and infinite, the rarest thing becomes what can't be automated: participation, shared stakes, and belonging. A playbook for building brands people actually show up for.",
  },
];

const STAGES = ["SXSW · Austin", "Brands & Culture · New York", "Private brand & leadership summits"];

const VIDEOS = [
  { title: "SXSW · Austin", id: "aWDxk7nBQ1s" },
  { title: "Brands & Culture · New York", id: "lktsrBpM_0k" },
];

const SPEAKERS = [
  {
    name: "Kirsten Ludwig",
    role: "Co-Founder, IN GOOD CO",
    img: "/speaking/kirsten.jpg",
    bio: "Kirsten Ludwig is a brand builder, cultural curator, and Co-Founder of IN GOOD CO, a global brand consultancy built for challenger brands that refuse to play it safe. She is the co-host of the GOOD THINKING podcast, a speaker and a top voice in brand. Her expertise is disrupting the status quo.",
  },
  {
    name: "Chris Danton",
    role: "Co-Founder, IN GOOD CO · Writer, GOOD THINKING",
    img: "/speaking/chris.jpg",
    bio: "Chris is an award-winning futurist, brand builder, author, speaker, and creative strategist. She is also the author and podcast co-host for GOOD THINKING, a publication read by top brand executives across the world. Her expertise is leading the future of brand.",
  },
];

const SITE_URL = "https://getgoodthinking.com";

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
    <div className="speaking-root min-h-screen overflow-x-hidden bg-black text-white font-sans selection:bg-accent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* Global switcher bar is rendered site-wide via layout.tsx (GlobalBar). */}

      {/* Hero */}
      <section className="px-5 sm:px-8 lg:px-12 pt-16 sm:pt-20 lg:pt-24 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="text-accent text-[10px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.25em] mb-6">
              Keynotes · Live Podcasts · Workshops
            </p>
            <h1 className="speaking-display text-white text-[13.5vw] sm:text-[12.5vw] lg:text-[10.5rem]">
              Good<br />Thinking,<br />
              <span className="text-accent">Out Loud.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg sm:text-xl text-white/70 leading-relaxed">
              Kirsten Ludwig &amp; Chris Danton take the ideas behind GOOD THINKING to the
              stage, helping brand and marketing teams see what&apos;s next and act on it.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={BOOKING_MAILTO}
                className="bg-accent text-black font-bold uppercase tracking-wide text-sm px-8 py-4 hover:brightness-110 transition-all"
              >
                Book us to speak
              </a>
              <a
                href="#talks"
                className="text-white/60 hover:text-white text-sm uppercase tracking-widest transition-colors"
              >
                See the talks ↓
              </a>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/speaking/duo.jpg"
                alt="Kirsten Ludwig and Chris Danton"
                className="w-full h-[440px] sm:h-[520px] lg:h-[640px] object-cover grayscale-[0.15]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Positioning statement */}
      <section className="px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-t border-white/10">
        <p className="speaking-display text-white text-3xl sm:text-6xl lg:text-7xl max-w-5xl leading-[0.95]">
          Culture moves fast. We help your team{" "}
          <span className="text-accent">move first</span>, with talks that are equal parts
          foresight, provocation, and practical playbook.
        </p>
      </section>

      {/* Talks */}
      <section id="talks" className="px-5 sm:px-8 lg:px-12 py-16 lg:py-20 border-t border-white/10">
        <div className="flex items-baseline justify-between mb-12">
          <h2 className="speaking-display text-accent text-5xl sm:text-7xl">The Talks</h2>
          <span className="text-white/40 text-xs uppercase tracking-widest hidden sm:block">
            Keynote · Fireside · Workshop
          </span>
        </div>
        <div className="border-t border-white/15">
          {TALKS.map((t) => (
            <div
              key={t.no}
              className="grid md:grid-cols-12 gap-4 md:gap-8 py-9 border-b border-white/15 group"
            >
              <div className="md:col-span-1 text-accent font-display text-3xl">{t.no}</div>
              <h3 className="md:col-span-4 speaking-display text-white text-3xl sm:text-4xl">
                {t.title}
              </h3>
              <p className="md:col-span-7 text-white/70 text-base sm:text-lg leading-relaxed max-w-2xl">
                {t.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-white/50 text-sm max-w-2xl">
          Every talk is tailored to your audience and shaped with you ahead of the date. Formats
          range from a 20-minute provocation to a half-day working session.
        </p>
        <div className="mt-10">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-4">Topics we speak on</p>
          <div className="flex flex-wrap gap-2">
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
              <span
                key={t}
                className="border border-white/20 text-white/70 text-xs uppercase tracking-wide px-3 py-1.5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="px-5 sm:px-8 lg:px-12 py-16 lg:py-20 border-t border-white/10">
        <h2 className="speaking-display text-accent text-5xl sm:text-7xl mb-12">The Speakers</h2>
        <div className="grid sm:grid-cols-2 gap-10 lg:gap-16">
          {SPEAKERS.map((s) => (
            <div key={s.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.name}
                className="w-full h-[440px] sm:h-[500px] object-cover object-top grayscale mb-6"
              />
              <h3 className="speaking-display text-white text-4xl sm:text-5xl">{s.name}</h3>
              <p className="text-accent text-xs uppercase tracking-widest mt-2 mb-4">{s.role}</p>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-md">{s.bio}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-white/60 text-base sm:text-lg leading-relaxed max-w-3xl">
          Together they lead <span className="text-white">IN GOOD CO</span> and publish{" "}
          <span className="text-white">GOOD THINKING</span>, a weekly newsletter and podcast on
          brand, marketing, and culture. They speak as a duo or solo, depending on the room.
        </p>
      </section>

      {/* Stages / proof */}
      <section id="stages" className="border-t border-white/10">
        <div className="px-5 sm:px-8 lg:px-12 pt-16 lg:pt-20 pb-10">
          <h2 className="speaking-display text-accent text-5xl sm:text-7xl mb-10">On Stage</h2>
          <div className="flex flex-wrap gap-x-10 gap-y-4">
            {STAGES.map((v) => (
              <span key={v} className="text-white text-lg sm:text-2xl font-display uppercase tracking-wide">
                {v}
              </span>
            ))}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/speaking/onstage-duo.jpg"
          alt="Kirsten Ludwig and Chris Danton"
          className="w-full h-[440px] lg:h-[620px] object-cover object-[center_28%]"
        />
        <div className="px-5 sm:px-8 lg:px-12 py-16 lg:py-20 grid md:grid-cols-2 gap-8 lg:gap-12">
          {VIDEOS.map((v) => (
            <div key={v.id}>
              <div className="relative w-full aspect-video border border-white/15">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="text-accent text-xs uppercase tracking-widest mt-3">{v.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CMO Dinners */}
      <section id="dinners" className="px-5 sm:px-8 lg:px-12 py-16 lg:py-24 border-t border-white/10">
        <p className="text-accent text-xs uppercase tracking-[0.25em] mb-6">Convenings</p>
        <h2 className="speaking-display text-accent text-5xl sm:text-7xl mb-8">CMO Dinners</h2>
        <p className="speaking-display text-white text-2xl sm:text-4xl max-w-4xl leading-[1.05] mb-12">
          A closed-door dinner for CMOs. Invite-only, curated by GOOD THINKING. People who
          already trust us enough to cancel other plans.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          {["dinner-1", "dinner-2", "dinner-3"].map((d) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={d}
              src={`/speaking/${d}.jpg`}
              alt="A GOOD THINKING CMO dinner"
              className="w-full h-[260px] sm:h-[320px] object-cover"
            />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl text-white/70 text-base sm:text-lg leading-relaxed">
          <p>
            Closed door. No phones. No devices of any kind. Because the best conversations are
            never recorded.
          </p>
          <p>
            Here&apos;s the thing about Cannes: the panels are packed. The activations are
            impressive. The rosé is plentiful. And yet, the most valuable thing that happens
            there has nothing to do with any of it.
          </p>
          <p>
            It&apos;s the conversation at 8pm when the agenda falls away. When someone says the
            thing you&apos;ve been thinking all week but couldn&apos;t say on stage.
          </p>
          <p className="speaking-display text-accent text-2xl sm:text-3xl self-end">
            We&apos;re creating that. On purpose.
          </p>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="px-5 sm:px-8 lg:px-12 py-24 lg:py-32 border-t border-white/10 text-center">
        <p className="text-accent text-xs uppercase tracking-[0.25em] mb-6">Booking</p>
        <h2 className="speaking-display text-white text-5xl sm:text-8xl lg:text-[9rem] mb-10">
          Bring <span className="speaking-outline">GOOD<br />THINKING</span> to<br />your stage.
        </h2>
        <a
          href={BOOKING_MAILTO}
          className="inline-block bg-accent text-black font-bold uppercase tracking-wide text-sm px-10 py-5 hover:brightness-110 transition-all"
        >
          Book us to speak
        </a>
        <p className="mt-6 text-white/50 text-sm">
          or email{" "}
          <a href={BOOKING_MAILTO} className="text-accent underline underline-offset-4">
            {BOOKING_EMAIL}
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-8 lg:px-12 py-12 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="GOOD THINKING" className="h-6 w-auto" />
          <span className="text-white/40 text-xs uppercase tracking-widest">by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/speaking/igc-logo.svg" alt="IN GOOD CO" className="h-4 w-auto" />
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-widest text-white/60">
          <a href="/jobs" className="hover:text-white transition-colors">Jobs</a>
          <a href="/futures" className="hover:text-white transition-colors">Good Future</a>
          <a href="https://ingoodco.substack.com" className="hover:text-white transition-colors">Newsletter</a>
          <a href={BOOKING_MAILTO} className="hover:text-white transition-colors">Contact</a>
        </nav>
        <span className="text-white/30 text-xs">© {new Date().getFullYear()} IN GOOD CO</span>
      </footer>
    </div>
  );
}
