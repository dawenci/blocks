import '../popup-menu/index.js'

/**
 *
 *
 * @export
 * @param {Element} el
 * @param {any[] | ((e: MouseEvent) => any[])} menuData
 * @param {boolean} [dark]
 */
export function blBindContextMenu(el, menuData, dark) {
  const handler = (e) => {
    e.preventDefault()
    const $menu = document.body.appendChild(document.createElement('bl-popup-menu'))
    $menu.style.minWidth = '200px'
    $menu.dark = !!dark
    $menu.anchor = `[${e.pageX}, ${e.pageY}]`
    $menu.autoflip = true
    $menu.origin = 'top-start'
    $menu.addEventListener('closed', () => {
      document.body.removeChild($menu)
    })
    $menu.open = true
    $menu.data = typeof menuData === 'function' ? menuData(e) : menuData
  }

  el.addEventListener('contextmenu', handler)

  return () => {
    el.removeEventListener('contextmenu', handler)
  }
}
