import { expect } from '@playwright/test'
import { When, Then } from '../fixtures'

const clienteValido = { nome: 'Maria Silva', email: 'maria@exemplo.com', cep: '01310-100' }

When('eu finalizo a compra informando um cliente valido', async ({ carrinho, checkout }) => {
  await carrinho.finalizarCompra()
  await checkout.informarNome(clienteValido.nome)
  await checkout.informarEmail(clienteValido.email)
  await checkout.informarCep(clienteValido.cep)
  await checkout.confirmarPedido()
})

Then(
  'o sistema confirma o pedido com número no formato {string}',
  async ({ page, confirmacao }, formato: string) => {
    const padrao = new RegExp(`^Pedido ${formato.replace(/0/g, () => '[0-9]')}$`)
    await expect(page).toHaveURL(/\/pedido-confirmado/)
    await expect(confirmacao.numeroDoPedido()).toHaveText(padrao)
  },
)
