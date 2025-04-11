/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { defineConfig } from "vite";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

// eslint-disable-next-line @typescript-eslint/dot-notation
const isLibBuild = process.env["npm_lifecycle_script"]?.includes("--lib");

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
      "@ui": resolve(__dirname, "ui"),
    },
  },
  base: "",
  publicDir: isLibBuild ? false : "public",
  plugins: [isLibBuild ? dts() : undefined],
  build: isLibBuild
    ? {
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
            dir: "dist",
          },
          external: ["indigo-ketcher"],
        },
      }
    : {
        rollupOptions: {
          output: {
            dir: "build",
          },
        },
      },
});
