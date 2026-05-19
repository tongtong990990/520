import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  generateBuildId: async () =>
    process.env.NEXT_PUBLIC_BUILD_ID?.slice(0, 7) ?? `build-${Date.now()}`,
  ...(isGitHubPages
    ? {
        basePath: "/520",
        assetPrefix: "/520/",
      }
    : {}),
};

export default nextConfig;
