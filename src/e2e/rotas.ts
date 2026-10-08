export const ROTAS = {
  home: '/',
  carrinho: '/carrinho',
  checkout: '/checkout',
  pedidoConfirmado: '/pedido-confirmado',
} as const

export type Rota = (typeof ROTAS)[keyof typeof ROTAS]

const escaparRegex = (texto: string) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Padrão (RegExp) que casa a URL completa da página de uma rota, para `toHaveURL`.
 * Recebe só o caminho (`ROTAS.x`): o host vem do `baseURL` do Playwright (.env), então
 * os testes não ficam presos a um ambiente. Tolera barra final, query e hash.
 */
export const padraoDaUrl = (rota: Rota): RegExp =>
  new RegExp(`^[a-z]+://[^/]+${escaparRegex(rota).replace(/\/$/, '')}/?(\\?.*)?(#.*)?$`)
