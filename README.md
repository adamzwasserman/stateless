# stateless-dataos

[![npm version](https://badge.fury.io/js/stateless-dataos.svg)](https://badge.fury.io/js/stateless-dataos)
[![Build Status](https://github.com/adamzwasserman/stateless/workflows/CI/badge.svg)](https://github.com/adamzwasserman/stateless/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> The React state library that **contains no state**.

```tsx
import { useDomState } from 'stateless-dataos'

const manifest = {
  filters: { selector: '[data-filter]', read: 'data:filter' },
  search:  { selector: '#search',       read: 'value' },
}

function App() {
  const state = useDomState(manifest)  // ← that's it

  return <YourApp state={state} />
}
```

**No `useState`. No Redux. No Zustand. No signals.**
**No state synchronization bugs — ever.**

The DOM **is** the state.
You just read it.

---

This is the official React implementation of **[DATAOS](https://dataos.software)** — the architecture behind **multicardz** (1M+ cards, sub-100ms interactions).

Built on **[domx-dataos](https://domx.software)** — the canonical DATAOS implementation for DOM state collection and observation.

## Features

- **< 1 KB** gzipped (plus domx)
- Full TypeScript
- Works with Next.js, SSR, htmx, everything
- **Mathematically impossible** to have sync bugs
- Read shortcuts: `'value'`, `'checked'`, `'text'`, `'data:name'`, `'attr:name'`

## Complementary to Server State Libraries

**stateless-dataos** complements, rather than competes with, libraries like [TanStack Query](https://tanstack.com/query), [SWR](https://swr.vercel.app/), or [React Query](https://react-query.tanstack.com/):

| Library | Purpose | State Source |
|---------|---------|--------------|
| **stateless-dataos** | DOM/UI state | HTML elements |
| TanStack Query | Server/API state | Database endpoints |

**Use together for complete state management:**

```tsx
function TodoApp() {
  // Server state (TanStack Query)
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  })

  // UI state (stateless-dataos)
  const { filter, search } = useDomState({
    filter: { selector: '[data-filter]', read: 'data:filter' },
    search: { selector: '#search', read: 'value' }
  })

  // Combine both
  const filteredTodos = todos?.filter(todo =>
    todo.text.includes(search) &&
    (!filter || todo.status === filter)
  )
}
```

## Install

```bash
npm install stateless-dataos
```

## Quick Start

```tsx
import { useDomState, useDomValue, useDomArray, useDomMap } from 'stateless-dataos'

// Basic DOM state reading with shortcuts
const manifest = {
  username: { selector: '#username', read: 'value' },
  isLoggedIn: { selector: '[data-user]', read: el => !!el.dataset.user }
}
const state = useDomState(manifest)

// Two-way binding helper
const [value, setValue] = useDomValue('#input', 'value')

// Array extraction with shortcuts
const items = useDomArray('[data-item]', 'text')

// Map extraction with shortcuts
const map = useDomMap('[data-entry]', 'data:key', 'data:value')
```

### Read Shortcuts

stateless uses [domx-dataos](https://domx.software) read shortcuts:

| Shortcut | What it reads |
|----------|---------------|
| `'value'` | `el.value` (form inputs) |
| `'checked'` | `el.checked` (checkboxes) |
| `'text'` | `el.textContent` |
| `'data:name'` | `el.dataset.name` |
| `'attr:name'` | `el.getAttribute('name')` |
| `(el) => ...` | Custom function |

## API Reference

### `useDomState<T>(manifest: T): ExtractedState<T>`

Reads state directly from the DOM using a manifest of selectors and read shortcuts.

**Parameters:**

- `manifest`: Object mapping keys to `{ selector: string, read: string | (el: Element) => any }`

**Returns:** Object with extracted values. Single elements return their value, multiple elements return arrays, missing elements return `null`.

### `useDomValue(selector: string, attribute?: string): [string, (value: string) => void]`

Two-way binding helper for form inputs.

**Parameters:**

- `selector`: CSS selector for the element
- `attribute`: Attribute to read/write (defaults to 'value')

**Returns:** Tuple of [currentValue, setValueFunction]

### `useDomArray<T>(selector: string, read: string | Reader<T>): T[]`

Extracts an array of values from multiple DOM elements.

### `useDomMap<T>(selector: string, keyRead: string | Reader<string>, valueRead: string | Reader<T>): Map<string, T>`

Extracts a Map from DOM elements with key-value pairs.

## Handling Browser Refresh

Since the DOM is rebuilt on page refresh, UI state is lost. Use the **Cache-and-Replay Pattern**:

```tsx
// Before API calls, cache state to localStorage
async function fetchData(filters) {
  localStorage.setItem('lastFilters', JSON.stringify(filters))
  // ... fetch
}

// On page load, restore and replay
function initialize() {
  const cached = localStorage.getItem('lastFilters')
  if (cached) {
    const filters = JSON.parse(cached)
    restoreDomState(filters)  // Move DOM elements to cached positions
    fetchData(filters)        // Replay the API call
  }
}
```

This doesn't violate DATAOS principles—we persist state *across* sessions, not *during* them. On restore, we immediately re-derive from the corrected DOM.

## Related Projects

- **[domx-dataos](https://domx.software)** — The canonical DATAOS implementation. stateless uses domx-dataos internally.
- **[DATAOS](https://dataos.software)** — The architecture and book behind this approach.
- **[multicardz](https://multicardz.software)** — Spatial data platform built with DATAOS.

## Website

[stateless.software](https://stateless.software)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## The truth

Every other React state library is **lying to you**.
They all create a second copy of state in JavaScript that must be kept in sync with the DOM.

**stateless-dataos** refuses to lie.

There is no second copy.
There is no sync.
There is only **the DOM**.

You have been writing DATAOS apps all along — you just didn't know it yet.

**stateless-dataos** makes it official.

---

Made by [@adamzwasserman](https://twitter.com/adamzwasserman)
Powered by **[DATAOS](https://dataos.software)** and **[domx-dataos](https://domx.software)**
