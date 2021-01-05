const icons = new Map()

/**
 * @param {string} key
 * @param {{ width: number, height: number, viewBox: string, data: string, [key: string]: any }} options 
 */
export function register(key, options) {
  icons.set(key, options)
}

/**
 * @param {string} key
 */
export function getIconSvg(key, options = {}) {
  if (!key) return null
  const icon = icons.get(key)
  if (!icon) return null

  Object.assign(icon, options)

  const doc = new DOMParser().parseFromString(icon.data, 'image/svg+xml')
  let svg = doc.querySelector('svg')
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    Array.prototype.forEach.call(doc.children, child => {
      svg.appendChild(child)
    })
  }

  if (icon.width) svg.setAttribute('width', icon.width)
  if (icon.height) svg.setAttribute('height', icon.height)
  if (icon.viewBox) svg.setAttribute('viewBox', icon.viewBox)

  return svg
}
