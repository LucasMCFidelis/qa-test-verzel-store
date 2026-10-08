import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import type { Item } from '@utils/itens'

export class CartPage extends BasePage {
  paginaCarregada(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Carrinho' })
  }

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

  async definirCupomAplicado(codigo: string) {
    await this.page.evaluate(
      (valor) => sessionStorage.setItem('verzel-store:cupom', valor),
      JSON.stringify(codigo),
    )
    await this.page.reload()
  }

  async aplicarCupom(codigo: string) {
    await this.page.getByRole('textbox', { name: 'Cupom de desconto' }).fill(codigo)
    await this.page.getByRole('button', { name: 'Aplicar cupom' }).click()
  }

  async finalizarCompra() {
    await this.page.getByRole('link', { name: 'Finalizar compra' }).click()
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

  mensagemDeCupomAplicado() {
    return this.page.getByText(/^Cupom\s+\S+\s+aplicado\.$/)
  }

  botaoRemoverCupom() {
    return this.page.getByRole('button', { name: 'Remover cupom' })
  }

  alerta() {
    return this.page.getByRole('alert')
  }

  avisoDeFreteGratis() {
    return this.resumo().getByText(/^Faltam R\$ [\d.,]+ para o frete grátis\.$/)
  }

  resumo() {
    return this.page.getByRole('region', { name: 'Resumo do pedido' })
  }
}
