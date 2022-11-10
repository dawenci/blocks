/// <reference path="../types/common/zIndex.d.ts" />

let zIndex = 1

export function init(value) {
  zIndex = value
}

export function peek() {
  return zIndex
}

export function next() {
  return ++zIndex
}
