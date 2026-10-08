import { expect } from '@playwright/test'
import type { CartPage } from '../pages/CartPage'
import { Then } from '../fixtures'

const valor = (texto: string) => `/^(- )?${texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$/`

async function verificarResumo(
  carrinho: CartPage,
  esperado: { subtotal: string; desconto: string; frete: string; total: string },
) {
  await expect(carrinho.resumo()).toMatchAriaSnapshot(`
    - term: Subtotal
    - definition: ${valor(esperado.subtotal)}
    - term: /^Desconto/
    - definition: ${valor(esperado.desconto)}
    - term: Frete
    - definition: ${valor(esperado.frete)}
    - term: Total
    - definition: ${valor(esperado.total)}
  `)
}

Then(
  'o resumo exibe subtotal {string}, desconto {string}, o frete é grátis \\(R$ 0,00) e total {string}',
  async ({ carrinho }, subtotal: string, desconto: string, total: string) => {
    await verificarResumo(carrinho, { subtotal, desconto, frete: 'Grátis', total })
  },
)

Then(
  'o resumo exibe subtotal {string}, desconto {string}, o frete é {string} e total {string}',
  async ({ carrinho }, subtotal: string, desconto: string, frete: string, total: string) => {
    await verificarResumo(carrinho, { subtotal, desconto, frete, total })
  },
)

Then(
  'o resumo mantém subtotal {string}, desconto {string}, frete {string} e total {string}',
  async ({ carrinho }, subtotal: string, desconto: string, frete: string, total: string) => {
    await verificarResumo(carrinho, { subtotal, desconto, frete, total })
  },
)
