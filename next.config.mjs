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
  },
  // If you need backend proxies during dev, uncomment and configure:
  // async rewrites() {
  //   return [
  //     { source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' },
  //   ];
  // },
};

export default nextConfig;

