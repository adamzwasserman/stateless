import { renderHook } from '@testing-library/react'
import { useDomMap } from '../useDomMap'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useDomMap', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('creates Map from elements using shortcuts', () => {
    document.body.innerHTML = `
      <div data-key="a" data-value="1"></div>
      <div data-key="b" data-value="2"></div>
      <div data-key="c" data-value="3"></div>
    `

    const { result } = renderHook(() =>
      useDomMap('[data-key]', 'data:key', 'data:value')
    )

    expect(result.current.get('a')).toBe('1')
    expect(result.current.get('b')).toBe('2')
    expect(result.current.get('c')).toBe('3')
    expect(result.current.size).toBe(3)
  })

  it('creates Map using custom functions', () => {
    document.body.innerHTML = `
      <div data-key="a" data-value="1"></div>
      <div data-key="b" data-value="2"></div>
    `

    const { result } = renderHook(() =>
      useDomMap(
        '[data-key]',
        el => el.getAttribute('data-key')!,
        el => el.getAttribute('data-value')!
      )
    )

    expect(result.current.get('a')).toBe('1')
    expect(result.current.get('b')).toBe('2')
    expect(result.current.size).toBe(2)
  })

  it('returns empty Map for no matches', () => {
    const { result } = renderHook(() =>
      useDomMap('.nonexistent', 'data:key', 'text')
    )

    expect(result.current.size).toBe(0)
  })

  it('extracts complex values with custom function', () => {
    document.body.innerHTML = `
      <article data-id="post-1">
        <h2>Title 1</h2>
        <p>Content 1</p>
      </article>
      <article data-id="post-2">
        <h2>Title 2</h2>
        <p>Content 2</p>
      </article>
    `

    const { result } = renderHook(() =>
      useDomMap(
        'article',
        'data:id',
        el => ({
          title: el.querySelector('h2')?.textContent,
          content: el.querySelector('p')?.textContent
        })
      )
    )

    expect(result.current.get('post-1')).toEqual({
      title: 'Title 1',
      content: 'Content 1'
    })
    expect(result.current.get('post-2')).toEqual({
      title: 'Title 2',
      content: 'Content 2'
    })
  })
})
