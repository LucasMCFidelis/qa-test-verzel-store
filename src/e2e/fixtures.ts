import { test as base, createBdd } from 'playwright-bdd'
import { HomePage } from './pages/HomePage'

export const test = base.extend<{ home: HomePage }>({
  home: async ({ page }, use) => {
    await use(new HomePage(page))
  },
})

export const { Given, When, Then } = createBdd(test)