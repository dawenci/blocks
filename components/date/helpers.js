import { Depth, DepthValue } from './data.js'

export function getFirstDate(year, month) {
  return new Date(year, month, 1)
}

export function getLastDate(year, month) {
  return new Date(year, month + 1, 0)
}

export function getFirstDateOfNextMonth(year, month) {
  return new Date(year, month + 1, 1)
}

export function getLastDateOfPrevMonth(year, month) {
  return getLastDate(year, month - 1)
}

// 取出数组中最接近今天的 date
export function getClosestDate(dates = []) {
  const now = Date.now()
  let offset = Infinity
  let result = null
  for (let i = 0; i < dates.length; i += 1) {
    const current = dates[i]
    const currentOffset = Math.abs(current.getTime() - now)
    if (currentOffset < offset) {
      result = current
      offset = currentOffset
    }
  }
  return result
}

/**
 * 规范最小的深度取值
 */
export function normalizeMinDepth(min, depth) {
  if (!min) return Depth.Century
  return DepthValue[depth] < DepthValue[min]
    ? depth
    : min
}

/**
 * 规范面板深度取值
 */
export function normalizeViewDepth(view, min, depth) {
  if (!view) return depth
  if (DepthValue[view] < DepthValue[min]) {
    view = min
  }
  if (DepthValue[view] > DepthValue[depth]) {
    view = depth
  }
  return view
}
