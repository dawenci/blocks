import '../../components/popup-menu/index.js'
import { PopupOrigin } from '../../components/popup/index.js'

export type ContextMenuOptions = {
  disabled?: () => boolean
  minWidth?: string
}

export function blBindContextMenu(
  /** 绑定事件的目标元素 */
  el: HTMLElement,
  /** 菜单数组，或者生成菜单数组的函数 */
  menuData: (MenuItem | MenuGroup)[] | ((e: MouseEvent) => (MenuItem | MenuGroup)[]),
  options?: ContextMenuOptions
) {
  const handler = (e: MouseEvent) => {
    if (options?.disabled && options.disabled()) return

    e.preventDefault()
    const $menu = document.body.appendChild(document.createElement('bl-popup-menu'))
    $menu.style.minWidth = options?.minWidth || '200px'
    $menu.offsetX = e.pageX
    $menu.offsetY = e.pageY
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
