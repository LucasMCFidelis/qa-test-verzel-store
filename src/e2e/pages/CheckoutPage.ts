import type { Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import { ROTAS } from '../rotas'

export class CheckoutPage extends BasePage {
  protected readonly rota = ROTAS.checkout

  paginaCarregada(): Locator {
    return this.page.getByRole('heading', { level: 1, name: 'Finalizar compra' })
  }

  async abrir() {
    await this.page.goto(this.rota)
  }

  async informarNome(nome: string) {
    await this.campo('Nome completo').fill(nome)
  }

  async informarEmail(email: string) {
    await this.campo('E-mail').fill(email)
  }

  async informarCep(cep: string) {
    await this.campo('CEP').fill(cep)
  }

  async confirmarPedido() {
    await this.page.getByRole('button', { name: 'Confirmar pedido' }).click()
  }

  campo(nome: string) {
    return this.page.getByRole('textbox', { name: nome, exact: true })
  }

  botaoConfirmar() {
    return this.page.getByRole('button', { name: 'Confirmar pedido' })
  }
}
