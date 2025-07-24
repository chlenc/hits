import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import manifestData from "./public/manifest.json";

const pwaPlugin = VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
  manifest: manifestData as any,
});

// https://vite.dev/config/
export default defineConfig(() => ({
  base: "/",
  plugins: [react(), pwaPlugin],
  server: {
    host: true, // This allows external access
    cors: true, // Enable CORS for all origins
    hmr: {
      host: "0a014844b313.ngrok-free.app", // Set the HMR host to your ngrok URL
    },
  },
}));
