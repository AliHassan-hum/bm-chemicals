/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.free.pinggy.net', 'localhost:3000'],

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://bm-chemical-backend.vercel.app/:path*',
      },
    ]
  },
};

export default nextConfig;