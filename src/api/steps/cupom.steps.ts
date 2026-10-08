import { expect } from "@playwright/test"
import { Then } from "../fixtures"
import { emCentavos } from '@utils/dinheiro'
import { CalculoCarrinho } from "../types"

const PERCENTUAL_DESCONTO_BEMVINDO10 = 10

Then(
  'o cupom é aplicado ao subtotal de {float} gerando um desconto de {float}',
  async ({ ctx }, subtotal: number, desconto: number) => {
    const calculo: CalculoCarrinho = await ctx.resposta!.json()
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
  const calculo: CalculoCarrinho = await ctx.resposta!.json()
  expect(calculo.cupom?.aplicado).toBe(false)
  expect(calculo.cupom?.mensagem).toBe(mensagem)
})

Then('o código do cupom retornado é {string}', async ({ ctx }, codigo: string) => {
  const calculo: CalculoCarrinho = await ctx.resposta!.json()
  expect(calculo.cupom?.codigo).toBe(codigo)
})

Then('nenhum desconto é aplicado', async ({ ctx }) => {
  const calculo: CalculoCarrinho = await ctx.resposta!.json()
  expect(calculo.desconto).toBe(0)
})