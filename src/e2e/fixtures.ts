import { test as base, createBdd } from 'playwright-bdd'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'

export const test = base.extend<{
  home: HomePage
  carrinho: CartPage
  checkout: CheckoutPage
  confirmacao: OrderConfirmationPage
}>({
  home: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  carrinho: async ({ page }, use) => {
    await use(new CartPage(page))
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page))
  },
  confirmacao: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page))
  },
})

export const { Given, When, Then } = createBdd(test)
