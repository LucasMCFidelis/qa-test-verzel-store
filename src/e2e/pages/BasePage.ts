import type { Locator, Page } from '@playwright/test'

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Elemento que só existe quando esta página terminou de carregar (o assert fica no step). */
  abstract paginaCarregada(): Locator
}
