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
};

export default nextConfig;
