// https://github.com/basilfx/normalize-wheel/blob/master/src/normalizeWheel.js
// Reasonable defaults
const PIXEL_STEP = 10
const LINE_HEIGHT = 40
const PAGE_HEIGHT = 800

function normalizeWheel(event: WheelEvent) {
  // spinX
  let sX = 0
  // spinY
  let sY = 0
  // pixelX
  let pX = 0
  // pixelY
  let pY = 0

  // Legacy
  if ('detail' in event) {
    sY = event.detail
  }
  if ('wheelDelta' in event) {
    sY = -(event as any).wheelDelta / 120
  }
  if ('wheelDeltaY' in event) {
    sY = -(event as any).wheelDeltaY / 120
  }
  if ('wheelDeltaX' in event) {
    sX = -(event as any).wheelDeltaX / 120
  }

  // side scrolling on FF with DOMMouseScroll
  if (
    'axis' in event &&
    (event as any).axis === (event as any).HORIZONTAL_AXIS
  ) {
    sX = sY
    sY = 0
  }

  pX = sX * PIXEL_STEP
  pY = sY * PIXEL_STEP

  if ('deltaY' in event) {
    pY = event.deltaY
  }
  if ('deltaX' in event) {
    pX = event.deltaX
  }

  if ((pX || pY) && event.deltaMode) {
    // delta in LINE units
    if (event.deltaMode === 1) {
      pX *= LINE_HEIGHT
      pY *= LINE_HEIGHT
    }
    // delta in PAGE units
    else {
      pX *= PAGE_HEIGHT
      pY *= PAGE_HEIGHT
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) {
    sX = pX < 1 ? -1 : 1
  }
  if (pY && !sY) {
    sY = pY < 1 ? -1 : 1
  }

  return {
    spinX: sX,
    spinY: sY,
    pixelX: pX,
    pixelY: pY,
  }
}

type Data = { spinX: number; spinY: number; pixelX: number; pixelY: number }

/**
 * 监听滚轮事件
 *
 * @export
 * @param {Element} el 监听滚轮事件的元素
 * @param {(event: WheelEvent, data: {spinX: number; spinY: number, pixelX: number, pixelY: number}) => void} handler
 */
export function onWheel(
  el: Element,
  handler: (event: WheelEvent, data: Data) => void
) {
  const isFirefox =
    typeof navigator !== 'undefined' &&
    navigator.userAgent.toLowerCase().indexOf('firefox') > -1
  const eventType = isFirefox ? 'DOMMouseScroll' : 'mousewheel'

  el.addEventListener(eventType, function (this: any, event: any) {
    const normalized = normalizeWheel(event)
    if (typeof handler === 'function') {
      handler.apply(this, [event, normalized])
    }
  })
}
