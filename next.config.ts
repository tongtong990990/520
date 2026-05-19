import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  generateBuildId: async () => `v220-${Date.now()}`,
  ...(isGitHubPages
    ? {
        basePath: "/520",
        assetPrefix: "/520/",
      }
    : {}),
};

export default nextConfig;
