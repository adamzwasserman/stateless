# stateless

[![npm version](https://badge.fury.io/js/stateless.svg)](https://badge.fury.io/js/stateless)
[![Build Status](https://github.com/adamzwasserman/stateless/workflows/CI/badge.svg)](https://github.com/adamzwasserman/stateless/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> The React state library that **contains no state**.

```tsx
import { useDomState } from 'stateless'

const manifest = {
  filters: { selector: '[data-filter]', extract: el => el.dataset.filter },
  search:  { selector: '#search',       extract: el => el.value },
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

This is the official React implementation of **DATAOS** — the architecture behind **multicardz** (1M+ cards, sub-100ms interactions).

## Features

- **< 1 KB** gzipped
- **Zero dependencies**
- Full TypeScript
- Works with Next.js, SSR, htmx, everything
- **Mathematically impossible** to have sync bugs

## Complementary to Server State Libraries

**stateless** complements, rather than competes with, libraries like [TanStack Query](https://tanstack.com/query), [SWR](https://swr.vercel.app/), or [React Query](https://react-query.tanstack.com/):

| Library | Purpose | State Source |
|---------|---------|--------------|
| **stateless** | DOM/UI state | HTML elements |
| TanStack Query | Server/API state | Database endpoints |

**Use together for complete state management:**

```tsx
function TodoApp() {
  // Server state (TanStack Query)
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos
  })

  // UI state (stateless)
  const { filter, search } = useDomState({
    filter: { selector: '[data-filter]', extract: el => el.dataset.filter },
    search: { selector: '#search', extract: el => el.value }
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
npm install stateless
```

## Quick Start

```tsx
import { useDomState, useDomValue, useDomArray, useDomMap } from 'stateless'

// Basic DOM state reading
const manifest = {
  username: { selector: '#username', extract: el => el.value },
  isLoggedIn: { selector: '[data-user]', extract: el => !!el.dataset.user }
}
const state = useDomState(manifest)

// Two-way binding helper
const [value, setValue] = useDomValue('#input', 'value')

// Array extraction
const items = useDomArray('[data-item]', el => el.textContent)

// Map extraction
const map = useDomMap('[data-entry]',
  el => el.dataset.key,
  el => el.dataset.value
)
```

## API Reference

### `useDomState<T>(manifest: T): ExtractedState<T>`

Reads state directly from the DOM using a manifest of selectors and extractors.

**Parameters:**

- `manifest`: Object mapping keys to `{ selector: string, extract: (el: Element) => any }`

**Returns:** Object with extracted values. Single elements return their value, multiple elements return arrays, missing elements return `null`.

### `useDomValue(selector: string, attribute?: string): [string, (value: string) => void]`

Two-way binding helper for form inputs.

**Parameters:**

- `selector`: CSS selector for the element
- `attribute`: Attribute to read/write (defaults to 'value')

**Returns:** Tuple of [currentValue, setValueFunction]

### `useDomArray<T>(selector: string, extract: Extractor<T>): T[]`

Extracts an array of values from multiple DOM elements.

### `useDomMap<T>(selector: string, keyExtract: Extractor<string>, valueExtract: Extractor<T>): Map<string, T>`

Extracts a Map from DOM elements with key-value pairs.

## Website

[stateless.software](https://stateless.software)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## The truth

Every other React state library is **lying to you**.
They all create a second copy of state in JavaScript that must be kept in sync with the DOM.

**stateless** refuses to lie.

There is no second copy.
There is no sync.
There is only **the DOM**.

You have been writing DATAOS apps all along — you just didn't know it yet.

**stateless** makes it official.

---

Made by [@adamzwasserman](https://twitter.com/adamzwasserman)
Powered by **[DATAOS](stateless.software)**
