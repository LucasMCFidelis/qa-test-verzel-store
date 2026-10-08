import { test as base, createBdd } from 'playwright-bdd'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'

export const test = base.extend<{ home: HomePage; carrinho: CartPage; checkout: CheckoutPage }>({
  home: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  carrinho: async ({ page }, use) => {
    await use(new CartPage(page))
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page))
  },
})

export const { Given, When, Then } = createBdd(test)
