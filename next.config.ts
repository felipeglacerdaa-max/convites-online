import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/convite=:code',
        destination: '/convite/:code',
      },
    ];
  },
};

export default nextConfig;
