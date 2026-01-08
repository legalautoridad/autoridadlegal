import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@google-cloud/vertexai"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
