import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BIOS, BOOKING_EMAIL, C, FORMATS, LINKS, PRESS_PHOTOS, SITE_URL, TALKS } from "../../data";
import { PinnedPhoto } from "../../ui";

// Print layout for the downloadable press kit: five fixed A4 pages.
// Not linked anywhere; scripts/press-kit-pdf.sh prints it to
// public/speaking/good-thinking-press-kit.pdf. Re-run that after content changes.

export const metadata: Metadata = {
  title: "Press Kit PDF · GOOD THINKING",
  robots: { index: false, follow: false },
};

const KIT_URL = "getgoodthinking.com/speaking/press-kit";
const PHOTOS_ZIP_URL = "getgoodthinking.com/speaking/good-thinking-press-photos.zip";

const TALK_STYLES = [
  { bg: C.yellow, fg: C.black },
  { bg: C.white, fg: C.black },
  { bg: C.black, fg: C.white },
  { bg: C.white, fg: C.black },
  { bg: C.yellow, fg: C.black },
];

const FACTS: Record<string, string[]> = {
  "Chris Danton": [
    "Co-Founder, IN GOOD CO",
    "Writer and co-host, GOOD THINKING (18K subscribers)",
    "Award-winning futurist, author, and creative strategist",
    "Spoken at SXSW, Brands & Culture, and Paradigms",
    "Co-hosts invite-only CMO dinners at Cannes",
  ],
  "Kirsten Ludwig": [
    "Co-Founder, IN GOOD CO",
    "Co-host, GOOD THINKING podcast",
    "Brand builder and cultural curator",
    "Spoken at SXSW, Brands & Culture, and Paradigms",
    "Co-hosts invite-only CMO dinners at Cannes",
  ],
};

const BIO_PAGES = [
  { who: "Chris Danton", headline: "Leading the future of brand", img: "/speaking/chris.jpg", stage: "/speaking/chris-stage.jpg", tilt: 2 },
  { who: "Kirsten Ludwig", headline: "Disrupting the status quo", img: "/speaking/kirsten.jpg", stage: "/speaking/kirsten-stage.jpg", tilt: -2 },
];

function Page({ bg, color = C.black, children }: { bg: string; color?: string; children: ReactNode }) {
  return (
    <section className="speaking-root pdf-page relative overflow-hidden" style={{ background: bg, color }}>
      {children}
    </section>
  );
}

function Kicker({ children, color = C.black }: { children: ReactNode; color?: string }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-[0.3em]" style={{ color }}>
      {children}
    </p>
  );
}

export default function PressKitPdf() {
  return (
    <div className="pdf-root font-sans">
      <style>{`
        @page { size: A4; margin: 0; }
        .pdf-root { background: #777; padding: 24px 0; }
        .pdf-page { width: 210mm; height: 297mm; margin: 0 auto 24px; box-sizing: border-box; }
        @media print {
          .pdf-root { background: none; padding: 0; }
          .pdf-page { margin: 0; break-after: page; }
          .pdf-root, .pdf-page { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* 1. Cover */}
      <Page bg={C.yellow}>
        <div className="px-[14mm] py-[3mm] text-center text-[8px] font-bold uppercase tracking-[0.25em]" style={{ background: C.black, color: C.white }}>
          A weekly newsletter and podcast on brand, marketing, and culture
        </div>
        <div className="px-[14mm] pt-[14mm]">
          <Kicker>Press kit · {new Date().getFullYear()}</Kicker>
          <h1 className="speaking-display mt-4 text-[76px]">
            Kirsten Ludwig<br />&amp; Chris Danton
          </h1>
          <p className="mt-5 text-[15px]">Co-Founders of IN GOOD CO. Hosts of GOOD THINKING.</p>
        </div>
        <div className="mx-auto mt-[14mm] w-[150mm]">
          <PinnedPhoto
            src="/speaking/duo.jpg"
            alt="Kirsten Ludwig and Chris Danton with GOOD THINKING"
            tilt={-2}
            pin={C.black}
            imgClassName="aspect-[5/4] object-cover"
          />
        </div>
        <div className="absolute inset-x-0 bottom-[12mm] text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/speaking/press/logos/good-thinking-black.svg" alt="GOOD THINKING" className="mx-auto h-[5mm] w-auto" />
          <p className="mt-3 text-[11px] font-bold underline underline-offset-2">{KIT_URL}</p>
          <p className="mt-1 text-[10px]">Bios, photos, and logos, always current</p>
        </div>
      </Page>

      {/* 2. Talks + at a glance */}
      <Page bg={C.cream}>
        <div className="px-[14mm] pt-[14mm]">
          <Kicker>Speaking</Kicker>
          <h2 className="speaking-display mt-2 text-[44px]">What we talk about</h2>
          <div className="mt-[7mm] grid grid-cols-2 gap-[5mm]">
            {TALKS.map((t, i) => {
              const s = TALK_STYLES[i % TALK_STYLES.length];
              return (
                <div key={t.no} className="border-2 border-black p-[5mm]" style={{ background: s.bg, color: s.fg }}>
                  <h3 className="speaking-display text-[22px]">{t.title}</h3>
                  <p className="mt-2 text-[9.5px] leading-[1.55]">{t.body}</p>
                </div>
              );
            })}
            <div className="flex flex-col justify-center border-2 border-black p-[5mm]" style={{ background: C.paper }}>
              <h3 className="speaking-display text-[22px]">Something else?</h3>
              <p className="mt-2 text-[9.5px] leading-[1.55]">Every talk is tailored to your audience and shaped with you ahead of the date, from a 20-minute provocation to a half-day working session. Tell us about the room.</p>
            </div>
          </div>
          <p className="mt-[5mm] text-[11px]">
            <span className="font-bold">Formats:</span> {FORMATS.join(" · ")}
          </p>

          <div className="mt-[8mm] p-[7mm]" style={{ background: C.black, color: C.white }}>
            <h3 className="speaking-display text-[28px]" style={{ color: C.yellow }}>At a glance</h3>
            <dl className="mt-[4mm] grid grid-cols-2 gap-x-[8mm] gap-y-[4mm] text-[11px]">
              {[
                ["Who", "Kirsten Ludwig & Chris Danton (both she/her)"],
                ["Roles", "Co-Founders, IN GOOD CO"],
                ["Publication", "GOOD THINKING, weekly newsletter and podcast (18K subscribers)"],
                ["Stages", "SXSW · Brands & Culture · Paradigms · Private summits"],
                ["Convenings", "Invite-only CMO dinners at Cannes"],
                ["Press & booking", BOOKING_EMAIL],
              ].map(([k, v]) => (
                <div key={k} className="border-t pt-[2.5mm]" style={{ borderColor: "#333" }}>
                  <dt className="text-[8px] font-bold uppercase tracking-[0.25em]" style={{ color: C.yellow }}>{k}</dt>
                  <dd className="mt-1 leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Page>

      {/* 3–4. One bio page each */}
      {BIO_PAGES.map((p) => {
        const bio = BIOS.find((b) => b.who === p.who)!;
        return (
          <Page key={p.who} bg={C.white}>
            <div className="grid h-full grid-cols-[58%_42%]">
              <div className="px-[14mm] pt-[14mm]">
                <Kicker>Biography</Kicker>
                <h2 className="speaking-display mt-2 text-[56px]">{p.who}</h2>
                <p className="mt-2 inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest" style={{ background: C.yellow }}>
                  {bio.pronouns}
                </p>
                <div className="mt-[7mm] space-y-[5mm] text-[13px] leading-[1.7]">
                  {bio.full.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
                <div className="mt-[8mm]">
                  <Kicker>Fast facts</Kicker>
                  <ul className="mt-[3mm] space-y-[2.5mm] text-[12px]">
                    {FACTS[p.who].map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-[8mm] text-[9.5px]" style={{ color: "#666" }}>
                  Shorter bios (one line and approx. 40 words) are ready to copy at{" "}
                  <span className="underline">{KIT_URL}</span>
                </p>
              </div>
              <div className="px-[9mm] pt-[16mm]" style={{ background: C.black, color: C.white }}>
                {/* portrait, headline, stage shot */}
                <PinnedPhoto src={p.img} alt={p.who} tilt={p.tilt} pin={C.yellow} imgClassName="aspect-[4/5] object-cover object-top grayscale" />
                <p className="speaking-display mt-[10mm] text-[34px]" style={{ color: C.yellow }}>
                  {p.headline}.
                </p>
                <div className="mt-[10mm]">
                  <PinnedPhoto src={p.stage} alt={`${p.who} on stage`} tilt={-p.tilt} pin={C.white} imgClassName="aspect-[4/3] object-cover" />
                </div>
              </div>
            </div>
          </Page>
        );
      })}

      {/* 5. Photos + contact */}
      <Page bg={C.yellow}>
        <div className="px-[14mm] pt-[14mm]">
          <Kicker>Photography</Kicker>
          <h2 className="speaking-display mt-2 text-[44px]">Approved photos</h2>
          <p className="mt-2 text-[11px]">Free to use alongside coverage of Kirsten and Chris. Need something else? Just ask.</p>

          <div className="mt-[5mm] p-[5mm]" style={{ background: C.black, color: C.white }}>
            <p className="text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color: C.yellow }}>Download the full-size files</p>
            <p className="mt-2 text-[11px]">
              All photos as a zip: <span className="font-bold underline">{PHOTOS_ZIP_URL}</span>
            </p>
            <p className="mt-1 text-[11px]">
              Single photos and logos at <span className="font-bold underline">{KIT_URL}</span>
            </p>
          </div>

          <div className="mt-[6mm] grid grid-cols-3 gap-[4mm]">
            {PRESS_PHOTOS.map((ph) => (
              <figure key={ph.file} className="border-2 border-black p-[2mm] pb-[1.5mm]" style={{ background: C.white, boxShadow: "3px 3px 0 0 #000" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.src} alt={ph.caption} className={`aspect-[4/5] w-full object-cover ${ph.pos}`} />
                <figcaption className="mt-[1.5mm] text-[8.5px]" style={{ color: "#444" }}>{ph.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-[7mm] border-2 border-black p-[6mm]" style={{ background: C.white, boxShadow: "5px 5px 0 0 #000" }}>
            <Kicker>Contact</Kicker>
            <p className="speaking-display mt-2 text-[24px] underline underline-offset-4">{BOOKING_EMAIL}</p>
            <p className="mt-[3mm] text-[10.5px] leading-[1.8]">
              {LINKS.map((l, i) => (
                <span key={l.href}>
                  <span className="font-bold">{l.label}</span> {l.handle}
                  {i < LINKS.length - 1 ? " · " : ""}
                </span>
              ))}
            </p>
            <p className="mt-[2mm] text-[10.5px]">
              <span className="font-bold">Booking a talk?</span> {SITE_URL.replace("https://", "")}/speaking
            </p>
          </div>
        </div>
      </Page>
    </div>
  );
}
