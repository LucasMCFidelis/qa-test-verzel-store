@e2e @checkout
Feature: Dados do cliente no checkout

  @VS-70 @nome @particao-equivalencia @valor-limite @regressao
  Scenario Outline: Rejeitar nome sem sobrenome [<descricao>]
    Given que o carrinho contém os itens "P005 x1"
    And que estou na página de checkout
    And que o cliente informa o nome <nome>
    And que o cliente informa o e-mail "maria@exemplo.com" e o CEP "01310-100"
    When eu confirmo o pedido
    Then o sistema exibe mensagem de erro para o campo "Nome completo"
    And o pedido não é confirmado
    And o sistema mantém o cliente na página de checkout
    And os campos "E-mail" e "CEP" não exibem erro

    Examples:
      | descricao                       | nome     |
      | sem sobrenome                   | "Maria"  |
      | sem sobrenome com espaço no fim | "Maria " |

  @VS-71 @email @particao-equivalencia @regressao
  Scenario Outline: Rejeitar e-mail com formato inválido [<descricao>]
    Given que o carrinho contém os itens "P005 x1"
    And que estou na página de checkout
    And que o cliente informa o nome "Maria Silva" e o CEP "01310-100"
    And que o cliente informa o e-mail <email>
    When eu confirmo o pedido
    Then o sistema exibe mensagem de erro para o campo "E-mail"
    And o pedido não é confirmado
    And o sistema mantém o cliente na página de checkout
    And os campos "Nome completo" e "CEP" não exibem erro

    Examples:
      | descricao               | email                     |
      | sem @                   | "maria.exemplo.com"       |
      | sem domínio             | "maria@"                  |
      | sem usuário             | "@exemplo.com"            |
      | espaço interno          | "maria silva@exemplo.com" |
      | sem extensão de domínio | "maria@exemplo"           |

  @VS-72 @cep @valor-limite @regressao
  Scenario Outline: Rejeitar CEP com 7 ou 9 dígitos (limites da regra) [<descricao>]
    Given que o carrinho contém os itens "P005 x1"
    And que estou na página de checkout
    And que o cliente informa o nome "Maria Silva" e o e-mail "maria@exemplo.com"
    And que o cliente informa o CEP <cep>
    When eu confirmo o pedido
    Then o sistema exibe mensagem de erro para o campo "CEP"
    And o pedido não é confirmado
    And o sistema mantém o cliente na página de checkout
    And os campos "Nome completo" e "E-mail" não exibem erro

    Examples:
      | descricao           | cep          |
      | 7 dígitos           | "0131010"    |
      | 9 dígitos           | "013101000"  |
      | 7 dígitos com hífen | "01310-10"   |
      | 9 dígitos com hífen | "01310-1000" |
