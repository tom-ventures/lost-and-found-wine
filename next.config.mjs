/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
  async redirects() {
    return [
      { source: '/ad-astra', destination: '/wines/ad-astra-nv', permanent: true },
      { source: '/origin-pinotgris', destination: '/wines/origin-pinot-gris-2022', permanent: true },
      { source: '/origin-pinotnoir', destination: '/wines/origin-pinot-noir-2022', permanent: true },
      { source: '/uncharted-pinotgris', destination: '/wines/uncharted-pinot-gris-2021', permanent: true },
      { source: '/uncharted-rose', destination: '/wines/uncharted-rose-2021', permanent: true },
      { source: '/uncharted-syrah', destination: '/wines/uncharted-syrah-2019', permanent: true },
    ];
  },
};

export default nextConfig;
