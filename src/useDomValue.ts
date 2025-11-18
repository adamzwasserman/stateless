import { useDomState } from './useDomState'

export function useDomValue(selector: string, attribute = 'value') {
  const state = useDomState({
    value: {
      selector,
      extract: el => el.getAttribute(`data-${attribute}`) ?? el.getAttribute(attribute) ?? ''
    }
  })

  const setValue = (value: string) => {
    const el = document.querySelector(selector)
    if (el) el.setAttribute(`data-${attribute}`, value)
  }

  return [state.value, setValue] as const
}
