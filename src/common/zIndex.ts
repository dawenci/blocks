let zIndex = 1

export function init(value: number): void {
  zIndex = value
}

export function peek(): number {
  return zIndex
}

export function next(): number {
  return ++zIndex
}
