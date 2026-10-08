import type { Page } from '@playwright/test'

export class HomePage {
  constructor(private readonly page: Page) {}

  async abrir() {
    await this.page.goto('/')
  }

  async adicionarAoCarrinho(produto: string) {
    await this.botaoAdicionar(produto).click()
  }

  botaoAdicionar(produto: string) {
    return this.card(produto).getByRole('button', { name: 'Adicionar ao carrinho' })
  }

  card(produto: string) {
    return this.page.getByRole('article', { name: produto, exact: true })
  }

  contadorDoCarrinho() {
    return this.page.getByRole('link', { name: /itens no carrinho/ })
  }
}
