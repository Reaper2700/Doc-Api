import { defineConfig } from 'vitest/config'
import tsconfigPath from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPath()],
  test: {
    dir: 'src',
    projects: [
      // workspace substituido por projects
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/uses-cases',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/http/controllers',
          environment:
            './prisma/vitest-environment-prisma/prisma-test-environment.ts',
        },
      },
    ],
  },
})
