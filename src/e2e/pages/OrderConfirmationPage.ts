import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import { ROTAS } from '../rotas'

export class OrderConfirmationPage extends BasePage {
  protected readonly rota = ROTAS.pedidoConfirmado

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
