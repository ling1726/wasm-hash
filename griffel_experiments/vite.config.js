import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/target":  "http://localhost:3000",
    },
  },
});
