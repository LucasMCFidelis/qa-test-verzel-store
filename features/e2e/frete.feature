@e2e @frete
Feature: Frete no carrinho

  @VS-64 @valor-limite @ca06 @ca07 @regressao
  Scenario: Cobrar frete com subtotal logo abaixo do limite (R$ 199,90)
    Given que o carrinho contém os itens "P004 x1, P005 x1, P008 x1"
    When eu acesso o carrinho
    Then o resumo exibe subtotal "R$ 199,90", desconto "R$ 0,00", o frete é "R$ 19,90" e total "R$ 219,80"
    And o sistema exibe o aviso "Faltam R$ 0,10 para o frete grátis."

  @VS-65 @smoke @valor-limite @ca06 @bug
  Scenario: Conceder frete grátis com subtotal exatamente R$ 200,00
    Given que o carrinho contém os itens "P005 x2"
    When eu acesso o carrinho
    Then o resumo exibe subtotal "R$ 200,00", desconto "R$ 0,00", o frete é grátis (R$ 0,00) e total "R$ 200,00"
    And o sistema não exibe o aviso de valor faltante para o frete grátis
    And o sistema indica que o frete é grátis

  @VS-66 @smoke @cupom @ca08 @ca06 @regressao
  Scenario: Manter frete grátis quando o desconto reduz o valor abaixo do limite
    Given que o carrinho contém os itens "P001 x1, P008 x3"
    And que estou na página do carrinho
    When eu aplico o cupom "BEMVINDO10"
    Then o resumo exibe subtotal "R$ 209,90", desconto "R$ 20,99", o frete é grátis (R$ 0,00) e total "R$ 188,91"
    And o sistema não exibe o aviso de valor faltante para o frete grátis
