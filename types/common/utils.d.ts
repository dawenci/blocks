export const property: <T extends object>(prop: keyof T) => (obj: T) => T[keyof T]
export const forEach: <T>(list: T[], fn: (item: T, index: number, list: T[]) => void) => void
export const map: <T, U>(list: T[], fn: (item: T, index: number, list: T[]) => U) => U[]
export const filter: <T>(list: T[], fn: (item: T, index: number, list: T[]) => boolean) => T[]
export const find: <T>(list: T[], fn: (item: T, index: number, list: T[]) => boolean) => T | undefined
export const findIndex: <T>(list: T[], fn: (item: T, index: number, list: T[]) => boolean) => number
export const includes: <T>(list: T[], item: T) => boolean
export const every: <T>(list: T[], fn: (item: T, index: number, list: T[]) => boolean) => boolean
export const some: <T>(list: T[], fn: (item: T, index: number, list: T[]) => boolean) => boolean
export const propertyEq: (prop: string, value: any) => (obj: object) => boolean
export function findLast<T>(list: T[], fn: (item: T, index: number, list: T[]) => boolean): T | undefined
export function padLeft(ch: string, n: number, str: string): string
export function padRight(ch: string, n: number, str: string): string
export function round(x: number, digits?: number): number
export function camelCase(str: string): string
export function capitalize(str: string): string
export function range(start: number, end: number): number[]
export function isEmpty(obj: any): boolean
export const uniqBy: <T, U>(fn: (item: T) => U, list: T[]) => T[]
export function merge(output: object | Array<any>, to?: object | null, from?: object | null): object | Array<any>
export function flatten(list?: any[]): any[]
