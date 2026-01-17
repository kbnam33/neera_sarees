/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add external domains if/when using next/image with remote URLs
    // domains: [],
  },
  // If you need backend proxies during dev, uncomment and configure:
  // async rewrites() {
  //   return [
  //     { source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' },
  //   ];
  // },
};

export default nextConfig;

