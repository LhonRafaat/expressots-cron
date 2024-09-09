import { defineConfig } from "vitest/config";
import { codecovVitePlugin } from "@codecov/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "path";
/**
 * @see {@link https://vitejs.dev/config/}
 * @see {@link https://vitest.dev/config/}
 */
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "expresso-ts-adapter-express-coverage",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  resolve: {
    alias: {
      "@expressots/core": path.resolve(__dirname, "node_modules/@expressots/core/lib/cjs/index.js"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["reflect-metadata"],
    exclude: ["**/node_modules/**", "**/lib/**"],
    coverage: {
      all: true,
      include: ["**/src/**"],
      exclude: ["**/node_modules/**", "**/lib/**", "**/index.ts/**"],
      thresholds: {
        global: {
          statements: 85,
          branches: 85,
          functions: 85,
          lines: 85,
        },
      },
      reporter: ["text", "html", "json"],
      provider: "v8",
    },
    // ref: https://vitest.dev/config/#testtimeout
    testTimeout: 10000,
  },
});
