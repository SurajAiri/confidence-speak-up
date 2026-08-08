import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake barrel-export packages so only the icons/primitives you
  // actually import end up in the client bundle, instead of the whole
  // library graph.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Serve modern, smaller formats where the browser supports them.
  // AVIF first (smallest), WebP fallback — your source assets are
  // already .webp, so Next will additionally offer AVIF automatically.
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Gzip/Brotli response compression (on by default on most hosts, but
  // explicit here in case this gets self-hosted behind a bare Node server).
  compress: true,

  // Removes the `X-Powered-By: Next.js` response header — trivial, but
  // it's a free byte/request saving and one less fingerprint.
  poweredByHeader: false,

  // Fully typed routes catch broken internal links at build time instead
  // of at runtime — cheap insurance once you add more pages/routes.
  typedRoutes: true,
};

export default nextConfig;
