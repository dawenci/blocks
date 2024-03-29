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
import '../icon/index.js';
import '../popup-menu/index.js';
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './menu-item.style.js';
import { template } from './menu-item.template.js';
import { BlPopupMenu } from '../popup-menu/index.js';
import { BlComponent } from '../component/Component.js';
import { PopupOrigin } from '../popup/index.js';
export let BlNavMenuItem = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-nav-menu-item',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _expand_decorators;
    let _expand_initializers = [];
    let _active_decorators;
    let _active_initializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _link_decorators;
    let _link_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$label_decorators;
    let _$label_initializers = [];
    let _$icon_decorators;
    let _$icon_initializers = [];
    let _$arrow_decorators;
    let _$arrow_initializers = [];
    var BlNavMenuItem = class extends BlComponent {
        static {
            _expand_decorators = [attr('boolean')];
            _active_decorators = [attr('boolean')];
            _disabled_decorators = [attr('boolean')];
            _link_decorators = [attr('boolean')];
            _$layout_decorators = [shadowRef('#layout')];
            _$label_decorators = [shadowRef('#label')];
            _$icon_decorators = [shadowRef('#icon')];
            _$arrow_decorators = [shadowRef('#arrow')];
            __esDecorate(this, null, _expand_decorators, { kind: "accessor", name: "expand", static: false, private: false, access: { has: obj => "expand" in obj, get: obj => obj.expand, set: (obj, value) => { obj.expand = value; } } }, _expand_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _active_decorators, { kind: "accessor", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } } }, _active_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _link_decorators, { kind: "accessor", name: "link", static: false, private: false, access: { has: obj => "link" in obj, get: obj => obj.link, set: (obj, value) => { obj.link = value; } } }, _link_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$label_decorators, { kind: "accessor", name: "$label", static: false, private: false, access: { has: obj => "$label" in obj, get: obj => obj.$label, set: (obj, value) => { obj.$label = value; } } }, _$label_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$icon_decorators, { kind: "accessor", name: "$icon", static: false, private: false, access: { has: obj => "$icon" in obj, get: obj => obj.$icon, set: (obj, value) => { obj.$icon = value; } } }, _$icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$arrow_decorators, { kind: "accessor", name: "$arrow", static: false, private: false, access: { has: obj => "$arrow" in obj, get: obj => obj.$arrow, set: (obj, value) => { obj.$arrow = value; } } }, _$arrow_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlNavMenuItem = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'menuitem';
        }
        #expand_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _expand_initializers, void 0));
        get expand() { return this.#expand_accessor_storage; }
        set expand(value) { this.#expand_accessor_storage = value; }
        #active_accessor_storage = __runInitializers(this, _active_initializers, void 0);
        get active() { return this.#active_accessor_storage; }
        set active(value) { this.#active_accessor_storage = value; }
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, void 0);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #link_accessor_storage = __runInitializers(this, _link_initializers, void 0);
        get link() { return this.#link_accessor_storage; }
        set link(value) { this.#link_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$label_accessor_storage = __runInitializers(this, _$label_initializers, void 0);
        get $label() { return this.#$label_accessor_storage; }
        set $label(value) { this.#$label_accessor_storage = value; }
        #$icon_accessor_storage = __runInitializers(this, _$icon_initializers, void 0);
        get $icon() { return this.#$icon_accessor_storage; }
        set $icon(value) { this.#$icon_accessor_storage = value; }
        #$arrow_accessor_storage = __runInitializers(this, _$arrow_initializers, void 0);
        get $arrow() { return this.#$arrow_accessor_storage; }
        set $arrow(value) { this.#$arrow_accessor_storage = value; }
        _leaveTimer;
        _enterTimer;
        _data;
        constructor() {
            super();
            this.appendShadowChild(template());
            const onClick = (e) => {
                if (this.disabled)
                    return;
                if (this.hasSubmenu) {
                    if (this.isInlineMode) {
                        this.expand = !this.expand;
                    }
                    else if (this.$submenu instanceof BlPopupMenu) {
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
            };
            this.hook.onConnected(() => {
                this.render();
                this.$layout.addEventListener('click', onClick);
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
            });
            this.hook.onDisconnected(() => {
                this.$layout.removeEventListener('click', onClick);
                this.onmouseenter = null;
                this.onmouseleave = null;
                if (this.$submenu && document.body.contains(this.$submenu)) {
                    this.$submenu.parentElement.removeChild(this.$submenu);
                }
            });
            this.hook.onAttributeChangedDep('expand', () => {
                if (this.$submenu) {
                    ;
                    this.$submenu.expand = this.expand;
                }
            });
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
        get hasSubmenu() {
            return !!this.data.children?.length;
        }
        get data() {
            return this._data ?? {};
        }
        set data(value) {
            this._data = value;
            this.render();
        }
        render() {
            super.render();
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
                    this.$submenu.anchorElement = () => this;
                    if (this.$rootMenu.horizontal && this.$hostMenu.level === 0) {
                        this.$submenu.origin = PopupOrigin.TopStart;
                    }
                    else {
                        this.$submenu.origin = PopupOrigin.LeftStart;
                    }
                }
                else {
                    this.$submenu = document.createElement('bl-nav-menu');
                    this.$submenu.submenu = true;
                    this.$submenu.collapse = this.$hostMenu.collapse;
                    this.$submenu.inline = this.$hostMenu.inline;
                    this.$submenu.horizontal = this.$hostMenu.horizontal;
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
    return BlNavMenuItem = _classThis;
})();
