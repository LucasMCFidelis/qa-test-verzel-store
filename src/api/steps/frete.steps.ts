import { expect } from "@playwright/test"
import { Then } from "../fixtures"
import { CalculoCarrinho } from "../types"
import { emCentavos } from "@utils/dinheiro"

const LIMITE_FRETE_GRATIS_EM_CENTAVOS = 20000

Then('o frete é grátis', async ({ ctx }) => {
    const calculo: CalculoCarrinho = await ctx.resposta!.json()
    expect(calculo.freteGratis).toBe(true)
    expect(calculo.frete).toBe(0)
})

Then('o frete de {float} é cobrado', async ({ ctx }, frete: number) => {
    const calculo: CalculoCarrinho = await ctx.resposta!.json()
    expect(calculo.freteGratis).toBe(false)
    expect(emCentavos(calculo.frete)).toBe(emCentavos(frete))
})

Then('faltam {float} para o frete grátis', async ({ ctx }, faltante: number) => {
    const calculo: CalculoCarrinho = await ctx.resposta!.json()
    const faltanteEsperado = Math.max(
        0,
        LIMITE_FRETE_GRATIS_EM_CENTAVOS - emCentavos(calculo.subtotal),
    )
    expect(emCentavos(calculo.valorFaltanteFreteGratis)).toBe(emCentavos(faltante))
    expect(emCentavos(calculo.valorFaltanteFreteGratis)).toBe(faltanteEsperado)
})

Then('não falta valor para o frete grátis', async ({ ctx }) => {
    const calculo: CalculoCarrinho = await ctx.resposta!.json()
    expect(calculo.valorFaltanteFreteGratis).toBe(0)
})
