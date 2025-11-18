import { renderHook, waitFor } from '@testing-library/react'
import { useDomValue } from '../useDomValue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useDomValue', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('reads value from data attribute', () => {
    document.body.innerHTML = '<input id="test" data-value="hello" />'

    const { result } = renderHook(() => useDomValue('#test'))
    expect(result.current[0]).toBe('hello')
  })

  it('falls back to value attribute', () => {
    document.body.innerHTML = '<input id="test" value="fallback" />'

    const { result } = renderHook(() => useDomValue('#test'))
    expect(result.current[0]).toBe('fallback')
  })

  it('sets value via data attribute', async () => {
    document.body.innerHTML = '<input id="test" />'

    const { result } = renderHook(() => useDomValue('#test'))
    const [, setValue] = result.current

    setValue('new value')

    await waitFor(() => {
      const el = document.querySelector('#test')!
      expect(el.getAttribute('data-value')).toBe('new value')
    })
  })

  it('supports custom attribute names', () => {
    document.body.innerHTML = '<div id="test" data-status="active" />'

    const { result } = renderHook(() => useDomValue('#test', 'status'))
    expect(result.current[0]).toBe('active')
  })
})
