import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/ 
export default defineConfig(() => {
  const enableTagger = process.env.VITE_ENABLE_TAGGER === "true";

  return {
    server: {
      host: "localhost",
      port: 5173,
      strictPort: true,
      hmr: {
        overlay: false,
      },
    },
    preview: {
      host: "localhost",
      port: 5173,
      strictPort: true,
    },
    plugins: [react(), enableTagger && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
