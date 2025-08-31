import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
