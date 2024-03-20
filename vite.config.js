import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@infrastructure": resolve(__dirname, "src/infrastructure"),
      "@processors": resolve(__dirname, "src/processors"),
      "@providers": resolve(__dirname, "src/providers"),
      "@models": resolve(__dirname, "src/models"),
      "@utils": resolve(__dirname, "src/utils"),
      "@rules": resolve(__dirname, "rules"),
    },
  },
  build: {
    lib: {
      entry: {
        inspecto: resolve(__dirname, "index.ts"),
        rules: resolve(__dirname, "rules", "index.ts"),
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
