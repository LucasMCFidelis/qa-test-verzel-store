import { expect } from '@playwright/test'
import { Given, When, Then } from '../fixtures'

Given('que o cupom {string} está aplicado', async ({ carrinho }, codigo: string) => {
  await carrinho.definirCupomAplicado(codigo)
})

When('eu aplico o cupom {string}', async ({ carrinho }, codigo: string) => {
  await carrinho.aplicarCupom(codigo)
})

Then('o sistema informa que o cupom foi aplicado com sucesso', async ({ carrinho }) => {
  await expect(carrinho.mensagemDeCupomAplicado()).toBeVisible()
})

Then('o sistema exibe a mensagem {string}', async ({ carrinho }, mensagem: string) => {
  await expect(carrinho.alerta()).toHaveText(mensagem)
})

Then('nenhum desconto é aplicado', async ({ carrinho }) => {
  await expect(carrinho.mensagemDeCupomAplicado()).toBeHidden()
  await expect(carrinho.botaoRemoverCupom()).toBeHidden()
})

Then('o cupom {string} continua aplicado', async ({ carrinho }, codigo: string) => {
  await expect(carrinho.mensagemDeCupomAplicado()).toContainText(codigo)
})
