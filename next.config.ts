import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: an unrelated lockfile in the home directory
  // otherwise gets auto-detected as the root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
