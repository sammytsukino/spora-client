import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.glb"],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      all: false,
      include: [
        "src/lib/**/*.{ts,tsx}",
        "src/hooks/**/*.{ts,tsx}",
        "src/components/ui/**/*.{tsx}",
        "src/components/shared/**/*.{tsx}",
        "src/constants/**/*.ts",
        "src/components/home/SignInForm.tsx",
        "src/components/home/SignUpForm.tsx",
        "src/views/Installation.tsx",
      ],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
      exclude: [
        "node_modules/",
        "src/test/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "src/lib/api.ts",
        "src/lib/admin-pdf-export.ts",
        "src/lib/accentColorCycling.ts",
        "src/hooks/useImageLuminance.ts",
        "src/views/FloraReader.tsx",
      ],
    },
  },
})
