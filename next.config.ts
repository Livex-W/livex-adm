import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/adm',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'livex.com.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'livex-s3.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
