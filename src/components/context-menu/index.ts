import '../popup-menu/index.js'
import { PopupOrigin } from '../popup/index.js'

export function blBindContextMenu(
  /** 绑定事件的目标元素 */
  el: HTMLElement,
  /** 菜单数组，或者生成菜单数组的函数 */
  menuData: (MenuItem | MenuGroup)[] | ((e: MouseEvent) => (MenuItem | MenuGroup)[])
) {
  const handler = (e: MouseEvent) => {
    e.preventDefault()
    const $menu = document.body.appendChild(document.createElement('bl-popup-menu'))
    $menu.style.minWidth = '200px'
    $menu.offset = [e.pageX, e.pageY] //`[${e.pageX}, ${e.pageY}]`
    $menu.autoflip = true
    $menu.inset = true
    $menu.origin = PopupOrigin.TopStart
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
