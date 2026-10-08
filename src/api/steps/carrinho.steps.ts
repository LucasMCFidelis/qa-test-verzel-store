import { parseItens } from '@utils/itens'
import { Given } from '../fixtures'

Given('que o carrinho contém os itens {string}', async ({ ctx }, itens: string) => {
    ctx.corpo.itens = parseItens(itens)
})
