import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/solar-system',
        destination: '/',
      },
      {
        source: '/planet/:path*',
        destination: '/',
      },
      {
        source: '/space',
        destination: '/',
      },
      {
        source: '/celebration',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
