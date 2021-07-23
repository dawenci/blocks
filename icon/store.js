const icons = new Map()

/**
 * @param {string} key
 * @param {string} data
 * @param {Record<string, any>} [attrs]
 */
export function registerSvgIcon(key, data, attrs = {}) {
  icons.set(key, { data, attrs })
}

/**
 * @param {string} key
 * @param {Record<string, any>} [attrs]
 */
export function getRegisteredSvgIcon(key, attrs = {}) {
  if (!key) return null
  const iconData = icons.get(key)
  if (!iconData) return null
  
  return parseSvg(iconData.data, Object.assign({}, iconData.attrs, attrs))
}

/**
 * @param {string} str
 * @param {Record<string, any>} [attrs]
 */
export function parseSvg(str, attrs = {}) {
  const doc = new DOMParser().parseFromString(str, 'image/svg+xml')

  // 解析错误
  if (doc.querySelector('parsererror')) return null
  
  let svg = doc.querySelector('svg')
  const children = doc.children
  if (!svg && !children.length) return null

  // 传入的 str 可能不包含 svg 标签，而是 svg 标签内部的内容
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    Array.prototype.forEach.call(children, child => {
      svg.appendChild(child)
    })
  }

  Object.keys(attrs).forEach(attr => {
    svg.setAttribute(attr, attrs[attr])
  })

  return svg
}

/**
 * @param {string} icon
 * @param {Record<string, any>} [attrs]
 */
export function parseIcon(icon, attrs = {}) {
  return getRegisteredSvgIcon(icon) ?? parseSvg(icon)
}
