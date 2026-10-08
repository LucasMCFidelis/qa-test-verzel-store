@e2e @carrinho
Feature: Carrinho na vitrine de produtos

  @VS-56 @smoke @regressao
  Scenario: Adicionar um produto ao carrinho pela vitrine
    Given que o carrinho está vazio
    And que estou na página inicial
    When eu adiciono o produto "Camiseta Essencial" ao carrinho
    Then o sistema informa "1 no carrinho" para o produto "Camiseta Essencial"
    And o contador do carrinho no cabeçalho indica 1 item
    And o carrinho contém o item "Camiseta Essencial" com quantidade 1, "R$ 59,90 cada" e total do item "R$ 59,90"

  @VS-57 @quantidade @smoke @valor-limite @ca10 @regressao
  Scenario: Bloquear a 6ª unidade ao adicionar pela vitrine
    Given que o carrinho contém os itens "P001 x4"
    And que estou na página inicial
    When eu adiciono mais um produto "Camiseta Essencial"
    Then o sistema informa que o limite de 5 unidades por produto foi atingido
    And o sistema desabilita o botão de adicionar ao carrinho para o item "Camiseta Essencial"

  @VS-58 @quantidade @valor-limite @ca10 @regressao
  Scenario: Bloquear a 6ª unidade ao aumentar pelo botão + no carrinho
    Given que o carrinho contém os itens "P004 x4"
    And que estou na página do carrinho
    When eu aumento em 1 unidade a quantidade do produto "Boné Aba Curva"
    Then a quantidade do item passa a 5
    And o sistema informa que o limite de 5 unidades por produto foi atingido
    And o sistema desabilita o botão de aumentar a quantidade do item "Boné Aba Curva"
    And o resumo exibe subtotal "R$ 249,50", desconto "R$ 0,00", o frete é grátis (R$ 0,00) e total "R$ 249,50"
