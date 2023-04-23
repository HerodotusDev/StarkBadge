/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['everai-collection-v0.s3.us-west-2.amazonaws.com'],
  },
}

module.exports = nextConfig
