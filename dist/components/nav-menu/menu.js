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
import './menu-group.js';
import './menu-item.js';
import '../tooltip/index.js';
import { append, unmount } from '../../common/mount.js';
import { attr, attrs } from '../../decorators/attr/index.js';
import { boolGetter, boolSetter } from '../../common/property.js';
import { contentTemplate, groupTemplate, itemTemplate } from './menu.template.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { forEach } from '../../common/utils.js';
import { style } from './menu.style.js';
import { BlComponent } from '../component/Component.js';
import { PopupOrigin } from '../popup/origin.js';
export let BlNavMenu = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-nav-menu',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _enterDelay_decorators;
    let _enterDelay_initializers = [];
    let _leaveDelay_decorators;
    let _leaveDelay_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _level_decorators;
    let _level_initializers = [];
    let _submenu_decorators;
    let _submenu_initializers = [];
    let _expand_decorators;
    let _expand_initializers = [];
    let _inline_decorators;
    let _inline_initializers = [];
    let _horizontal_decorators;
    let _horizontal_initializers = [];
    let _collapse_decorators;
    let _collapse_initializers = [];
    var BlNavMenu = class extends BlComponent {
        static {
            _enterDelay_decorators = [attr('number')];
            _leaveDelay_decorators = [attr('number')];
            _size_decorators = [attrs.size];
            _level_decorators = [attr('int')];
            _submenu_decorators = [attr('boolean')];
            _expand_decorators = [attr('boolean')];
            _inline_decorators = [attr('boolean', {
                    get(self) {
                        return boolGetter('inline')(self);
                    },
                    set(self, value) {
                        boolSetter('inline')(self, value);
                        if (value) {
                            boolSetter('horizontal')(self, false);
                            boolSetter('collapse')(self, false);
                        }
                    },
                })];
            _horizontal_decorators = [attr('boolean', {
                    get(self) {
                        return boolGetter('horizontal')(self);
                    },
                    set(self, value) {
                        boolSetter('horizontal')(self, value);
                        if (value) {
                            boolSetter('inline')(self, false);
                            boolSetter('collapse')(self, false);
                        }
                    },
                })];
            _collapse_decorators = [attr('boolean', {
                    get(self) {
                        return boolGetter('collapse')(self);
                    },
                    set(self, value) {
                        boolSetter('collapse')(self, value);
                        if (value) {
                            boolSetter('inline')(self, false);
                            boolSetter('horizontal')(self, false);
                        }
                    },
                })];
            __esDecorate(this, null, _enterDelay_decorators, { kind: "accessor", name: "enterDelay", static: false, private: false, access: { has: obj => "enterDelay" in obj, get: obj => obj.enterDelay, set: (obj, value) => { obj.enterDelay = value; } } }, _enterDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _leaveDelay_decorators, { kind: "accessor", name: "leaveDelay", static: false, private: false, access: { has: obj => "leaveDelay" in obj, get: obj => obj.leaveDelay, set: (obj, value) => { obj.leaveDelay = value; } } }, _leaveDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _level_decorators, { kind: "accessor", name: "level", static: false, private: false, access: { has: obj => "level" in obj, get: obj => obj.level, set: (obj, value) => { obj.level = value; } } }, _level_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _submenu_decorators, { kind: "accessor", name: "submenu", static: false, private: false, access: { has: obj => "submenu" in obj, get: obj => obj.submenu, set: (obj, value) => { obj.submenu = value; } } }, _submenu_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _expand_decorators, { kind: "accessor", name: "expand", static: false, private: false, access: { has: obj => "expand" in obj, get: obj => obj.expand, set: (obj, value) => { obj.expand = value; } } }, _expand_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _inline_decorators, { kind: "accessor", name: "inline", static: false, private: false, access: { has: obj => "inline" in obj, get: obj => obj.inline, set: (obj, value) => { obj.inline = value; } } }, _inline_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _horizontal_decorators, { kind: "accessor", name: "horizontal", static: false, private: false, access: { has: obj => "horizontal" in obj, get: obj => obj.horizontal, set: (obj, value) => { obj.horizontal = value; } } }, _horizontal_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _collapse_decorators, { kind: "accessor", name: "collapse", static: false, private: false, access: { has: obj => "collapse" in obj, get: obj => obj.collapse, set: (obj, value) => { obj.collapse = value; } } }, _collapse_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlNavMenu = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'menu';
        }
        #enterDelay_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _enterDelay_initializers, 150));
        get enterDelay() { return this.#enterDelay_accessor_storage; }
        set enterDelay(value) { this.#enterDelay_accessor_storage = value; }
        #leaveDelay_accessor_storage = __runInitializers(this, _leaveDelay_initializers, 200);
        get leaveDelay() { return this.#leaveDelay_accessor_storage; }
        set leaveDelay(value) { this.#leaveDelay_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #level_accessor_storage = __runInitializers(this, _level_initializers, 0);
        get level() { return this.#level_accessor_storage; }
        set level(value) { this.#level_accessor_storage = value; }
        #submenu_accessor_storage = __runInitializers(this, _submenu_initializers, void 0);
        get submenu() { return this.#submenu_accessor_storage; }
        set submenu(value) { this.#submenu_accessor_storage = value; }
        #expand_accessor_storage = __runInitializers(this, _expand_initializers, void 0);
        get expand() { return this.#expand_accessor_storage; }
        set expand(value) { this.#expand_accessor_storage = value; }
        #inline_accessor_storage = __runInitializers(this, _inline_initializers, void 0);
        get inline() { return this.#inline_accessor_storage; }
        set inline(value) { this.#inline_accessor_storage = value; }
        #horizontal_accessor_storage = __runInitializers(this, _horizontal_initializers, void 0);
        get horizontal() { return this.#horizontal_accessor_storage; }
        set horizontal(value) { this.#horizontal_accessor_storage = value; }
        #collapse_accessor_storage = __runInitializers(this, _collapse_initializers, void 0);
        get collapse() { return this.#collapse_accessor_storage; }
        set collapse(value) { this.#collapse_accessor_storage = value; }
        _data;
        $parentMenu;
        $parentItem;
        constructor() {
            super();
            this.appendShadowChild(contentTemplate());
            this._data = [];
            const onActive = (e) => {
                this.clearActive();
                let $item = e.detail.$item;
                while ($item) {
                    $item.data.active = true;
                    $item.active = true;
                    $item = $item.$hostMenu.$parentItem;
                }
            };
            this.hook.onConnected(() => {
                this.render();
                this.addEventListener('active', onActive);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('active', onActive);
            });
            this.hook.onAttributeChanged(this.render);
            this.#setupAria();
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value;
            this.render();
        }
        clearEnterTimer() {
        }
        clearLeaveTimer() {
        }
        clearActive() {
            forEach(this.children, (child) => {
                if (child.clearActive)
                    child.clearActive();
            });
        }
        horizontalRender() {
            const fragment = document.createDocumentFragment();
            const render = ($root, data = []) => {
                data.forEach(item => {
                    if (item.data) {
                        render($root, item.data);
                        return;
                    }
                    const $item = itemTemplate();
                    $item.setAttribute('host-context', 'horizontal');
                    $item.$hostMenu = this;
                    $root.appendChild($item);
                    $item.data = item;
                });
            };
            render(fragment, this.data);
            this.innerHTML = '';
            this.appendChild(fragment);
        }
        verticalRender() {
            const hostContext = this.inline ? 'inline' : this.collapse ? 'collapse' : 'vertical';
            const fragment = document.createDocumentFragment();
            const render = ($root, data = []) => {
                data.forEach(item => {
                    if (isGroup(item)) {
                        if (this.collapse) {
                            render($root, item.data);
                        }
                        else {
                            const $group = groupTemplate();
                            $group.$hostMenu = this;
                            $group.horizontal = this.horizontal;
                            $group.inline = this.inline;
                            $group.collapse = this.collapse;
                            $root.appendChild($group);
                            $group.data = item;
                        }
                    }
                    else {
                        const $item = itemTemplate();
                        $item.setAttribute('host-context', hostContext);
                        $item.$hostMenu = this;
                        $root.appendChild($item);
                        $item.data = item;
                    }
                });
            };
            render(fragment, this.data);
            this.innerHTML = '';
            this.appendChild(fragment);
            if (this.collapse) {
                if (!this.$tooltip) {
                    this.$tooltip = document.createElement('bl-popup');
                    this.$tooltip.origin = PopupOrigin.LeftCenter;
                    this.$tooltip.style.cssText = 'padding:8px;font-size:14px;';
                    this.$tooltip.arrow = 6;
                    append(this.$tooltip, document.body);
                    Array.prototype.forEach.call(this.children, $item => {
                        if ($item.hasSubmenu)
                            return;
                        $item.onmouseenter = () => {
                            console.log('mouseenter');
                            if (this.collapse && this.$tooltip) {
                                this.$tooltip.anchorElement = () => $item;
                                this.$tooltip.innerText = $item.data.label;
                                this.$tooltip.open = true;
                            }
                        };
                        $item.onmouseleave = () => {
                            console.log('mouseleave');
                            if (this.$tooltip) {
                                this.$tooltip.open = false;
                            }
                        };
                    });
                }
            }
            else {
                if (this.$tooltip) {
                    unmount(this.$tooltip);
                    this.$tooltip = undefined;
                }
            }
        }
        render() {
            super.render();
            if (this.horizontal) {
                this.horizontalRender();
            }
            else {
                this.verticalRender();
            }
        }
        #setupAria() {
            const update = () => {
                this.setAttribute('aria-orientation', this.horizontal ? 'horizontal' : 'vertical');
            };
            this.hook.onRender(update);
            this.hook.onConnected(update);
            this.hook.onAttributeChangedDep('horizontal', update);
        }
    };
    return BlNavMenu = _classThis;
})();
function isGroup(data) {
    return Array.isArray(data.data);
}
