import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['leetcode/**/*.{test,spec}.{js,ts}', 'interview/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', '.nuxt', '.output'],
  },
});
