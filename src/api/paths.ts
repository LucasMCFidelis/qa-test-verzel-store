export const PATHS = {
  produtos: '/api/produtos',
  produto: (id: string) => `/api/produtos/${encodeURIComponent(id)}`,
  carrinhoCalcular: '/api/carrinho/calcular',
  pedidos: '/api/pedidos',
} as const
