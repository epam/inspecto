import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "inspecto",
    },
    rollupOptions: {
      output: {
        dir: "build",
      },
    },
  },
});
