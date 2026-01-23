import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const WITH_PWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
});

export default WITH_PWA(nextConfig);