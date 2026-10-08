import { expect, type APIRequestContext } from '@playwright/test'
import { parseItens } from '@utils/itens'
import { emCentavos } from '@utils/dinheiro'
import { PATHS } from '../paths'
import { Given, When, Then } from '../fixtures'

type Calculo = {
  itens: Array<{ produtoId: string; precoUnitario: number; quantidade: number; total: number }>
  subtotal: number
  desconto: number
  frete: number
  freteGratis: boolean
  valorFaltanteFreteGratis: number
  total: number
  cupom: { codigo: string; aplicado: boolean; mensagem: string } | null
}

const PERCENTUAL_DESCONTO_BEMVINDO10 = 10
const LIMITE_FRETE_GRATIS_EM_CENTAVOS = 20000

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
  const calculo: Calculo = await ctx.resposta!.json()
  expect(calculo.itens).toHaveLength(ctx.corpo.itens.length)
  for (const item of calculo.itens) {
    expect(emCentavos(item.precoUnitario)).toBe(precos.get(item.produtoId))
    expect(emCentavos(item.total)).toBe(precos.get(item.produtoId)! * item.quantidade)
  }
})

Then('o subtotal é {float}', async ({ request, ctx }, subtotal: number) => {
  const precos = await precosDoCatalogo(request)
  const calculo: Calculo = await ctx.resposta!.json()
  const subtotalEsperado = ctx.corpo.itens.reduce(
    (soma, item) => soma + precos.get(item.produtoId)! * item.quantidade,
    0,
  )
  expect(emCentavos(calculo.subtotal)).toBe(emCentavos(subtotal))
  expect(emCentavos(calculo.subtotal)).toBe(subtotalEsperado)
})

Then(
  'o cupom é aplicado ao subtotal de {float} gerando um desconto de {float}',
  async ({ ctx }, subtotal: number, desconto: number) => {
    const calculo: Calculo = await ctx.resposta!.json()
    const descontoEsperado = Math.round(
      (emCentavos(subtotal) * PERCENTUAL_DESCONTO_BEMVINDO10) / 100,
    )
    expect(calculo.cupom?.aplicado).toBe(true)
    expect(emCentavos(calculo.subtotal)).toBe(emCentavos(subtotal))
    expect(emCentavos(calculo.desconto)).toBe(emCentavos(desconto))
    expect(emCentavos(calculo.desconto)).toBe(descontoEsperado)
  },
)

Then('o cupom é recusado com a mensagem {string}', async ({ ctx }, mensagem: string) => {
  const calculo: Calculo = await ctx.resposta!.json()
  expect(calculo.cupom?.aplicado).toBe(false)
  expect(calculo.cupom?.mensagem).toBe(mensagem)
})

Then('o código do cupom retornado é {string}', async ({ ctx }, codigo: string) => {
  const calculo: Calculo = await ctx.resposta!.json()
  expect(calculo.cupom?.codigo).toBe(codigo)
})

Then('nenhum desconto é aplicado', async ({ ctx }) => {
  const calculo: Calculo = await ctx.resposta!.json()
  expect(calculo.desconto).toBe(0)
})

Then('o frete é grátis', async ({ ctx }) => {
  const calculo: Calculo = await ctx.resposta!.json()
  expect(calculo.freteGratis).toBe(true)
  expect(calculo.frete).toBe(0)
})

Then('o frete de {float} é cobrado', async ({ ctx }, frete: number) => {
  const calculo: Calculo = await ctx.resposta!.json()
  expect(calculo.freteGratis).toBe(false)
  expect(emCentavos(calculo.frete)).toBe(emCentavos(frete))
})

Then('faltam {float} para o frete grátis', async ({ ctx }, faltante: number) => {
  const calculo: Calculo = await ctx.resposta!.json()
  const faltanteEsperado = Math.max(
    0,
    LIMITE_FRETE_GRATIS_EM_CENTAVOS - emCentavos(calculo.subtotal),
  )
  expect(emCentavos(calculo.valorFaltanteFreteGratis)).toBe(emCentavos(faltante))
  expect(emCentavos(calculo.valorFaltanteFreteGratis)).toBe(faltanteEsperado)
})

Then('não falta valor para o frete grátis', async ({ ctx }) => {
  const calculo: Calculo = await ctx.resposta!.json()
  expect(calculo.valorFaltanteFreteGratis).toBe(0)
})

Then('o total do pedido é {float}', async ({ ctx }, total: number) => {
  const calculo: Calculo = await ctx.resposta!.json()
  const totalEsperado =
    emCentavos(calculo.subtotal) - emCentavos(calculo.desconto) + emCentavos(calculo.frete)
  expect(emCentavos(calculo.total)).toBe(emCentavos(total))
  expect(emCentavos(calculo.total)).toBe(totalEsperado)
})

Then('o erro aponta para o campo {string}', async ({ ctx }, campo: string) => {
  const corpo = await ctx.resposta!.json()
  expect(corpo).toHaveProperty('erro.campo', campo)
})

Then('nenhum valor é calculado', async ({ ctx }) => {
  const corpo = await ctx.resposta!.json()
  for (const campo of ['itens', 'subtotal', 'desconto', 'frete', 'total']) {
    expect(corpo).not.toHaveProperty(campo)
  }
})
