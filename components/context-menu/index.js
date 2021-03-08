import '../popup-menu/index.js'

/**
 *
 *
 * @export
 * @param {Element} el
 * @param {any} menuData
 */
export function onContextMenu(el, menuData, dark) {
  const handler = (e) => {
    e.preventDefault()
    const $menu = document.body.appendChild(document.createElement('blocks-popup-menu'))
    $menu.style.minWidth = '200px'
    $menu.dark = !!dark
    $menu.anchor = `[${e.pageX}, ${e.pageY}]`
    $menu.autoflip = true
    $menu.origin = 'top-start'
    $menu.addEventListener('close', () => {
      document.body.removeChild($menu)
    })
    $menu.open = true
    $menu.data = menuData
  }

  el.addEventListener('contextmenu', handler)

  return () => {
    el.removeEventListener('contextmenu', handler)
  }
}
