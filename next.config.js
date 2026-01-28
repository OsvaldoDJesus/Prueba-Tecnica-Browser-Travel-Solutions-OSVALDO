/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
  allowedDevOrigins: ['192.168.1.14', 'localhost', '127.0.0.1'],
};

module.exports = nextConfig;
