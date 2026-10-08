import { expect } from '@playwright/test'
import { When, Then } from '../fixtures'

When('eu acesso o carrinho', async ({ carrinho }) => {
  await carrinho.abrir()
})

Then('o sistema exibe o aviso {string}', async ({ carrinho }, aviso: string) => {
  await expect(carrinho.avisoDeFreteGratis()).toHaveText(aviso)
})

Then('o sistema não exibe o aviso de valor faltante para o frete grátis', async ({ carrinho }) => {
  await expect(carrinho.resumo()).toBeVisible()
  await expect(carrinho.avisoDeFreteGratis()).toBeHidden()
})

Then('o sistema indica que o frete é grátis', async ({ carrinho }) => {
  await expect(carrinho.resumo()).toMatchAriaSnapshot(`
    - term: Frete
    - definition: Grátis
  `)
})
