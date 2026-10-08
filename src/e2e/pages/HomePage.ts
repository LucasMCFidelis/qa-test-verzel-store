import type { Page } from '@playwright/test'

export class HomePage {
  constructor(private readonly page: Page) {}

  async abrir() {
    await this.page.goto('/')
  }
}