/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mark sharp as an external server-only module so Next.js doesn't try to bundle it
  serverExternalPackages: ["sharp"],
};

module.exports = nextConfig;
