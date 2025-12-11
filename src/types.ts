export type Reader<T = unknown> = (el: Element) => T

// Manifest matches domx API - read can be a shortcut string or custom function
export interface Manifest {
  [key: string]: {
    selector: string
    read: string | Reader
    write?: string | ((el: Element, value: unknown) => void)
    watch?: string
  }
}

// Keep Extractor as alias for backwards compatibility
export type Extractor<T = unknown> = Reader<T>
