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
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
import { strGetter, strSetter } from '../../common/property.js';
import { popupStyleTemplate, popupTemplate } from './template.js';
import { Control } from '../base-control/index.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
const ARROW_SIZE = 8;
export var PopupOrigin;
(function (PopupOrigin) {
    PopupOrigin["Center"] = "center";
    PopupOrigin["TopStart"] = "top-start";
    PopupOrigin["TopCenter"] = "top-center";
    PopupOrigin["TopEnd"] = "top-end";
    PopupOrigin["RightStart"] = "right-start";
    PopupOrigin["RightCenter"] = "right-center";
    PopupOrigin["RightEnd"] = "right-end";
    PopupOrigin["BottomEnd"] = "bottom-end";
    PopupOrigin["BottomCenter"] = "bottom-center";
    PopupOrigin["BottomStart"] = "bottom-start";
    PopupOrigin["LeftEnd"] = "left-end";
    PopupOrigin["LeftCenter"] = "left-center";
    PopupOrigin["LeftStart"] = "left-start";
})(PopupOrigin || (PopupOrigin = {}));
const originArray = Object.values(PopupOrigin);
export let BlocksPopup = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-popup',
            mixins: [WithOpenTransition],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _origin_decorators;
    let _origin_initializers = [];
    let _inset_decorators;
    let _inset_initializers = [];
    let _appendToBody_decorators;
    let _appendToBody_initializers = [];
    let _arrow_decorators;
    let _arrow_initializers = [];
    let _autofocus_decorators;
    let _autofocus_initializers = [];
    let _capturefocus_decorators;
    let _capturefocus_initializers = [];
    let _autoflip_decorators;
    let _autoflip_initializers = [];
    let _restorefocus_decorators;
    let _restorefocus_initializers = [];
    var BlocksPopup = class extends Control {
        static {
            _origin_decorators = [attr('enum', { enumValues: originArray })];
            _inset_decorators = [attr('boolean')];
            _appendToBody_decorators = [attr('boolean')];
            _arrow_decorators = [attr('boolean')];
            _autofocus_decorators = [attr('boolean')];
            _capturefocus_decorators = [attr('boolean')];
            _autoflip_decorators = [attr('boolean')];
            _restorefocus_decorators = [attr('boolean')];
            __esDecorate(this, null, _origin_decorators, { kind: "accessor", name: "origin", static: false, private: false, access: { has: obj => "origin" in obj, get: obj => obj.origin, set: (obj, value) => { obj.origin = value; } } }, _origin_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _inset_decorators, { kind: "accessor", name: "inset", static: false, private: false, access: { has: obj => "inset" in obj, get: obj => obj.inset, set: (obj, value) => { obj.inset = value; } } }, _inset_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _appendToBody_decorators, { kind: "accessor", name: "appendToBody", static: false, private: false, access: { has: obj => "appendToBody" in obj, get: obj => obj.appendToBody, set: (obj, value) => { obj.appendToBody = value; } } }, _appendToBody_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _arrow_decorators, { kind: "accessor", name: "arrow", static: false, private: false, access: { has: obj => "arrow" in obj, get: obj => obj.arrow, set: (obj, value) => { obj.arrow = value; } } }, _arrow_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _autofocus_decorators, { kind: "accessor", name: "autofocus", static: false, private: false, access: { has: obj => "autofocus" in obj, get: obj => obj.autofocus, set: (obj, value) => { obj.autofocus = value; } } }, _autofocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _capturefocus_decorators, { kind: "accessor", name: "capturefocus", static: false, private: false, access: { has: obj => "capturefocus" in obj, get: obj => obj.capturefocus, set: (obj, value) => { obj.capturefocus = value; } } }, _capturefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _autoflip_decorators, { kind: "accessor", name: "autoflip", static: false, private: false, access: { has: obj => "autoflip" in obj, get: obj => obj.autoflip, set: (obj, value) => { obj.autoflip = value; } } }, _autoflip_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _restorefocus_decorators, { kind: "accessor", name: "restorefocus", static: false, private: false, access: { has: obj => "restorefocus" in obj, get: obj => obj.restorefocus, set: (obj, value) => { obj.restorefocus = value; } } }, _restorefocus_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPopup = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'popup';
        }
        static get observedAttributes() {
            return super.observedAttributes.concat([
                'anchor',
                'append-to-body',
                'arrow',
                'autoflip',
                'autofocus',
                'capturefocus',
                'inset',
                'offset',
                'origin',
                'restorefocus',
            ]);
        }
        #origin_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _origin_initializers, PopupOrigin.Center));
        get origin() { return this.#origin_accessor_storage; }
        set origin(value) { this.#origin_accessor_storage = value; }
        #inset_accessor_storage = __runInitializers(this, _inset_initializers, void 0);
        get inset() { return this.#inset_accessor_storage; }
        set inset(value) { this.#inset_accessor_storage = value; }
        #appendToBody_accessor_storage = __runInitializers(this, _appendToBody_initializers, void 0);
        get appendToBody() { return this.#appendToBody_accessor_storage; }
        set appendToBody(value) { this.#appendToBody_accessor_storage = value; }
        #arrow_accessor_storage = __runInitializers(this, _arrow_initializers, void 0);
        get arrow() { return this.#arrow_accessor_storage; }
        set arrow(value) { this.#arrow_accessor_storage = value; }
        #autofocus_accessor_storage = __runInitializers(this, _autofocus_initializers, void 0);
        get autofocus() { return this.#autofocus_accessor_storage; }
        set autofocus(value) { this.#autofocus_accessor_storage = value; }
        #capturefocus_accessor_storage = __runInitializers(this, _capturefocus_initializers, void 0);
        get capturefocus() { return this.#capturefocus_accessor_storage; }
        set capturefocus(value) { this.#capturefocus_accessor_storage = value; }
        #autoflip_accessor_storage = __runInitializers(this, _autoflip_initializers, void 0);
        get autoflip() { return this.#autoflip_accessor_storage; }
        set autoflip(value) { this.#autoflip_accessor_storage = value; }
        #restorefocus_accessor_storage = __runInitializers(this, _restorefocus_initializers, void 0);
        get restorefocus() { return this.#restorefocus_accessor_storage; }
        set restorefocus(value) { this.#restorefocus_accessor_storage = value; }
        constructor() {
            super();
            this._appendStyle(popupStyleTemplate());
            this._ref.$layout.appendChild(popupTemplate());
            const shadowRoot = this.shadowRoot;
            const $arrow = shadowRoot.querySelector('#arrow');
            const $slot = shadowRoot.querySelector('slot');
            Object.assign(this._ref, {
                $arrow,
                $slot,
            });
            this.addEventListener('opened', () => {
                if (this.autofocus)
                    this._focus();
                this.updatePositionAndDirection();
            });
            this.addEventListener('closed', () => {
                this._blur();
            });
            if (this.capturefocus) {
                this._captureFocus();
            }
        }
        get offset() {
            const value = strGetter('offset')(this);
            if (value)
                return JSON.parse(value);
            return [0, 0];
        }
        set offset(value) {
            strSetter('offset')(this, JSON.stringify(value));
        }
        #getAnchorFn;
        get anchor() {
            return this.#getAnchorFn ?? strGetter('anchor')(this);
        }
        set anchor(value) {
            if (typeof value === 'string' || value === null) {
                strSetter('anchor')(this, value);
                this.#getAnchorFn = undefined;
            }
            else {
                strSetter('anchor')(this, null);
                if (typeof value === 'function') {
                    this.#getAnchorFn = value;
                }
                else if (value instanceof Node) {
                    this.#getAnchorFn = () => value;
                }
            }
            this.updatePositionAndDirection();
        }
        getAnchorFrame() {
            let x1;
            let x2;
            let y1;
            let y2;
            let layoutAnchor;
            const anchor = typeof this.anchor === 'function' ? this.anchor() : this.anchor;
            if (anchor === null) {
                layoutAnchor = getOffsetParent(this);
            }
            else if (anchor instanceof Element) {
                layoutAnchor = anchor;
            }
            else if (typeof anchor === 'string') {
                if (!anchor.trim()) {
                    layoutAnchor = getOffsetParent(this);
                }
                else if (/\[\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
                    ;
                    [x1, y1, x2, y2] = JSON.parse(anchor);
                }
                else if (/\[\s*\d+\s*,\s*\d+\s*\]/.test(anchor)) {
                    ;
                    [x1, y1] = JSON.parse(anchor);
                    x2 = x1;
                    y2 = y1;
                }
                else {
                    layoutAnchor = document.querySelector(anchor);
                    if (layoutAnchor === null) {
                        layoutAnchor = getOffsetParent(this);
                    }
                }
            }
            if (layoutAnchor) {
                const rect = layoutAnchor.getBoundingClientRect();
                y1 = Math.floor(rect.top);
                x1 = Math.floor(rect.left);
                y2 = y1 + rect.height;
                x2 = x1 + rect.width;
            }
            else {
                const { top, left } = getOffsetParent(this).getBoundingClientRect();
                x1 += left;
                x2 += left;
                y1 += top;
                y2 += top;
            }
            return { x1, y1, x2, y2 };
        }
        render() {
        }
        updatePositionAndDirection() {
            if (!this.open)
                return;
            const popup = this._ref.$layout;
            const popupWidth = popup.offsetWidth;
            const popupHeight = popup.offsetHeight;
            const layoutParent = getOffsetParent(this);
            if (!layoutParent)
                return;
            const { scrollTop: layoutScrollTop, scrollLeft: layoutScrollLeft, scrollWidth: layoutWidth, scrollHeight: layoutHeight, } = layoutParent;
            const { top: layoutOffsetTop, left: layoutOffsetLeft } = layoutParent.getBoundingClientRect();
            const [ox, oy] = this.offset;
            const { x1, y1, x2, y2 } = this.getAnchorFrame();
            let top;
            let left;
            let shadowX;
            let shadowY;
            let originX;
            let originY;
            const verticalFlip = () => {
                shadowY = {
                    top: 'bottom',
                    bottom: 'top',
                    center: 'center',
                }[shadowY];
                originY = {
                    top: 'bottom',
                    bottom: 'top',
                    center: 'center',
                }[originY];
            };
            const horizontalFlip = () => {
                shadowX = {
                    left: 'right',
                    right: 'left',
                }[shadowX];
                originX = {
                    left: 'right',
                    right: 'left',
                }[originX];
            };
            const arrowSize = this.arrow ? ARROW_SIZE : 0;
            if (this.origin.startsWith('top')) {
                top = (this.inset ? y1 : y2) + arrowSize + oy;
                originY = 'top';
                shadowY = 'bottom';
                if (this.autoflip && top + popupHeight > layoutHeight) {
                    const flipTop = (this.inset ? y2 : y1) - arrowSize - oy - popupHeight;
                    if (flipTop > 0) {
                        top = flipTop;
                        verticalFlip();
                    }
                }
            }
            else if (this.origin.startsWith('right')) {
                left = (this.inset ? x2 : x1) - arrowSize - ox - popupWidth;
                originX = 'right';
                shadowX = 'left';
                if (this.autoflip && left < 0) {
                    const flipLeft = (this.inset ? x1 : x2) + arrowSize + ox;
                    if (flipLeft + popupWidth < layoutWidth) {
                        left = flipLeft;
                        horizontalFlip();
                    }
                }
            }
            else if (this.origin.startsWith('bottom')) {
                top = (this.inset ? y2 : y1) - arrowSize - oy - popupHeight;
                originY = 'bottom';
                shadowY = 'top';
                if (this.autoflip && top < 0) {
                    const flipTop = (this.inset ? y1 : y2) + arrowSize + oy;
                    if (flipTop + popupHeight < layoutHeight) {
                        top = flipTop;
                        verticalFlip();
                    }
                }
            }
            else if (this.origin.startsWith('left')) {
                left = (this.inset ? x1 : x2) + arrowSize + ox;
                originX = 'left';
                shadowX = 'right';
                if (this.autoflip && left + popupWidth > layoutWidth) {
                    const flipLeft = (this.inset ? x2 : x1) - arrowSize - ox - popupWidth;
                    if (flipLeft > 0) {
                        left = flipLeft;
                        horizontalFlip();
                    }
                }
            }
            else {
                top = y1 + (y2 - y1) / 2 - popupHeight / 2 + oy;
                left = x1 + (x2 - x1) / 2 - popupWidth / 2 + ox;
                originX = 'center';
                originY = 'center';
                shadowX = 'center';
                shadowY = 'center';
            }
            if (this._isVertical()) {
                if (this.origin.endsWith('start')) {
                    left = x1 + ox;
                    originX = 'left';
                    shadowX = 'right';
                    if (this.autoflip &&
                        left + popupWidth > layoutWidth &&
                        x2 - ox - popupWidth > 0) {
                        left = x2 - ox - popupWidth;
                        horizontalFlip();
                    }
                }
                else if (this.origin.endsWith('end')) {
                    left = x2 - ox - popupWidth;
                    originX = 'right';
                    shadowX = 'left';
                    if (this.autoflip && left < 0 && x1 + ox + popupWidth < layoutWidth) {
                        left = x1 + ox;
                        horizontalFlip();
                    }
                }
                else if (this.origin.endsWith('center')) {
                    left = x1 + (x2 - x1) / 2 - popupWidth / 2 + ox;
                    originX = 'center';
                    shadowX = 'center';
                }
            }
            else if (this._isHorizontal()) {
                if (this.origin.endsWith('start')) {
                    top = y1 + oy;
                    originY = 'top';
                    shadowY = 'bottom';
                    if (this.autoflip &&
                        top + popupHeight > layoutHeight &&
                        y2 - oy - popupHeight > 0) {
                        top = y2 - oy - popupHeight;
                        verticalFlip();
                    }
                }
                else if (this.origin.endsWith('end')) {
                    top = y2 - oy - popupHeight;
                    originY = 'bottom';
                    shadowY = 'top';
                    if (this.autoflip && top < 0 && y1 + oy + popupHeight < layoutHeight) {
                        top = y1 + oy + popupHeight;
                        verticalFlip();
                    }
                }
                else if (this.origin.endsWith('center')) {
                    top = y1 + (y2 - y1) / 2 - popupHeight / 2 + oy;
                    originY = 'center';
                    shadowY = 'center';
                }
            }
            this.style.top = `${top + layoutScrollTop - layoutOffsetTop}px`;
            this.style.left = `${left + layoutScrollLeft - layoutOffsetLeft}px`;
            this._setOrigin(originY, originX);
        }
        #refreshPosition;
        _initAnchorEvent() {
            if (this.#refreshPosition)
                return;
            this.#refreshPosition = () => this.open && this.anchor && this.updatePositionAndDirection();
            window.addEventListener('scroll', this.#refreshPosition, true);
            window.addEventListener('touchstart', this.#refreshPosition);
            window.addEventListener('click', this.#refreshPosition);
        }
        _destroyAnchorEvent() {
            if (!this.#refreshPosition)
                return;
            window.removeEventListener('scroll', this.#refreshPosition, true);
            window.removeEventListener('touchstart', this.#refreshPosition);
            window.removeEventListener('click', this.#refreshPosition);
            this.#refreshPosition = null;
        }
        connectedCallback() {
            super.connectedCallback();
            if (this.appendToBody && this.parentElement !== document.body) {
                document.body.appendChild(this);
            }
            if (this.open) {
                this._onOpenAttributeChange();
                this._updateVisible();
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this._destroyAnchorEvent();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            switch (attrName) {
                case 'open': {
                    this._onOpenAttributeChange();
                    this._updateVisible();
                    break;
                }
                case 'anchor': {
                    this.anchor = newValue;
                    break;
                }
                case 'offset': {
                    this.updatePositionAndDirection();
                    break;
                }
                case 'arrow': {
                    this._updateArrow();
                    this.updatePositionAndDirection();
                    break;
                }
                case 'append-to-body': {
                    if (this.appendToBody &&
                        this.parentElement !== document.body &&
                        document.documentElement.contains(this)) {
                        document.body.appendChild(this);
                    }
                    this.updatePositionAndDirection();
                    break;
                }
                case 'capturefocus': {
                    if (this.capturefocus) {
                        this._captureFocus();
                    }
                    else {
                        this._stopCaptureFocus();
                    }
                    break;
                }
                case 'origin': {
                    this._updateClass();
                    this._updateArrow();
                    this.updatePositionAndDirection();
                    break;
                }
                default: {
                    this.updatePositionAndDirection();
                    break;
                }
            }
        }
        #firstFocusable;
        #lastFocusable;
        _captureFocus() {
            this.#firstFocusable =
                this._ref.$layout.querySelector('#first') ||
                    this._ref.$layout.insertBefore(document.createElement('button'), this._ref.$layout.firstChild);
            this.#lastFocusable =
                this._ref.$layout.querySelector('#last') ||
                    this._ref.$layout.appendChild(document.createElement('button'));
            this.#firstFocusable.id = 'first';
            this.#lastFocusable.id = 'last';
            this.#firstFocusable.onkeydown = e => {
                if (e.key === 'Tab' && e.shiftKey) {
                    this.#lastFocusable?.focus?.();
                }
            };
            this.#lastFocusable.onkeydown = e => {
                if (e.key === 'Tab' && !e.shiftKey) {
                    this.#firstFocusable?.focus?.();
                }
            };
        }
        _stopCaptureFocus() {
            if (this.#firstFocusable && this.#firstFocusable.parentElement) {
                this._ref.$layout.removeChild(this.#firstFocusable);
            }
            if (this.#firstFocusable && this.#lastFocusable?.parentElement) {
                this._ref.$layout.removeChild(this.#lastFocusable);
            }
        }
        _updateVisible() {
            this._updateClass();
            this._updateArrow();
            this.updatePositionAndDirection();
            if (this.open) {
                this._initAnchorEvent();
            }
            else {
                this._destroyAnchorEvent();
            }
        }
        _isHorizontal() {
            return this.origin.startsWith('left') || this.origin.startsWith('right');
        }
        _isVertical() {
            return this.origin.startsWith('top') || this.origin.startsWith('bottom');
        }
        _updateClass() {
            if (this._isHorizontal()) {
                this._ref.$layout.classList.add('horizontal');
                this._ref.$layout.classList.remove('vertical');
            }
            else if (this._isVertical()) {
                this._ref.$layout.classList.remove('horizontal');
                this._ref.$layout.classList.add('vertical');
            }
            else {
                this._ref.$layout.classList.remove('horizontal');
                this._ref.$layout.classList.remove('vertical');
            }
        }
        _updateArrow() {
            if (this.arrow) {
                this._ref.$arrow.style.display = '';
            }
            else {
                this._ref.$arrow.style.display = 'none';
            }
        }
        #prevFocus;
        _focus() {
            if (this.restorefocus && !this.#prevFocus) {
                this.#prevFocus = document.activeElement;
            }
            this.focus();
        }
        _blur() {
            this.blur();
            if (this.#prevFocus) {
                if (this.restorefocus && typeof this.#prevFocus.focus) {
                    this.#prevFocus.focus();
                }
                this.#prevFocus = undefined;
            }
        }
        _setOriginClass(value) {
            ;
            [...this._ref.$layout.classList.values()].forEach(className => {
                if (className !== value && className.startsWith('origin-')) {
                    this._ref.$layout.classList.remove(className);
                }
            });
            this._ref.$layout.classList.add(value);
        }
        _setOrigin(y, x) {
            this._setOriginClass(`origin-${y}-${x}`);
            this.style.transformOrigin = `${y} ${x}`;
        }
    };
    return BlocksPopup = _classThis;
})();
function getOffsetParent(popup) {
    let el = popup;
    while (el) {
        if (el.offsetParent) {
            return el.offsetParent;
        }
        el = el.parentElement;
    }
    return null;
}
