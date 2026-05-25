import { mergeConfig } from "vitest/config"
import viteConfig from "./vite.config"

export default mergeConfig(viteConfig, {
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
        branches: 74,
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
        "src/hooks/useImageLuminance.ts",
        // Excluded from thresholds: iframe + TTS + postMessage shell
        "src/views/FloraReader.tsx",
      ],
    },
  },
})
