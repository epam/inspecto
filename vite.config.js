import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@infrastructure": resolve(__dirname, "inspecto/infrastructure"),
      "@processors": resolve(__dirname, "inspecto/processors"),
      "@testing": resolve(__dirname, "inspecto/testing"),
      "@providers": resolve(__dirname, "inspecto/providers"),
      "@models": resolve(__dirname, "inspecto/models"),
      "@utils": resolve(__dirname, "utils"),
      "@rules": resolve(__dirname, "rules"),
      "@inspecto": resolve(__dirname, "inspecto"),
      '@ui': resolve(__dirname, 'ui'),
    },
  },
  build: {
    lib: {
      entry: {
        inspecto: resolve(__dirname, "index.ts"),
        rules: resolve(__dirname, "rules", "index.ts"),
        utils: resolve(__dirname, "utils", "index.ts"),
      },
      name: "inspecto",
    },
    rollupOptions: {
      output: {
        dir: "build",
      },
      external: ["indigo-ketcher"],
    },
  },
});
