import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    define: {
      "import.meta.env.VITE_EAS_PROVIDER_URL": JSON.stringify(
        env.VITE_EAS_PROVIDER_URL
      ),
    },
  };
});
