import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverComponentsExternalPackages: ['@react-pdf/renderer'],
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'your-database-domain.com'
    ], // Si estás usando imágenes desde tu base de datos o un CDN
  },
};

export default nextConfig;
