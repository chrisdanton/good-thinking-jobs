import Image from "next/image";
import Link from "next/link";

const CREAM = "#FAFAF8";
const INK = "#0F0F0F";
const YELLOW = "#F9FF00";
const WARM_MUTED = "#6B6860";
const WARM_BORDER = "rgba(15,15,15,0.08)";

export default function V3() {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, backgroundColor: CREAM, zIndex: -1 }} />
      <div style={{ color: INK }}>

        {/* ── VARIANT NAV ── */}
        <div style={{ backgroundColor: INK, padding: "8px 32px", display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}>DESIGN VARIANT:</span>
          {[["V1", "/v1", false], ["V2", "/v2", false], ["V3", "/v3", true]].map(([label, href, active]) => (
            <Link key={String(label)} href={String(href)} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", color: active ? YELLOW : "rgba(255,255,255,0.35)", textDecoration: "none", fontWeight: active ? 700 : 400 }}>
              {String(label)}
            </Link>
          ))}
        </div>

        {/* ── HERO — split layout ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "end", minHeight: "85vh" }}>
            <div style={{ paddingBottom: 64 }}>
              <p style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase", color: WARM_MUTED, marginBottom: 32, fontWeight: 500 }}>
                Newsletter + Podcast
              </p>
              <h1 className="font-display font-bold uppercase" style={{ fontSize: "clamp(72px, 9vw, 130px)", lineHeight: 0.86, letterSpacing: "-0.02em", color: INK, marginBottom: 40 }}>
                Good<br />Thinking
              </h1>
              <p style={{ fontSize: 20, color: WARM_MUTED, lineHeight: 1.65, maxWidth: 400, marginBottom: 48, fontWeight: 300 }}>
                The weekly briefing on brand, culture, and marketing — read by 17,000+ executives, founders, and creative leaders worldwide.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a href="https://ingoodco.substack.com/" target="_blank" rel="noopener noreferrer"
                  style={{ backgroundColor: INK, color: YELLOW, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", padding: "15px 32px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                  Subscribe Free →
                </a>
                <Link href="/jobs"
                  style={{ border: `1.5px solid ${INK}`, color: INK, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", padding: "15px 32px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                  Browse Jobs
                </Link>
              </div>
            </div>

            {/* Hero image — hosts */}
            <div style={{ position: "relative", alignSelf: "stretch", minHeight: 500 }}>
              <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
                <Image src="/headshots/chris.jpg" alt="Chris Danton" fill className="object-cover object-top" />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}`, backgroundColor: INK }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 40px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {[["17,000+", "Subscribers"], ["Top 10%", "Open Rate"], ["Top 10%", "Download Rate"], ["85K+", "Monthly Views"]].map(([stat, label]) => (
                <div key={label}>
                  <div className="font-display font-bold uppercase" style={{ fontSize: "clamp(24px, 3vw, 40px)", color: YELLOW, lineHeight: 1 }}>{stat}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8, fontFamily: "monospace" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: WARM_MUTED, marginBottom: 24, fontWeight: 500 }}>
                What we do
              </p>
              <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(56px, 6vw, 88px)", lineHeight: 0.88, letterSpacing: "-0.01em", marginBottom: 32 }}>
                Brand.<br />Culture.<br />Every Week.
              </h2>
              <p style={{ fontSize: 18, color: WARM_MUTED, lineHeight: 1.7, marginBottom: 40 }}>
                A curated best-of-the-best on culture, trends, and marketing. What we&apos;re sharing in brand meetings and dropping to friends on Slack — across F&B, Retail, Tech, Wellness, Beauty, Sport, and more.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Target", "Complex", "Perelel", "Klaviyo", "Herman Miller", "Walmart", "LVMH"].map((b) => (
                  <span key={b} style={{ border: `1.5px solid ${WARM_BORDER}`, padding: "8px 18px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: WARM_MUTED, borderRadius: 2 }}>{b}</span>
                ))}
              </div>
            </div>
            {/* Kirsten photo */}
            <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", backgroundColor: "#e5e3e0" }}>
              <Image src="/headshots/kirsten.jpg" alt="Kirsten Ludwig" fill className="object-cover object-top" />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "48px 32px 32px", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }}>
                <div style={{ color: "white", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace", opacity: 0.8 }}>Read by leaders at top brands worldwide</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}`, backgroundColor: INK }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 40px" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 56, fontWeight: 500 }}>
              What readers say
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 48 }}>
              {[
                { q: "I have pretty much unsubscribed from everything else, but yours was a must keep. I find a few gems in there each week.", name: "Aaron Levant", title: "CEO @ Complex & Co-Founder @ Truff" },
                { q: "Many marketers consider GOOD THINKING to be the most interesting and relevant newsletter on brands and culture right now.", name: "Jenny Olson", title: "CMO @ Herman Miller" },
                { q: "I pore through your weekly newsletter and dive into virtually every link. I also find myself forwarding it to many of the companies I work with.", name: "Tony Weisman", title: "Board Member @ Klaviyo, Former CMO @ Dunkin'" },
              ].map((t) => (
                <div key={t.name}>
                  <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 32, fontStyle: "italic" }}>&ldquo;{t.q}&rdquo;</p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "white", marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{t.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOSTS ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px" }}>
            <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: WARM_MUTED, marginBottom: 64, fontWeight: 500 }}>
              The Hosts
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80 }}>
              {[
                { name: "Chris Danton", role: "Author · Co-Founder & Chief of Ideas @ IN GOOD CO", img: "/headshots/chris.jpg", bio: "Award-winning futurist, brand builder, author, speaker, and creative strategist with over 20 years of expertise. Led brand positioning for Google, Zappos, Psycho Bunny, and Pinterest. International speaker at SXSW, Brands & Culture NYC. Frequently quoted in the Wall Street Journal, Bloomberg, The Guardian, and Adweek.", li: "https://linkedin.com/in/chrisdanton" },
                { name: "Kirsten Ludwig", role: "Podcast Co-Host · Co-Founder @ IN GOOD CO", img: "/headshots/kirsten.jpg", bio: "Brand builder, cultural curator, and Co-Founder of IN GOOD CO — a global brand consultancy for challenger brands. Career spanning Ralph Lauren, Anthropologie, and Fred Segal before her agency was acquired by WPP. Forbes contributor, Cannes Lions judge, and bold LinkedIn voice with 20K+ followers.", li: "https://linkedin.com/in/kirstenludwig" },
              ].map((h) => (
                <div key={h.name}>
                  <div style={{ position: "relative", aspectRatio: "3/2", overflow: "hidden", backgroundColor: "#e5e3e0", marginBottom: 32 }}>
                    <Image src={h.img} alt={h.name} fill className="object-cover object-top" />
                  </div>
                  <h3 className="font-display font-bold uppercase" style={{ fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 0.9, marginBottom: 10 }}>{h.name}</h3>
                  <p style={{ fontSize: 12, color: WARM_MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, fontFamily: "monospace" }}>{h.role}</p>
                  <p style={{ fontSize: 16, color: WARM_MUTED, lineHeight: 1.7, marginBottom: 24 }}>{h.bio}</p>
                  <a href={h.li} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: INK, textDecoration: "none", borderBottom: `1.5px solid ${INK}`, paddingBottom: 2, display: "inline-block" }}>
                    Connect on LinkedIn →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPEAKING ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}`, backgroundColor: "#F4F3F0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 64, flexWrap: "wrap", gap: 16 }}>
              <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(48px, 6vw, 80px)", lineHeight: 0.88 }}>
                Where we&apos;ve<br />taken the stage
              </h2>
              <p style={{ fontSize: 12, color: WARM_MUTED, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "monospace" }}>Speaking & Events</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {[
                { name: "SXSW — Austin", video: "https://www.youtube.com/embed/aWDxk7nBQ1s" },
                { name: "Brands & Culture — NYC", video: "https://www.youtube.com/embed/lktsrBpM_0k" },
              ].map((ev) => (
                <div key={ev.name}>
                  <div className="aspect-video" style={{ overflow: "hidden", backgroundColor: "#ddd" }}>
                    <iframe src={ev.video} title={ev.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                  </div>
                  <p style={{ fontSize: 12, color: WARM_MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 14, fontFamily: "monospace" }}>{ev.name}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
              {[
                { name: "SXSW × Populous — Austin", photo: "/speaking/populous-sxsw.jpg" },
                { name: "Soho House", photo: null },
              ].map((ev) => (
                <div key={ev.name}>
                  <div className="aspect-video relative" style={{ overflow: "hidden", backgroundColor: "#ddd" }}>
                    {ev.photo ? <Image src={ev.photo} alt={ev.name} fill className="object-cover" /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><span style={{ fontSize: 11, color: "#bbb", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>Photo Coming Soon</span></div>}
                  </div>
                  <p style={{ fontSize: 12, color: WARM_MUTED, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 14, fontFamily: "monospace" }}>{ev.name}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["SXSW — London", "Ollie", "J.P. Morgan Chase"].map((ev) => (
                <span key={ev} style={{ border: `1.5px solid rgba(15,15,15,0.15)`, padding: "8px 20px", fontSize: 11, color: WARM_MUTED, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>{ev}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOBS CTA ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}` }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 48 }}>
            <div>
              <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: WARM_MUTED, marginBottom: 24, fontFamily: "monospace" }}>Job Board</p>
              <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(56px, 7vw, 100px)", lineHeight: 0.88, marginBottom: 20 }}>
                Looking for<br />your next role?
              </h2>
              <p style={{ fontSize: 18, color: WARM_MUTED, maxWidth: 440, lineHeight: 1.65 }}>
                Brand, marketing, and creative leadership roles — delivered to 17,000+ inboxes every Sunday.
              </p>
            </div>
            <Link href="/jobs" style={{ backgroundColor: INK, color: YELLOW, fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", padding: "18px 40px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
              Browse Jobs →
            </Link>
          </div>
        </section>

        {/* ── PRESS ── */}
        <section style={{ borderBottom: `1px solid ${WARM_BORDER}`, padding: "56px 40px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p style={{ fontSize: 11, color: WARM_MUTED, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 32, fontFamily: "monospace" }}>As featured in</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 48px", alignItems: "center" }}>
              {["Bloomberg", "Wall Street Journal", "Forbes", "The Guardian", "Adweek"].map((n) => (
                <span key={n} className="font-headline font-bold uppercase" style={{ fontSize: 18, color: "rgba(15,15,15,0.2)", letterSpacing: "0.05em" }}>{n}</span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
