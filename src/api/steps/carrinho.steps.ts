import { expect, type APIRequestContext } from '@playwright/test'
import { parseItens } from '@utils/itens'
import { emCentavos } from '@utils/dinheiro'
import { PATHS } from '../paths'
import { Given, When, Then } from '../fixtures'
import { CalculoCarrinho } from '../types'

async function precosDoCatalogo(request: APIRequestContext) {
  const produtos: Array<{ id: string; preco: number }> = await (
    await request.get(PATHS.produtos)
  ).json()
  return new Map(produtos.map((produto) => [produto.id, emCentavos(produto.preco)]))
}

Given('que o carrinho contém os itens {string}', async ({ ctx }, itens: string) => {
  ctx.corpo.itens = parseItens(itens)
})

When('eu calculo o carrinho', async ({ request, ctx }) => {
  ctx.resposta = await request.post(PATHS.carrinhoCalcular, { data: ctx.corpo })
})

When(
  'eu calculo o carrinho informando o cupom {string}',
  async ({ request, ctx }, cupom: string) => {
    ctx.corpo.cupom = cupom
    ctx.resposta = await request.post(PATHS.carrinhoCalcular, { data: ctx.corpo })
  },
)

Then('o total de cada item é o preço unitário vezes a quantidade', async ({ request, ctx }) => {
  const precos = await precosDoCatalogo(request)
  const calculo: CalculoCarrinho = await ctx.resposta!.json()
  expect(calculo.itens).toHaveLength(ctx.corpo.itens.length)
  for (const item of calculo.itens) {
    expect(emCentavos(item.precoUnitario)).toBe(precos.get(item.produtoId))
    expect(emCentavos(item.total)).toBe(precos.get(item.produtoId)! * item.quantidade)
  }
})

Then('o subtotal é {float}', async ({ request, ctx }, subtotal: number) => {
  const precos = await precosDoCatalogo(request)
  const calculo: CalculoCarrinho = await ctx.resposta!.json()
  const subtotalEsperado = ctx.corpo.itens.reduce(
    (soma, item) => soma + precos.get(item.produtoId)! * item.quantidade,
    0,
  )
  expect(emCentavos(calculo.subtotal)).toBe(emCentavos(subtotal))
  expect(emCentavos(calculo.subtotal)).toBe(subtotalEsperado)
})

Then('o total do carrinho é {float}', async ({ ctx }, total: number) => {
  const calculo: CalculoCarrinho = await ctx.resposta!.json()
  const totalEsperado =
    emCentavos(calculo.subtotal) - emCentavos(calculo.desconto) + emCentavos(calculo.frete)
  expect(emCentavos(calculo.total)).toBe(emCentavos(total))
  expect(emCentavos(calculo.total)).toBe(totalEsperado)
})

Then('nenhum valor é calculado', async ({ ctx }) => {
  const corpo = await ctx.resposta!.json()
  for (const campo of ['itens', 'subtotal', 'desconto', 'frete', 'total']) {
    expect(corpo).not.toHaveProperty(campo)
  }
})
