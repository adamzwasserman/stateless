import { renderHook, waitFor, act } from '@testing-library/react'
import { useDomArray } from '../useDomArray'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useDomArray', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('extracts array from multiple elements using data shortcut', () => {
    document.body.innerHTML = `
      <li data-id="1">Item 1</li>
      <li data-id="2">Item 2</li>
      <li data-id="3">Item 3</li>
    `

    const { result } = renderHook(() =>
      useDomArray('li', 'data:id')
    )

    expect(result.current).toEqual(['1', '2', '3'])
  })

  it('extracts array using custom function', () => {
    document.body.innerHTML = `
      <li data-id="1">Item 1</li>
      <li data-id="2">Item 2</li>
    `

    const { result } = renderHook(() =>
      useDomArray('li', el => el.getAttribute('data-id'))
    )

    expect(result.current).toEqual(['1', '2'])
  })

  it('returns empty array for no matches', () => {
    const { result } = renderHook(() =>
      useDomArray('.nonexistent', 'text')
    )

    expect(result.current).toEqual([])
  })

  it('returns single-item array for one match', () => {
    document.body.innerHTML = '<div class="item">Only one</div>'

    const { result } = renderHook(() =>
      useDomArray('.item', 'text')
    )

    expect(result.current).toEqual(['Only one'])
  })

  it('reacts to DOM changes', async () => {
    document.body.innerHTML = '<div class="items"></div>'

    const { result, rerender } = renderHook(() =>
      useDomArray('.item', 'text')
    )

    expect(result.current).toEqual([])

    // Add items
    const container = document.querySelector('.items')!
    const span = document.createElement('span')
    span.className = 'item'
    span.textContent = 'New'

    await act(async () => {
      container.appendChild(span)
    })

    await waitFor(() => {
      rerender()
      expect(result.current).toEqual(['New'])
    })
  })
})
