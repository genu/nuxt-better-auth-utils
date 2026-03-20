import { defineConfig } from "vitest/config"

export default defineConfig({
  esbuild: {
    tsconfigRaw: "{}",
  },
  test: {
    environment: "node",
  },
})
