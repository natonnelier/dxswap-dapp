import { createAction } from '@reduxjs/toolkit'

export const selectCurrency = createAction<{ currencyId: string }>('bridge/selectCurrency')
export const switchCurrencies = createAction<void>('bridge/switchCurrencies')
export const typeInput = createAction<{ typedValue: string }>('bridge/typeInput')
export const replaceBridgeState = createAction<{
  typedValue: string
  currencyId?: string
  recipient: string | null
}>('bridge/replaceBridgeState')
export const setRecipient = createAction<{ recipient: string | null }>('bridge/setRecipient')