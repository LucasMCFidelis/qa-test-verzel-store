import type { Page } from '@playwright/test'
import type { Item } from '@utils/itens'

export class CartPage {
  constructor(private readonly page: Page) {}

  async abrir() {
    await this.page.goto('/carrinho')
  }

  async abrirPeloCabecalho() {
    await this.page.getByRole('link', { name: /itens no carrinho/ }).click()
  }

  async montarComItens(itens: Item[]) {
    await this.page.goto('/')
    await this.page.evaluate(
      (valor) => sessionStorage.setItem('verzel-store:itens', valor),
      JSON.stringify(itens),
    )
  }

  async aumentarQuantidade(produto: string) {
    await this.botaoAumentar(produto).click()
  }

  item(produto: string) {
    return this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('heading', { name: produto, exact: true }) })
  }

  botaoAumentar(produto: string) {
    return this.page.getByRole('button', { name: `Aumentar quantidade de ${produto}` })
  }

  quantidade(produto: string) {
    return this.page.getByRole('status', { name: `Quantidade de ${produto}` })
  }

  resumo() {
    return this.page.getByRole('region', { name: 'Resumo do pedido' })
  }
}
