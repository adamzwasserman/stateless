import { useEffect, useMemo, useReducer } from 'react'
import type { Manifest } from './types'

function extractState(manifest: Manifest): Record<string, any> {
  const state: Record<string, any> = {}

  for (const [key, config] of Object.entries(manifest)) {
    const elements = document.querySelectorAll(config.selector)
    if (elements.length === 0) {
      state[key] = null
    } else if (elements.length === 1) {
      state[key] = config.extract(elements[0])
    } else {
      state[key] = Array.from(elements).map(config.extract)
    }
  }

  return state
}

export function useDomState<T extends Manifest>(manifest: T) {
  const [counter, forceUpdate] = useReducer(x => x + 1, 0)

  useEffect(() => {
    const observer = new MutationObserver(forceUpdate)
    observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
      attributeOldValue: true
    })
    return () => observer.disconnect()
  }, [])

  return useMemo(() => extractState(manifest), [manifest, counter])
}
