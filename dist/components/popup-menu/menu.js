import { BlocksPopup } from '../popup/index.js';
import { intGetter, intSetter, numGetter, numSetter, } from '../../common/property.js';
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js';
import { forEach } from '../../common/utils.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { itemTemplate, groupTemplate } from './menu-template.js';
export class BlocksPopupMenu extends BlocksPopup {
    _data;
    _leaveTimer;
    _enterTimer;
    _clearClickOutside;
    $parentItem;
    $parentMenu;
    constructor() {
        super();
        this._data = [];
        this.onmouseenter = () => {
            this.enter();
        };
        this.onmouseleave = () => {
            this.leave();
        };
    }
    get enterDelay() {
        return numGetter('enter-delay')(this) ?? 150;
    }
    set enterDelay(value) {
        numSetter('enter-delay')(this, value);
    }
    get leaveDelay() {
        return numGetter('leave-delay')(this) ?? 200;
    }
    set leaveDelay(value) {
        numSetter('leave-delay')(this, value);
    }
    get size() {
        return sizeGetter(this);
    }
    set size(value) {
        sizeSetter(this, value);
    }
    get level() {
        return intGetter('level')(this) ?? 0;
    }
    set level(value) {
        intSetter('level')(this, value);
    }
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
        this.render();
    }
    clearEnterTimer() {
        clearTimeout(this._enterTimer);
    }
    clearLeaveTimer() {
        clearTimeout(this._leaveTimer);
    }
    enter() {
        if (this.level === 0)
            return;
        if (this.$parentItem) {
            this.$parentItem.clearEnterTimer();
        }
        this.clearEnterTimer();
        this._enterTimer = setTimeout(() => {
            this.open = true;
        }, this.enterDelay);
        if (this.$parentMenu instanceof BlocksPopupMenu) {
            if (this.$parentMenu.enter) {
                this.$parentMenu.enter();
            }
        }
        clearTimeout(this._leaveTimer);
        if (this.$parentItem) {
            this.$parentItem.clearLeaveTimer();
        }
    }
    leave() {
        if (this.level === 0)
            return;
        if (this.$parentItem) {
            this.$parentItem.clearLeaveTimer();
        }
        clearTimeout(this._leaveTimer);
        this._leaveTimer = setTimeout(() => {
            this.open = false;
        }, this.leaveDelay);
        if (this.$parentMenu instanceof BlocksPopupMenu) {
            if (this.$parentMenu.leave) {
                this.$parentMenu.leave();
            }
        }
        clearTimeout(this._enterTimer);
        if (this.$parentItem) {
            this.$parentItem.clearEnterTimer();
        }
    }
    closeAll() {
        this.open = false;
        if (this.$parentMenu instanceof BlocksPopupMenu) {
            this.$parentMenu.closeAll();
        }
    }
    clearActive() {
        const children = this.children;
        forEach(children, child => {
            if (child.clearActive)
                child.clearActive();
        });
    }
    render() {
        super.render();
        const fragment = document.createDocumentFragment();
        this.data.forEach(item => {
            if (item.data) {
                const $group = groupTemplate();
                $group.$hostMenu = this;
                fragment.appendChild($group);
                $group.data = item;
                return;
            }
            const $item = itemTemplate();
            $item.$hostMenu = this;
            fragment.appendChild($item);
            $item.data = item;
        });
        this.innerHTML = '';
        this.appendChild(fragment);
        super.updatePositionAndDirection();
    }
    connectedCallback() {
        super.connectedCallback();
        this.autoflip = true;
        this.render();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this._destroyClickOutside();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (BlocksPopup.observedAttributes.includes(attrName)) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
        }
        if (attrName === 'open') {
            if (this.open) {
                this._initClickOutside();
            }
            else {
                this._destroyClickOutside();
            }
        }
        if (attrName === 'open' && this.$parentItem) {
            this.$parentItem.classList[this.open ? 'add' : 'remove']('submenu-open');
        }
        this.render();
    }
    _initClickOutside() {
        if (this._clearClickOutside)
            return;
        this._clearClickOutside = onClickOutside(this, e => {
            if (this.level === 0 && this.open) {
                if (e.target.$rootMenu !== this) {
                    this.open = false;
                }
            }
        });
    }
    _destroyClickOutside() {
        if (this._clearClickOutside) {
            this._clearClickOutside();
            this._clearClickOutside = undefined;
        }
    }
    static get observedAttributes() {
        return BlocksPopup.observedAttributes.concat([
            'level',
            'size',
            'enter-delay',
            'leave-delay',
        ]);
    }
}
if (!customElements.get('bl-popup-menu')) {
    customElements.define('bl-popup-menu', BlocksPopupMenu);
}
