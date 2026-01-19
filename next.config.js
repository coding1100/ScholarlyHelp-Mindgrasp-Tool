/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  
  // Enable image optimization for better LCP
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  reactStrictMode: true,
  
  // Enable compression
  compress: true,
  
  // Optimize production builds
  swcMinify: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize heavy package imports - tree shake these libraries
    optimizePackageImports: [
      'lucide-react', 
      'react-icons',
      'react-slick',
      'slick-carousel',
      '@szhsin/react-accordion',
      'react-spinners',
      'react-loader-spinner',
      'dayjs',
      'moment',
    ],
  },
  
  // Webpack optimizations for smaller bundles
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split vendor chunks for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate heavy libraries into their own chunks
          slick: {
            test: /[\\/]node_modules[\\/](react-slick|slick-carousel)[\\/]/,
            name: 'slick',
            chunks: 'all',
            priority: 30,
          },
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|react-icons)[\\/]/,
            name: 'icons',
            chunks: 'all',
            priority: 25,
          },
        },
      };
    }
    return config;
  },
  
  // Headers for caching static assets - enable bfcache
  async headers() {
    return [
      // Security headers for all pages - upgrade HTTP to HTTPS
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 'upgrade-insecure-requests',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Enable bfcache for pages
      {
        source: '/((?!api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
