import Image from "next/image";
import Link from "next/link";

const YELLOW = "#F9FF00";
const BLACK = "#0A0A0A";
const WHITE = "#FFFFFF";

export default function V2() {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, backgroundColor: BLACK, zIndex: -1 }} />
      <div style={{ color: WHITE }}>

        {/* ── VARIANT NAV ── */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.04)", padding: "8px 32px", display: "flex", gap: 24, alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}>DESIGN VARIANT:</span>
          {[["V1", "/v1", false], ["V2", "/v2", true], ["V3", "/v3", false]].map(([label, href, active]) => (
            <Link key={String(label)} href={String(href)} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: active ? YELLOW : "rgba(255,255,255,0.3)", textDecoration: "none", fontWeight: active ? 700 : 400 }}>
              {String(label)}
            </Link>
          ))}
        </div>

        {/* ── HERO ── */}
        <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "0 40px 56px", width: "100%" }}>

            {/* Huge headline — full bleed */}
            <div style={{ overflow: "hidden", marginLeft: -40, marginRight: -40, paddingLeft: 40 }}>
              <h1 className="font-display font-bold uppercase" style={{ fontSize: "clamp(100px, 18vw, 260px)", lineHeight: 0.82, letterSpacing: "-0.03em", color: WHITE, whiteSpace: "nowrap" }}>
                Good Thinking
              </h1>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 40, flexWrap: "wrap", gap: 24 }}>
              <div style={{ maxWidth: 480 }}>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 24, fontWeight: 300 }}>
                  The weekly briefing on brand, culture, and marketing. Read by 17,000+ executives, founders, and creative leaders worldwide.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a href="https://ingoodco.substack.com/" target="_blank" rel="noopener noreferrer"
                    style={{ backgroundColor: YELLOW, color: BLACK, fontSize: 13, fontWeight: 900, letterSpacing: "0.12em", padding: "14px 32px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", fontFamily: "Trade Gothic, sans-serif" }}>
                    Subscribe Free →
                  </a>
                  <a href="https://www.youtube.com/playlist?list=PLj1FlPag44RI9GBd7VQU2WVr-HptAjrUM" target="_blank" rel="noopener noreferrer"
                    style={{ border: "1px solid rgba(255,255,255,0.2)", color: WHITE, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", padding: "14px 32px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                    Watch →
                  </a>
                </div>
              </div>

              {/* Stats — stacked display */}
              <div style={{ display: "flex", gap: 40 }}>
                {[["17K+", "Subscribers"], ["Top 10%", "Open Rate"], ["85K+", "Monthly Views"]].map(([n, l]) => (
                  <div key={l} style={{ textAlign: "right" }}>
                    <div className="font-display font-bold" style={{ fontSize: "clamp(28px, 4vw, 48px)", color: YELLOW, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6, fontFamily: "monospace" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── YELLOW STATEMENT ── */}
        <section style={{ backgroundColor: YELLOW, color: BLACK }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 40px" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(56px, 9vw, 130px)", lineHeight: 0.86, letterSpacing: "-0.02em" }}>
                  Brand.<br />Culture.<br />Every<br />Week.
                </h2>
              </div>
              <div style={{ flex: 1, minWidth: 280, paddingTop: 8 }}>
                <p style={{ fontSize: 20, color: "rgba(0,0,0,0.65)", lineHeight: 1.6, marginBottom: 32, maxWidth: 420 }}>
                  A best-of-the-best on culture, trends, and marketing. What we&apos;re sharing in brand meetings — across F&B, Retail, Tech, Wellness, Beauty, Sport, and more.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["Target", "Complex", "Perelel", "Klaviyo", "Herman Miller", "Walmart", "LVMH"].map((b) => (
                    <span key={b} style={{ border: "1.5px solid rgba(0,0,0,0.2)", padding: "6px 16px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, fontFamily: "monospace" }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 40px" }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 40 }}>What people say</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, backgroundColor: "rgba(255,255,255,0.06)" }}>
              {[
                { q: "I have pretty much unsubscribed from everything else. Yours was a must keep. I find gems in there each week.", name: "Aaron Levant", title: "CEO @ Complex" },
                { q: "Many marketers consider GOOD THINKING to be the most interesting and relevant newsletter on brands and culture right now.", name: "Jenny Olson", title: "CMO @ Herman Miller" },
                { q: "I pore through your weekly newsletter and dive into virtually every link.", name: "Tony Weisman", title: "Board Member @ Klaviyo" },
              ].map((t) => (
                <div key={t.name} style={{ backgroundColor: BLACK, padding: "48px 36px" }}>
                  <div className="font-display font-bold" style={{ fontSize: 56, color: YELLOW, lineHeight: 1, marginBottom: 24 }}>&ldquo;</div>
                  <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.65, marginBottom: 32 }}>{t.q}</p>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: WHITE, letterSpacing: "0.05em", textTransform: "uppercase" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4, fontFamily: "monospace" }}>{t.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOSTS ── */}
        <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 40px" }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, color: YELLOW, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 48 }}>The Hosts</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[
                { name: "Chris\nDanton", role: "Author · Co-Founder & Chief of Ideas @ IN GOOD CO", img: "/headshots/chris.jpg", bio: "Award-winning futurist, brand builder, author, speaker, and creative strategist with 20+ years of expertise. Led brand positioning for Google, Zappos, Psycho Bunny, and Pinterest. International speaker at SXSW, Brands & Culture NYC. Quoted in WSJ, Bloomberg, The Guardian, Adweek.", li: "https://linkedin.com/in/chrisdanton" },
                { name: "Kirsten\nLudwig", role: "Podcast Co-Host · Co-Founder @ IN GOOD CO", img: "/headshots/kirsten.jpg", bio: "Brand builder, cultural curator, and Co-Founder of IN GOOD CO — a global brand consultancy for challenger brands. Career spanning Ralph Lauren, Anthropologie, Fred Segal. Forbes contributor, Cannes Lions judge, 20K+ LinkedIn followers.", li: "https://linkedin.com/in/kirstenludwig" },
              ].map((h) => (
                <div key={h.name} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 32, border: "1px solid rgba(255,255,255,0.08)", padding: 40 }}>
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#1a1a1a" }}>
                    <Image src={h.img} alt={h.name.replace("\n", " ")} fill className="object-cover object-top" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 className="font-display font-bold uppercase" style={{ fontSize: "clamp(32px, 3.5vw, 52px)", lineHeight: 0.88, color: WHITE, whiteSpace: "pre-line", marginBottom: 12 }}>{h.name}</h3>
                      <p style={{ fontFamily: "monospace", fontSize: 10, color: YELLOW, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>{h.role}</p>
                      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{h.bio}</p>
                    </div>
                    <a href={h.li} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily: "monospace", fontSize: 10, color: YELLOW, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", marginTop: 24, display: "inline-block" }}>
                      Connect on LinkedIn →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPEAKING ── */}
        <section style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
              <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.88 }}>
                Where we&apos;ve<br />taken the stage
              </h2>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Speaking & Events</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {[
                { name: "SXSW — Austin", video: "https://www.youtube.com/embed/aWDxk7nBQ1s" },
                { name: "Brands & Culture — NYC", video: "https://www.youtube.com/embed/lktsrBpM_0k" },
              ].map((ev) => (
                <div key={ev.name}>
                  <div className="aspect-video" style={{ border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <iframe src={ev.video} title={ev.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                  </div>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 12 }}>{ev.name}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[
                { name: "SXSW × Populous — Austin", photo: "/speaking/populous-sxsw.jpg" },
                { name: "Soho House", photo: null },
              ].map((ev) => (
                <div key={ev.name}>
                  <div className="aspect-video relative" style={{ border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", backgroundColor: "#111" }}>
                    {ev.photo ? <Image src={ev.photo} alt={ev.name} fill className="object-cover" /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Photo Coming Soon</span></div>}
                  </div>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 12 }}>{ev.name}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["SXSW — London", "Ollie", "J.P. Morgan Chase"].map((ev) => (
                <span key={ev} style={{ border: "1px solid rgba(255,255,255,0.15)", padding: "8px 20px", fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{ev}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOBS ── yellow bg */}
        <section style={{ backgroundColor: YELLOW, color: BLACK }}>
          <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
            <div>
              <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 0.88, marginBottom: 16 }}>
                Looking for<br />your next role?
              </h2>
              <p style={{ fontSize: 18, color: "rgba(0,0,0,0.55)", maxWidth: 460 }}>
                Brand, marketing, and creative leadership roles — delivered to 17,000+ inboxes every Sunday.
              </p>
            </div>
            <Link href="/jobs" style={{ backgroundColor: BLACK, color: YELLOW, fontSize: 13, fontWeight: 900, letterSpacing: "0.12em", padding: "18px 40px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              Browse Jobs →
            </Link>
          </div>
        </section>

        {/* ── PRESS ── */}
        <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "56px 40px" }}>
          <div style={{ maxWidth: 1440, margin: "0 auto" }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>As featured in</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 48px" }}>
              {["Bloomberg", "Wall Street Journal", "Forbes", "The Guardian", "Adweek"].map((n) => (
                <span key={n} className="font-headline font-bold uppercase" style={{ fontSize: 20, color: "rgba(255,255,255,0.12)", letterSpacing: "0.05em" }}>{n}</span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
