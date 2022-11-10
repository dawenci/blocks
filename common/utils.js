/// <reference path="../types/common/utils.d.ts" />

export const property = (prop) => obj => obj[prop]

export const forEach = (list, fn) => Array.prototype.forEach.call(list, fn)
export const map = (list, fn) => Array.prototype.map.call(list, fn)
export const filter = (list, fn) => Array.prototype.filter.call(list, fn)
export const find = (list, fn) => Array.prototype.find.call(list, fn)
export const findIndex = (list, fn) => Array.prototype.findIndex.call(list, fn)
export const includes = (list, fn) => Array.prototype.includes.call(list, fn)
export const every = (list, fn) => Array.prototype.every.call(list, fn)
export const some = (list, fn) => Array.prototype.some.call(list, fn)
export const propertyEq = (prop, value) => obj => obj[prop] === value

export function findLast(list, fn) {
  let len = list?.length
  if (!len) return
  while (len--) {
    if (fn(list[len], len, list)) return list[len]
  }
}

function pad(ch, n, str, isRight) {
  str = String(str)
  let count = n - str.length
  let pad = ''
  while ((count--) > 0) {
    pad += ch[0]
  }
  str = isRight ? str + pad : pad + str
  return str
}

export function padLeft(ch, n, str) {
  return pad(ch, n, str, false)
}

export function padRight(ch, n, str) {
  return pad(ch, n, str, true)
}

export function round(x, digits = 0) {
  const sign = x < 0 ? -1 : 1
  if (sign < 0) x = -x
  digits = Math.pow(10, digits)
  x *= digits
  x = Math.round(x)
  return sign * x / digits
}

export function camelCase(str) {
  str = ('' + str).trim()
  if (!str.length) return str
  return str
    .replace(/[-_]+([\S])/g, (_, char) => char.toUpperCase())
    .replace(/^([A-Z])/, (_, char) => char.toLowerCase())
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()
}

export function range(start, end) {
  const list = []
  for (let i = start; i <= end; i += 1) {
    list.push(i)
  }
  return list
}

export function isEmpty(obj) {
  if (!obj) return true
  for (let p in obj) {
    return false
  }
  return true
}

export const uniqBy = (() => {
  const has = Object.prototype.hasOwnProperty
  class _SameValueUniqCache {
    constructor(initList) {
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
  
    has(item) {
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
  
    add(item) {
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
  
    remove(item) {
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


const has = Object.prototype.hasOwnProperty
export function merge(output, to, from) {
  const isOutputArray = Array.isArray(output)
  if (to == null && from == null) return output
  to = to == null ? isOutputArray ? [] : {} : Object(to)
  from = from == null ? isOutputArray ? [] : {} : Object(from)

  // 处理 to 的数据
  for (let prop in to) {
    const toVal = to[prop]

    // 如果是 from 中没有该属性，使用 to 的值
    if (!(prop in from)) {
      output[prop] = toVal
      continue
    }

    const fromVal = from[prop]

    // 如果 from 中的属性值是原始类型（ 包括 undefined ），则直接覆盖
    if ((typeof fromVal !== 'object' && typeof fromVal !== 'function') || fromVal === null) {
      output[prop] = fromVal
      continue
    }

    // 是否使用数组，取决于第一个对象的值是否为数组
    const propOutput = Array.isArray(toVal) ? [] : {}

    // 对象合并
    output[prop] = _merge(propOutput, toVal, fromVal)
  }

  // 处理 from 的数据
  for (let prop in from) {
    // 上一轮遍历 from 时，已经合并的值，直接跳过
    if (has.call(output, prop)) continue
    output[prop] = from[prop]
  }
 
  return output
}


export function flatten(list = []) {
  const result = []
  const size = list.length
  for (let index = 0; index < size; index += 1) {
    const item = list[index]
    if (!Array.isArray(item)) result.push(item)
    else result.push.apply(result, item)
  }
  return result
}
