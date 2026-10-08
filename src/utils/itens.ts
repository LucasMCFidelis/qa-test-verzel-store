export type Item = { produtoId: string; quantidade: number }

export const parseItens = (texto: string): Item[] =>
  texto.split(',').map((parte) => {
    const [produtoId, qtd] = parte.trim().split(/\s+x/)
    return { produtoId, quantidade: Number(qtd) }
  })