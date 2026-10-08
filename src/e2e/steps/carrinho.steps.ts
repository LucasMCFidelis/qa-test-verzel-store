import { expect } from '@playwright/test'
import { parseItens } from '@utils/itens'
import { Given, When, Then } from '../fixtures'

Given('que o carrinho está vazio', async ({ carrinho }) => {
  await carrinho.montarComItens([])
})

Given('que o carrinho contém os itens {string}', async ({ carrinho }, itens: string) => {
  await carrinho.montarComItens(parseItens(itens))
})

Given('que estou na página inicial', async ({ home }) => {
  await home.abrir()
})

Given('que estou na página do carrinho', async ({ carrinho }) => {
  await carrinho.abrir()
})

When('eu adiciono o produto {string} ao carrinho', async ({ home }, produto: string) => {
  await home.adicionarAoCarrinho(produto)
})

When('eu adiciono mais um produto {string}', async ({ home }, produto: string) => {
  await home.adicionarAoCarrinho(produto)
})

When(
  'eu aumento em 1 unidade a quantidade do produto {string}',
  async ({ carrinho }, produto: string) => {
    await carrinho.aumentarQuantidade(produto)
  },
)

Then(
  'o sistema informa {string} para o produto {string}',
  async ({ home }, mensagem: string, produto: string) => {
    await expect(home.card(produto).getByText(mensagem)).toBeVisible()
  },
)

Then('o contador do carrinho no cabeçalho indica {int} item(ns)', async ({ home }, quantidade: number) => {
  await expect(home.contadorDoCarrinho()).toHaveAccessibleName(`Carrinho ${quantidade} itens no carrinho`)
})

Then(
  'o carrinho contém o item {string} com quantidade {int}, {string} e total do item {string}',
  async ({ carrinho }, produto: string, quantidade: number, unitario: string, total: string) => {
    await carrinho.abrirPeloCabecalho()
    const item = carrinho.item(produto)
    await expect(carrinho.quantidade(produto)).toHaveText(String(quantidade))
    await expect(item.getByText(unitario)).toBeVisible()
    await expect(item.getByText(total, { exact: true })).toBeVisible()
  },
)

Then('o sistema informa que o limite de 5 unidades por produto foi atingido', async ({ page }) => {
  // A vitrine ("Limite de 5 unidades atingido.") e o carrinho ("Limite de 5 unidades por produto.")
  // usam textos distintos para a mesma regra; ambos são validados por esta frase do plano.
  await expect(page.getByText(/Limite de 5 unidades/)).toBeVisible()
})

Then(
  'o sistema desabilita o botão de adicionar ao carrinho para o item {string}',
  async ({ home }, produto: string) => {
    await expect(home.botaoAdicionar(produto)).toBeDisabled()
  },
)

Then('a quantidade do item passa a {int}', async ({ page }, quantidade: number) => {
  // Cenários com um único item no carrinho; o plano não nomeia o produto neste passo.
  await expect(page.getByRole('status', { name: /^Quantidade de / })).toHaveText(String(quantidade))
})

Then(
  'o sistema desabilita o botão de aumentar a quantidade do item {string}',
  async ({ carrinho }, produto: string) => {
    await expect(carrinho.botaoAumentar(produto)).toBeDisabled()
  },
)
