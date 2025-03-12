import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    // Debug log to check what API_URL is actually being used
    console.log('Next.js config - API_URL:', process.env.API_URL);
    
    // Make sure API URL matches protocol of client
    const apiUrl = process.env.API_URL || 'http://localhost:9000/api';
    
    // Log the actual URL that will be used for the rewrite
    const destinationUrl = apiUrl.endsWith('/api') 
      ? `${apiUrl.slice(0, -4)}/:path*` 
      : `${apiUrl}/:path*`;
    
    console.log('Rewriting requests to:', destinationUrl);
    
    return [
      {
        source: '/api/:path*',
        destination: destinationUrl,
      },
    ];
  },
  
  // Add headers to help with CORS
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  
  env: {
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
