import { useDomState } from './useDomState'
import type { Reader } from './types'

/**
 * Extracts a Map from DOM elements with key-value pairs.
 *
 * @param selector - CSS selector to match elements
 * @param keyRead - Shortcut string or function to extract key from each element
 * @param valueRead - Shortcut string or function to extract value from each element
 * @returns Map with keys and values extracted from DOM
 *
 * @example
 * ```tsx
 * const userMap = useDomMap(
 *   '[data-user]',
 *   'data:userId',
 *   'data:userName'
 * )
 * // Or with functions:
 * const customMap = useDomMap(
 *   '[data-user]',
 *   el => el.dataset.userId,
 *   el => el.dataset.userName
 * )
 * ```
 */
export function useDomMap<T>(
  selector: string,
  keyRead: string | Reader<string>,
  valueRead: string | Reader<T>
): Map<string, T> {
  // For Map, we need a custom read function that combines key and value extraction
  const state = useDomState({
    items: {
      selector,
      read: (el: Element) => ({
        key: typeof keyRead === 'function' ? keyRead(el) : extractByShortcut(el, keyRead),
        value: typeof valueRead === 'function' ? valueRead(el) : extractByShortcut(el, valueRead)
      })
    }
  })

  const items = state.items as { key: string; value: T } | { key: string; value: T }[] | null
  const normalizedItems = Array.isArray(items) ? items : items ? [items] : []
  return new Map(normalizedItems.map(item => [item.key, item.value]))
}

// Helper to extract value using domx shortcut syntax
function extractByShortcut(el: Element, shortcut: string): unknown {
  if (shortcut === 'value') return (el as HTMLInputElement).value
  if (shortcut === 'checked') return (el as HTMLInputElement).checked
  if (shortcut === 'text') return el.textContent
  if (shortcut.startsWith('attr:')) return el.getAttribute(shortcut.slice(5))
  if (shortcut.startsWith('data:')) return (el as HTMLElement).dataset[shortcut.slice(5)]
  throw new Error(`Unknown shortcut: ${shortcut}`)
}
