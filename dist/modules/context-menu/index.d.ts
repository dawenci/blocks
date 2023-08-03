import '../../components/popup-menu/index.js';
export type ContextMenuOptions = {
    disabled?: () => boolean;
    minWidth?: string;
};
export declare function blBindContextMenu(el: HTMLElement, menuData: (MenuItem | MenuGroup)[] | ((e: MouseEvent) => (MenuItem | MenuGroup)[]), options?: ContextMenuOptions): () => void;
