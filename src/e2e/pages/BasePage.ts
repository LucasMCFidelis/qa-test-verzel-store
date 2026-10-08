import type { Locator, Page } from '@playwright/test'
import { padraoDaUrl, type Rota } from '../rotas'

export abstract class BasePage {
  protected abstract readonly rota: Rota

  constructor(protected readonly page: Page) {}

  abstract paginaCarregada(): Locator

  urlEsperada(): RegExp {
    return padraoDaUrl(this.rota)
  }
}
