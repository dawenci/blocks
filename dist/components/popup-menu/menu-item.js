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
import '../../components/icon/index.js';
import '../../components/popup/index.js';
import { attr, attrs } from '../../decorators/attr/index.js';
import { contentTemplate, menuTemplate } from './menu-item.template.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './menu-item.style.js';
import { BlComponent } from '../component/Component.js';
import { PopupOrigin } from '../../components/popup/index.js';
export let BlPopupMenuItem = (() => {
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
    let _size_decorators;
    let _size_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$label_decorators;
    let _$label_initializers = [];
    let _$icon_decorators;
    let _$icon_initializers = [];
    let _$arrow_decorators;
    let _$arrow_initializers = [];
    var BlPopupMenuItem = class extends BlComponent {
        static {
            _disabled_decorators = [attr('boolean')];
            _link_decorators = [attr('boolean')];
            _active_decorators = [attr('boolean')];
            _size_decorators = [attrs.size];
            _$layout_decorators = [shadowRef('#layout')];
            _$label_decorators = [shadowRef('#label')];
            _$icon_decorators = [shadowRef('#icon')];
            _$arrow_decorators = [shadowRef('#arrow')];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _link_decorators, { kind: "accessor", name: "link", static: false, private: false, access: { has: obj => "link" in obj, get: obj => obj.link, set: (obj, value) => { obj.link = value; } } }, _link_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _active_decorators, { kind: "accessor", name: "active", static: false, private: false, access: { has: obj => "active" in obj, get: obj => obj.active, set: (obj, value) => { obj.active = value; } } }, _active_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$label_decorators, { kind: "accessor", name: "$label", static: false, private: false, access: { has: obj => "$label" in obj, get: obj => obj.$label, set: (obj, value) => { obj.$label = value; } } }, _$label_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$icon_decorators, { kind: "accessor", name: "$icon", static: false, private: false, access: { has: obj => "$icon" in obj, get: obj => obj.$icon, set: (obj, value) => { obj.$icon = value; } } }, _$icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$arrow_decorators, { kind: "accessor", name: "$arrow", static: false, private: false, access: { has: obj => "$arrow" in obj, get: obj => obj.$arrow, set: (obj, value) => { obj.$arrow = value; } } }, _$arrow_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlPopupMenuItem = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'menuitem';
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
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
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
        _enterTimer;
        _leaveTimer;
        constructor() {
            super();
            this.appendShadowChild(contentTemplate());
            const onClick = (e) => {
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
            };
            const onMouseEnter = () => {
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
            const onMouseLeave = () => {
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
            this.hook.onConnected(() => {
                this.addEventListener('click', onClick);
                this.addEventListener('mouseenter', onMouseEnter);
                this.addEventListener('mouseleave', onMouseLeave);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('click', onClick);
                this.removeEventListener('mouseenter', onMouseEnter);
                this.removeEventListener('mouseleave', onMouseLeave);
            });
            this.hook.onConnected(this.render);
            this.hook.onDisconnected(() => {
                if (this.$submenu && document.body.contains(this.$submenu)) {
                    this.$submenu.parentElement.removeChild(this.$submenu);
                }
            });
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
            super.render();
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
                this.$submenu.anchorElement = () => this;
                this.$submenu.origin = PopupOrigin.LeftStart;
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
    return BlPopupMenuItem = _classThis;
})();
