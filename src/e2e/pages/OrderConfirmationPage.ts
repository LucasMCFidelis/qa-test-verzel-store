import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class OrderConfirmationPage extends BasePage {
  paginaCarregada(): Locator {
    return this.numeroDoPedido()
  }

  numeroDoPedido() {
    return this.page.getByRole('heading', { level: 1, name: /^Pedido\s/ })
  }

  resumo() {
    return this.page.getByRole('region', { name: 'Itens do pedido' })
  }
}
