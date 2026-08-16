/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.free.pinggy.net', 'localhost:3000'],

  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bm-chemical-backend.vercel.app';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ]
  },
};

export default nextConfig;