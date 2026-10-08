import { test as base, createBdd } from 'playwright-bdd'
import type { APIResponse } from '@playwright/test'
import { Item } from '@utils/itens';
import { UserInfo } from './types';

type Contexto = {
  corpo: { itens: Array<Item>; cupom?: string }
  user?: UserInfo
  resposta?: APIResponse
}

export const test = base.extend<{ ctx: Contexto }>({
  ctx: async ({}, use) => {
    await use({ corpo: { itens: [] } })
  },
})

export const { Given, When, Then } = createBdd(test)