import type { Page } from '@playwright/test'

export class OrderConfirmationPage {
  constructor(private readonly page: Page) {}

  numeroDoPedido() {
    return this.page.getByRole('heading', { level: 1, name: /^Pedido\s/ })
  }

  resumo() {
    return this.page.getByRole('region', { name: 'Itens do pedido' })
  }
}
