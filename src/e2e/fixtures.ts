import { test as base, createBdd } from 'playwright-bdd'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'

export const test = base.extend<{ home: HomePage; carrinho: CartPage }>({
  home: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  carrinho: async ({ page }, use) => {
    await use(new CartPage(page))
  },
})

export const { Given, When, Then } = createBdd(test)
