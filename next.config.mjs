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
  webpack: (config, { isServer }) => {
    // Optimize chunk loading
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
          shared: {
            name: (module, chunks) => {
              return chunks.map(chunk => chunk.name).join('~');
            },
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
    };
    return config;
  },
  // Add production source maps for better debugging
  productionBrowserSourceMaps: true,
};

export default nextConfig; 