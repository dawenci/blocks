/// <reference path="../types/common/getBodyScrollBarWidth.d.ts" />

export function getBodyScrollBarWidth() {
  const $outer = document.createElement('div')
  const $inner = $outer.cloneNode()
  $outer.style.cssText = 'visibility: hidden;overflow:scroll;position: absolute;top: 0;left: 0;width: 100px;'
  $inner.style.cssText = 'width: 100%;'
  $outer.appendChild($inner)
  document.body.appendChild($outer)
  return $outer.offsetWidth - $inner.offsetWidth
}
