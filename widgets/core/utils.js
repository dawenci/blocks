export const property = (prop) => obj => obj[prop]

export const forEach = (list, fn) => Array.prototype.forEach.call(list, fn)
export const map = (list, fn) => Array.prototype.map.call(list, fn)
export const filter = (list, fn) => Array.prototype.filter.call(list, fn)
export const find = (list, fn) => Array.prototype.find.call(list, fn)
export const includes = (list, fn) => Array.prototype.includes.call(list, fn)
export const every = (list, fn) => Array.prototype.every.call(list, fn)
export const some = (list, fn) => Array.prototype.some.call(list, fn)

export const propertyEq = (prop, value) => obj => obj[prop] === value
