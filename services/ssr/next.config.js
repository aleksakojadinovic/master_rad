/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['host.docker.internal', 'dev.sts.com'],
  },
  experimental: {
    appDir: true,
  },
  i18n: {
    locales: ['en-US', 'sr'],
    defaultLocale: 'en-US',
  },
};

module.exports = nextConfig;
