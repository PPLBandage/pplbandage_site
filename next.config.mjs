/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
