"use client";

export default function FeaturedBadge({ size = 90 }: { size?: number }) {
  return (
    <div
      className="shrink-0 animate-spin-slow"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 90 90"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="45" cy="45" r="45" fill="#F9FF00" />
        <text
          x="45"
          y="49"
          textAnchor="middle"
          fill="black"
          fontFamily="'Open Sans', sans-serif"
          fontWeight="600"
          fontSize="9.5"
          letterSpacing="1.8"
        >
          FEATURED
        </text>
      </svg>
    </div>
  );
}
