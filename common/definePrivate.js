export function definePrivate(obj, name, initValue) {
  Object.defineProperty(obj, name, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: initValue
  })
}
