import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withBundle = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  serverExternalPackages: ["@google-cloud/vertexai"],
  allowedDevOrigins: [
    'carnivore-comrade-drone.ngrok-free.dev',
    'handling-freebee-mug.ngrok-free.dev'
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
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
        source: '/partidos-judiciales',
        destination: '/juzgados',
        permanent: true,
      },
      {
        source: '/partidos-judiciales/:path*',
        destination: '/juzgados/:path*',
        permanent: true,
      },
      {
        source: '/municipios',
        destination: '/juzgados',
        permanent: true,
      },
      {
        source: '/precio-honorarios-financiacion',
        destination: '/honorarios',
        permanent: true,
      },
      // Consolidated Glossary Slugs (301 Redirects)
      {
        source: '/glosario/test-salival-indiciario-drogotest',
        destination: '/glosario/test-salival-indiciario',
        permanent: true,
      },
      {
        source: '/glosario/test-indiciario-salivar',
        destination: '/glosario/test-salival-indiciario',
        permanent: true,
      },
      {
        source: '/glosario/cinemometro-radar',
        destination: '/glosario/cinemometro',
        permanent: true,
      },
      {
        source: '/glosario/trabajos-en-beneficio-de-la-comunidad-tbc',
        destination: '/glosario/trabajos-en-beneficio-de-la-comunidad',
        permanent: true,
      },
      {
        source: '/glosario/perdida-de-vigencia-del-permiso',
        destination: '/glosario/perdida-de-vigencia-del-permiso-de-conducir-art-47-cp',
        permanent: true,
      },
      {
        source: '/glosario/concurso-formal-de-delitos-art-382-cp',
        destination: '/glosario/concurso-de-delitos-viales-art-382-cp',
        permanent: true,
      },
      {
        source: '/glosario/suspension-de-la-ejecucion-de-la-pena-art-80-cp',
        destination: '/glosario/suspension-de-la-pena-de-prision',
        permanent: true,
      },
      {
        source: '/glosario/falso-positivo-por-farmacos-prescritos',
        destination: '/glosario/falso-positivo-por-medicacion',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
      {
        source: '/:path*\\.(svg|jpg|jpeg|png|webp|avif|woff2|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/llms.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate' },
        ],
      },
      {
        source: '/llms-full.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate' },
        ],
      },
    ];
  },
};

export default withBundle(nextConfig);
