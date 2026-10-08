import { expect } from '@playwright/test'
import { Given, When, Then } from '../fixtures'
import { padraoDaUrl, ROTAS } from '../rotas'

Given('que estou na página de checkout', async ({ checkout }) => {
  await checkout.abrir()
  await expect(checkout.paginaCarregada()).toBeVisible()
})

Given('que o cliente informa o nome {string}', async ({ checkout }, nome: string) => {
  await checkout.informarNome(nome)
})

Given('que o cliente informa o e-mail {string}', async ({ checkout }, email: string) => {
  await checkout.informarEmail(email)
})

Given('que o cliente informa o CEP {string}', async ({ checkout }, cep: string) => {
  await checkout.informarCep(cep)
})

Given(
  'que o cliente informa o e-mail {string} e o CEP {string}',
  async ({ checkout }, email: string, cep: string) => {
    await checkout.informarEmail(email)
    await checkout.informarCep(cep)
  },
)

Given(
  'que o cliente informa o nome {string} e o CEP {string}',
  async ({ checkout }, nome: string, cep: string) => {
    await checkout.informarNome(nome)
    await checkout.informarCep(cep)
  },
)

Given(
  'que o cliente informa o nome {string} e o e-mail {string}',
  async ({ checkout }, nome: string, email: string) => {
    await checkout.informarNome(nome)
    await checkout.informarEmail(email)
  },
)

When('eu confirmo o pedido', async ({ checkout }) => {
  await checkout.confirmarPedido()
})

Then(
  'o sistema exibe mensagem de erro para o campo {string}',
  async ({ checkout }, campo: string) => {
    await expect(checkout.campo(campo)).toHaveAttribute('aria-invalid', 'true')
    await expect(checkout.campo(campo)).toHaveAccessibleDescription(/Informe/)
  },
)

Then('o pedido não é confirmado', async ({ page }) => {
  await expect(page).not.toHaveURL(padraoDaUrl(ROTAS.pedidoConfirmado))
})

Then('o sistema mantém o cliente na página de checkout', async ({ page, checkout }) => {
  await expect(page).toHaveURL(checkout.urlEsperada())
  await expect(checkout.paginaCarregada()).toBeVisible()
  await expect(checkout.botaoConfirmar()).toBeVisible()
})

Then(
  'os campos {string} e {string} não exibem erro',
  async ({ checkout }, campo1: string, campo2: string) => {
    for (const campo of [campo1, campo2]) {
      await expect(checkout.campo(campo)).not.toHaveAttribute('aria-invalid', 'true')
      await expect(checkout.campo(campo)).not.toHaveAccessibleDescription(/Informe/)
    }
  },
)
