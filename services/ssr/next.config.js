/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['host.docker.internal', 'dev.sts.com'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
