import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: an unrelated lockfile in the home directory
  // otherwise gets auto-detected as the root.
  turbopack: {
    root: path.join(__dirname),
  },

  experimental: {
    // Document uploads go through a Server Action, and the default cap is 1MB —
    // too small for a scanned PDF. Keep MAX_UPLOAD_BYTES in app/lib/documents.ts
    // below this, leaving room for multipart overhead.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
