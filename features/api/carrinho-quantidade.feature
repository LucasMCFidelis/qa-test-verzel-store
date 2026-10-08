@api @carrinho @quantidade
Feature: Quantidade por produto no cálculo do carrinho

  Background:
    Given que a API da Verzel Store está disponível

  @VS-28 @smoke @valor-limite @regressao
  Scenario: Aceitar quantidade no limite superior
    Given que o carrinho contém os itens "P001 x5"
    When eu calculo o carrinho
    Then a resposta tem status 200
    And o subtotal é 299.50

  @VS-29 @smoke @valor-limite @regressao @bug
  Scenario: Rejeitar quantidade acima do limite
    Given que o carrinho contém os itens "P001 x6"
    When eu calculo o carrinho
    Then a resposta tem status 422
    And o erro retornado tem o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    And o erro aponta para o campo "itens[0].quantidade"
    And nenhum valor é calculado

  @VS-30 @valor-limite @regressao
  Scenario: Rejeitar quantidade zero
    Given que o carrinho contém os itens "P001 x0"
    When eu calculo o carrinho
    Then a resposta tem status 422
    And o erro retornado tem o código "QUANTIDADE_INVALIDA"
    And o erro aponta para o campo "itens[0].quantidade"
    And nenhum valor é calculado

  @VS-35 @regressao @bug
  Scenario: Rejeitar carrinho com um item acima do limite e outro dentro
    Given que o carrinho contém os itens "P001 x6, P004 x5"
    When eu calculo o carrinho
    Then a resposta tem status 422
    And o erro retornado tem o código "QUANTIDADE_MAXIMA_EXCEDIDA"
    And o erro aponta para o campo "itens[0].quantidade"
    And nenhum valor é calculado

  @VS-36 @regressao
  Scenario: Rejeitar o mesmo produto repetido na lista
    Given que o carrinho contém os itens "P001 x3, P001 x3"
    When eu calculo o carrinho
    Then a resposta tem status 422
    And o erro retornado tem o código "ITEM_DUPLICADO"
    And nenhum valor é calculado
