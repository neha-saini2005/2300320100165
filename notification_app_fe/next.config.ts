import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://4.224.186.213/:path*",
      },
    ];
  },
};

export default nextConfig;