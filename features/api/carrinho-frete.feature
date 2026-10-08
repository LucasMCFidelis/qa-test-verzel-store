@api @carrinho @frete
Feature: Frete no cálculo do carrinho

  Background:
    Given que a API da Verzel Store está disponível

  @VS-21 @smoke @valor-limite @regressao
  Scenario: Cobrar frete abaixo do limite
    Given que o carrinho contém os itens "P008 x3, P004 x1"
    When eu calculo o carrinho
    Then a resposta tem status 200
    And o frete de 19.90 é cobrado
    And faltam 0.10 para o frete grátis
    And o total do carrinho é 219.80

  @VS-22 @smoke @valor-limite @regressao @bug
  Scenario: Conceder frete grátis no valor limite
    Given que o carrinho contém os itens "P005 x2"
    When eu calculo o carrinho
    Then a resposta tem status 200
    And o frete é grátis
    And não falta valor para o frete grátis
    And o total do carrinho é 200.00

  @VS-23 @regressao
  Scenario Outline: Retornar faltante zero quando o frete grátis já foi atingido [<descricao>]
    Given que o carrinho contém os itens "<itens>"
    When eu calculo o carrinho
    Then a resposta tem status 200
    And o frete é grátis
    And não falta valor para o frete grátis

    Examples:
      | descricao                           | itens                     |
      | subtotal 209,80 (vizinho do limite) | P001 x1, P004 x1, P005 x1 |
      | subtotal 229,90                     | P007 x1                   |

  @VS-24 @cupom @regressao
  Scenario: Manter frete grátis quando o desconto reduz o valor abaixo do limite
    Given que o carrinho contém os itens "P001 x1, P008 x3"
    When eu calculo o carrinho informando o cupom "BEMVINDO10"
    Then a resposta tem status 200
    And o cupom é aplicado ao subtotal de 209.90 gerando um desconto de 20.99
    And o frete é grátis
    And o total do carrinho é 188.91

  @VS-25 @cupom @regressao
  Scenario: Calcular o faltante sobre o subtotal antes do desconto
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "BEMVINDO10"
    Then a resposta tem status 200
    And o cupom é aplicado ao subtotal de 100.00 gerando um desconto de 10.00
    And faltam 100.00 para o frete grátis

  @VS-26 @cupom @regressao
  Scenario: Aplicar o desconto apenas sobre os produtos, sem reduzir o frete
    Given que o carrinho contém os itens "P005 x1"
    When eu calculo o carrinho informando o cupom "BEMVINDO10"
    Then a resposta tem status 200
    And o cupom é aplicado ao subtotal de 100.00 gerando um desconto de 10.00
    And o frete de 19.90 é cobrado
    And o total do carrinho é 109.90
