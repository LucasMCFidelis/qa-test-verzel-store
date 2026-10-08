# qa-test-verzel-store

Teste técnico de QA para a **Verzel Store** (loja online). O repositório automatiza testes de **API** e **E2E** em estilo BDD (Gherkin em pt-BR) e mantém uma collection Postman com os casos de API.

- Aplicação sob teste: `BASE_URL` (padrão `https://verzel-store.qa-test-verzel-store.workers.dev`), definida em `.env` (ignorado pelo git).
- Foco atual: fluxo de **carrinho** (`POST /carrinho/calcular`, cupons, frete grátis, limites de quantidade/itens) e catálogo (`/produtos`).
- Idioma: features, steps, nomes de domínio e commits em **português**. Código de infraestrutura (fixtures, config) segue o idioma já existente no arquivo.

## Stack

Playwright (`@playwright/test`) + `playwright-bdd` + TypeScript (strict, ESM-style `nodenext`, CJS no package) + `dotenv`.

## Estrutura

```
features/
  api/*.feature        # cenários Gherkin da camada API
  e2e/*.feature        # cenários Gherkin da camada E2E
src/
  api/fixtures.ts      # test.extend + createBdd; fixture `ctx` (corpo/resposta da requisição)
  api/steps/*.steps.ts
  e2e/fixtures.ts      # fixtures de Page Objects
  e2e/pages/*.ts       # Page Objects (ex.: HomePage)
  e2e/steps/*.steps.ts
  utils/               # helpers compartilhados (alias `@utils/*`)
postman/               # collection + environment (IDs VS-N dos casos de API)
test-plan/             # export do plano de testes (QAS) em JSON — fonte dos casos E2E; ignorado pelo git
.features-gen/         # GERADO por `bddgen` — nunca editar nem commitar
reports/, playwright-report/, test-results/   # gerados — nunca commitar
```

Projetos Playwright: `api`, `e2e-chromium`, `e2e-firefox`, `e2e-webkit`. Cada camada tem suas próprias fixtures e steps — **steps de API e E2E não são compartilhados**; só `src/utils` é comum.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run test:api` | gera specs (`bddgen`) e roda só a API |
| `npm run test:e2e` | E2E em Chromium |
| `npm run test:e2e:all` | E2E em Chromium, Firefox e WebKit |
| `npm run test:smoke` | API + E2E Chromium filtrando `@smoke` |
| `npm run test:ui` | modo UI do Playwright |
| `npm run steps` | lista os steps definidos (`bddgen export`) — use antes de criar um step novo |
| `npm run report` | abre o relatório HTML |

Sempre rode via os scripts `npm run …` (eles executam `bddgen` antes). Rodar `playwright test` direto usa specs gerados desatualizados. Para validar tipos: `npx tsc --noEmit`.

## Plano de testes (`test-plan/`) — fonte dos casos E2E

`test-plan/*.json` é o export do plano de testes do QAS (ignorado pelo git; pode haver mais de um arquivo — use o mais recente). **Antes de montar feature, steps ou Page Object de um caso `VS-N`, leia o caso nesse arquivo.** O `id` numérico do caso é o `N` do `VS-N`.

- Estrutura: `suites[]` aninhadas (`title`, `suites`, `cases`); cada caso tem `id`, `title`, `description`, `preconditions`, `priority`, `layer` (`api`/`e2e`), `tags` e `steps[]` (`keyword` + `text`, já em Gherkin pt-BR).
- Extrair um caso (arquivo é grande; não leia inteiro):
  `node -e 'const d=JSON.parse(require("fs").readFileSync("test-plan/<arquivo>.json","utf8"));(function w(s){for(const x of s){for(const c of x.cases||[])if(c.id===57)console.log(JSON.stringify(c,null,1));w(x.suites||[])}})(d.suites)'`
- Use `title` como título do cenário, `tags` como tags (`@VS-N` + as do caso), `steps` como base do Gherkin, `preconditions` para o `Given`/estado inicial e `description` para a intenção. Respeite a redação dos steps do plano, ajustando só para reutilizar steps existentes (`npm run steps`).
- Se `description`/steps indicarem dado a confirmar (ex.: "mensagem exata deve ser confirmada na UI"), confirme na UI real e **avise o usuário** do que foi observado; não invente.
- Casos E2E vivem em `suites > e2e > …` (`layer: "e2e"`); os de API também estão no plano, além do Postman.

## Rastreabilidade (Postman ↔ Gherkin)

Os casos de teste têm IDs `VS-N` (ex.: `VS-21`), definidos na collection Postman e organizados por pasta (`busca-de-produtos`, `calcular-carrinho/{cupons,frete,quantidade-por-produto,…}`). Ao portar um caso para BDD:

- Mantenha o ID na tag do cenário: `@VS-21`.
- Preserve a intenção e os dados do caso Postman; não invente comportamento esperado — se o contrato for ambíguo, pergunte.
- Casos parametrizados (vários `VS-12 [variação]`) viram `Scenario Outline` + `Examples`.
- Tags de camada (`@api`, `@e2e`), de prioridade/suíte (`@smoke`, `@regressao`) e `@setup` (cenários que só validam o setup) ficam no topo da Feature/Scenario.

## Boas práticas de testes

**Gherkin**
- Cenário descreve **comportamento de negócio**, não implementação: nada de seletores, URLs ou JSON cru no `.feature`.
- Um cenário = uma regra. `Given` monta estado, `When` executa **uma** ação, `Then` verifica o resultado observável.
- Títulos no formato do Postman: verbo no infinitivo + resultado esperado ("Rejeitar quantidade zero").
- Reutilize steps existentes (rode `npm run steps`) antes de criar novos; frases consistentes evitam steps duplicados/ambíguos.
- Dados em steps via parâmetros (`{string}`, `{int}`) ou helpers de `src/utils` (ex.: `parseItens("P002 x1, P004 x2")`).

**Steps e fixtures**
- Steps finos: delegam para fixtures, Page Objects e utils. Sem lógica de negócio nem asserts espalhados em helpers.
- Estado entre steps vive na fixture (`ctx` na API) — nunca em variáveis de módulo/globais (testes rodam em paralelo, `fullyParallel: true`).
- Imports de `Given/When/Then` vêm da `fixtures.ts` da própria camada, não de `playwright-bdd` direto.
- Use o alias `@utils/*` para helpers compartilhados.

**API**
- Asserte status code, corpo e **campo do erro** (mensagem/campo indicado), não só o status.
- Valores monetários e regras (frete, desconto, faltante) devem ser calculados no teste a partir de dados conhecidos (preço do produto no catálogo), com o cálculo explícito e legível — não copie o número da resposta.
- Cada teste é independente: não dependa de ordem nem de estado deixado por outro cenário (a API de cálculo é stateless; mantenha assim).
- Limites: cubra valor-limite, abaixo e acima (ex.: 5 un. por produto, frete grátis no valor exato).

**E2E**
- Page Object por página/componente em `src/e2e/pages`, com métodos em linguagem de negócio (`abrir()`, `adicionarAoCarrinho()`), recebendo `Page` no construtor. Todo Page Object estende `BasePage` e implementa `paginaCarregada()` (locator que só existe com a página carregada); os steps usam `expect(po.paginaCarregada()).toBeVisible()` em vez de validar só a URL.
- Locators por papel/texto acessível (`getByRole`, `getByLabel`, `getByTestId`) — evite CSS/XPath frágeis.
- Esperas **somente** via auto-wait e `expect(...)` web-first. Proibido `waitForTimeout`/sleeps.
- Asserts ficam em steps `Then` (ou `expect` no step), não dentro dos Page Objects.
- Prefira montar o estado via API/URL quando o foco do teste não for a UI de montagem.

**Geral**
- Sem `test.only`/`test.skip` commitados (`forbidOnly` quebra o CI). Teste instável: investigue a causa, não aumente retries.
- Sem dados sensíveis no repositório; configuração por `.env` (`BASE_URL`). Se criar variáveis novas, documente em `.env.example`.
- Não commitar `.env`, `.features-gen`, `reports`, `playwright-report`, `test-results`.

## Como trabalhar neste repositório (Claude Code)

- **Leia antes de escrever:** olhe a feature, os steps e a fixture da camada afetada e o caso `VS-N` correspondente — no `test-plan/` (E2E e API) e/ou na collection Postman (API).
- **Mudanças pequenas e verificáveis:** adicione um cenário, rode `npm run test:api` (ou `test:e2e`) e só então avance. Reporte falhas com a saída real; não diga que passou sem rodar.
- **Falha de teste ≠ ajustar o teste:** se o cenário falha contra a aplicação, diferencie bug da aplicação (reporte, marque `@bug`/documente) de erro do teste. Nunca afrouxe um assert só para ficar verde.
- **Não chute o contrato da API:** verifique o comportamento real com uma chamada (`curl`/Postman) antes de fixar o esperado, e confirme com o usuário se divergir da especificação.
- **Não edite arquivos gerados** (`.features-gen`, relatórios) nem `package-lock.json` manualmente.
- **Dependências:** não adicione pacotes sem necessidade; pergunte antes.
- **Commits:** pequenos, em português, no estilo do histórico (`Adiciona …`, `Ajusta …`, `Complementa …`), citando o `VS-N` quando houver. Só commite quando solicitado.
- **Escopo:** não refatore nem reformate código fora do que foi pedido.
