import { expect } from '@playwright/test'
import { Then } from '../fixtures'

Then('a resposta tem status {int}', async ({ ctx }, status: number) => {
  expect(ctx.resposta?.status()).toBe(status)
})

Then(
  'o erro retornado tem o código {string}',
  async ({ ctx }, codigo: string) => {
    const corpo = await ctx.resposta!.json()
    expect(corpo).toHaveProperty('erro.codigo', codigo)
  },
)
