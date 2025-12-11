import { useEffect, useMemo, useState } from 'react'
import { collect, observe } from 'domx-dataos'
import type { Manifest } from './types'

/**
 * React hook that reads state directly from the DOM using selectors and read shortcuts.
 * Uses domx under the hood for DOM state collection and observation.
 * Automatically updates when the DOM changes.
 *
 * @param manifest - Object mapping state keys to DOM selectors and read shortcuts/functions
 * @returns Object with current values extracted from the DOM
 *
 * @example
 * ```tsx
 * const state = useDomState({
 *   username: { selector: '#username', read: 'value' },
 *   filter: { selector: '[data-filter]', read: 'data:filter' },
 *   custom: { selector: '.item', read: el => el.dataset.id }
 * })
 * ```
 */
export function useDomState<T extends Manifest>(manifest: T) {
  const [counter, forceUpdate] = useState(0)

  useEffect(() => {
    // Use domx observe() to watch for DOM changes
    const unsubscribe = observe(manifest, () => {
      forceUpdate(c => c + 1)
    })

    return unsubscribe
  }, [manifest])

  // Include counter in dependencies so we re-collect when DOM changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => collect(manifest), [manifest, counter])
}
