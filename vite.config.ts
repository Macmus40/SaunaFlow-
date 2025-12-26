import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ESM environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// W tym projekcie katalog główny jest traktowany jako źródłowy (src)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Fix: Use the manually defined __dirname to resolve the "@" alias to the project root
      "@": path.resolve(__dirname, "./"),
    },
  },
});