import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@google-cloud/vertexai"],
  allowedDevOrigins: [
    'carnivore-comrade-drone.ngrok-free.dev',
    'handling-freebee-mug.ngrok-free.dev'
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/precio-honorarios-financiacion',
        destination: '/honorarios',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
