import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [react()],
  server: { host: "127.0.0.1" },
  vite: {
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  },
});
