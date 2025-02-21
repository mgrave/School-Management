import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react({
      // Habilita Fast Refresh
      fastRefresh: true,
    }),
    svgr()
  ],
  server: {
    host: true, // Permite acceso desde la red local
    hmr: {
      overlay: true // Muestra errores en pantalla
    }
  },
  resolve: {
    alias: {
      //eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
