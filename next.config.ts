import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: { remotePatterns: [] },
};

export default nextConfig;
