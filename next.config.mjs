/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xanrkptipcdhvklrvcia.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // If you need backend proxies during dev, uncomment and configure:
  // async rewrites() {
  //   return [
  //     { source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' },
  //   ];
  // },
};

export default nextConfig;

