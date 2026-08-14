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
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    esmExternals: true,
    serverMinification: false,
    serverActions: {
      // Debe cubrir MAX_RAW_UPLOAD_SIZE_MB (.env.template, default 15MB) más el
      // overhead del multipart/form-data — si no, Next.js rechaza el body con
      // 413 "Body exceeded X MB limit" antes de que la Server Action se ejecute,
      // sin llegar siquiera a la validación de tamaño del use-case.
      bodySizeLimit: '20mb',
    },
  },
};

export default nextConfig;
