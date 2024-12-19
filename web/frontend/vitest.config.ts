import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      './playground/**/*.*',
      './playground-temp/**/*.*',
    ],
    testTimeout: 20000,
    isolate: false,
  },
})
