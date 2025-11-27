import { useDomState } from './useDomState'
import type { Extractor } from './types'

/**
 * Extracts a Map from DOM elements with key-value pairs.
 *
 * @param selector - CSS selector to match elements
 * @param keyExtract - Function to extract key from each element
 * @param valueExtract - Function to extract value from each element
 * @returns Map with keys and values extracted from DOM
 *
 * @example
 * ```tsx
 * const userMap = useDomMap(
 *   '[data-user]',
 *   el => el.dataset.userId,
 *   el => el.dataset.userName
 * )
 * ```
 */
export function useDomMap<T>(selector: string, keyExtract: Extractor<string>, valueExtract: Extractor<T>): Map<string, T> {
  const state = useDomState({
    items: { selector, extract: (el: Element) => ({ key: keyExtract(el), value: valueExtract(el) }) }
  })

  const items = state.items as { key: string; value: T } | { key: string; value: T }[] | null
  const normalizedItems = Array.isArray(items) ? items : items ? [items] : []
  return new Map(normalizedItems.map(item => [item.key, item.value]))
}
