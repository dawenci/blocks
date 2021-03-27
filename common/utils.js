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
