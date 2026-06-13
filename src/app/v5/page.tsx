import Image from "next/image";
import Link from "next/link";

const YELLOW = "#F9FF00";
const INK = "#1A1A1A";
const CREAM = "#F7F5F0";
const WHITE = "#FFFFFF";
const SOFT = "rgba(0,0,0,0.08)";

const gt: React.CSSProperties = {
  fontFamily: "'Trade Gothic', system-ui, sans-serif",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const hosts = [
  {
    name: "Chris Danton",
    firstName: "Chris",
    role: "Author · Co-Founder & Chief of Ideas, IN GOOD CO",
    topic: "Brand & Culture Strategy",
    headline: ["What brand", "leaders read", "on Sunday."],
    pitch: "Available for keynotes, brand panels, and private corporate events. Speaks on brand strategy, cultural intelligence, and what separates brands people talk about from the ones they forget.",
    bio: "Award-winning futurist, brand builder, author, speaker, and creative strategist with 20+ years of expertise. Led brand positioning for Google, Zappos, Psycho Bunny, and Pinterest. International speaker at SXSW and private keynotes for leading corporations. Frequently quoted in WSJ, Bloomberg, The Guardian, and Adweek.",
    chips: ["Google", "Zappos", "Pinterest", "Psycho Bunny", "SXSW", "WSJ"],
    photo: "/headshots/chris.jpg",
    li: "https://linkedin.com/in/chrisdanton",
  },
  {
    name: "Kirsten Ludwig",
    firstName: "Kirsten",
    role: "Podcast Co-Host · Co-Founder, IN GOOD CO",
    topic: "Brand Building & Creative Leadership",
    headline: ["Building brands", "that people", "actually love."],
    pitch: "Available for keynotes, workshops, and executive off-sites. Speaks on brand-building for challenger brands, cultural curation, and what it means to lead creative teams through change.",
    bio: "Brand builder, cultural curator, and Co-Founder of IN GOOD CO — a global brand consultancy for challenger brands. Career spanning Ralph Lauren, Anthropologie, and Fred Segal before her agency was acquired by WPP. Forbes contributor, Cannes Lions judge, and LinkedIn voice with 20K+ followers.",
    chips: ["Ralph Lauren", "Anthropologie", "Fred Segal", "WPP", "Forbes", "Cannes Lions"],
    photo: "/headshots/kirsten.jpg",
    li: "https://linkedin.com/in/kirstenludwig",
  },
];

const testimonials = [
  { quote: "I have pretty much unsubscribed from everything else at this point, but I felt yours was a must keep.", name: "Aaron Levant", title: "CEO, Complex · Co-Founder, Truff" },
  { quote: "Many marketers consider GOOD THINKING to be the most interesting and relevant newsletter on brands and culture right now.", name: "Jenny Olson", title: "CMO, Herman Miller · Former CMO, Crate & Barrel" },
  { quote: "I pore through your weekly newsletter and dive into virtually every link. I also find myself forwarding it to many of the companies I work with.", name: "Tony Weisman", title: "Board Member, Klaviyo · Former CMO, Dunkin'" },
];

const categories = ["Culture", "F&B", "Retail", "Tech", "Sport", "Wellness & Beauty", "Travel", "Silvers, Alphas & Zs"];

const speakingVideos = [
  { name: "SXSW", sub: "Austin", src: "https://www.youtube.com/embed/aWDxk7nBQ1s" },
  { name: "Brands & Culture", sub: "New York", src: "https://www.youtube.com/embed/lktsrBpM_0k" },
];

const press = ["Bloomberg", "Wall Street Journal", "Forbes", "The Guardian", "Adweek"];

export default function V5() {
  return (
    <div style={{ backgroundColor: CREAM, color: INK }}>

      {/* Variant nav */}
      <div style={{ backgroundColor: INK, padding: "8px 40px", display: "flex", gap: 24, alignItems: "center" }}>
        <span style={{ ...gt, fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Design Variant</span>
        {(["V1","V2","V3","V4","V5"] as const).map((v) => (
          <Link key={v} href={`/${v.toLowerCase()}`} style={{ ...gt, fontSize: 9, color: v === "V5" ? YELLOW : "rgba(255,255,255,0.35)", textDecoration: "none", fontWeight: v === "V5" ? 700 : 400 }}>
            {v}
          </Link>
        ))}
      </div>

      {/* ── HERO — split: type left / duo photo right ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}`, display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "90vh" }}>

        {/* Left — dark type block */}
        <div style={{ backgroundColor: INK, padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[{ v: "17,000+", l: "Subscribers" }, { v: "Top 10%", l: "Open Rate" }, { v: "Top 10%", l: "Downloads" }, { v: "85k+", l: "Monthly Views" }].map(s => (
              <span key={s.l} style={{ ...gt, fontSize: 10, fontWeight: 700, backgroundColor: YELLOW, color: INK, padding: "5px 12px" }}>
                {s.v} {s.l}
              </span>
            ))}
          </div>

          <div>
            <h1 className="font-display font-bold uppercase" style={{ fontSize: "clamp(72px, 10vw, 148px)", lineHeight: 0.84, color: WHITE, marginBottom: 36 }}>
              Good<br />Think<br />ing
            </h1>
            <p style={{ ...gt, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 360, marginBottom: 32 }}>
              Newsletter + Podcast — The weekly briefing on brand, culture, and marketing. Read by 17,000+ C-suite executives, founders, and creative leaders worldwide.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://ingoodco.substack.com/" target="_blank" rel="noopener noreferrer"
                style={{ ...gt, fontSize: 11, fontWeight: 700, backgroundColor: YELLOW, color: INK, padding: "13px 28px", textDecoration: "none" }}>
                Subscribe Free
              </a>
              <a href="https://www.youtube.com/playlist?list=PLj1FlPag44RI9GBd7VQU2WVr-HptAjrUM" target="_blank" rel="noopener noreferrer"
                style={{ ...gt, fontSize: 11, fontWeight: 700, backgroundColor: "transparent", color: WHITE, padding: "13px 28px", textDecoration: "none", border: `1.5px solid rgba(255,255,255,0.4)` }}>
                Watch the Podcast
              </a>
            </div>
          </div>

          <div style={{ ...gt, fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Est. 2020 — Weekly — Newsletter + Podcast</div>
        </div>

        {/* Right — duo newspaper photo */}
        <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#222" }}>
          <Image src="/headshots/duo.jpg" alt="Chris Danton & Kirsten Ludwig" fill className="object-cover object-center" />
        </div>

      </section>

      {/* ── WHAT WE COVER — big category list ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: INK }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 56px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <div style={{ ...gt, fontSize: 10, color: YELLOW, opacity: 0.7, marginBottom: 32 }}>What we cover</div>
            {categories.map((c, i) => (
              <div key={c} style={{
                ...gt,
                fontSize: "clamp(22px, 2.8vw, 40px)",
                fontWeight: 700,
                color: i % 2 === 0 ? WHITE : "rgba(255,255,255,0.35)",
                lineHeight: 1.05,
                paddingBottom: 10,
                marginBottom: 10,
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
              }}>
                {c}
              </div>
            ))}
          </div>
          <div style={{ paddingTop: 56 }}>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.9, marginBottom: 40 }}>
              A best-of-the-best on culture, trends, and marketing. What we&apos;re dropping to friends on Slack and finding useful in brand meetings — across every category that matters.
            </p>
            {/* Testimonials stacked */}
            {testimonials.map((t) => (
              <div key={t.name} style={{ borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 24, marginBottom: 24 }}>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, fontStyle: "italic", marginBottom: 12 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ ...gt, fontSize: 10, fontWeight: 700, color: YELLOW, opacity: 0.8 }}>{t.name}</div>
                <div style={{ ...gt, fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOSTS — speaker bios ── */}
      {hosts.map((h) => (
        <section key={h.name} style={{ borderBottom: `1px solid rgba(255,255,255,0.06)`, backgroundColor: INK }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "400px 1fr 1fr", minHeight: 520 }}>

            {/* Photo */}
            <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#0d0d0d" }}>
              <Image src={h.photo} alt={h.name} fill className="object-cover object-top" style={{ filter: "grayscale(100%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 28px 28px", background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)" }}>
                <div style={{ ...gt, fontSize: 9, color: YELLOW, marginBottom: 8, opacity: 0.8 }}>Speaker Bio</div>
                <h3 className="font-display font-bold uppercase" style={{ fontSize: "clamp(32px, 3vw, 48px)", lineHeight: 0.88, color: WHITE }}>
                  {h.name.split(" ").map((w, i) => <span key={i} style={{ display: "block" }}>{w}</span>)}
                </h3>
              </div>
            </div>

            {/* Hook */}
            <div style={{ padding: "48px 44px", borderRight: `1px solid rgba(255,255,255,0.06)`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ ...gt, fontSize: 9, color: YELLOW, opacity: 0.6, marginBottom: 24 }}>{h.topic}</div>
                <h4 className="font-display font-bold uppercase" style={{ fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 0.88, color: WHITE, marginBottom: 28 }}>
                  {h.headline.map((line, i) => <span key={i} style={{ display: "block" }}>{line}</span>)}
                </h4>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.85 }}>{h.pitch}</p>
              </div>
              <a href={`mailto:chris@weareingoodco.com?subject=Speaking — ${h.firstName}`}
                style={{ ...gt, fontSize: 11, fontWeight: 700, backgroundColor: YELLOW, color: INK, padding: "12px 24px", textDecoration: "none", display: "inline-block", alignSelf: "flex-start", marginTop: 32 }}>
                Book {h.firstName}
              </a>
            </div>

            {/* Bio */}
            <div style={{ padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ ...gt, fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>{h.role}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.9, marginBottom: 28 }}>{h.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {h.chips.map(b => (
                    <span key={b} style={{ ...gt, fontSize: 9, color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "4px 12px" }}>{b}</span>
                  ))}
                </div>
              </div>
              <a href={h.li} target="_blank" rel="noopener noreferrer"
                style={{ ...gt, fontSize: 9, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginTop: 32, borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 2, display: "inline-block" }}>
                Connect on LinkedIn ↗
              </a>
            </div>

          </div>
        </section>
      ))}

      {/* ── DUO — full bleed, this is the moment ── */}
      <section style={{ position: "relative", minHeight: "80vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>

        {/* Full-bleed photo */}
        <Image src="/headshots/duo.jpg" alt="Chris Danton & Kirsten Ludwig" fill className="object-cover object-top" style={{ zIndex: 0 }} />

        {/* Dark gradient from bottom */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)", zIndex: 1 }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", padding: "0 56px 72px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "end" }}>
          <div>
            <div style={{ ...gt, fontSize: 10, color: YELLOW, opacity: 0.7, marginBottom: 20 }}>Chris & Kirsten · Duo Speaking</div>
            <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(48px, 7vw, 112px)", lineHeight: 0.84, color: WHITE }}>
              Good<br />Thinking<br />Makes<br />Brands<br />Better.
            </h2>
          </div>
          <div style={{ paddingBottom: 8 }}>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.85, marginBottom: 32, maxWidth: 440 }}>
              A live conversation format on brand strategy, cultural intelligence, and the future of marketing — from the two people who built the weekly briefing 17,000 leaders read every Sunday.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              <a href="mailto:chris@weareingoodco.com?subject=Duo Speaking Inquiry"
                style={{ ...gt, fontSize: 11, fontWeight: 700, backgroundColor: YELLOW, color: INK, padding: "14px 32px", textDecoration: "none" }}>
                Book Chris & Kirsten
              </a>
              <a href="mailto:chris@weareingoodco.com?subject=Speaking Inquiry"
                style={{ ...gt, fontSize: 11, fontWeight: 700, backgroundColor: "transparent", color: WHITE, padding: "14px 32px", textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.4)" }}>
                Inquire About Speaking
              </a>
            </div>
            <div style={{ ...gt, fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
              SXSW · Brands & Culture NYC · Soho House · SXSW London · Ollie · J.P. Morgan Chase
            </div>
          </div>
        </div>
      </section>

      {/* ── SPEAKING VIDEOS ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: INK }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "48px 56px 40px", borderBottom: `1px solid rgba(255,255,255,0.06)` }}>
            <div style={{ ...gt, fontSize: 10, color: YELLOW, opacity: 0.7, marginBottom: 12 }}>On Stage</div>
            <h3 className="font-display font-bold uppercase" style={{ fontSize: "clamp(36px, 4vw, 60px)", lineHeight: 0.88, color: WHITE }}>
              Watch them work.
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {speakingVideos.map((ev, i) => (
              <div key={ev.name} style={{ borderRight: i === 0 ? `1px solid rgba(255,255,255,0.06)` : "none" }}>
                <div className="aspect-video">
                  <iframe src={ev.src} title={`${ev.name} — ${ev.sub}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
                  <span style={{ ...gt, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{ev.name} — {ev.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOBS CTA ── */}
      <section style={{ borderBottom: `1px solid rgba(0,0,0,0.12)`, backgroundColor: YELLOW }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32, flexWrap: "wrap" }}>
          <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(48px, 6vw, 96px)", lineHeight: 0.86, color: INK }}>
            Looking for<br />your next role?
          </h2>
          <div style={{ maxWidth: 360 }}>
            <p style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", lineHeight: 1.75, marginBottom: 28 }}>
              Brand, marketing, and creative leadership roles — delivered to 17,000+ inboxes every Sunday.
            </p>
            <Link href="/jobs" style={{ ...gt, fontSize: 11, fontWeight: 700, backgroundColor: INK, color: YELLOW, padding: "13px 28px", textDecoration: "none", display: "inline-block" }}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRESS ── */}
      <section style={{ backgroundColor: CREAM }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 56px" }}>
          <div style={{ ...gt, fontSize: 9, color: "rgba(0,0,0,0.35)", marginBottom: 20 }}>As Featured In</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 40px", alignItems: "center" }}>
            {press.map(n => (
              <span key={n} style={{ fontFamily: "'Trade Gothic', system-ui, sans-serif", fontSize: 14, fontWeight: 700, color: "rgba(0,0,0,0.2)", letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
