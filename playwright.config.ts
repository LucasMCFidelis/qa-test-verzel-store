import { defineConfig, devices } from '@playwright/test'
import { defineBddConfig, defineBddProject, cucumberReporter } from 'playwright-bdd'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const CI = !!process.env.CI

const e2eTestDir = defineBddConfig({
  outputDir: '.features-gen/e2e',
  features: 'features/e2e/**/*.feature',
  steps: 'src/e2e/**/*.ts',
})

export default defineConfig({
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    cucumberReporter('html', { outputFile: 'reports/cucumber.html' }),
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://verzel-store.qa-test-verzel-store.workers.dev',
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      ...defineBddProject({
        name: 'api',
        features: 'features/api/**/*.feature',
        steps: 'src/api/**/*.ts',
      }),
      use: { extraHTTPHeaders: { 'Content-Type': 'application/json' } },
    },

    { name: 'e2e-chromium', testDir: e2eTestDir, use: { ...devices['Desktop Chrome'] } },
    { name: 'e2e-firefox', testDir: e2eTestDir, use: { ...devices['Desktop Firefox'] } },
    { name: 'e2e-webkit', testDir: e2eTestDir, use: { ...devices['Desktop Safari'] } },
  ],
})