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
import '../button/index.js';
import '../modal-mask/index.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { onDragMove } from '../../common/onDragMove.js';
import { dialogTemplate } from './template.js';
import { style as withOpenTransitionStyle } from '../with-open-transition/style.js';
import { style } from './style.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { applyMixins } from '../../common/applyMixins.js';
import { Control } from '../base-control/index.js';
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js';
import { customElement } from '../../decorators/customElement.js';
import { applyStyle } from '../../decorators/style.js';
import { attr } from '../../decorators/attr.js';
let BlocksDialog = (() => {
    let _classDecorators = [customElement('bl-dialog'), applyStyle(style), applyStyle(withOpenTransitionStyle)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _mask_decorators;
    let _mask_initializers = [];
    let _closeable_decorators;
    let _closeable_initializers = [];
    let _capturefocus_decorators;
    let _capturefocus_initializers = [];
    let _appendToBody_decorators;
    let _appendToBody_initializers = [];
    let _titleText_decorators;
    let _titleText_initializers = [];
    var BlocksDialog = class extends Control {
        static {
            _mask_decorators = [attr('boolean')];
            _closeable_decorators = [attr('boolean')];
            _capturefocus_decorators = [attr('boolean')];
            _appendToBody_decorators = [attr('boolean')];
            _titleText_decorators = [attr('string')];
            __esDecorate(this, null, _mask_decorators, { kind: "accessor", name: "mask", static: false, private: false, access: { has: obj => "mask" in obj, get: obj => obj.mask, set: (obj, value) => { obj.mask = value; } } }, _mask_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeable_decorators, { kind: "accessor", name: "closeable", static: false, private: false, access: { has: obj => "closeable" in obj, get: obj => obj.closeable, set: (obj, value) => { obj.closeable = value; } } }, _closeable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _capturefocus_decorators, { kind: "accessor", name: "capturefocus", static: false, private: false, access: { has: obj => "capturefocus" in obj, get: obj => obj.capturefocus, set: (obj, value) => { obj.capturefocus = value; } } }, _capturefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _appendToBody_decorators, { kind: "accessor", name: "appendToBody", static: false, private: false, access: { has: obj => "appendToBody" in obj, get: obj => obj.appendToBody, set: (obj, value) => { obj.appendToBody = value; } } }, _appendToBody_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _titleText_decorators, { kind: "accessor", name: "titleText", static: false, private: false, access: { has: obj => "titleText" in obj, get: obj => obj.titleText, set: (obj, value) => { obj.titleText = value; } } }, _titleText_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDialog = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return super.observedAttributes.concat([
                'append-to-body',
                'open',
                'title-text',
                'closeable',
                'capturefocus',
                'mask',
            ]);
        }
        static get role() {
            return 'dialog';
        }
        #mask_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _mask_initializers, void 0));
        get mask() { return this.#mask_accessor_storage; }
        set mask(value) { this.#mask_accessor_storage = value; }
        #closeable_accessor_storage = __runInitializers(this, _closeable_initializers, void 0);
        get closeable() { return this.#closeable_accessor_storage; }
        set closeable(value) { this.#closeable_accessor_storage = value; }
        #capturefocus_accessor_storage = __runInitializers(this, _capturefocus_initializers, void 0);
        get capturefocus() { return this.#capturefocus_accessor_storage; }
        set capturefocus(value) { this.#capturefocus_accessor_storage = value; }
        #appendToBody_accessor_storage = __runInitializers(this, _appendToBody_initializers, void 0);
        get appendToBody() { return this.#appendToBody_accessor_storage; }
        set appendToBody(value) { this.#appendToBody_accessor_storage = value; }
        #titleText_accessor_storage = __runInitializers(this, _titleText_initializers, '');
        get titleText() { return this.#titleText_accessor_storage; }
        set titleText(value) { this.#titleText_accessor_storage = value; }
        removeAfterClose = false;
        constructor() {
            super();
            this._appendStyle(withOpenTransitionStyleTemplate());
            this._ref.$layout.appendChild(dialogTemplate());
            const $mask = document.createElement('bl-modal-mask');
            this._ref.$mask = $mask;
            const _refocus = () => {
                this.focus();
                this.removeEventListener('blur', _refocus);
            };
            $mask.addEventListener('mousedown', () => {
                this.focus();
                this.addEventListener('blur', _refocus);
            });
            $mask.addEventListener('mouseup', () => {
                this.removeEventListener('blur', _refocus);
            });
            this.addEventListener('opened', () => {
                this._focus();
            });
            this.addEventListener('closed', () => {
                this._blur();
                if (this.removeAfterClose) {
                    this.parentElement && this.parentElement.removeChild(this);
                }
            });
            this._ref.$layout.addEventListener('slotchange', () => {
                this.render();
            });
            if (this.capturefocus) {
                this._captureFocus();
            }
        }
        render() {
            super.render();
            this._renderHeader();
            this._renderFooter();
            this._renderClose();
        }
        _captureFocus() {
            this._ref.$firstFocusable =
                this._ref.$layout.querySelector('#first') ||
                    this._ref.$layout.insertBefore(document.createElement('button'), this._ref.$layout.firstChild);
            this._ref.$lastFocusable =
                this._ref.$layout.querySelector('#last') ||
                    this._ref.$layout.appendChild(document.createElement('button'));
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
        _updateVisible() {
            if (this.open) {
                if (!this.style.left) {
                    this.style.left =
                        (document.body.clientWidth - this.offsetWidth) / 2 + 'px';
                }
                if (!this.style.top) {
                    this.style.top =
                        (document.body.clientHeight - this.offsetHeight) / 2 + 'px';
                }
                if (this._ref.$mask) {
                    this._ref.$mask.open = true;
                }
            }
            else {
                if (this._ref.$mask) {
                    this._ref.$mask.open = false;
                }
            }
        }
        _renderClose() {
            if (this.closeable) {
                if (!this._ref.$close) {
                    this._ref.$close = document.createElement('button');
                    this._ref.$close.id = 'close';
                    this._ref.$close.appendChild(getRegisteredSvgIcon('cross'));
                    this._ref.$close.onclick = () => {
                        this.open = false;
                    };
                    if (this._ref.$lastFocusable) {
                        this._ref.$layout.insertBefore(this._ref.$close, this._ref.$lastFocusable);
                    }
                    else {
                        this._ref.$layout.appendChild(this._ref.$close);
                    }
                }
            }
            else {
                if (this._ref.$close) {
                    this._ref.$close.parentElement.removeChild(this._ref.$close);
                    this._ref.$close = undefined;
                }
            }
        }
        _renderHeader() {
            if (this.querySelectorHost('[slot="header"]')) {
                this._ref.$layout.classList.remove('no-header');
            }
            else if (this.titleText) {
                this._ref.$layout.classList.remove('no-header');
                const $title = this.querySelectorShadow('h1');
                $title.innerText = this.titleText;
            }
            else {
                this._ref.$layout.classList.add('no-header');
            }
        }
        _renderFooter() {
            if (this.querySelector('[slot="footer"]')) {
                this._ref.$layout.classList.remove('no-footer');
            }
            else {
                this._ref.$layout.classList.add('no-footer');
            }
        }
        #prevFocus;
        _focus() {
            if (!this.#prevFocus) {
                this.#prevFocus = document.activeElement;
            }
            this.focus();
        }
        _blur() {
            this.blur();
            if (this.#prevFocus) {
                ;
                this.#prevFocus?.focus?.();
                this.#prevFocus = undefined;
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.setAttribute('tabindex', '-1');
            if (this.parentElement !== document.body) {
                document.body.appendChild(this);
            }
            if (this.mask) {
                this.parentElement?.insertBefore?.(this._ref.$mask, this);
            }
            this._renderHeader();
            this._renderFooter();
            this._initDragEvents();
        }
        _initDragEvents() {
            let startX;
            let startY;
            const isHeader = (target) => {
                if (this._ref.$layout.querySelector('header').contains(target)) {
                    return true;
                }
                if (this.contains(target)) {
                    let el = target;
                    while (el && el !== this) {
                        if (el.slot === 'header')
                            return true;
                        el = el.parentElement;
                    }
                }
                return false;
            };
            onDragMove(this._ref.$layout, {
                onStart: ({ $target, stop }) => {
                    if (!isHeader($target))
                        return stop();
                    const marginLeft = parseFloat(window.getComputedStyle(this).marginLeft || '0');
                    const marginTop = parseFloat(window.getComputedStyle(this).marginTop || '0');
                    startX = this.offsetLeft - marginLeft;
                    startY = this.offsetTop - marginTop;
                },
                onMove: ({ offset }) => {
                    this.style.left = startX + offset.x + 'px';
                    this.style.top = startY + offset.y + 'px';
                },
            });
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this._ref.$mask && this._ref.$mask.parentElement) {
                this._ref.$mask.parentElement.removeChild(this._ref.$mask);
            }
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName == 'open' && this.shadowRoot) {
                this._onOpenAttributeChange();
                this._updateVisible();
            }
            if (attrName === 'mask') {
                if (this.mask) {
                    this.parentElement?.insertBefore?.(this._ref.$mask, this);
                }
                else if (this._ref.$mask.parentElement) {
                    this._ref.$mask.parentElement.removeChild(this._ref.$mask);
                }
            }
            if (attrName === 'title-text') {
                this._renderHeader();
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
    };
    return BlocksDialog = _classThis;
})();
applyMixins(BlocksDialog, [WithOpenTransition]);
export { BlocksDialog };
