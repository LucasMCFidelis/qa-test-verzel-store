export type UserInfo = { nome: string; email: string; cep: string }

export
    type CalculoCarrinho = {
        itens: Array<{ produtoId: string; precoUnitario: number; quantidade: number; total: number }>
        subtotal: number
        desconto: number
        frete: number
        freteGratis: boolean
        valorFaltanteFreteGratis: number
        total: number
        cupom: { codigo: string; aplicado: boolean; mensagem: string } | null
    }

export
    type CalculoPedido = {
        numero: string
        criadoEm: string
        cliente: UserInfo
    } & CalculoCarrinho
