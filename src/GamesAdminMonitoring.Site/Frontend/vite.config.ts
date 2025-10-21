import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        ["gold-and-dragon-result"]: path.resolve(
          __dirname,
          "GoldAndDragonSetResult/main.tsx",
        ),
      },
      output: {
        entryFileNames: "js/[name].min.js",
        dir: "../wwwroot",
        assetFileNames: "css/[name].min.[ext]",
      },
    },
  },
});
