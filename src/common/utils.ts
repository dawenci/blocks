const has = Object.prototype.hasOwnProperty

export const property = (prop: string) => (obj: object) => (obj as any)[prop]

export const forEach = <T>(list: ArrayLike<T>, fn: (item: T, index: number, list: ArrayLike<T>) => void): void =>
  Array.prototype.forEach.call(list, fn)

export function map<T, R>(list: ArrayLike<T>, fn: (item: T, index: number, list: ArrayLike<T>) => R): R[] {
  const results = Array.prototype.map.call(list, fn) as R[]
  return results
}

export const filter = <T>(
  list: ArrayLike<T>,
  fn: (item: T, index: number, list: ArrayLike<T>) => boolean
): ArrayLike<T> => Array.prototype.filter.call(list, fn)

export const find = <T>(
  list: ArrayLike<T>,
  fn: (item: T, index: number, list: ArrayLike<T>) => boolean
): T | undefined => Array.prototype.find.call(list, fn)

export const findIndex = <T>(list: ArrayLike<T>, fn: (item: T, index: number, list: ArrayLike<T>) => boolean): number =>
  Array.prototype.findIndex.call(list, fn)

export const includes = <T>(list: ArrayLike<T>, item: T): boolean => Array.prototype.includes.call(list, item)

export const every = <T>(list: ArrayLike<T>, fn: (item: T, index: number, list: ArrayLike<T>) => boolean): boolean =>
  Array.prototype.every.call(list, fn)

export const some = <T>(list: ArrayLike<T>, fn: (item: T, index: number, list: ArrayLike<T>) => boolean): boolean =>
  Array.prototype.some.call(list, fn)

export const propertyEq =
  (prop: string, value: any) =>
  (obj: object): boolean =>
    (obj as any)[prop] === value

export function findLast<T>(
  list: ArrayLike<T>,
  fn: (item: T, index: number, list: ArrayLike<T>) => boolean
): T | undefined {
  let len = list?.length
  if (!len) return
  while (len--) {
    if (fn(list[len], len, list)) return list[len]
  }
}

function pad(ch: string, n: number, str: string, isRight: boolean): string {
  str = String(str)
  let count = n - str.length
  let pad = ''
  while (count-- > 0) {
    pad += ch[0]
  }
  str = isRight ? str + pad : pad + str
  return str
}

export function padLeft(ch: string, n: number, str: string): string {
  return pad(ch, n, str, false)
}

export function padRight(ch: string, n: number, str: string): string {
  return pad(ch, n, str, true)
}

export function round(x: number, digits = 0): number {
  const sign = x < 0 ? -1 : 1
  if (sign < 0) x = -x
  digits = Math.pow(10, digits)
  x *= digits
  x = Math.round(x)
  return (sign * x) / digits
}

// export function camelCase(str: string): string {
//   str = ('' + str).trim()
//   if (!str.length) return str
//   return str
//     .replace(/[-_]+([\S])/g, (_, char) => char.toUpperCase())
//     .replace(/^([A-Z])/, (_, char) => char.toLowerCase())
// }
export function camelCase(str: string): string {
  str = ('' + str).trim()
  if (!str.length) return str
  return (
    str
      // 先转换连续的大写，避免去空格分割线之后，错误地将分布在空格横线两侧的大写字符转换掉
      .replace(/([A-Z])([A-Z]+)/g, (_, c1, c2) => c1 + c2.toLowerCase())
      // 问号在括号内，分组里如果不是小写字母，char 会捕获到空字符串，而不用担心是 undefined
      .replace(/[-_\s\.]+([a-z]?)/g, (_, char) => char && char.toUpperCase())
      .replace(/^([A-Z])/, (_, char) => char.toLowerCase())
  )
}

export function kebabCase(str: string): string {
  return str.replace(/[A-Z]/g, ch => '-' + ch.toLowerCase()).replace(/[-_\s]{2,}/g, '-')
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
}

export function range(start: number, end: number): number[] {
  const list = []
  for (let i = start; i <= end; i += 1) {
    list.push(i)
  }
  return list
}

export function isEmpty(obj: object): boolean {
  if (!obj) return true
  for (const p in obj) {
    return false
  }
  return true
}

export function uniq<T>(list: T[]): T[] {
  return [...new Set(list)]
}

export const uniqBy: <T>(fn: (item: T) => any, list: ArrayLike<T>) => T[] = (() => {
  const has = Object.prototype.hasOwnProperty
  class _SameValueUniqCache {
    _strings: Record<string, string>
    _primitive: Record<string, any>
    _set: Set<any>

    constructor(initList?: any[]) {
      this._strings = Object.create(null)
      this._primitive = Object.create(null)
      this._set = new Set()
      if (initList && initList.length) {
        const len = initList.length
        for (let index = 0; index < len; index += 1) {
          this.add(initList[index])
        }
      }
    }

    has(item: any) {
      const type = typeof item
      if (type === 'string') {
        return !!has.call(this._strings, item)
      }
      // -0
      if (type === 'number' && 1 / item === -Infinity) {
        return has.call(this._primitive, '-0')
      }
      if (type === 'number' || item == null || type === 'symbol') {
        return !!has.call(this._primitive, item)
      }
      // 其他对象
      return this._set.has(item)
    }

    add(item: any) {
      const type = typeof item
      if (type === 'string') {
        this._strings[item] = item
        return
      }
      // -0
      if (type === 'number' && 1 / item === -Infinity) {
        this._primitive['-0'] = -0
        return
      }
      if (type === 'number' || item == null || type === 'symbol') {
        this._primitive[item] = item
        return
      }
      // 其他对象
      this._set.add(item)
    }

    remove(item: any) {
      const type = typeof item
      if (type === 'string') {
        delete this._strings[item]
        return
      }
      // -0
      if (type === 'number' && 1 / item === -Infinity) {
        delete this._primitive['-0']
        return
      }
      if (type === 'number' || item == null || type === 'symbol') {
        delete this._primitive[item]
        return
      }
      // 其他对象
      this._set.delete(item)
    }
  }

  return function uniqBy(fn, list) {
    if (!list || !list.length) list = []
    const result = []
    const size = list.length >>> 0

    const cache = new _SameValueUniqCache()
    for (let index = 0; index < size; index += 1) {
      const item = list[index]
      const value = fn(item)
      if (cache.has(value)) continue
      result.push(item)
      cache.add(value)
    }

    return result
  }
})()

export function merge(
  output: Record<string, any> | Array<any>,
  to: Record<string, any> | Array<any>,
  from?: Record<string, any> | Array<any>
) {
  const isOutputArray = Array.isArray(output)
  if (to == null && from == null) return output
  to = to == null ? (isOutputArray ? [] : {}) : Object(to)
  from = from == null ? (isOutputArray ? [] : {}) : Object(from)

  // 处理 to 的数据
  for (const prop in to) {
    const toVal = (to as any)[prop]

    // 如果是 from 中没有该属性，使用 to 的值
    if (!(prop in (from as any))) {
      ;(output as any)[prop] = toVal
      continue
    }

    const fromVal = (from as any)[prop]

    // 如果 from 中的属性值是原始类型（ 包括 undefined ），则直接覆盖
    if ((typeof fromVal !== 'object' && typeof fromVal !== 'function') || fromVal === null) {
      ;(output as any)[prop] = fromVal
      continue
    }

    // 是否使用数组，取决于第一个对象的值是否为数组
    const propOutput = Array.isArray(toVal) ? [] : {}

    // 对象合并
    ;(output as any)[prop] = merge(propOutput, toVal, fromVal)
  }

  // 处理 from 的数据
  for (const prop in from) {
    // 上一轮遍历 from 时，已经合并的值，直接跳过
    if (has.call(output, prop)) continue
    ;(output as any)[prop] = (from as any)[prop]
  }

  return output
}

type Nested<T> = Array<T | Nested<T>>

export function flatten<T>(list: Nested<T> = []) {
  const result: T[] = []
  const size = list.length
  for (let index = 0; index < size; index += 1) {
    const item = list[index]
    if (!Array.isArray(item)) {
      result.push(item)
    } else {
      const flattenItems = flatten(item)
      result.push(...flattenItems)
    }
  }
  return result
}
