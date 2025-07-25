// next.config.js
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.53'],
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.53",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pplbandage.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pplb.ru",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev2.andcool.ru",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    config.cache = false;
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default withBundleAnalyzer(nextConfig);