import { useDomState } from './useDomState'
import { apply } from 'domx-dataos'

/**
 * Two-way binding hook for DOM element values.
 * Reads from data-{attribute} first, then falls back to {attribute}.
 * Writes to data-{attribute} using domx apply().
 *
 * @param selector - CSS selector for the target element
 * @param attribute - Attribute name to read/write (defaults to 'value')
 * @returns Tuple of [currentValue, setValueFunction]
 *
 * @example
 * ```tsx
 * const [name, setName] = useDomValue('#name-input')
 * const [count, setCount] = useDomValue('#counter', 'count')
 * ```
 */
export function useDomValue(selector: string, attribute = 'value') {
  const manifest = {
    value: {
      selector,
      read: (el: Element) => el.getAttribute(`data-${attribute}`) ?? el.getAttribute(attribute) ?? '',
      write: `data:${attribute}`
    }
  }

  const state = useDomState(manifest)

  const setValue = (value: string) => {
    apply(manifest, { value })
  }

  return [state.value, setValue] as const
}
