import { Depth, DepthValue } from './data.js'

export function range(start, end) {
  const list = []
  for (let i = start; i <= end; i += 1) {
    list.push(i)
  }
  return list
}

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

export function toggleClass(el, className, flag) {
  el.classList[flag ? 'add' : 'remove'](className)
}

export function toggleAttr(el, attrName, flag) {
  if (flag) {
    el.setAttribute(attrName, '')
  }
  else {
    el.removeAttribute(attrName)
  }
}

export function normalizeDepth(depth) {
  if (!depth) return Depth.Month
  if (depth !== Depth.Month && depth !== Depth.Year && depth !== Depth.Decade) {
    depth = depth.Month
  }
  return depth
}

export function normalizeMinDepth(minDepth, depth) {
  if (!minDepth) return Depth.Decade
  return DepthValue[depth] < DepthValue[minDepth]
    ? depth
    : minDepth
}

export function normalizeViewDepth(viewDepth, minDepth, depth) {
  if (!viewDepth) return depth
  if (DepthValue[viewDepth] < DepthValue[minDepth]) {
    viewDepth = minDepth
  }
  if (DepthValue[viewDepth] > DepthValue[depth]) {
    viewDepth = depth
  }
  return viewDepth
}
