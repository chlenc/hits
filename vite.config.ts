import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import manifestData from "./public/manifest.json";

const pwaPlugin = VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
  manifest: manifestData as any,
  // Increase the maximum size of files that can be precached by Workbox.
  // The default is 2 MiB, but our charting_library bundle is ~2.6 MiB which
  // breaks the build. Adjusting this value avoids the error while still
  // keeping precache size reasonable.
  workbox: {
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
  },
});

// https://vite.dev/config/
export default defineConfig(() => ({
  base: "/",
  plugins: [react(), pwaPlugin],
}));
