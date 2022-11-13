export function getBodyScrollBarWidth(): number {
  const $outer = document.createElement('div')
  const $inner = $outer.cloneNode() as HTMLDivElement
  $outer.style.cssText =
    'visibility: hidden;overflow:scroll;position: absolute;top: 0;left: 0;width: 100px;'
  $inner.style.cssText = 'width: 100%;'
  $outer.appendChild($inner)
  document.body.appendChild($outer)
  const value = $outer.offsetWidth - $inner.offsetWidth
  document.body.removeChild($outer)
  return value
}
