export const PATHS = {
  produtos: '/api/produtos',
  produto: (id: string) => `/api/produtos/${encodeURIComponent(id)}`,
} as const
