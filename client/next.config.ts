import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // Debug log to check what API_URL is actually being used
    console.log('Next.js config - API_URL:', process.env.API_URL);
    
    return [
      {
        source: '/api/:path*',
        destination: process.env.API_URL ? `${process.env.API_URL}/:path*` : 'http://localhost:5000/api/:path*', // Fixed how we use the API_URL
      },
    ];
  },
  
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
