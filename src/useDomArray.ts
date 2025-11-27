import { useDomState } from './useDomState'
import type { Extractor } from './types'

/**
 * Extracts an array of values from multiple DOM elements matching the selector.
 *
 * @param selector - CSS selector to match multiple elements
 * @param extract - Function to extract value from each element
 * @returns Array of extracted values
 *
 * @example
 * ```tsx
 * const items = useDomArray('.todo-item', el => el.textContent)
 * const prices = useDomArray('[data-price]', el => parseFloat(el.dataset.price))
 * ```
 */
export function useDomArray<T>(selector: string, extract: Extractor<T>): T[] {
  const state = useDomState({
    items: { selector, extract }
  })

  const items = state.items as T | T[] | null
  if (Array.isArray(items)) return items
  if (items != null) return [items]
  return []
}
