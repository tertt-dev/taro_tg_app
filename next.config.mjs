/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't.me',
        port: '',
        pathname: '/i/**',
      },
    ],
    deviceSizes: [140, 280, 320, 480, 520],
    imageSizes: [140, 280, 320, 480, 520],
  },
};

export default nextConfig; 