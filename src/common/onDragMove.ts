type Offset = { x: number; y: number }

type Point = {
  clientX: number
  clientY: number
  pageX: number
  pageY: number
  screenX: number
  screenY: number
}

export type OnEnd = (data: { eventType: string; start: Point; current: Point; offset: Offset }) => void

export type OnMove = (data: {
  eventType: string
  preventDefault: () => boolean
  stopPropagation: () => boolean
  stopImmediatePropagation: () => boolean
  start: Point
  current: Point
  offset: Offset
}) => void

export type OnCancel = (data: { eventType: string; start: Point; current: Point; offset: Offset }) => void

export type OnStart = (data: {
  eventType: string
  $target: HTMLElement
  start: Point
  current: Point
  offset: Offset
  stop: () => boolean
  preventDefault: () => boolean
  stopPropagation: () => boolean
  stopImmediatePropagation: () => boolean
}) => void

type Options = {
  onStart?: OnStart
  onEnd?: OnEnd
  onMove?: OnMove
  onCancel?: OnCancel
}

export function onDragMove($el: HTMLElement, options: Options) {
  let start: Point | null = null
  let current: Point | null = null
  let offset: Offset | null = null
  let shouldStop = false
  let shouldPreventDefault = false
  let shouldStopPropagation = false
  let shouldStopImmediatePropagation = false

  const stop = () => (shouldStop = true)
  const preventDefault = () => (shouldPreventDefault = true)
  const stopPropagation = () => (shouldStopPropagation = true)
  const stopImmediatePropagation = () => (shouldStopImmediatePropagation = true)

  const clear = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onMoveEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onMoveEnd)
    document.removeEventListener('touchcancel', onMoveCancel)
  }

  const onMove = (event: MouseEvent | TouchEvent) => {
    // 鼠标已经松开，结束（例如：鼠标移动到窗口外，松开，移回来）
    if ((event as MouseEvent).buttons === 0) {
      onMoveCancel(event)
      return
    }

    current = getPoint(event)
    offset = getOffset(start!, current)

    if (typeof options.onMove === 'function') {
      options.onMove({
        eventType: event.type,
        preventDefault,
        stopPropagation,
        stopImmediatePropagation,
        start: start!,
        current,
        offset,
      })
      if (shouldPreventDefault) {
        shouldPreventDefault = false
        event.preventDefault()
      }
      if (shouldStopPropagation) {
        shouldStopPropagation = false
        event.stopPropagation()
      }
      if (shouldStopImmediatePropagation) {
        shouldStopImmediatePropagation = false
        event.stopImmediatePropagation()
      }
    }
  }

  const onMoveEnd = (event: any) => {
    current = getPoint(event)
    offset = getOffset(start!, current)

    if (typeof options.onEnd === 'function') {
      options.onEnd({
        eventType: event.type,
        start: start as any,
        current,
        offset,
      })
    }
    clear()
  }

  const onMoveCancel = (event: MouseEvent | TouchEvent) => {
    if (typeof options.onCancel === 'function') {
      options.onCancel({
        eventType: event.type,
        start: start as Point,
        current: current as Point,
        offset: offset as Offset,
      })
    }
    clear()
  }

  const onMoveStart = (event: MouseEvent | TouchEvent) => {
    start = current = getPoint(event)
    offset = getOffset(start, current)

    if (typeof options.onStart === 'function') {
      options.onStart({
        eventType: event.type,
        $target: event.target as HTMLElement,
        start,
        current,
        offset,
        stop,
        preventDefault,
        stopPropagation,
        stopImmediatePropagation,
      })
      if (shouldPreventDefault) {
        shouldPreventDefault = false
        event.preventDefault()
      }
      if (shouldStopPropagation) {
        shouldStopPropagation = false
        event.stopPropagation()
      }
      if (shouldStopImmediatePropagation) {
        shouldStopImmediatePropagation = false
        event.stopImmediatePropagation()
      }
      if (shouldStop) {
        shouldStop = false
        return
      }
    }

    if (event.type === 'touchstart') {
      document.addEventListener('touchmove', onMove, { passive: false })
      document.addEventListener('touchend', onMoveEnd)
      document.addEventListener('touchcancel', onMoveCancel)
    } else {
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onMoveEnd)
    }
  }

  $el.addEventListener('mousedown', onMoveStart as any)
  $el.addEventListener('touchstart', onMoveStart as any)

  return () => {
    clear()
    $el.removeEventListener('mousedown', onMoveStart as any)
    $el.removeEventListener('touchstart', onMoveStart as any)
  }
}

function getPoint(event: MouseEvent | TouchEvent) {
  const obj = (event as TouchEvent).changedTouches?.[0] ?? event
  return {
    clientX: obj.clientX,
    clientY: obj.clientY,
    pageX: obj.pageX,
    pageY: obj.pageY,
    screenX: obj.screenX,
    screenY: obj.screenY,
  }
}

function getOffset(start: Point, current: Point) {
  return {
    x: current.pageX - start.pageX,
    y: current.pageY - start.pageY,
  }
}
