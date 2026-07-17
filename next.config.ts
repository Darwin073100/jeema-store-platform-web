import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['typeorm', '@react-pdf/renderer'],
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/images/**', // Wildcard for all paths under /images
      },
    ],
  },
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
