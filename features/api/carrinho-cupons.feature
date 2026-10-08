@api @carrinho @cupom
Feature: Cupons no cálculo do carrinho

  Background:
    Given que a API da Verzel Store está disponível

  @VS-5 @smoke @regressao
  Scenario: Aplicar cupom BEMVINDO10 em carrinho com um item
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "BEMVINDO10"
    Then a resposta tem status 200
    And o cupom é aplicado ao subtotal de 100.00 gerando um desconto de 10.00

  @VS-6 @regressao
  Scenario: Aplicar cupom BEMVINDO10 em carrinho com múltiplos itens
    Given que o carrinho contém os itens "P002 x1, P004 x2"
    When eu calculo o carrinho informando o cupom "BEMVINDO10"
    Then a resposta tem status 200
    And o total de cada item é o preço unitário vezes a quantidade
    And o cupom é aplicado ao subtotal de 239.70 gerando um desconto de 23.97
    And o frete é grátis
    And o total do pedido é 215.73

  @VS-7 @regressao
  Scenario: Calcular carrinho sem cupom
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho
    Then a resposta tem status 200
    And nenhum desconto é aplicado
    And o total do pedido é 119.90

  @VS-8 @regressao
  Scenario: Aplicar cupom em minúsculas
    Given que o carrinho contém os itens "P001 x3"
    When eu calculo o carrinho informando o cupom "bemvindo10"
    Then a resposta tem status 200
    And o cupom é aplicado ao subtotal de 179.70 gerando um desconto de 17.97
    And o total do pedido é 181.63

  @VS-10 @regressao
  Scenario: Aplicar cupom com espaços nas pontas
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "  bemvindo10  "
    Then a resposta tem status 200
    And o cupom é aplicado ao subtotal de 100.00 gerando um desconto de 10.00
    And o código do cupom retornado é "BEMVINDO10"

  @VS-11 @smoke @regressao
  Scenario: Rejeitar cupom inexistente
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "PROMO50"
    Then a resposta tem status 200
    And o cupom é recusado com a mensagem "Cupom inválido."
    And nenhum desconto é aplicado

  @VS-12 @regressao
  Scenario Outline: Rejeitar código de cupom inválido [<descricao>]
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "<cupom>"
    Then a resposta tem status 200
    And o cupom é recusado com a mensagem "Cupom inválido."
    And nenhum desconto é aplicado

    Examples:
      | descricao                 | cupom                                                                                                  |
      | um caractere a menos      | BEMVINDO1                                                                                              |
      | um caractere a mais       | BEMVINDO100                                                                                            |
      | espaço interno            | BEM VINDO10                                                                                            |
      | caractere especial no fim | BEMVINDO10!                                                                                            |
      | só caracteres especiais   | @#$%                                                                                                   |
      | mais de 100 caracteres    | XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX |

  @VS-15 @smoke @regressao
  Scenario: Rejeitar cupom expirado
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "VERAO2026"
    Then a resposta tem status 200
    And o cupom é recusado com a mensagem "Cupom expirado."
    And nenhum desconto é aplicado

  @VS-16 @regressao
  Scenario: Identificar cupom expirado em minúsculas
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "verao2026"
    Then a resposta tem status 200
    And o cupom é recusado com a mensagem "Cupom expirado."

  @VS-17 @frete @regressao
  Scenario: Manter frete grátis ao usar cupom expirado
    Given que o carrinho contém os itens "P007 x1"
    When eu calculo o carrinho informando o cupom "VERAO2026"
    Then a resposta tem status 200
    And o cupom é recusado com a mensagem "Cupom expirado."
    And nenhum desconto é aplicado
    And o frete é grátis
    And o total do pedido é 229.90
