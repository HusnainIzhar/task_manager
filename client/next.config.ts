import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production' 
          ? 'https://your-production-server.com/api/:path*'  // Update with actual production URL
          : 'http://localhost:9000/api/:path*',  // Development server URL with correct port
      },
    ];
  },
};

export default nextConfig;
