// setupDevPlatform uses the @cloudflare/next-on-pages next-dev module to allow
// us to use bindings during local development (when running the application
// with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
let nextConfig;

nextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/image-loader.ts",
  },
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
  nextConfig = {
    images: {
      loader: "custom",
      loaderFile: "./src/image-loader__dev.ts",
    },
  };
}

export default nextConfig;
