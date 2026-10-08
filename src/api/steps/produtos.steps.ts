import { expect } from '@playwright/test'
import { PATHS } from '../paths'
import { Given, When, Then } from '../fixtures'

type Produto = { id: string; nome: string; descricao: string; categoria: string; preco: number }

const campos = (texto: string) => texto.split(',').map((campo) => campo.trim())

Given('que a API da Verzel Store está disponível', async ({ request }) => {
  const resposta = await request.get(PATHS.produtos)
  expect(resposta.ok()).toBe(true)
})

When('eu consulto a lista de produtos', async ({ request, ctx }) => {
  ctx.resposta = await request.get(PATHS.produtos)
})

When('eu consulto o produto com id {string}', async ({ request, ctx }, id: string) => {
  ctx.resposta = await request.get(PATHS.produto(id))
})

Then('a lista de produtos não está vazia', async ({ ctx }) => {
  const produtos: Produto[] = await ctx.resposta!.json()
  expect(Array.isArray(produtos)).toBe(true)
  expect(produtos.length).toBeGreaterThan(0)
})

Then('cada produto possui os campos {string}', async ({ ctx }, lista: string) => {
  const produtos: Produto[] = await ctx.resposta!.json()
  for (const produto of produtos) {
    expect(Object.keys(produto).sort()).toEqual(campos(lista).sort())
  }
})

Then('o campo {string} de cada produto é maior que zero', async ({ ctx }, campo: string) => {
  const produtos: Record<string, number>[] = await ctx.resposta!.json()
  for (const produto of produtos) {
    expect(produto[campo]).toBeGreaterThan(0)
  }
})

Then('o produto retornado tem o id {string}', async ({ ctx }, id: string) => {
  const produto: Produto = await ctx.resposta!.json()
  expect(produto.id).toBe(id)
})

Then('o produto possui os campos {string}', async ({ ctx }, lista: string) => {
  const produto: Produto = await ctx.resposta!.json()
  expect(Object.keys(produto).sort()).toEqual(campos(lista).sort())
})

Then('o campo {string} do produto é maior que zero', async ({ ctx }, campo: string) => {
  const produto: Record<string, number> = await ctx.resposta!.json()
  expect(produto[campo]).toBeGreaterThan(0)
})

Then(
  'a mensagem do erro informa que o produto {string} não foi encontrado',
  async ({ ctx }, id: string) => {
    const corpo = await ctx.resposta!.json()
    expect(corpo.erro.mensagem).toContain(`Produto ${id} não encontrado`)
  },
)
