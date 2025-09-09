import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: ".", // studentPanel root
  publicDir: resolve(__dirname, "../public"), // point to top-level public
});
