export type Extractor<T = any> = (el: Element) => T

export interface Manifest {
  [key: string]: {
    selector: string
    extract: Extractor
  }
}
