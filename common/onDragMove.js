
export function onDragMove($el, options) {
  let start = null
  let current = null
  let offset = null
  let shouldStop = false
  let shouldPreventDefault = false
  let shouldStopPropagation = false
  let shouldStopImmediatePropagation = false

  const stop = () => shouldStop = true
  const preventDefault = () => shouldPreventDefault = true
  const stopPropagation = () => shouldStopPropagation = true
  const stopImmediatePropagation = () => shouldStopImmediatePropagation = true

  const clear = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onMoveEnd)
    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onMoveEnd)
    document.removeEventListener('touchcancel', onMoveCancel)
  }

  const onMove = event => {
    // 鼠标已经松开，结束（例如：鼠标移动到窗口外，松开，移回来）
    if (event.buttons === 0) {
      onMoveCancel(event)
      return
    }

    // TODO, 鼠标离开窗口的时候，退出
    const $from = event.relatedTarget || event.toElement
    if (event.type === 'mousemove' && (!$from || $from.nodeName === 'HTML')) {
      clear()
      return
    }

    current = getPoint(event)
    offset = getOffset(start, current)

    if (typeof options.onMove === 'function') {
      options.onMove({
        eventType: event.type,
        preventDefault,
        stopPropagation,
        stopImmediatePropagation,
        start,
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

  const onMoveEnd = event => {
    current = getPoint(event)
    offset = getOffset(start, current)

    if (typeof options.onEnd === 'function') {
      options.onEnd({
        eventType: event.type,
        start,
        current,
        offset,
      })
    }
    clear()
  }

  const onMoveCancel = event => {
    if (typeof options.onCancel === 'function') {
      options.onCancel({
        eventType: event.type,
        start,
        current,
        offset,
      })
    }
    clear()
  }

  const onMoveStart = event => {
    start = current = getPoint(event)
    offset = getOffset(start, current)

    if (typeof options.onStart === 'function') {
      options.onStart({
        eventType: event.type,
        target: event.target,
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
    }
    else {
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onMoveEnd)
    }    
  }

  $el.addEventListener('mousedown', onMoveStart)
  $el.addEventListener('touchstart', onMoveStart)

  return () => {
    clear()
    $el.removeEventListener('mousedown', onMoveStart)
    $el.removeEventListener('touchstart', onMoveStart)
  }
}

function getPoint(event) {
  const obj = event.changedTouches?.[0] ?? event
  return {
    clientX: obj.clientX,
    clientY: obj.clientY,
    pageX: obj.pageX,
    pageY: obj.pageY,    
    screenX: obj.screenX,
    screenY: obj.screenY,
  }
}

function getOffset(start, current) {
  return {
    x: current.pageX - start.pageX,
    y: current.pageY - start.pageY
  }
}
