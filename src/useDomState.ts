import { useEffect, useMemo, useState } from 'react'
import type { Manifest } from './types'

/**
 * Extracts state from the DOM using the provided manifest
 * @param manifest - Configuration object mapping keys to selectors and extractors
 * @returns Object containing extracted values from DOM elements
 */
function extractState(manifest: Manifest): Record<string, unknown> {
  const state: Record<string, unknown> = {}

  for (const key in manifest) {
    const config = manifest[key]
    try {
      const elements = document.querySelectorAll(config.selector)
      if (elements.length === 0) {
        state[key] = null
      } else if (elements.length === 1) {
        state[key] = config.extract(elements[0])
      } else {
        state[key] = Array.from(elements, config.extract)
      }
    } catch (error) {
      console.warn(`Invalid selector "${config.selector}" for key "${key}":`, error)
      state[key] = null
    }
  }

  return state
}

/**
 * React hook that reads state directly from the DOM using selectors and extractors.
 * Automatically updates when the DOM changes.
 *
 * @param manifest - Object mapping state keys to DOM selectors and extraction functions
 * @returns Object with current values extracted from the DOM
 *
 * @example
 * ```tsx
 * const state = useDomState({
 *   username: { selector: '#username', extract: el => el.value },
 *   isLoggedIn: { selector: '[data-user]', extract: el => !!el.dataset.user }
 * })
 * ```
 */
export function useDomState<T extends Manifest>(manifest: T) {
  const [counter, forceUpdate] = useState(0)

  useEffect(() => {
    const observer = new MutationObserver(() => forceUpdate(c => c + 1))

    // Observe only elements that match our manifest selectors for better performance
    const selectors: string[] = []
    for (const key in manifest) {
      selectors.push(manifest[key].selector)
    }
    const uniqueSelectors = [...new Set(selectors)]

    uniqueSelectors.forEach((selector: string) => {
      try {
        const elements = document.querySelectorAll(selector)
        elements.forEach((element: Element) => {
          observer.observe(element, {
            childList: true,
            attributes: true,
            subtree: true
          })
        })
      } catch (error) {
        // Invalid selector - already handled in extractState
      }
    })

    return () => observer.disconnect()
  }, [manifest])

  return useMemo(() => extractState(manifest), [manifest, counter])
}
