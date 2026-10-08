@e2e @cupom
Feature: Cupons de desconto no carrinho

  @VS-59 @smoke @ca01 @ca09 @regressao
  Scenario: Aplicar o cupom BEMVINDO10 em carrinho abaixo do limite de frete grátis
    Given que o carrinho contém os itens "P002 x1"
    And que estou na página do carrinho
    When eu aplico o cupom "BEMVINDO10"
    Then o sistema informa que o cupom foi aplicado com sucesso
    And o resumo exibe subtotal "R$ 139,90", desconto "R$ 13,99", o frete é "R$ 19,90" e total "R$ 145,81"

  @VS-60 @smoke @ca03 @regressao
  Scenario: Rejeitar cupom inexistente
    Given que o carrinho contém os itens "P002 x1"
    And que estou na página do carrinho
    When eu aplico o cupom "DESCONTO50"
    Then o sistema exibe a mensagem "Cupom inválido."
    And nenhum desconto é aplicado
    And o resumo mantém subtotal "R$ 139,90", desconto "R$ 0,00", frete "R$ 19,90" e total "R$ 159,80"

  @VS-61 @smoke @ca04 @regressao
  Scenario: Rejeitar cupom expirado
    Given que o carrinho contém os itens "P002 x1"
    And que estou na página do carrinho
    When eu aplico o cupom "VERAO2026"
    Then o sistema exibe a mensagem "Cupom expirado."
    And nenhum desconto é aplicado
    And o resumo mantém subtotal "R$ 139,90", desconto "R$ 0,00", frete "R$ 19,90" e total "R$ 159,80"

  @VS-62 @carrinho @ca01 @ca09 @regressao
  Scenario: Recalcular o desconto ao alterar a quantidade com cupom aplicado
    Given que o carrinho contém os itens "P002 x1"
    And que o cupom "BEMVINDO10" está aplicado
    And que estou na página do carrinho
    When eu aumento em 1 unidade a quantidade do produto "Calça Jeans Slim"
    Then o cupom "BEMVINDO10" continua aplicado
    And o resumo exibe subtotal "R$ 279,80", desconto "R$ 27,98", o frete é grátis (R$ 0,00) e total "R$ 251,82"
