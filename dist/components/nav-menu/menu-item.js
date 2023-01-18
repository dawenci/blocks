import '../icon/index.js';
import '../popup-menu/index.js';
import { boolGetter, boolSetter } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { PopupOrigin } from '../popup/index.js';
import { styleTemplate, contentTemplate } from './menu-item-template.js';
import { BlocksPopupMenu } from '../popup-menu/index.js';
export class BlocksNavMenuItem extends Component {
    $layout;
    $label;
    $icon;
    $arrow;
    _leaveTimer;
    _enterTimer;
    _data;
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
        this.$layout.addEventListener('click', e => {
            if (this.disabled)
                return;
            if (this.hasSubmenu) {
                if (this.isInlineMode) {
                    this.expand = !this.expand;
                }
                else if (this.$submenu instanceof BlocksPopupMenu) {
                    if (!document.body.contains(this.$submenu)) {
                        document.body.appendChild(this.$submenu);
                    }
                    this.clearLeaveTimer();
                    this.clearEnterTimer();
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
        });
        this.onmouseenter = () => {
            if (!this.isInlineMode && this.$submenu) {
                if (!document.body.contains(this.$submenu)) {
                    document.body.appendChild(this.$submenu);
                }
                this.$submenu.clearEnterTimer();
                this.clearEnterTimer();
                this._enterTimer = setTimeout(() => {
                    ;
                    this.$submenu.open = true;
                }, this.$hostMenu?.enterDelay ?? 0);
                clearTimeout(this._leaveTimer);
                this.$submenu.clearLeaveTimer();
            }
        };
        this.onmouseleave = () => {
            if (!this.isInlineMode && this.$submenu) {
                this.$submenu.clearLeaveTimer();
                this.clearLeaveTimer();
                this._leaveTimer = setTimeout(() => {
                    ;
                    this.$submenu.open = false;
                }, this.$hostMenu?.leaveDelay ?? 0);
                clearTimeout(this._enterTimer);
                this.$submenu.clearEnterTimer();
            }
        };
    }
    #hostMenu;
    get $hostMenu() {
        return this.#hostMenu;
    }
    set $hostMenu($menu) {
        this.#hostMenu = $menu;
    }
    #submenu;
    get $submenu() {
        return this.#submenu;
    }
    set $submenu($menu) {
        this.#submenu = $menu;
    }
    #parentMenu;
    get $parentMenu() {
        return this.#parentMenu;
    }
    set $parentMenu($menu) {
        this.#parentMenu = $menu;
    }
    get $rootMenu() {
        let $menu = this.$hostMenu;
        while ($menu?.$parentMenu) {
            $menu = $menu.$parentMenu;
        }
        return $menu;
    }
    get isInlineMode() {
        return this.$rootMenu?.inline;
    }
    get isCollapseMode() {
        return this.$rootMenu.collapse;
    }
    get expand() {
        return boolGetter('expand')(this);
    }
    set expand(value) {
        boolSetter('expand')(this, value);
    }
    get active() {
        return boolGetter('active')(this);
    }
    set active(value) {
        boolSetter('active')(this, value);
    }
    get hasSubmenu() {
        return !!this.data.children?.length;
    }
    get disabled() {
        return boolGetter('disabled')(this);
    }
    set disabled(value) {
        boolSetter('disabled')(this, value);
    }
    get link() {
        return boolGetter('link')(this);
    }
    set link(value) {
        boolSetter('link')(this, value);
    }
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
            this.$icon.value = data.icon;
            this.$icon.style.display = 'block';
        }
        else {
            this.$icon.value = '';
            this.$icon.style.display = 'none';
        }
        this.$label.textContent = data.label ?? '';
        this.link = !!data.href;
        this.active = !!data.active;
        this.$label.style.paddingLeft = this.$hostMenu.level * 28 + 'px';
        if (this.hasSubmenu) {
            this.innerHTML = '';
            this.classList.add('has-submenu');
            if (!this.isInlineMode) {
                this.$submenu = document.createElement('bl-popup-menu');
                this.$submenu.appendToBody = true;
                this.$submenu.anchor = () => this;
                if (this.$rootMenu.horizontal &&
                    this.$hostMenu.level === 0) {
                    this.$submenu.origin = PopupOrigin.TopStart;
                }
                else {
                    this.$submenu.origin = PopupOrigin.LeftStart;
                }
            }
            else {
                this.$submenu = document.createElement('bl-nav-menu');
                this.$submenu.submenu = true;
                this.appendChild(this.$submenu);
            }
            this.$submenu.$parentItem = this;
            this.$submenu.$parentMenu = this.$hostMenu;
            this.$submenu.enterDelay = this.$hostMenu.enterDelay;
            this.$submenu.leaveDelay = this.$hostMenu.leaveDelay;
            this.$submenu.size = this.$hostMenu.size;
            this.$submenu.level = this.$hostMenu.level + 1;
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
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'expand' && this.$submenu) {
            ;
            this.$submenu.expand = this.expand;
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
        return ['disabled', 'link', 'expand', 'active'];
    }
}
if (!customElements.get('bl-nav-menu-item')) {
    customElements.define('bl-nav-menu-item', BlocksNavMenuItem);
}
