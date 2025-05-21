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
