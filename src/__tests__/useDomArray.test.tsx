import { renderHook, waitFor } from '@testing-library/react'
import { useDomArray } from '../useDomArray'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useDomArray', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('extracts array from multiple elements', () => {
    document.body.innerHTML = `
      <li data-id="1">Item 1</li>
      <li data-id="2">Item 2</li>
      <li data-id="3">Item 3</li>
    `

    const { result } = renderHook(() =>
      useDomArray('li', el => el.getAttribute('data-id'))
    )

    expect(result.current).toEqual(['1', '2', '3'])
  })

  it('returns empty array for no matches', () => {
    const { result } = renderHook(() =>
      useDomArray('.nonexistent', el => el.textContent)
    )

    expect(result.current).toEqual([])
  })

  it('returns single-item array for one match', () => {
    document.body.innerHTML = '<div class="item">Only one</div>'

    const { result } = renderHook(() =>
      useDomArray('.item', el => el.textContent)
    )

    expect(result.current).toEqual(['Only one'])
  })

  it('reacts to DOM changes', async () => {
    document.body.innerHTML = '<div class="items"></div>'

    const { result } = renderHook(() =>
      useDomArray('.item', el => el.textContent)
    )

    expect(result.current).toEqual([])

    // Add items
    const container = document.querySelector('.items')!
    container.innerHTML = '<span class="item">New</span>'

    await waitFor(() => {
      expect(result.current).toEqual(['New'])
    })
  })
})
