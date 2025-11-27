export type Extractor<T = unknown> = (el: Element) => T

export interface Manifest {
  [key: string]: {
    selector: string
    extract: Extractor
  }
}
