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
import '../modal-mask/index.js';
import { setStyles } from '../../common/style.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { onKey } from '../../common/onKey.js';
import { capitalize } from '../../common/utils.js';
import { contentTemplate, styleTemplate } from './template.js';
import { Control } from '../base-control/index.js';
import { applyMixins } from '../../common/applyMixins.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
export let BlocksDrawer = (() => {
    let _classDecorators = [customElement('bl-drawer')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _capturefocus_decorators;
    let _capturefocus_initializers = [];
    let _closeOnClickOutside_decorators;
    let _closeOnClickOutside_initializers = [];
    let _closeOnEscape_decorators;
    let _closeOnEscape_initializers = [];
    let _mask_decorators;
    let _mask_initializers = [];
    let _open_decorators;
    let _open_initializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _placement_decorators;
    let _placement_initializers = [];
    var BlocksDrawer = class extends Control {
        static {
            _capturefocus_decorators = [attr('boolean')];
            _closeOnClickOutside_decorators = [attr('boolean')];
            _closeOnEscape_decorators = [attr('boolean')];
            _mask_decorators = [attr('boolean')];
            _open_decorators = [attr('boolean')];
            _name_decorators = [attr('string')];
            _size_decorators = [attr('string')];
            _placement_decorators = [attr('enum', { enumValues: ['right', 'left', 'bottom', 'top'] })];
            __esDecorate(this, null, _capturefocus_decorators, { kind: "accessor", name: "capturefocus", static: false, private: false, access: { has: obj => "capturefocus" in obj, get: obj => obj.capturefocus, set: (obj, value) => { obj.capturefocus = value; } } }, _capturefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeOnClickOutside_decorators, { kind: "accessor", name: "closeOnClickOutside", static: false, private: false, access: { has: obj => "closeOnClickOutside" in obj, get: obj => obj.closeOnClickOutside, set: (obj, value) => { obj.closeOnClickOutside = value; } } }, _closeOnClickOutside_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeOnEscape_decorators, { kind: "accessor", name: "closeOnEscape", static: false, private: false, access: { has: obj => "closeOnEscape" in obj, get: obj => obj.closeOnEscape, set: (obj, value) => { obj.closeOnEscape = value; } } }, _closeOnEscape_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _mask_decorators, { kind: "accessor", name: "mask", static: false, private: false, access: { has: obj => "mask" in obj, get: obj => obj.mask, set: (obj, value) => { obj.mask = value; } } }, _mask_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _open_decorators, { kind: "accessor", name: "open", static: false, private: false, access: { has: obj => "open" in obj, get: obj => obj.open, set: (obj, value) => { obj.open = value; } } }, _open_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placement_decorators, { kind: "accessor", name: "placement", static: false, private: false, access: { has: obj => "placement" in obj, get: obj => obj.placement, set: (obj, value) => { obj.placement = value; } } }, _placement_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDrawer = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [
                'capturefocus',
                'close-on-click-outside',
                'close-on-escape',
                'mask',
                'name',
                'open',
                'placement',
                'size',
            ];
        }
        #capturefocus_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _capturefocus_initializers, void 0));
        get capturefocus() { return this.#capturefocus_accessor_storage; }
        set capturefocus(value) { this.#capturefocus_accessor_storage = value; }
        #closeOnClickOutside_accessor_storage = __runInitializers(this, _closeOnClickOutside_initializers, void 0);
        get closeOnClickOutside() { return this.#closeOnClickOutside_accessor_storage; }
        set closeOnClickOutside(value) { this.#closeOnClickOutside_accessor_storage = value; }
        #closeOnEscape_accessor_storage = __runInitializers(this, _closeOnEscape_initializers, void 0);
        get closeOnEscape() { return this.#closeOnEscape_accessor_storage; }
        set closeOnEscape(value) { this.#closeOnEscape_accessor_storage = value; }
        #mask_accessor_storage = __runInitializers(this, _mask_initializers, void 0);
        get mask() { return this.#mask_accessor_storage; }
        set mask(value) { this.#mask_accessor_storage = value; }
        #open_accessor_storage = __runInitializers(this, _open_initializers, void 0);
        get open() { return this.#open_accessor_storage; }
        set open(value) { this.#open_accessor_storage = value; }
        #name_accessor_storage = __runInitializers(this, _name_initializers, void 0);
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, '30%');
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #placement_accessor_storage = __runInitializers(this, _placement_initializers, 'right');
        get placement() { return this.#placement_accessor_storage; }
        set placement(value) { this.#placement_accessor_storage = value; }
        constructor() {
            super();
            this._appendStyle(styleTemplate());
            this._appendContent(contentTemplate());
            const shadowRoot = this.shadowRoot;
            const $name = shadowRoot.getElementById('name-prop');
            const $close = shadowRoot.getElementById('close');
            Object.assign(this._ref, { $name, $close });
            $close.onclick = () => (this.open = false);
            if (this.capturefocus) {
                this._captureFocus();
            }
        }
        render() {
            const top = '0';
            const right = '0';
            const bottom = '0';
            const left = '0';
            switch (this.placement) {
                case 'right': {
                    setStyles(this, {
                        top,
                        right,
                        bottom,
                        left: 'auto',
                        height: '100vh',
                        width: this.size,
                    });
                    break;
                }
                case 'left': {
                    setStyles(this, {
                        top,
                        right: 'auto',
                        bottom,
                        left,
                        height: '100vh',
                        width: this.size,
                    });
                    break;
                }
                case 'bottom': {
                    setStyles(this, {
                        top: 'auto',
                        right,
                        bottom,
                        left,
                        width: '100vw',
                        height: this.size,
                    });
                    break;
                }
                case 'top': {
                    setStyles(this, {
                        top,
                        right,
                        bottom: 'auto',
                        left,
                        width: '100vw',
                        height: this.size,
                    });
                    break;
                }
            }
            this._ref.$name.textContent = this.name;
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.parentElement !== document.body) {
                document.body.appendChild(this);
            }
            this.render();
            if (this.mask) {
                const $mask = this._ensureMask();
                this.parentElement?.insertBefore?.($mask, this);
                $mask.open = this.open;
            }
            this._initClickOutside();
            this._initKeydown();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this._ref.$mask && document.body.contains(this._ref.$mask)) {
                this._ref.$mask.open = false;
                this._ref.$mask.parentElement.removeChild(this._ref.$mask);
            }
            this._destroyClickOutside();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'open') {
                this.openTransitionName = `open${capitalize(this.placement)}`;
                this._onOpenAttributeChange();
                if (this.mask && this._ref.$mask) {
                    this._ref.$mask.open = newValue;
                }
            }
            if (attrName === 'mask' && this.mask) {
                if (this.mask && !this._ref.$mask) {
                    const $mask = this._ensureMask();
                    this.parentElement?.insertBefore?.($mask, this);
                    $mask.open = this.open;
                }
                else {
                    if (this._ref.$mask && document.body.contains(this._ref.$mask)) {
                        const $mask = this._ref.$mask;
                        $mask.open = false;
                        $mask.parentElement.removeChild(this._ref.$mask);
                    }
                }
            }
            if (attrName === 'close-on-click-outside') {
                if (this.closeOnClickOutside) {
                    this._initClickOutside;
                }
                else {
                    this._destroyClickOutside();
                }
            }
            if (attrName === 'close-on-escape') {
                if (this.closeOnEscape) {
                    this._initKeydown();
                }
                else {
                    this._destroyKeydown();
                }
            }
            if (attrName === 'capturefocus') {
                if (this.capturefocus) {
                    this._captureFocus();
                }
                else {
                    this._stopCaptureFocus();
                }
            }
        }
        #clearKeydown;
        _initKeydown() {
            if (this.closeOnEscape && !this.#clearKeydown) {
                this.#clearKeydown = onKey('escape', () => {
                    if (this.open)
                        this.open = false;
                });
            }
        }
        _destroyKeydown() {
            if (this.#clearKeydown) {
                this.#clearKeydown();
                this.#clearKeydown = undefined;
            }
        }
        #clearClickOutside;
        _initClickOutside() {
            if (this.closeOnClickOutside && !this.#clearClickOutside) {
                this.#clearClickOutside = onClickOutside(this, () => {
                    if (this.open)
                        this.open = false;
                });
            }
        }
        _destroyClickOutside() {
            if (this.#clearClickOutside) {
                this.#clearClickOutside();
                this.#clearClickOutside = undefined;
            }
        }
        _ensureMask() {
            if (!this._ref.$mask) {
                this._ref.$mask = document.createElement('bl-modal-mask');
            }
            this._ref.$mask.open = this.open;
            return this._ref.$mask;
        }
        _captureFocus() {
            const { $layout } = this._ref;
            this._ref.$firstFocusable =
                $layout.querySelector('#first') ||
                    $layout.insertBefore(document.createElement('button'), $layout.firstChild);
            this._ref.$lastFocusable =
                $layout.querySelector('#last') ||
                    $layout.appendChild(document.createElement('button'));
            this._ref.$firstFocusable.id = 'first';
            this._ref.$lastFocusable.id = 'last';
            this._ref.$firstFocusable.onkeydown = e => {
                if (e.key === 'Tab' && e.shiftKey) {
                    this._ref.$lastFocusable?.focus?.();
                }
            };
            this._ref.$lastFocusable.onkeydown = e => {
                if (e.key === 'Tab' && !e.shiftKey) {
                    this._ref.$firstFocusable?.focus?.();
                }
            };
        }
        _stopCaptureFocus() {
            if (this._ref.$firstFocusable?.parentElement) {
                this._ref.$layout.removeChild(this._ref.$firstFocusable);
            }
            if (this._ref.$lastFocusable?.parentElement) {
                this._ref.$layout.removeChild(this._ref.$lastFocusable);
            }
        }
    };
    return BlocksDrawer = _classThis;
})();
applyMixins(BlocksDrawer, [WithOpenTransition]);
