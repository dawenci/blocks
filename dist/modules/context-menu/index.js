import '../../components/popup-menu/index.js';
import { PopupOrigin } from '../../components/popup/index.js';
export function blBindContextMenu(el, menuData) {
    const handler = (e) => {
        e.preventDefault();
        const $menu = document.body.appendChild(document.createElement('bl-popup-menu'));
        $menu.style.minWidth = '200px';
        $menu.offsetX = e.pageX;
        $menu.offsetY = e.pageY;
        $menu.autoflip = true;
        $menu.inset = true;
        $menu.origin = PopupOrigin.TopStart;
        $menu.addEventListener('closed', () => {
            document.body.removeChild($menu);
        });
        $menu.open = true;
        $menu.data = typeof menuData === 'function' ? menuData(e) : menuData;
    };
    el.addEventListener('contextmenu', handler);
    return () => {
        el.removeEventListener('contextmenu', handler);
    };
}
