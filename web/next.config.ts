import type { NextConfig } from "next";

const apiInternalUrl = (
  process.env.API_INTERNAL_URL ?? "http://localhost:4000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  allowedDevOrigins: ["192.168.112.52"],
  async rewrites() {
    return [
      {
        source: "/assets/:path*",
        destination: apiInternalUrl + "/assets/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/dashboard/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

export default nextConfig;