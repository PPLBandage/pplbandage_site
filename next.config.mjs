/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'cdn.discordapp.com',
            port: '',
            pathname: '/avatars/**',
          },
        ],
      },
};

export default nextConfig;
