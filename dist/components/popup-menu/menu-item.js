var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import '../../components/popup/index.js';
import '../../components/icon/index.js';
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { contentTemplate, menuTemplate } from './menu-item.template.js';
import { style } from './menu-item.style.js';
import { PopupOrigin } from '../../components/popup/index.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let BlocksPopupMenuItem = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-popup-menu-item',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _link_decorators;
    let _link_initializers = [];
    let _active_decorators;
    let _active_initializers = [];
    var BlocksPopupMenuItem = class extends Component {
        static {
            _disabled_decorators = [attr('boolean')];
            _link_decorators = [attr('boolean')];
            _active_decorators = [attr('boolean')];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _link_decorators, { kind: "accessor", name: "link", static: false, private: false, access: { has: obj => "link" in obj, get: obj => obj.link, set: (obj, value) => { obj.link = value; } } }, _link_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _active_decorators, { kind: "accessor", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } } }, _active_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPopupMenuItem = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #disabled_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _disabled_initializers, void 0));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #link_accessor_storage = __runInitializers(this, _link_initializers, void 0);
        get link() { return this.#link_accessor_storage; }
        set link(value) { this.#link_accessor_storage = value; }
        #active_accessor_storage = __runInitializers(this, _active_initializers, void 0);
        get active() { return this.#active_accessor_storage; }
        set active(value) { this.#active_accessor_storage = value; }
        _enterTimer;
        _leaveTimer;
        $layout;
        $label;
        $icon;
        $arrow;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
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
    };
    return BlocksPopupMenuItem = _classThis;
})();
