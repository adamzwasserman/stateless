import { useDomState } from './useDomState'
import type { Extractor } from './types'

export function useDomArray<T = any>(selector: string, extract: Extractor<T>) {
  const state = useDomState({
    items: { selector, extract }
  })

  return Array.isArray(state.items) ? state.items : state.items ? [state.items] : []
}
