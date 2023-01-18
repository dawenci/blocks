import '../../components/popup/index.js';
import '../../components/icon/index.js';
import { boolGetter, boolSetter } from '../../common/property.js';
import { activeGetter, activeSetter, disabledGetter, disabledSetter, } from '../../common/propertyAccessor.js';
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { styleTemplate, contentTemplate, menuTemplate, } from './menu-item-template.js';
import { PopupOrigin } from '../../components/popup/index.js';
export class BlocksPopupMenuItem extends Component {
    _enterTimer;
    _leaveTimer;
    $layout;
    $label;
    $icon;
    $arrow;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(styleTemplate());
        shadowRoot.appendChild(contentTemplate());
        this.$layout = shadowRoot.getElementById('layout');
        this.$label = shadowRoot.getElementById('label');
        this.$icon = shadowRoot.getElementById('icon');
        this.$arrow = shadowRoot.getElementById('arrow');
        this.addEventListener('click', e => {
            if (this.disabled)
                return;
            if (this.hasSubmenu) {
                if (!document.body.contains(this.$submenu)) {
                    document.body.appendChild(this.$submenu);
                }
                this.clearEnterTimer();
                this.clearLeaveTimer();
                if (this.$submenu) {
                    this.$submenu.clearEnterTimer();
                    this.$submenu.clearLeaveTimer();
                    this.$submenu.open = true;
                }
                return;
            }
            if (this.data.handler) {
                this.data.handler(e);
            }
            else if (this.data.href) {
                window.open(this.data.href, this.data.target ?? '_blank');
            }
            if (this.$rootMenu) {
                dispatchEvent(this.$rootMenu, 'active', { detail: { $item: this } });
            }
            ;
            this.$hostMenu.closeAll();
        });
        this.onmouseenter = () => {
            if (this.$submenu) {
                if (!document.body.contains(this.$submenu)) {
                    document.body.appendChild(this.$submenu);
                }
                clearTimeout(this.$submenu._enterTimer);
                clearTimeout(this._enterTimer);
                this._enterTimer = setTimeout(() => {
                    this.$submenu.open = true;
                }, this.$hostMenu.enterDelay);
                clearTimeout(this._leaveTimer);
                clearTimeout(this.$submenu._leaveTimer);
            }
        };
        this.onmouseleave = () => {
            if (this.$submenu) {
                clearTimeout(this.$submenu._leaveTimer);
                clearTimeout(this._leaveTimer);
                this._leaveTimer = setTimeout(() => {
                    ;
                    this.$submenu.open = false;
                }, this.$hostMenu.leaveDelay);
                clearTimeout(this._enterTimer);
                clearTimeout(this.$submenu._enterTimer);
            }
        };
    }
    #submenu;
    get $submenu() {
        return this.#submenu;
    }
    set $submenu($menu) {
        this.#submenu = $menu;
    }
    #hostMenu;
    get $hostMenu() {
        return this.#hostMenu;
    }
    set $hostMenu($menu) {
        this.#hostMenu = $menu;
    }
    get $rootMenu() {
        let $menu = this.$hostMenu;
        while ($menu.$parentMenu)
            $menu = $menu.$parentMenu;
        return $menu;
    }
    get hasSubmenu() {
        return !!this.data.children?.length;
    }
    get isLeaf() {
        return !this.hasSubmenu;
    }
    get disabled() {
        return disabledGetter(this);
    }
    set disabled(value) {
        disabledSetter(this, value);
    }
    get link() {
        return boolGetter('link')(this);
    }
    set link(value) {
        boolSetter('link')(this, value);
    }
    get active() {
        return activeGetter(this);
    }
    set active(value) {
        activeSetter(this, value);
    }
    _data;
    get data() {
        return this._data ?? {};
    }
    set data(value) {
        this._data = value;
        this.render();
    }
    render() {
        const data = this.data;
        this.disabled = !!data.disabled;
        if (data.icon) {
            ;
            this.$icon.value = data.icon;
            this.$icon.style.display = 'block';
        }
        else {
            ;
            this.$icon.value = '';
            this.$icon.style.display = 'none';
        }
        this.$label.textContent = data.label ?? '';
        this.link = !!data.href;
        this.active = !!data.active;
        if (this.hasSubmenu) {
            this.classList.add('has-submenu');
            this.$submenu = menuTemplate();
            this.$submenu.size = this.$hostMenu.size;
            this.$submenu.enterDelay = this.$hostMenu.enterDelay;
            this.$submenu.leaveDelay = this.$hostMenu.leaveDelay;
            this.$submenu.appendToBody = true;
            this.$submenu.$parentItem = this;
            this.$submenu.$parentMenu = this.$hostMenu;
            this.$submenu.level = this.$hostMenu.level + 1;
            this.$submenu.anchor = () => this;
            this.$submenu.origin = PopupOrigin.LeftStart;
            this.$submenu.data = data.children;
        }
        else {
            this.classList.remove('has-submenu');
            this.$submenu = undefined;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.$submenu && document.body.contains(this.$submenu)) {
            this.$submenu.parentElement.removeChild(this.$submenu);
        }
    }
    clearEnterTimer() {
        clearTimeout(this._enterTimer);
    }
    clearLeaveTimer() {
        clearTimeout(this._leaveTimer);
    }
    clearActive() {
        this.data.active = false;
        this.active = false;
        if (this.$submenu)
            this.$submenu.clearActive();
    }
    static get observedAttributes() {
        return ['disabled', 'link', 'active'];
    }
}
if (!customElements.get('bl-popup-menu-item')) {
    customElements.define('bl-popup-menu-item', BlocksPopupMenuItem);
}
