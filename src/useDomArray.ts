import { useDomState } from './useDomState'
import type { Reader } from './types'

/**
 * Extracts an array of values from multiple DOM elements matching the selector.
 *
 * @param selector - CSS selector to match multiple elements
 * @param read - Shortcut string or function to extract value from each element
 * @returns Array of extracted values
 *
 * @example
 * ```tsx
 * const ids = useDomArray('.todo-item', 'data:id')
 * const texts = useDomArray('.todo-item', 'text')
 * const custom = useDomArray('[data-price]', el => parseFloat(el.dataset.price))
 * ```
 */
export function useDomArray<T>(selector: string, read: string | Reader<T>): T[] {
  const state = useDomState({
    items: { selector, read }
  })

  const items = state.items as T | T[] | null
  if (Array.isArray(items)) return items
  if (items != null) return [items]
  return []
}
