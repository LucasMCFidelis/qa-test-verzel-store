@api @produtos
Feature: Busca de produtos

  Background:
    Given que a API da Verzel Store está disponível

  @VS-1 @smoke @regressao
  Scenario: Listar os produtos disponíveis com status 200 e campos esperados
    When eu consulto a lista de produtos
    Then a resposta tem status 200
    And a lista de produtos não está vazia
    And cada produto possui os campos "id, nome, descricao, categoria, preco"
    And o campo "preco" de cada produto é maior que zero

  @VS-3 @smoke @regressao
  Scenario: Consultar produto existente pelo id
    When eu consulto o produto com id "P001"
    Then a resposta tem status 200
    And o produto retornado tem o id "P001"
    And o produto possui os campos "id, nome, descricao, categoria, preco"
    And o campo "preco" do produto é maior que zero

  @VS-4 @regressao
  Scenario Outline: Rejeitar consulta de produto inexistente [<id>]
    When eu consulto o produto com id "<id>"
    Then a resposta tem status 404
    And o erro retornado tem o código "PRODUTO_NAO_ENCONTRADO"
    And a mensagem do erro informa que o produto "<id>" não foi encontrado

    Examples:
      | id   |
      | P999 |
      | P000 |
      | ABC  |
