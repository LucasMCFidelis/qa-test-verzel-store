@api @pedidos
Feature: Pedidos

  Background:
    Given que a API da Verzel Store está disponível

  @VS-37 @smoke
  Scenario: Confirmar pedido sem cupom abaixo do limite de frete grátis
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "P005 x1"
    When eu confirmo o pedido
    Then a resposta tem status 201
    And o pedido é confirmado com número no formato "VZ-000000"
    And a data de criação do pedido é informada
    And o frete de 19.90 é cobrado
    And o total do pedido é 119.90

  @VS-38
  Scenario: Confirmar pedido com resumo de valores igual ao do cálculo
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "P002 x1, P004 x2"
    When eu confirmo o pedido informando o cupom "BEMVINDO10"
    Then a resposta tem status 201
    And o resumo de valores é idêntico ao do cálculo do mesmo carrinho

  @VS-75 @quantidade @smoke
  Scenario Outline: Rejeitar pedido com quantidade de produtos acima do limite
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "<itens>"
    When eu confirmo o pedido
    Then a resposta tem status 422
    And o erro retornado tem o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    And o erro aponta para o campo "<campo>"
    And nenhum pedido é criado

    Examples:
      | itens            | campo               |
      | P001 x6          | itens[0].quantidade |
      | P001 x5, P004 x6 | itens[1].quantidade |
  
  @VS-76 @regressao @bug
  Scenario: Confirmar pedido sem cupom no limite para obtenção do frete grátis
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "P005 x2"
    When eu confirmo o pedido
    Then a resposta tem status 201
    And o pedido é confirmado com número no formato "VZ-000000"
    And o frete é grátis
    And o total do pedido é 200.00

  @VS-39 @cupom @smoke
  Scenario: Confirmar pedido com cupom BEMVINDO10
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "P005 x1"
    When eu confirmo o pedido informando o cupom "BEMVINDO10"
    Then a resposta tem status 201
    And o cupom é aplicado ao subtotal de 100.00 gerando um desconto de 10.00
    And o frete de 19.90 é cobrado
    And o total do pedido é 109.90

  @VS-40 @cupom @frete
  Scenario: Confirmar pedido com frete grátis quando o desconto reduz o valor abaixo do limite
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "P001 x1, P008 x3"
    When eu confirmo o pedido informando o cupom "BEMVINDO10"
    Then a resposta tem status 201
    And o cupom é aplicado ao subtotal de 209.90 gerando um desconto de 20.99
    And o frete é grátis
    And o total do pedido é 188.91

  @VS-42 @cupom @smoke
  Scenario: Rejeitar pedido com cupom inexistente
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "P005 x1"
    When eu confirmo o pedido informando o cupom "PROMO50"
    Then a resposta tem status 422
    And o erro retornado tem o código "CUPOM_INVALIDO"
    And nenhum pedido é criado

  @VS-43 @cupom @smoke
  Scenario: Rejeitar pedido com cupom expirado
    Given que os dados do cliente são válidos
    And que o carrinho contém os itens "P005 x1"
    When eu confirmo o pedido informando o cupom "VERAO2026"
    Then a resposta tem status 422
    And o erro retornado tem o código "CUPOM_EXPIRADO"
    And nenhum pedido é criado

  @VS-44 @cliente @nome
  Scenario Outline: Rejeitar nome sem sobrenome
    Given que o carrinho contém os itens "P005 x1"
    And que o cliente informa o nome <nome>
    When eu confirmo o pedido
    Then a resposta tem status 422
    And o erro retornado tem o código "DADOS_INVALIDOS"
    And o erro indica os campos inválidos "cliente.nome"
    And nenhum pedido é criado

    Examples:
      | nome     |
      | "Maria"  |
      | "Maria " |

  @VS-46 @cliente @email
  Scenario Outline: Rejeitar e-mail com formato inválido
    Given que o carrinho contém os itens "P005 x1"
    And que o cliente informa o e-mail "<email>"
    When eu confirmo o pedido
    Then a resposta tem status 422
    And o erro retornado tem o código "DADOS_INVALIDOS"
    And o erro indica os campos inválidos "cliente.email"
    And nenhum pedido é criado

    Examples:
      | email                   |
      | maria.exemplo.com       |
      | maria@                  |
      | @exemplo.com            |
      | maria silva@exemplo.com |

  @VS-48 @cliente @cep
  Scenario Outline: Aceitar CEP com ou sem hífen e retornar sem hífen
    Given que o carrinho contém os itens "P005 x1"
    And que o cliente informa o CEP "<cep>"
    When eu confirmo o pedido
    Then a resposta tem status 201
    And o CEP retornado é "01310100"

    Examples:
      | cep       |
      | 01310100  |
      | 01310-100 |

  @VS-49 @cliente @cep
  Scenario Outline: Rejeitar CEP com quantidade de dígitos diferente de 8
    Given que o carrinho contém os itens "P005 x1"
    And que o cliente informa o CEP "<cep>"
    When eu confirmo o pedido
    Then a resposta tem status 422
    And o erro retornado tem o código "DADOS_INVALIDOS"
    And o erro indica os campos inválidos "cliente.cep"
    And nenhum pedido é criado

    Examples:
      | cep        |
      | 0131010    |
      | 013101000  |
      | 01310-10   |
      | 01310-1000 |