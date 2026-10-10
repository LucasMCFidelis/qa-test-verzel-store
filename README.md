<div align="center">

<h1>🧪 Teste técnico: QA Júnior na Verzel</h1>

**Planejamento, execução manual e exploratória, report de bugs e automação (API + E2E) da _Verzel Store_, com foco em carrinho, cupons, frete grátis, limite de quantidade e confirmação de pedido.**

<p align="center">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Playwright_BDD-9.x-green?style=for-the-badge" alt="Playwright BDD" />
  <img src="https://img.shields.io/badge/Testes-69_passando_%7C_7_falhas_por_bugs_conhecidos-orange?style=for-the-badge" alt="Status dos testes" />
</p>

</div>

**Sumário**

- [1. Entregas](#1-entregas)
- [2. Cenários e Gherkin](#2-cenários-e-gherkin)
- [3. Execução manual e Exploratoria](#3-execução-manual-e-exploratoria)
- [4. Bugs encontrados](#4-bugs-encontrados)
- [5. Como rodar a automação](#5-como-rodar-a-automação)
  - [Passo 1 — Clonar repositório](#passo-1--clonar-repositório)
  - [Passo 2 — Acessar projeto e instalar dependências](#passo-2--acessar-projeto-e-instalar-dependências)
  - [Passo 3 — Copiar .env.example](#passo-3--copiar-envexample)
    - [Bash](#bash)
    - [PowerShell](#powershell)
  - [Passo 4 — Executar os testes Playwright](#passo-4--executar-os-testes-playwright)
  - [Passo 5 — Executar a collection no Postman](#passo-5--executar-a-collection-no-postman)

---

## 1. Entregas

O plano de testes foi levantado a partir da documentação e mantido no **Qase**, com 80 casos (`VS-1` a `VS-80`) em **Gherkin pt-BR**, sendo 4 exploratórios (`VS-77` a `VS-80`). O ID `VS-N` liga Qase, Postman e código.

| Entregável                                    | Onde está                                                                                                                                                                                                                        |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cenários de teste (Gherkin)                   | [`test-docs/documentacao-testes-qase.csv`](test-docs/documentacao-testes-qase.csv) (plano) e [`features/`](features) (automatizados)                                                                                             |
| Execução manual com resultado de cada cenário | [`test-docs/registro-testes-manuais/`](test-docs/registro-testes-manuais) (PDFs das rodadas roteirizadas e CSV da exploratória)                                                                                                  |
| Report dos bugs                               | Issues [#1](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/1) a [#6](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/6); resumo em [`defeitos-encontrados.csv`](test-docs/defeitos-encontrados.csv) |
| Evidências da execução                        | PDFs de `registro-testes-manuais/` (passos com capturas de tela) e anexos das issues                                                                                                                                             |
| Automação com Playwright                      | 76 testes (53 API + 23 E2E) em [`features/`](features) e [`src/`](src)                                                                                                                                                           |
| Collection Postman                            | [`postman/`](postman)                                                                                                                                                                                                            |

---

## 2. Cenários e Gherkin

| Camada | Casos no plano | Cenários automatizados                 |
| ------ | -------------- | -------------------------------------- |
| API    | 57             | 36 (53 testes, contando os `Examples`) |
| E2E    | 23 (19 roteirizados + 4 exploratórios) | 15 (23 testes)         |

Os exploratórios (`VS-77` a `VS-80`) não são automatizados: ficam no Qase, com o registro da execução em CSV.

Tags: `@VS-N` (caso), `@api`/`@e2e` (camada), `@smoke`/`@regressao` (suíte) e `@bug` (reproduz defeito aberto).

---

## 3. Execução manual e Exploratoria

Executada na Verzel Store v2.3.0. As rodadas roteirizadas são de 07/10/2026 e a exploratória, de 09/10/2026. Cada rodada tem um relatório público no Qase, com os passos, o status e os comentários de cada caso.

| Rodada                                                                                                    | Casos  | Passou | Falhou           |
| --------------------------------------------------------------------------------------------------------- | ------ | ------ | ---------------- |
| [API — prioridade alta](https://app.qase.io/public/report/89003f57fefe2a58f1d55ec8f44b3f8f615471c3)       | 26     | 24     | 2 (VS-22, VS-29) |
| [API — complementares](https://app.qase.io/public/report/3ae4d3ff278ca31273d21d835c8e5d1df862203c)        | 30     | 28     | 2 (VS-35, VS-75) |
| [E2E — prioridade alta](https://app.qase.io/public/report/a4409239f6543a6f75dd4f79a0e0933f2a894bc7)       | 19     | 18     | 1 (VS-65)        |
| [Exploratória](https://app.qase.io/public/report/c95cb215b3b927122a39da7ab732bcf9c406414c)                | 4      | 2      | 2 (VS-78, VS-80) |
| **Total**                                                                                                 | **79** | **72** | **7**            |

O `VS-76` foi criado depois, a partir do bug #1, e é coberto pelo Postman e pela automação. Os exploratórios `VS-77` a `VS-80` foram criados na sequência; `VS-78` e `VS-80` originaram os bugs #3 a #6.

---

## 4. Bugs encontrados

| #                                                                     | Defeito                                                                  | Severidade | Casos               |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------- | ------------------- |
| [#1](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/1) | Frete grátis não é concedido com subtotal exatamente R$ 200,00 (CA06)    | Crítica    | VS-22, VS-65, VS-76 |
| [#2](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/2) | API aceita mais de 5 unidades por produto no carrinho e no pedido (CA10) | Alta       | VS-29, VS-35, VS-75 |
| [#3](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/3) | Espaços internos excedentes no nome não são removidos ao confirmar o pedido | Menor  | VS-78               |
| [#4](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/4) | Nome com símbolos, números e emoji é aceito ao confirmar o pedido        | Menor      | VS-78               |
| [#5](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/5) | Checkout exibe resumo desatualizado e sem aviso após alterar o carrinho sem conexão | Alta | VS-80          |
| [#6](https://github.com/LucasMCFidelis/qa-test-verzel-store/issues/6) | Tentativa de aplicar cupom sem conexão bloqueia o botão sem mensagem de erro | Menor  | VS-80               |

Cada issue traz passos de reprodução, esperado x obtido, impacto, evidências e critérios de reteste. Os cenários automatizados que reproduzem os bugs #1 e #2 **falham de propósito**: os asserts não foram afrouxados. Os bugs #3 a #6 vieram dos testes exploratórios e ainda não têm cenário automatizado.

---

## 5. Como rodar a automação

**Pré-requisito:** Node.js 20+.

### Passo 1 — Clonar repositório
```bash
git clone https://github.com/LucasMCFidelis/qa-test-verzel-store.git
```

### Passo 2 — Acessar projeto e instalar dependências
```bash
cd qa-test-verzel-store
npm install
npx playwright install
```

O `npx playwright install` baixa os navegadores usados nos testes E2E (Chromium, Firefox e WebKit). Se for rodar só o E2E em Chromium, `npx playwright install chromium` basta.

### Passo 3 — Copiar .env.example
#### Bash
```bash
cp .env.example .env
```
#### PowerShell
```powershell
Copy-Item .env.example .env
```

O `.env` tem só `BASE_URL` (padrão: `https://verzel-store.qa-test-verzel-store.workers.dev`).

### Passo 4 — Executar os testes Playwright

| Comando                | O que faz                         |
| ---------------------- | --------------------------------- |
| `npm run test:api`     | Testes de API                     |
| `npm run test:e2e`     | E2E em Chromium                   |
| `npm run test:e2e:all` | E2E em Chromium, Firefox e WebKit |
| `npm run test:smoke`   | Apenas `@smoke` (API + E2E)       |
| `npm run report`       | Abre o relatório HTML             |

Use sempre `npm run …`, que gera os specs a partir dos `.feature` antes de rodar.

### Passo 5 — Executar a collection no Postman

A collection [`verzel-store`](postman/verzel-store.postman_collection.json) tem os casos de API (84 requests, cada um nomeado com o ID `VS-N` do Qase) e usa o environment [`verzel-store-qa`](postman/verzel-store-qa.postman_environment.json). Este passo é independente dos anteriores: precisa só do Postman, não do Node.

1. **Importar:** no Postman, clique em **Import** e selecione os dois arquivos da pasta [`postman/`](postman): `verzel-store.postman_collection.json` e `verzel-store-qa.postman_environment.json`.
2. **Selecionar o environment:** no seletor do canto superior direito, escolha **verzel-store-qa**. Ele define `base_url` como `https://verzel-store.qa-test-verzel-store.workers.dev/api`. Sem ele, as URLs `{{base_url}}/…` não resolvem.
3. **Executar os testes de acordo com a necessidade:** cada request tem testes na aba **Tests**. A aba **Test Results** mostra o que passou e o que falhou.