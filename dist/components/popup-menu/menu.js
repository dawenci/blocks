var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { BlocksPopup } from '../popup/index.js';
import { forEach } from '../../common/utils.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { itemTemplate, groupTemplate } from './menu-template.js';
import { customElement } from '../../decorators/customElement.js';
import { attr, attrs } from '../../decorators/attr.js';
export let BlocksPopupMenu = (() => {
    let _classDecorators = [customElement('bl-popup-menu')];
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
    var BlocksPopupMenu = class extends BlocksPopup {
        static {
            _enterDelay_decorators = [attr('number')];
            _leaveDelay_decorators = [attr('number')];
            _size_decorators = [attrs.size];
            _level_decorators = [attr('int')];
            __esDecorate(this, null, _enterDelay_decorators, { kind: "accessor", name: "enterDelay", static: false, private: false, access: { has: obj => "enterDelay" in obj, get: obj => obj.enterDelay, set: (obj, value) => { obj.enterDelay = value; } } }, _enterDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _leaveDelay_decorators, { kind: "accessor", name: "leaveDelay", static: false, private: false, access: { has: obj => "leaveDelay" in obj, get: obj => obj.leaveDelay, set: (obj, value) => { obj.leaveDelay = value; } } }, _leaveDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _level_decorators, { kind: "accessor", name: "level", static: false, private: false, access: { has: obj => "level" in obj, get: obj => obj.level, set: (obj, value) => { obj.level = value; } } }, _level_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPopupMenu = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return BlocksPopup.observedAttributes.concat([
                'level',
                'size',
                'enter-delay',
                'leave-delay',
            ]);
        }
        _data = (__runInitializers(this, _instanceExtraInitializers), void 0);
        _leaveTimer;
        _enterTimer;
        _clearClickOutside;
        $parentItem;
        $parentMenu;
        #enterDelay_accessor_storage = __runInitializers(this, _enterDelay_initializers, 150);
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
    };
    return BlocksPopupMenu = _classThis;
})();
