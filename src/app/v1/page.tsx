import Image from "next/image";
import Link from "next/link";

const LIGHT = "#EDECEA";
const WHITE = "#FFFFFF";
const INK = "#111111";
const MUTED = "#888888";
const SOFT = "rgba(0,0,0,0.07)";
const YELLOW = "#F9FF00";

const mono: React.CSSProperties = { fontFamily: "'Courier New', monospace" };
const tag = (label: string) => (
  <span style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
    {label}
  </span>
);

export default function V1() {
  const hosts = [
    {
      name: "Chris Danton",
      role: "Author · Co-Founder",
      img: "/headshots/chris.jpg",
      bio: "Award-winning futurist, brand builder, author, and creative strategist. 20+ years. Google, Zappos, Psycho Bunny, Pinterest. Quoted in WSJ, Bloomberg, The Guardian, Adweek.",
      li: "https://linkedin.com/in/chrisdanton",
    },
    {
      name: "Kirsten Ludwig",
      role: "Co-Host · Co-Founder",
      img: "/headshots/kirsten.jpg",
      bio: "Brand builder and cultural curator. Ralph Lauren, Anthropologie, Fred Segal. WPP acquisition. Forbes contributor, Cannes Lions judge. 20K+ LinkedIn followers.",
      li: "https://linkedin.com/in/kirstenludwig",
    },
  ];

  return (
    <>
      <div style={{ position: "fixed", inset: 0, backgroundColor: LIGHT, zIndex: -1 }} />
      <div style={{ color: INK }}>

        {/* ── VARIANT NAV ── */}
        <div style={{ backgroundColor: INK, padding: "8px 32px", display: "flex", gap: 24, alignItems: "center" }}>
          {mono && <span style={{ ...mono, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>DESIGN VARIANT:</span>}
          {[["V1", "/v1", true], ["V2", "/v2", false], ["V3", "/v3", false]].map(([label, href, active]) => (
            <Link key={String(label)} href={String(href)} style={{ ...mono, fontSize: 10, letterSpacing: "0.15em", color: active ? YELLOW : "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: active ? 700 : 400 }}>
              {String(label)}
            </Link>
          ))}
        </div>

        {/* ── HERO ── */}
        <section style={{ borderBottom: `1px solid ${SOFT}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 56px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: YELLOW, border: `1px solid rgba(0,0,0,0.2)` }} />
              {tag("EST. 2020 — NEWSLETTER + PODCAST — WEEKLY")}
            </div>

            <h1 className="font-display font-bold uppercase" style={{ fontSize: "clamp(80px, 14vw, 200px)", lineHeight: 0.84, letterSpacing: "-0.02em", color: INK, marginBottom: 40 }}>
              Good<br />Thinking
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
              <p style={{ ...mono, fontSize: 13, color: "#666", maxWidth: 420, lineHeight: 1.7 }}>
                The weekly briefing on brand, culture, and marketing.<br />
                Read by 17,000+ C-suite executives, founders, and creative leaders worldwide.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <a href="https://ingoodco.substack.com/" target="_blank" rel="noopener noreferrer"
                  style={{ ...mono, backgroundColor: YELLOW, color: INK, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", padding: "13px 28px", borderRadius: 100, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                  Subscribe Free ↗
                </a>
                <Link href="/jobs" style={{ ...mono, backgroundColor: WHITE, color: INK, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", padding: "13px 28px", borderRadius: 100, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${SOFT}`, textDecoration: "none" }}>
                  Browse Jobs →
                </Link>
              </div>
            </div>
          </div>

          {/* Stats ticker */}
          <div style={{ borderTop: `1px solid ${SOFT}`, backgroundColor: WHITE }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 40px", display: "flex", flexWrap: "wrap", gap: "8px 40px" }}>
              {[["SUBSCRIBERS", "17,000+"], ["OPEN_RATE", "TOP 10%"], ["DOWNLOAD_RATE", "TOP 10%"], ["MONTHLY_VIEWS", "85K+"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ ...mono, fontSize: 10, color: "#bbb", letterSpacing: "0.15em" }}>{k}</span>
                  <span style={{ ...mono, fontSize: 11, fontWeight: 700, backgroundColor: INK, color: YELLOW, padding: "2px 10px", borderRadius: 4 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section style={{ borderBottom: `1px solid ${SOFT}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
            <SectionLabel index="01" label="ABOUT" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 40 }}>
              <div style={{ backgroundColor: INK, color: "white", padding: 48, borderRadius: 10 }}>
                <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(48px, 6vw, 80px)", lineHeight: 0.88, marginBottom: 28 }}>
                  Brand.<br />Culture.<br />Every Week.
                </h2>
                <p style={{ ...mono, fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 360 }}>
                  A best-of-the-best on culture, trends, and marketing. What we&apos;re sharing in brand meetings — across F&B, Retail, Tech, Wellness, Beauty, Sport, and more.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {["Target", "Complex", "Perelel", "Klaviyo", "Herman Miller", "Walmart", "LVMH", "Pinterest"].map((b) => (
                  <div key={b} style={{ backgroundColor: WHITE, border: `1px solid ${SOFT}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                    <span style={{ ...mono, fontSize: 11, color: "#999", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: WHITE }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
            <SectionLabel index="02" label="WHAT READERS SAY" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 40 }}>
              {[
                { q: "I have pretty much unsubscribed from everything else, but yours was a must keep. I find a few gems in there each week.", name: "Aaron Levant", title: "CEO @ Complex" },
                { q: "Many marketers consider GOOD THINKING to be the most interesting and relevant newsletter on brands and culture right now.", name: "Jenny Olson", title: "CMO @ Herman Miller" },
                { q: "I pore through your weekly newsletter and dive into virtually every link. I also find myself forwarding it to many of the companies I work with.", name: "Tony Weisman", title: "Board Member @ Klaviyo" },
              ].map((t) => (
                <div key={t.name} style={{ border: `1px solid ${SOFT}`, borderRadius: 8, padding: 32, backgroundColor: LIGHT }}>
                  <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>&ldquo;{t.q}&rdquo;</p>
                  <div>
                    <div style={{ ...mono, fontSize: 11, color: INK, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{t.name}</div>
                    <div style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOSTS ── */}
        <section style={{ borderBottom: `1px solid ${SOFT}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
            <SectionLabel index="03" label="THE HOSTS" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 40 }}>
              {hosts.map((h) => (
                <div key={h.name} style={{ backgroundColor: WHITE, border: `1px solid ${SOFT}`, borderRadius: 10, padding: 32, display: "flex", gap: 28 }}>
                  <div style={{ position: "relative", width: 110, height: 140, flexShrink: 0, borderRadius: 6, overflow: "hidden", backgroundColor: "#ddd" }}>
                    <Image src={h.img} alt={h.name} fill className="object-cover object-top" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className="font-display font-bold uppercase" style={{ fontSize: 30, lineHeight: 0.92, marginBottom: 10, color: INK }}>{h.name}</h3>
                    <p style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>{h.role}</p>
                    <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>{h.bio}</p>
                    <a href={h.li} target="_blank" rel="noopener noreferrer"
                      style={{ ...mono, backgroundColor: YELLOW, color: INK, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "7px 16px", borderRadius: 100, textDecoration: "none", display: "inline-block" }}>
                      LinkedIn ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPEAKING ── */}
        <section style={{ borderBottom: `1px solid ${SOFT}`, backgroundColor: WHITE }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 40px" }}>
            <SectionLabel index="04" label="SPEAKING & EVENTS" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 40, marginBottom: 14 }}>
              {[
                { name: "SXSW — Austin", video: "https://www.youtube.com/embed/aWDxk7nBQ1s" },
                { name: "Brands & Culture — NYC", video: "https://www.youtube.com/embed/lktsrBpM_0k" },
              ].map((ev) => (
                <div key={ev.name} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${SOFT}` }}>
                  <div className="aspect-video"><iframe src={ev.video} title={ev.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" /></div>
                  <div style={{ padding: "12px 16px", borderTop: `1px solid ${SOFT}` }}>
                    <span style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>{ev.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
              {[
                { name: "SXSW × Populous — Austin", photo: "/speaking/populous-sxsw.jpg" },
                { name: "Soho House", photo: null },
              ].map((ev) => (
                <div key={ev.name} style={{ borderRadius: 8, overflow: "hidden", border: `1px solid ${SOFT}` }}>
                  <div className="aspect-video relative" style={{ backgroundColor: "#e5e5e5" }}>
                    {ev.photo
                      ? <Image src={ev.photo} alt={ev.name} fill className="object-cover" />
                      : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><span style={{ ...mono, fontSize: 10, color: "#bbb", letterSpacing: "0.15em", textTransform: "uppercase" }}>Photo Coming Soon</span></div>}
                  </div>
                  <div style={{ padding: "12px 16px", borderTop: `1px solid ${SOFT}` }}>
                    <span style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.12em", textTransform: "uppercase" }}>{ev.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["SXSW — London", "Ollie", "J.P. Morgan Chase"].map((ev) => (
                <span key={ev} style={{ ...mono, fontSize: 10, color: MUTED, border: `1px solid rgba(0,0,0,0.12)`, borderRadius: 100, padding: "7px 18px", letterSpacing: "0.12em", textTransform: "uppercase" }}>{ev}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOBS CTA ── */}
        <section style={{ borderBottom: `1px solid ${SOFT}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
            <SectionLabel index="05" label="JOB BOARD" />
            <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(56px, 9vw, 120px)", lineHeight: 0.87, color: INK, margin: "32px 0 24px" }}>
              Looking for<br />your next role?
            </h2>
            <p style={{ ...mono, fontSize: 13, color: "#666", maxWidth: 400, lineHeight: 1.65, marginBottom: 32 }}>
              Brand, marketing, and creative leadership roles — delivered to 17,000+ inboxes every Sunday.
            </p>
            <Link href="/jobs" style={{ ...mono, backgroundColor: YELLOW, color: INK, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", padding: "15px 36px", borderRadius: 100, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              Browse Jobs →
            </Link>
          </div>
        </section>

        {/* ── PRESS ── */}
        <section style={{ backgroundColor: INK, padding: "56px 40px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ ...mono, fontSize: 10, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 28 }}>AS FEATURED IN</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 40px" }}>
              {["Bloomberg", "Wall Street Journal", "Forbes", "The Guardian", "Adweek"].map((n) => (
                <span key={n} style={{ ...mono, fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700 }}>{n}</span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>[{index}]</span>
      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>{label}</span>
      <div style={{ flex: 1, height: 1, backgroundColor: "rgba(0,0,0,0.07)" }} />
    </div>
  );
}
