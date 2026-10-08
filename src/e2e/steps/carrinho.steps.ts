import { Given } from '../fixtures'

Given('que o carrinho contém os itens {string}', async ({ home }, itens: string) => {
  await home.abrir()
})