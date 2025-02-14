/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export as it's not compatible with Next-Auth
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;