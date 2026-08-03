/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remote tunneling URLs allow karne ke liye:
  allowedDevOrigins: ['*.free.pinggy.net', 'localhost:3000'],

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Apka local backend port
      },
    ]
  },
};

export default nextConfig;