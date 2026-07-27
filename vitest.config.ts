import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Tests run against the same "@/..." import alias the app uses.
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
