import { useDomState } from './useDomState'

/**
 * Two-way binding hook for DOM element values.
 * Reads from data-{attribute} first, then falls back to {attribute}.
 * Writes to data-{attribute} to avoid conflicts with native properties.
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
  const state = useDomState({
    value: {
      selector,
      extract: (el: Element) => el.getAttribute(`data-${attribute}`) ?? el.getAttribute(attribute) ?? ''
    }
  })

  const setValue = (value: string) => {
    const el = document.querySelector(selector)
    if (el) el.setAttribute(`data-${attribute}`, value)
  }

  return [state.value, setValue] as const
}
