/**
 * @export
 * @param {string} attr
 * @returns {(element: Element) => string | null}
 */
export function strGetter(attr: string): (element: Element) => string | null

/**
 *
 * @export
 * @param {string} attr
 * @returns {(element: Element, value: any) => void}
 */
export function strSetter(attr: string): (element: Element, value: any) => void

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element) => boolean}
 */
export function boolGetter(attr: string): (element: Element) => boolean

/**
 * @export
 * @param {string} attr
 * @returns {(element: Element, value: any) => void}
 */
export function boolSetter(attr: string): (element: Element, value: any) => void

/**
 * @export
 * @param {string} attr
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function numGetter(attr: string, defaultValue?: number | null): (element: Element) => number

/**
 * @export
 * @param {string} attr
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function numSetter(attr: string, defaultValue?: number | null): (element: Element, value: any) => void

/**
 * @export
 * @param {string} attr
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function intGetter(attr: string, defaultValue?: number | null): (element: Element) => number

/**
 * @export
 * @param {string} attr
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function intSetter(attr: string, defaultValue?: number | null): (element: Element, value: any) => void

/**
 * @export
 * @param {string} attr
 * @param {any[]} values
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => any}
 */
export function enumGetter<T = any>(attr: string, values: T[], defaultValue?: T): (element: Element) => T

/**
 * @export
 * @param {string} attr
 * @param {any[]} values
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function enumSetter<T = any>(attr: string, values: T[], defaultValue?: T): (element: Element, value: any) => void

/**
 * @export
 * @param {string} attr
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function numRangeGetter(attr: string, min: number, max: number, defaultValue?: number | null): (element: Element) => number

/**
 * @export
 * @param {string} attr
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function numRangeSetter(attr: string, min: number, max: number, defaultValue?: number | null): (element: Element, value: any) => void

/**
 * @export
 * @param {string} attr
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element) => number}
 */
export function intRangeGetter(attr: string, min: number, max: number, defaultValue?: number | null): (element: Element) => number

/**
 * @export
 * @param {string} attr
 * @param {number} min
 * @param {number} max
 * @param {number | null} [defaultValue]
 * @returns {(element: Element, value: any) => void}
 */
export function intRangeSetter(attr: string, min: number, max: number, defaultValue?: number | null): (element: Element, value: any) => void
