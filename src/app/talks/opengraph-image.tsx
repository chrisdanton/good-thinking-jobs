// Share image for /sessions (Slack, iMessage, LinkedIn): yellow card, big condensed type.
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "GOOD SESSIONS · GOOD THINKING";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(path.join(process.cwd(), "public", "fonts", "TradeGothic-BoldCondensed.otf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F9FF00",
          color: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "TGC",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", fontSize: 220, lineHeight: 0.95, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
          <span>Good</span>
          <span>Sessions</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 40, textTransform: "uppercase", letterSpacing: "0.02em" }}>
          <span>Masterclasses · LIVE sessions · Conversations</span>
          <span style={{ background: "#000", color: "#F9FF00", padding: "8px 18px" }}>GOOD THINKING</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "TGC", data: font, weight: 700, style: "normal" }] }
  );
}
