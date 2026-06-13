import Link from "next/link";
import Image from "next/image";

const testimonials = [
  {
    quote: "I have pretty much unsubscribed from everything else at this point, but I felt yours was a must keep. I find a few gems in there each week.",
    name: "Aaron Levant",
    title: "CEO @ Complex & Co-Founder @ Truff",
  },
  {
    quote: "Many marketers consider GOOD THINKING to be the most interesting and relevant newsletter on brands and culture right now.",
    name: "Jenny Olson",
    title: "CMO @ Herman Miller & Former CMO @ Crate & Barrel",
  },
  {
    quote: "I pore through your weekly newsletter and dive into virtually every link. I also find myself forwarding it to many of the companies I work with.",
    name: "Tony Weisman",
    title: "Board Member @ Klaviyo, Former CMO @ Dunkin'",
  },
];

const readerLogos = ["Target", "Complex", "Perelel", "Klaviyo", "Herman Miller", "Walmart", "LVMH"];

const speakingVideos = [
  {
    name: "SXSW",
    subtitle: "Austin",
    video: "https://www.youtube.com/embed/aWDxk7nBQ1s",
  },
  {
    name: "Brands & Culture",
    subtitle: "New York",
    video: "https://www.youtube.com/embed/lktsrBpM_0k",
  },
];

const speakingPhotos = [
  { name: "SXSW × Populous", subtitle: "Austin", photo: "/speaking/populous-sxsw.jpg" as string | null },
  { name: "Soho House", subtitle: null, photo: null as string | null },
];

const otherEvents = [
  { name: "SXSW", location: "London" },
  { name: "Ollie", location: null },
  { name: "J.P. Morgan Chase", location: null },
];

const pressLogos = ["Bloomberg", "Wall Street Journal", "Forbes", "The Guardian", "Adweek"];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-32">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-headline mb-6">
            Newsletter + Podcast
          </p>
          <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-bold uppercase leading-[0.88] tracking-tight font-display text-white mb-8">
            Good<br />Thinking
          </h1>
          <p className="text-xl sm:text-2xl text-white/70 max-w-2xl font-secondary leading-relaxed mb-10">
            The weekly briefing on brand, culture, and marketing, read by 17,000+ C-suite executives, founders, and creative leaders worldwide.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://ingoodco.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-black font-bold uppercase tracking-widest text-sm px-8 py-4 font-headline hover:brightness-110 transition-all"
            >
              Subscribe Free
            </a>
            <a
              href="https://www.youtube.com/playlist?list=PLj1FlPag44RI9GBd7VQU2WVr-HptAjrUM"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 font-headline hover:border-white/70 transition-all"
            >
              Watch the Podcast
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-white/10 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { stat: "17,000+", label: "Subscribers" },
              { stat: "Top 10%", label: "Open Rate" },
              { stat: "Top 10%", label: "Download Rate" },
              { stat: "85k+", label: "Monthly Views" },
            ].map(({ stat, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-3xl font-bold font-display uppercase text-accent">{stat}</div>
                <div className="text-xs uppercase tracking-widest text-muted font-headline mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl sm:text-6xl font-bold uppercase leading-[0.9] font-display text-white mb-6">
              Brand.<br />Culture.<br />Every Week.
            </h2>
            <p className="text-base text-white/60 font-secondary leading-relaxed max-w-md">
              GOOD THINKING is a best-of-the-best on culture, trends, and marketing. We share what we&apos;re dropping to friends on Slack and finding useful in brand meetings, across F&amp;B, Retail, Tech, Wellness, Beauty, Sport, and more.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted font-headline mb-6">Read by leaders at</p>
            <div className="flex flex-wrap gap-4">
              {readerLogos.map((name) => (
                <span
                  key={name}
                  className="border border-white/20 px-4 py-2 text-xs uppercase tracking-widest font-headline text-white/60"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-white/10 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-white/10 p-8">
                <p className="text-white/80 font-secondary leading-relaxed mb-6 text-sm">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="text-white font-bold text-sm font-headline uppercase tracking-wide">{t.name}</div>
                  <div className="text-muted text-xs font-headline mt-1">{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Hosts */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-headline mb-12">The Hosts</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Chris */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border border-white/10 p-8">
              <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                <Image
                  src="/headshots/chris.jpg"
                  alt="Chris Danton"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-4xl font-bold uppercase leading-[0.9] font-display text-white mb-2">
                    Chris<br />Danton
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-accent font-headline mb-4">
                    Author · Co-Founder &amp; Chief of Ideas @ IN GOOD CO
                  </p>
                  <p className="text-sm text-white/60 font-secondary leading-relaxed mb-4">
                    Award-winning futurist, brand builder, author, speaker, and creative strategist with 20+ years of expertise. Led brand positioning for Google, Zappos, Psycho Bunny, and Pinterest.
                  </p>
                  <p className="text-sm text-white/60 font-secondary leading-relaxed">
                    International speaker at SXSW, Brands &amp; Culture NYC, and private keynotes for leading corporations. Frequently quoted in the Wall Street Journal, Bloomberg, The Guardian, and Adweek.
                  </p>
                </div>
                <a
                  href="https://www.linkedin.com/in/chrisdanton/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest font-headline text-accent hover:brightness-125 transition-all mt-6 block"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            </div>

            {/* Kirsten */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border border-white/10 p-8">
              <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
                <Image
                  src="/headshots/kirsten.jpg"
                  alt="Kirsten Ludwig"
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-4xl font-bold uppercase leading-[0.9] font-display text-white mb-2">
                    Kirsten<br />Ludwig
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-accent font-headline mb-4">
                    Podcast Co-Host · Co-Founder @ IN GOOD CO
                  </p>
                  <p className="text-sm text-white/60 font-secondary leading-relaxed mb-4">
                    Brand builder, cultural curator, and Co-Founder of IN GOOD CO, a global brand consultancy for challenger brands. Career spanning Ralph Lauren, Anthropologie, and Fred Segal before her agency was acquired by WPP.
                  </p>
                  <p className="text-sm text-white/60 font-secondary leading-relaxed">
                    Forbes contributor, Cannes Lions judge, and LinkedIn voice with 20K+ followers. Co-hosts Lit From Within. Holds a seat at THE BOARD, Sunday Dinner, and Intro.
                  </p>
                </div>
                <a
                  href="https://www.linkedin.com/in/kirstenludwig/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest font-headline text-accent hover:brightness-125 transition-all mt-6 block"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Speaking & Events */}
      <section id="speaking" className="border-b border-white/10 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p className="text-xs uppercase tracking-[0.2em] text-accent font-headline mb-4">Speaking &amp; Events</p>
          <h2 className="text-4xl sm:text-5xl font-bold uppercase leading-[0.9] font-display text-white mb-12">
            Where we&apos;ve<br />taken the stage
          </h2>

          {/* Videos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {speakingVideos.map((event) => (
              <div key={event.name}>
                <div className="aspect-video border border-white/10 overflow-hidden mb-3">
                  <iframe
                    src={event.video}
                    title={`${event.name} · ${event.subtitle}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs uppercase tracking-widest text-muted font-headline">
                  {event.name}
                  {event.subtitle && (
                    <span className="text-white/30 ml-2">· {event.subtitle}</span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Photo placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {speakingPhotos.map((event) => (
              <div key={event.name}>
                <div className="aspect-video border border-white/10 overflow-hidden mb-3 bg-white/[0.03] flex items-center justify-center relative">
                  {event.photo ? (
                    <Image src={event.photo} alt={event.name} fill className="object-cover" />
                  ) : (
                    <span className="text-white/25 text-xs font-headline uppercase tracking-widest">
                      Photo coming soon
                    </span>
                  )}
                </div>
                <p className="text-xs uppercase tracking-widest text-muted font-headline">
                  {event.name}
                  {event.subtitle && (
                    <span className="text-white/30 ml-2">· {event.subtitle}</span>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Other events */}
          <div className="flex flex-wrap gap-3">
            {otherEvents.map((event) => (
              <div
                key={`${event.name}-${event.location}`}
                className="border border-white/20 px-6 py-4"
              >
                <span className="text-sm font-bold uppercase tracking-widest font-headline text-white/70">
                  {event.name}
                  {event.location && (
                    <span className="text-white/40 ml-2 font-normal">{event.location}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs CTA */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl sm:text-4xl font-bold uppercase font-display text-white leading-tight mb-2">
              Looking for your next role?
            </h3>
            <p className="text-white/60 font-secondary">Brand, marketing, and creative leadership roles, sent to 17,000+ inboxes every Sunday.</p>
          </div>
          <Link
            href="/jobs"
            className="shrink-0 bg-accent text-black font-bold uppercase tracking-widest text-sm px-8 py-4 font-headline hover:brightness-110 transition-all whitespace-nowrap"
          >
            Browse Jobs →
          </Link>
        </div>
      </section>

      {/* Press */}
      <section className="border-b border-white/10 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
          <p className="text-xs uppercase tracking-[0.2em] text-muted font-headline mb-8">As featured in</p>
          <div className="flex flex-wrap gap-x-10 gap-y-4 items-center">
            {pressLogos.map((name) => (
              <span key={name} className="text-lg font-bold font-headline uppercase tracking-wider text-white/40 hover:text-white/70 transition-colors">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
