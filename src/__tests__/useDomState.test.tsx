import { renderHook, waitFor } from '@testing-library/react'
import { useDomState } from '../useDomState'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useDomState', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('extracts single element value using read shortcut', () => {
    document.body.innerHTML = '<input id="test" value="hello" />'

    const manifest = {
      value: {
        selector: '#test',
        read: 'value'
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.value).toBe('hello')
  })

  it('extracts single element using custom read function', () => {
    document.body.innerHTML = '<input id="test" value="hello" />'

    const manifest = {
      value: {
        selector: '#test',
        read: (el: Element) => (el as HTMLInputElement).value.toUpperCase()
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.value).toBe('HELLO')
  })

  it('extracts multiple elements as array using data shortcut', () => {
    document.body.innerHTML = `
      <div data-item="1"></div>
      <div data-item="2"></div>
      <div data-item="3"></div>
    `

    const manifest = {
      items: {
        selector: '[data-item]',
        read: 'data:item'
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.items).toEqual(['1', '2', '3'])
  })

  it('returns null for missing elements', () => {
    const manifest = {
      value: {
        selector: '#nonexistent',
        read: 'text'
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
        read: 'text'
      }
    }

    const { result, rerender } = renderHook(() => useDomState(manifest))
    expect(result.current.text).toBe('initial')

    // Mutate DOM - in JSDOM, MutationObserver may need manual triggering
    const el = document.querySelector('#test')!
    el.textContent = 'updated'

    // Force a rerender to pick up the change (domx observe uses requestAnimationFrame)
    await waitFor(() => {
      rerender()
      expect(result.current.text).toBe('updated')
    }, { timeout: 2000 })
  })

  it('handles data attributes using shortcut', () => {
    document.body.innerHTML = '<button data-filter="active">Filter</button>'

    const manifest = {
      filter: {
        selector: '[data-filter]',
        read: 'data:filter'
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.filter).toBe('active')
  })

  it('handles attr shortcut', () => {
    document.body.innerHTML = '<a id="link" href="/home">Home</a>'

    const manifest = {
      href: {
        selector: '#link',
        read: 'attr:href'
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.href).toBe('/home')
  })

  it('handles checkbox checked shortcut', () => {
    document.body.innerHTML = '<input id="cb" type="checkbox" checked />'

    const manifest = {
      isChecked: {
        selector: '#cb',
        read: 'checked'
      }
    }

    const { result } = renderHook(() => useDomState(manifest))
    expect(result.current.isChecked).toBe(true)
  })
})
