import type { Metadata } from "next";
import type { ReactNode } from "react";

// GOOD INDEX is in private testing: keep it out of search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function GoodIndexLayout({ children }: { children: ReactNode }) {
  return children;
}
