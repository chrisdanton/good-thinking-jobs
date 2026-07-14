/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/jobs",
        permanent: false,
      },
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
