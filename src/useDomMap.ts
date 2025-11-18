import { useDomState } from './useDomState'
import type { Extractor } from './types'

export function useDomMap<T = any>(selector: string, keyExtract: Extractor<string>, valueExtract: Extractor<T>) {
  const state = useDomState({
    items: { selector, extract: el => ({ key: keyExtract(el), value: valueExtract(el) }) }
  })

  const items = Array.isArray(state.items) ? state.items : state.items ? [state.items] : []
  return new Map(items.map(item => [item.key, item.value]))
}
