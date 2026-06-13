import Image from "next/image";
import Link from "next/link";

const BG = "#F5F3EE";
const INK = "#1A1A1A";
const MID = "#6B6B6B";
const SOFT = "rgba(0,0,0,0.09)";
const YELLOW = "#F9FF00";
const WHITE = "#FFFFFF";

const mono: React.CSSProperties = {
  fontFamily: "'Courier New', Courier, monospace",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
};

const stats = [
  { label: "Subscribers", value: "17,000+" },
  { label: "Open Rate", value: "Top 10%" },
  { label: "Download Rate", value: "Top 10%" },
  { label: "Monthly Views", value: "85k+" },
];

const brands = [
  { name: "Target", logo: "/logos/target.svg" },
  { name: "Complex", logo: null },
  { name: "Perelel", logo: null },
  { name: "Klaviyo", logo: "/logos/klaviyo.svg" },
  { name: "Herman Miller", logo: null },
  { name: "Walmart", logo: "/logos/walmart.svg" },
  { name: "LVMH", logo: null },
  { name: "Pinterest", logo: "/logos/pinterest.svg" },
];

const testimonials = [
  {
    quote: "I have pretty much unsubscribed from everything else at this point, but I felt yours was a must keep. I find a few gems in there each week.",
    name: "Aaron Levant",
    title: "CEO, Complex · Co-Founder, Truff",
  },
  {
    quote: "Many marketers consider GOOD THINKING to be the most interesting and relevant newsletter on brands and culture right now.",
    name: "Jenny Olson",
    title: "CMO, Herman Miller · Former CMO, Crate & Barrel",
  },
  {
    quote: "I pore through your weekly newsletter and dive into virtually every link. I find myself forwarding it to many of the companies I work with.",
    name: "Tony Weisman",
    title: "Board Member, Klaviyo · Former CMO, Dunkin'",
  },
];

const hosts = [
  {
    name: "Chris Danton",
    role: "Author · Co-Founder & Chief of Ideas, IN GOOD CO",
    photo: "/headshots/chris.jpg",
    bio: "Award-winning futurist, brand builder, author, speaker, and creative strategist with 20+ years of expertise. Led brand positioning for Google, Zappos, Psycho Bunny, and Pinterest. International speaker at SXSW and private keynotes for leading corporations. Frequently quoted in WSJ, Bloomberg, The Guardian, and Adweek.",
    li: "https://linkedin.com/in/chrisdanton",
  },
  {
    name: "Kirsten Ludwig",
    role: "Podcast Co-Host · Co-Founder, IN GOOD CO",
    photo: "/headshots/kirsten.jpg",
    bio: "Brand builder, cultural curator, and Co-Founder of IN GOOD CO — a global brand consultancy for challenger brands. Career spanning Ralph Lauren, Anthropologie, and Fred Segal before her agency was acquired by WPP. Forbes contributor, Cannes Lions judge, and LinkedIn voice with 20K+ followers.",
    li: "https://linkedin.com/in/kirstenludwig",
  },
];

const speakingVideos = [
  { name: "SXSW", sub: "Austin", src: "https://www.youtube.com/embed/aWDxk7nBQ1s" },
  { name: "Brands & Culture", sub: "New York", src: "https://www.youtube.com/embed/lktsrBpM_0k" },
];

const speakingPhotos = [
  { name: "SXSW × Populous", sub: "Austin", photo: "/speaking/populous-sxsw.jpg" as string | null },
  { name: "Soho House", sub: null, photo: null as string | null },
];

const otherEvents = ["SXSW — London", "Ollie", "J.P. Morgan Chase"];

const press = ["Bloomberg", "Wall Street Journal", "Forbes", "The Guardian", "Adweek"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      ...mono,
      fontSize: 10,
      color: MID,
      border: `1px solid ${SOFT}`,
      borderRadius: 100,
      padding: "5px 14px",
      display: "inline-block",
      backgroundColor: WHITE,
    }}>
      {children}
    </span>
  );
}

function SectionHeader({ star, label }: { star?: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
      {star && <span style={{ color: INK, fontSize: 14 }}>✹</span>}
      <span style={{ ...mono, fontSize: 10, color: MID }}>{label}</span>
      <div style={{ flex: 1, height: 1, backgroundColor: SOFT }} />
    </div>
  );
}

export default function V4() {
  return (
    <div style={{ backgroundColor: BG, color: INK, minHeight: "100vh" }}>

      {/* Variant nav */}
      <div style={{ backgroundColor: INK, padding: "8px 40px", display: "flex", gap: 24, alignItems: "center" }}>
        <span style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.25)" }}>DESIGN VARIANT:</span>
        {([["V1", "/v1"], ["V2", "/v2"], ["V3", "/v3"], ["V4", "/v4"]] as [string, string][]).map(([label, href]) => (
          <Link key={label} href={href} style={{ ...mono, fontSize: 10, color: href === "/v4" ? YELLOW : "rgba(255,255,255,0.35)", textDecoration: "none", fontWeight: href === "/v4" ? 700 : 400 }}>
            {label}
          </Link>
        ))}
      </div>

      {/* ── HERO ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: WHITE }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px 56px" }}>

          {/* Stats pills — top */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
            {stats.map((s) => (
              <span key={s.label} style={{
                fontFamily: "'Trade Gothic', system-ui, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: INK,
                color: YELLOW,
                borderRadius: 4,
                padding: "6px 14px",
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
              }}>
                {s.value} {s.label}
              </span>
            ))}
          </div>

          {/* Big headline */}
          <h1 className="font-display font-bold uppercase" style={{
            fontSize: "clamp(72px, 13vw, 192px)",
            lineHeight: 0.84,
            letterSpacing: "-0.02em",
            color: INK,
            marginBottom: 48,
          }}>
            Good<br />Thinking
          </h1>

          {/* Tagline + CTAs — stacked left, anchored below headline */}
          <div style={{ maxWidth: 560 }}>
            <p style={{
              fontFamily: "'Trade Gothic', system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 400,
              color: INK,
              lineHeight: 1.55,
              marginBottom: 28,
            }}>
              The weekly briefing on brand, culture, and marketing. Read by 17,000+ C-suite executives, founders, and creative leaders worldwide.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="https://ingoodco.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Trade Gothic', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  backgroundColor: YELLOW,
                  color: INK,
                  padding: "14px 28px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Subscribe Free
              </a>
              <a
                href="https://www.youtube.com/playlist?list=PLj1FlPag44RI9GBd7VQU2WVr-HptAjrUM"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Trade Gothic', system-ui, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  backgroundColor: "transparent",
                  color: INK,
                  padding: "14px 28px",
                  textDecoration: "none",
                  display: "inline-block",
                  border: `2px solid ${INK}`,
                }}
              >
                Watch the Podcast →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
          <SectionHeader star label="About" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Left — Big tagline card */}
            <div style={{
              backgroundColor: INK,
              borderRadius: 12,
              padding: 48,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 340,
            }}>
              <h2 className="font-display font-bold uppercase" style={{
                fontSize: "clamp(44px, 5.5vw, 80px)",
                lineHeight: 0.88,
                color: WHITE,
              }}>
                Brand.<br />Culture.<br />Every<br />Week.
              </h2>
              <p style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, maxWidth: 340, marginTop: 28 }}>
                A best-of-the-best on culture, trends, and marketing. What we&apos;re sharing in brand meetings — across F&amp;B, Retail, Tech, Wellness, Beauty, Sport, and more.
              </p>
            </div>

            {/* Right — Brand grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ ...mono, fontSize: 10, color: MID, marginBottom: 6 }}>✹ Read by leaders at</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, flex: 1 }}>
                {brands.map((b) => (
                  <div key={b.name} style={{
                    backgroundColor: WHITE,
                    border: `1px solid ${SOFT}`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px 16px",
                    minHeight: 72,
                  }}>
                    {b.logo ? (
                      <Image src={b.logo} alt={b.name} width={100} height={32} style={{ objectFit: "contain", maxHeight: 32 }} />
                    ) : (
                      <span style={{ fontFamily: "'Trade Gothic', system-ui, sans-serif", fontSize: 13, color: INK, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" as const }}>{b.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: WHITE }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
          <SectionHeader star label="What Readers Say" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {testimonials.map((t, i) => (
              <div key={t.name} style={{
                border: `1px solid ${SOFT}`,
                borderRadius: 10,
                padding: 32,
                backgroundColor: i === 1 ? INK : BG,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 24,
              }}>
                <div>
                  <span style={{ fontSize: 24, color: i === 1 ? YELLOW : INK }}>✹</span>
                  <p style={{
                    fontSize: 14,
                    color: i === 1 ? "rgba(255,255,255,0.75)" : "#444",
                    lineHeight: 1.8,
                    fontStyle: "italic",
                    marginTop: 16,
                  }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div>
                  <div style={{ ...mono, fontSize: 11, fontWeight: 700, color: i === 1 ? WHITE : INK, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ ...mono, fontSize: 10, color: i === 1 ? "rgba(255,255,255,0.4)" : MID }}>{t.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOSTS — speaker bio style ── */}
      {hosts.map((h, i) => (
        <section key={h.name} style={{ borderBottom: `1px solid rgba(255,255,255,0.08)`, backgroundColor: INK }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "420px 1fr 1fr", minHeight: 520 }}>

            {/* LEFT — photo with name overlay */}
            <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#111" }}>
              <Image
                src={h.photo}
                alt={h.name}
                fill
                className="object-cover object-top"
                style={{ filter: "grayscale(100%)" }}
              />
              {/* Name pinned to bottom-left */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}>
                <div style={{ ...mono, fontSize: 9, color: YELLOW, marginBottom: 8 }}>Speaker Bio</div>
                <h3 className="font-display font-bold uppercase" style={{ fontSize: "clamp(36px, 3.5vw, 52px)", lineHeight: 0.88, color: WHITE }}>
                  {h.name.split(" ").map((word, wi) => <span key={wi} style={{ display: "block" }}>{word}</span>)}
                </h3>
              </div>
            </div>

            {/* MIDDLE — speaking topic headline */}
            <div style={{ padding: "48px 40px", borderRight: `1px solid rgba(255,255,255,0.08)`, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ ...mono, fontSize: 9, color: YELLOW, marginBottom: 28, opacity: 0.7 }}>
                  {i === 0 ? "Brand & Culture Strategy" : "Brand Building & Creative Leadership"}
                </div>
                <h4 className="font-display font-bold uppercase" style={{
                  fontSize: "clamp(32px, 3.2vw, 52px)",
                  lineHeight: 0.88,
                  color: WHITE,
                  marginBottom: 32,
                }}>
                  {i === 0
                    ? <>What brand<br />leaders read<br />on Sunday.</>
                    : <>Building brands<br />that people<br />actually love.</>
                  }
                </h4>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.85 }}>
                  {i === 0
                    ? "Available for keynotes, brand panels, and private corporate events. Speaks on brand strategy, cultural intelligence, and what separates brands people talk about from the ones they forget."
                    : "Available for keynotes, workshops, and executive off-sites. Speaks on brand-building for challenger brands, cultural curation, and what it means to lead creative teams through change."
                  }
                </p>
              </div>
              <a
                href={`mailto:chris@weareingoodco.com?subject=Speaking Inquiry — ${h.name.split(" ")[0]}`}
                style={{
                  fontFamily: "'Trade Gothic', system-ui, sans-serif",
                  fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase" as const,
                  backgroundColor: YELLOW, color: INK,
                  padding: "12px 24px",
                  textDecoration: "none", display: "inline-block",
                  alignSelf: "flex-start", marginTop: 32,
                }}
              >
                Book {h.name.split(" ")[0]}
              </a>
            </div>

            {/* RIGHT — bio */}
            <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>{h.role}</div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.9, marginBottom: 28 }}>{h.bio}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(i === 0
                    ? ["Google", "Zappos", "Pinterest", "Psycho Bunny", "SXSW", "WSJ"]
                    : ["Ralph Lauren", "Anthropologie", "Fred Segal", "WPP", "Forbes", "Cannes Lions"]
                  ).map((b) => (
                    <span key={b} style={{
                      ...mono, fontSize: 9, color: "rgba(255,255,255,0.55)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 100, padding: "4px 12px",
                    }}>{b}</span>
                  ))}
                </div>
              </div>
              <a href={h.li} target="_blank" rel="noopener noreferrer" style={{
                ...mono, fontSize: 9, color: "rgba(255,255,255,0.5)",
                textDecoration: "none", marginTop: 32,
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                paddingBottom: 2, display: "inline-block",
              }}>
                Connect on LinkedIn ↗
              </a>
            </div>

          </div>
        </section>
      ))}

      {/* ── BOOK THE DUO ── */}
      <section style={{ borderBottom: `1px solid rgba(0,0,0,0.15)`, backgroundColor: YELLOW }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ ...mono, fontSize: 9, color: "rgba(0,0,0,0.45)", marginBottom: 12 }}>Chris & Kirsten · Duo</div>
            <h4 className="font-display font-bold uppercase" style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 0.9, color: INK }}>
              They also speak<br />as a duo.
            </h4>
          </div>
          <div style={{ maxWidth: 400 }}>
            <p style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.75, marginBottom: 24 }}>
              A conversation format covering brand strategy, cultural intelligence, and the future of marketing — from two people who built the newsletter 17,000 leaders read every Sunday.
            </p>
            <a
              href="mailto:chris@weareingoodco.com?subject=Duo Speaking Inquiry"
              style={{
                fontFamily: "'Trade Gothic', system-ui, sans-serif",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase" as const,
                backgroundColor: INK, color: YELLOW,
                padding: "13px 28px",
                textDecoration: "none", display: "inline-block",
              }}
            >
              Book Chris & Kirsten
            </a>
          </div>
        </div>
      </section>

      {/* ── SPEAKING ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: INK }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* Header row */}
          <div style={{ padding: "56px 40px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ color: YELLOW, fontSize: 14 }}>✹</span>
              <span style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Speaking & Events</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 48, flexWrap: "wrap" }}>
              <h2 className="font-display font-bold uppercase" style={{
                fontSize: "clamp(48px, 7vw, 104px)",
                lineHeight: 0.86,
                color: WHITE,
              }}>
                We take the<br />stage 20+<br />times a year.
              </h2>
              <div style={{ maxWidth: 320 }}>
                <p style={{ ...mono, fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.9, marginBottom: 24 }}>
                  Available for keynotes, brand panels, conference appearances, and private corporate events. SXSW, Cannes, private Fortune 500 stages.
                </p>
                <a
                  href="mailto:chris@weareingoodco.com?subject=Speaking Inquiry"
                  style={{
                    ...mono,
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: YELLOW,
                    color: INK,
                    borderRadius: 100,
                    padding: "12px 28px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  Inquire About Speaking ✹
                </a>
              </div>
            </div>
          </div>

          {/* Videos — full width, no padding, edge to edge inside container */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid rgba(255,255,255,0.08)` }}>
            {speakingVideos.map((ev, i) => (
              <div key={ev.name} style={{ borderRight: i === 0 ? `1px solid rgba(255,255,255,0.08)` : "none" }}>
                <div className="aspect-video">
                  <iframe
                    src={ev.src}
                    title={`${ev.name} — ${ev.sub}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid rgba(255,255,255,0.08)` }}>
                  <span style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{ev.name}</span>
                  <span style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: 10 }}>— {ev.sub}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Also appeared at */}
          <div style={{ padding: "24px 40px", borderTop: `1px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Also appeared at</span>
            {[...speakingPhotos.map(p => `${p.name}${p.sub ? ` — ${p.sub}` : ""}`), ...otherEvents].map((ev) => (
              <span key={ev} style={{
                ...mono, fontSize: 9, color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, padding: "5px 14px",
              }}>{ev}</span>
            ))}
          </div>

        </div>
      </section>

      {/* ── JOBS CTA ── */}
      <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: INK }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
          <div style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 32, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: YELLOW }}>✹</span>
            <span>Job Board</span>
          </div>
          <h2 className="font-display font-bold uppercase" style={{
            fontSize: "clamp(52px, 9vw, 128px)",
            lineHeight: 0.87,
            color: WHITE,
            marginBottom: 24,
          }}>
            Looking for<br />your next<br />role?
          </h2>
          <p style={{ ...mono, fontSize: 12, color: "rgba(255,255,255,0.4)", maxWidth: 380, lineHeight: 1.8, marginBottom: 36 }}>
            Brand, marketing, and creative leadership roles — delivered to 17,000+ inboxes every Sunday.
          </p>
          <Link href="/jobs" style={{
            ...mono,
            fontSize: 11,
            fontWeight: 700,
            backgroundColor: YELLOW,
            color: INK,
            borderRadius: 100,
            padding: "14px 36px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
          }}>
            Browse Jobs ✹
          </Link>
        </div>
      </section>

      {/* ── PRESS ── */}
      <section style={{ backgroundColor: BG, borderBottom: `1px solid ${SOFT}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 40px" }}>
          <div style={{ ...mono, fontSize: 10, color: MID, marginBottom: 24 }}>✹ As Featured In</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 36px", alignItems: "center" }}>
            {press.map((name) => (
              <span key={name} style={{ ...mono, fontSize: 13, color: "rgba(0,0,0,0.25)", fontWeight: 700, letterSpacing: "0.06em" }}>{name}</span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
