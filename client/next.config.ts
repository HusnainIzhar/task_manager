import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL || 'http://localhost:9000/api/:path*',
      },
    ];
  },
  
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
