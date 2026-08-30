import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * A production build and a running dev server both write to .next, and the
   * build fails on the half-written files it finds there. Setting
   * BUILD_DIST_DIR gives the build its own directory, so it can run while the
   * dev server keeps serving.
   */
  distDir: process.env.BUILD_DIST_DIR || ".next",
};

export default nextConfig;
