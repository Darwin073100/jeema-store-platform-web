import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['typeorm', '@react-pdf/renderer'],
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'your-database-domain.com'
    ], // Si estás usando imágenes desde tu base de datos o un CDN
  },
  experimental: {
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Asegurar que react-icons siempre esté en el lado del cliente
    if (isServer) {
      config.externals.push('react-icons');
    }
    return config;
  },
};

export default nextConfig;
