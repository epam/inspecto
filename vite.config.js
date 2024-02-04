import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      '@infrastructure': resolve(__dirname, "src/infrastructure"),
      '@processors': resolve(__dirname, "src/processors"),
    }
  },
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
