# stateless

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

## Install

```bash
npm install stateless
```

## Website

https://stateless.software

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
Powered by **DATAOS**[statless.software]
