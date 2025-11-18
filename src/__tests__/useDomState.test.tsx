import { renderHook, waitFor } from '@testing-library/react'
import { useDomState } from '../useDomState'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useDomState', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('extracts single element value', () => {
    document.body.innerHTML = '<input id="test" value="hello" />'

    const manifest = {
      value: {
        selector: '#test',
        extract: (el: Element) => (el as HTMLInputElement).value
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.value).toBe('hello')
  })

  it('extracts multiple elements as array', () => {
    document.body.innerHTML = `
      <div data-item="1"></div>
      <div data-item="2"></div>
      <div data-item="3"></div>
    `

    const manifest = {
      items: {
        selector: '[data-item]',
        extract: (el: Element) => el.getAttribute('data-item')
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.items).toEqual(['1', '2', '3'])
  })

  it('returns null for missing elements', () => {
    const manifest = {
      value: {
        selector: '#nonexistent',
        extract: (el: Element) => el.textContent
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.value).toBeNull()
  })

  it('reacts to DOM mutations', async () => {
    document.body.innerHTML = '<div id="test">initial</div>'

    const manifest = {
      text: {
        selector: '#test',
        extract: (el: Element) => el.textContent
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.text).toBe('initial')

    // Mutate DOM
    const el = document.querySelector('#test')!
    el.textContent = 'updated'

    await waitFor(() => {
      expect(result.current.text).toBe('updated')
    })
  })

  it('handles data attributes', () => {
    document.body.innerHTML = '<button data-filter="active">Filter</button>'

    const manifest = {
      filter: {
        selector: '[data-filter]',
        extract: (el: Element) => el.getAttribute('data-filter')
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.filter).toBe('active')
  })
})
