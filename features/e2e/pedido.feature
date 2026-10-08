@e2e @pedido
Feature: Confirmação do pedido

  @VS-73 @smoke @regressao
  Scenario: Confirmar pedido sem cupom abaixo do limite de frete grátis
    Given que o carrinho contém os itens "P001 x1"
    And que estou na página do carrinho
    When eu finalizo a compra informando um cliente valido
    Then o sistema confirma o pedido com número no formato "VZ-000000"
    And o resumo exibe subtotal "R$ 59,90", desconto "R$ 0,00", o frete é "R$ 19,90" e total "R$ 79,80"

  @VS-74 @cupom @smoke @regressao
  Scenario: Confirmar pedido com o cupom BEMVINDO10
    Given que o carrinho contém os itens "P005 x1"
    And que estou na página do carrinho
    And que o cupom "BEMVINDO10" está aplicado
    When eu finalizo a compra informando um cliente valido
    Then o sistema confirma o pedido com número no formato "VZ-000000"
    And o resumo exibe subtotal "R$ 100,00", desconto "R$ 10,00", o frete é "R$ 19,90" e total "R$ 109,90"
