const icons = new Map()

/**
 * @param {string} key
 * @param {{ width: number, height: number, viewBox: string, data: string, [key: string]: any }} options 
 */
export function registerSvgIcon(key, options) {
  icons.set(key, options)
}

/**
 * @param {string} key
 */
export function getRegisteredSvgIcon(key, options = {}) {
  if (!key) return null
  const icon = icons.get(key)
  if (!icon) return null

  Object.assign(icon, options)

  return parseSvg(icon.data, options)
}

export function parseSvg(str, options = {}) {
  const doc = new DOMParser().parseFromString(str, 'image/svg+xml')
  const children = doc.children
  let svg = doc.querySelector('svg')
  if (!svg && !children.length) return null

  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    Array.prototype.forEach.call(children, child => {
      svg.appendChild(child)
    })
  }

  if (options.width) svg.setAttribute('width', options.width)
  if (options.height) svg.setAttribute('height', options.height)
  if (options.viewBox) svg.setAttribute('viewBox', options.viewBox)

  return svg
}
