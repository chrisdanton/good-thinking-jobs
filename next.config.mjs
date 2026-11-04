/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/jobs",
        permanent: false,
      },
      // The GOOD FUTURE pages also answer at their raw .html file paths, which
      // Google reports as duplicates. Send those to the clean URLs.
      { source: "/futures/index.html", destination: "/futures", permanent: true },
      { source: "/futures/trends/:slug.html", destination: "/futures/trends/:slug", permanent: true },
    ];
  },
  async rewrites() {
    // The GOOD FUTURE section is a static mirror of the original site living in
    // /public/futures. Map its clean URLs to the underlying .html files.
    return [
      { source: "/futures", destination: "/futures/index.html" },
      { source: "/futures/", destination: "/futures/index.html" },
      { source: "/futures/trends/:slug", destination: "/futures/trends/:slug.html" },
      { source: "/futures/trends/:slug/", destination: "/futures/trends/:slug.html" },
    ];
  },
};

export default nextConfig;
