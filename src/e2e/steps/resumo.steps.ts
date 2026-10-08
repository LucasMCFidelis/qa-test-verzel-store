import { expect, type Locator, type Page } from '@playwright/test'
import { Then } from '../fixtures'

const valor = (texto: string) => `/^(- )?${texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$/`

const resumoDoPedido = (page: Page): Locator =>
  page.getByRole('region', { name: /^(Resumo|Itens) do pedido$/ })

async function verificarResumo(
  resumo: Locator,
  esperado: { subtotal: string; desconto: string; frete: string; total: string },
) {
  await expect(resumo).toMatchAriaSnapshot(`
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
  async ({ page }, subtotal: string, desconto: string, total: string) => {
    await verificarResumo(resumoDoPedido(page), { subtotal, desconto, frete: 'Grátis', total })
  },
)

Then(
  'o resumo exibe subtotal {string}, desconto {string}, o frete é {string} e total {string}',
  async ({ page }, subtotal: string, desconto: string, frete: string, total: string) => {
    await verificarResumo(resumoDoPedido(page), { subtotal, desconto, frete, total })
  },
)

Then(
  'o resumo mantém subtotal {string}, desconto {string}, frete {string} e total {string}',
  async ({ page }, subtotal: string, desconto: string, frete: string, total: string) => {
    await verificarResumo(resumoDoPedido(page), { subtotal, desconto, frete, total })
  },
)
