import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import { ROTAS } from '../rotas'

export class HomePage extends BasePage {
  protected readonly rota = ROTAS.home

  paginaCarregada(): Locator {
    return this.page.getByRole('heading', { level: 2, name: 'Produtos' })
  }

  async abrir() {
    await this.page.goto(this.rota)
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
