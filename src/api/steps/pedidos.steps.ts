import { expect } from '@playwright/test'
import { Given, When, Then } from '../fixtures'
import { CalculoPedido } from '../types'
import { emCentavos } from '@utils/dinheiro'
import { PATHS } from '../paths'

Given('que os dados do cliente são válidos', async ({ ctx }) => {
  ctx.user = { nome: 'Lucas Fidelis', email: 'lucas@example.com', cep: '01310100' }
})

Given('que o cliente informa o nome {string}', async ({ ctx }, nome: string) => {
  ctx.user = { nome, email: 'lucas@example.com', cep: '01310100' }
})

Given('que o cliente informa o e-mail {string}', async ({ ctx }, email: string) => {
  ctx.user = { nome: 'Lucas Fidelis', email, cep: '01310100' }
})

Given('que o cliente informa o CEP {string}', async ({ ctx }, cep: string) => {
  ctx.user = { nome: 'Lucas Fidelis', email: 'lucas@example.com', cep }
})

When('eu confirmo o pedido', async ({ request, ctx }) => {
  ctx.resposta = await request.post(PATHS.pedidos, {
    data: {
      cliente: ctx.user,
      itens: ctx.corpo.itens
    }
  })
})

When('eu confirmo o pedido informando o cupom {string}', async ({ request, ctx }, cupom: string) => {
  ctx.corpo.cupom = cupom
  ctx.resposta = await request.post(PATHS.pedidos, {
    data: {
      cliente: ctx.user,
      itens: ctx.corpo.itens,
      cupom
    }
  })
})

Then('o pedido é confirmado com número no formato "VZ-000000"', async ({ ctx }) => {
  const corpo = await ctx.resposta!.json()
  expect(corpo).toHaveProperty('numero')
  expect(corpo.numero).toMatch(/^VZ-\d{6}$/)
})

Then('a data de criação do pedido é informada', async ({ ctx }) => {
  const corpo = await ctx.resposta!.json()
  expect(corpo).toHaveProperty('criadoEm')
  expect(new Date(corpo.criadoEm).toString()).not.toBe('Invalid Date')
})

Then('o resumo de valores é idêntico ao do cálculo do mesmo carrinho', async ({ request, ctx }) => {
  const calculoPedido = await ctx.resposta!.json()
  const calculoCarrinho = await request.post(PATHS.carrinhoCalcular, {
    data: {
      itens: ctx.corpo.itens,
      cupom: ctx.corpo.cupom
    }
  })
  const corpoCalculado = await calculoCarrinho.json()

  expect(calculoPedido.subtotal).toEqual(corpoCalculado.subtotal)
  expect(calculoPedido.frete).toEqual(corpoCalculado.frete)
  expect(calculoPedido.freteGratis).toEqual(corpoCalculado.freteGratis)
  expect(calculoPedido.cupom).toEqual(corpoCalculado.cupom)
  expect(calculoPedido.desconto).toEqual(corpoCalculado.desconto)
  expect(calculoPedido.total).toEqual(corpoCalculado.total)
})

Then('nenhum pedido é criado', async ({ ctx }) => {
  const corpo = await ctx.resposta!.json()
  expect(corpo).not.toHaveProperty('numero')
  expect(corpo).toHaveProperty('erro')
})

Then('o total do pedido é {float}', async ({ ctx }, total: number) => {
  const calculo: CalculoPedido = await ctx.resposta!.json()
  const totalEsperado =
    emCentavos(calculo.subtotal) - emCentavos(calculo.desconto) + emCentavos(calculo.frete)
  expect(emCentavos(calculo.total)).toBe(emCentavos(total))
  expect(emCentavos(calculo.total)).toBe(totalEsperado)
})

Then('o erro indica os campos inválidos {string}', async ({ ctx }, campos: string) => {
  const corpo = await ctx.resposta!.json()
  const camposInvalidos = campos.split(',').map((campo) => campo.trim())

  for (const campo of camposInvalidos) {
    expect(
      corpo.erro.campos.map(
        (item: { campo: string; mensagem: string }) => item.campo
      )
    ).toContain(campo)
  }
})

Then('o CEP retornado é {string}', async ({ ctx }, cep: string) => {
  const corpo = await ctx.resposta!.json()
  expect(corpo).toHaveProperty('cliente.cep', cep)
})
