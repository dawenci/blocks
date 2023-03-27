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
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { updateBg } from './bg.js';
import { prop } from '../../decorators/prop.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { style } from './style.js';
import { template } from './template.js';
import { Component } from '../component/Component.js';
import { PopupOrigin } from './origin.js';
import { SetupFocusCapture } from '../setup-focus-capture/index.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
const originArray = Object.values(PopupOrigin);
export let BlocksPopup = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-popup',
            attachShadow: {
                mode: 'open',
                delegatesFocus: false,
            },
            styles: [style],
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
    let _focusable_decorators;
    let _focusable_initializers = [];
    let _autofocus_decorators;
    let _autofocus_initializers = [];
    let _capturefocus_decorators;
    let _capturefocus_initializers = [];
    let _autoflip_decorators;
    let _autoflip_initializers = [];
    let _restorefocus_decorators;
    let _restorefocus_initializers = [];
    let _offsetX_decorators;
    let _offsetX_initializers = [];
    let _offsetY_decorators;
    let _offsetY_initializers = [];
    let _anchorX_decorators;
    let _anchorX_initializers = [];
    let _anchorY_decorators;
    let _anchorY_initializers = [];
    let _anchorWidth_decorators;
    let _anchorWidth_initializers = [];
    let _anchorHeight_decorators;
    let _anchorHeight_initializers = [];
    let _anchorSelector_decorators;
    let _anchorSelector_initializers = [];
    let _anchorElement_decorators;
    let _anchorElement_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    let _$bg_decorators;
    let _$bg_initializers = [];
    let _$shadow_decorators;
    let _$shadow_initializers = [];
    var BlocksPopup = class extends Component {
        static {
            _origin_decorators = [attr('enum', { enumValues: originArray })];
            _inset_decorators = [attr('boolean')];
            _appendToBody_decorators = [attr('boolean')];
            _arrow_decorators = [attr('int')];
            _focusable_decorators = [attr('boolean')];
            _autofocus_decorators = [attr('boolean')];
            _capturefocus_decorators = [attr('boolean')];
            _autoflip_decorators = [attr('boolean')];
            _restorefocus_decorators = [attr('boolean')];
            _offsetX_decorators = [attr('number')];
            _offsetY_decorators = [attr('number')];
            _anchorX_decorators = [attr('number')];
            _anchorY_decorators = [attr('number')];
            _anchorWidth_decorators = [attr('number')];
            _anchorHeight_decorators = [attr('number')];
            _anchorSelector_decorators = [attr('string')];
            _anchorElement_decorators = [prop({
                    get(self) {
                        return self.#anchorElement;
                    },
                    set: (self, value) => {
                        self.#anchorElement = value;
                        self.updatePositionAndDirection();
                    },
                })];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$slot_decorators = [shadowRef('[part="default-slot"]')];
            _$bg_decorators = [shadowRef('[part="bg"]', false)];
            _$shadow_decorators = [shadowRef('[part="shadow"]', false)];
            __esDecorate(this, null, _origin_decorators, { kind: "accessor", name: "origin", static: false, private: false, access: { has: obj => "origin" in obj, get: obj => obj.origin, set: (obj, value) => { obj.origin = value; } } }, _origin_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _inset_decorators, { kind: "accessor", name: "inset", static: false, private: false, access: { has: obj => "inset" in obj, get: obj => obj.inset, set: (obj, value) => { obj.inset = value; } } }, _inset_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _appendToBody_decorators, { kind: "accessor", name: "appendToBody", static: false, private: false, access: { has: obj => "appendToBody" in obj, get: obj => obj.appendToBody, set: (obj, value) => { obj.appendToBody = value; } } }, _appendToBody_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _arrow_decorators, { kind: "accessor", name: "arrow", static: false, private: false, access: { has: obj => "arrow" in obj, get: obj => obj.arrow, set: (obj, value) => { obj.arrow = value; } } }, _arrow_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _focusable_decorators, { kind: "accessor", name: "focusable", static: false, private: false, access: { has: obj => "focusable" in obj, get: obj => obj.focusable, set: (obj, value) => { obj.focusable = value; } } }, _focusable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _autofocus_decorators, { kind: "accessor", name: "autofocus", static: false, private: false, access: { has: obj => "autofocus" in obj, get: obj => obj.autofocus, set: (obj, value) => { obj.autofocus = value; } } }, _autofocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _capturefocus_decorators, { kind: "accessor", name: "capturefocus", static: false, private: false, access: { has: obj => "capturefocus" in obj, get: obj => obj.capturefocus, set: (obj, value) => { obj.capturefocus = value; } } }, _capturefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _autoflip_decorators, { kind: "accessor", name: "autoflip", static: false, private: false, access: { has: obj => "autoflip" in obj, get: obj => obj.autoflip, set: (obj, value) => { obj.autoflip = value; } } }, _autoflip_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _restorefocus_decorators, { kind: "accessor", name: "restorefocus", static: false, private: false, access: { has: obj => "restorefocus" in obj, get: obj => obj.restorefocus, set: (obj, value) => { obj.restorefocus = value; } } }, _restorefocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _offsetX_decorators, { kind: "accessor", name: "offsetX", static: false, private: false, access: { has: obj => "offsetX" in obj, get: obj => obj.offsetX, set: (obj, value) => { obj.offsetX = value; } } }, _offsetX_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _offsetY_decorators, { kind: "accessor", name: "offsetY", static: false, private: false, access: { has: obj => "offsetY" in obj, get: obj => obj.offsetY, set: (obj, value) => { obj.offsetY = value; } } }, _offsetY_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _anchorX_decorators, { kind: "accessor", name: "anchorX", static: false, private: false, access: { has: obj => "anchorX" in obj, get: obj => obj.anchorX, set: (obj, value) => { obj.anchorX = value; } } }, _anchorX_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _anchorY_decorators, { kind: "accessor", name: "anchorY", static: false, private: false, access: { has: obj => "anchorY" in obj, get: obj => obj.anchorY, set: (obj, value) => { obj.anchorY = value; } } }, _anchorY_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _anchorWidth_decorators, { kind: "accessor", name: "anchorWidth", static: false, private: false, access: { has: obj => "anchorWidth" in obj, get: obj => obj.anchorWidth, set: (obj, value) => { obj.anchorWidth = value; } } }, _anchorWidth_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _anchorHeight_decorators, { kind: "accessor", name: "anchorHeight", static: false, private: false, access: { has: obj => "anchorHeight" in obj, get: obj => obj.anchorHeight, set: (obj, value) => { obj.anchorHeight = value; } } }, _anchorHeight_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _anchorSelector_decorators, { kind: "accessor", name: "anchorSelector", static: false, private: false, access: { has: obj => "anchorSelector" in obj, get: obj => obj.anchorSelector, set: (obj, value) => { obj.anchorSelector = value; } } }, _anchorSelector_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _anchorElement_decorators, { kind: "accessor", name: "anchorElement", static: false, private: false, access: { has: obj => "anchorElement" in obj, get: obj => obj.anchorElement, set: (obj, value) => { obj.anchorElement = value; } } }, _anchorElement_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$bg_decorators, { kind: "accessor", name: "$bg", static: false, private: false, access: { has: obj => "$bg" in obj, get: obj => obj.$bg, set: (obj, value) => { obj.$bg = value; } } }, _$bg_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$shadow_decorators, { kind: "accessor", name: "$shadow", static: false, private: false, access: { has: obj => "$shadow" in obj, get: obj => obj.$shadow, set: (obj, value) => { obj.$shadow = value; } } }, _$shadow_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPopup = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'popup';
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
        #arrow_accessor_storage = __runInitializers(this, _arrow_initializers, 0);
        get arrow() { return this.#arrow_accessor_storage; }
        set arrow(value) { this.#arrow_accessor_storage = value; }
        #focusable_accessor_storage = __runInitializers(this, _focusable_initializers, void 0);
        get focusable() { return this.#focusable_accessor_storage; }
        set focusable(value) { this.#focusable_accessor_storage = value; }
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
        #offsetX_accessor_storage = __runInitializers(this, _offsetX_initializers, 0);
        get offsetX() { return this.#offsetX_accessor_storage; }
        set offsetX(value) { this.#offsetX_accessor_storage = value; }
        #offsetY_accessor_storage = __runInitializers(this, _offsetY_initializers, 0);
        get offsetY() { return this.#offsetY_accessor_storage; }
        set offsetY(value) { this.#offsetY_accessor_storage = value; }
        #anchorX_accessor_storage = __runInitializers(this, _anchorX_initializers, void 0);
        get anchorX() { return this.#anchorX_accessor_storage; }
        set anchorX(value) { this.#anchorX_accessor_storage = value; }
        #anchorY_accessor_storage = __runInitializers(this, _anchorY_initializers, void 0);
        get anchorY() { return this.#anchorY_accessor_storage; }
        set anchorY(value) { this.#anchorY_accessor_storage = value; }
        #anchorWidth_accessor_storage = __runInitializers(this, _anchorWidth_initializers, 0);
        get anchorWidth() { return this.#anchorWidth_accessor_storage; }
        set anchorWidth(value) { this.#anchorWidth_accessor_storage = value; }
        #anchorHeight_accessor_storage = __runInitializers(this, _anchorHeight_initializers, 0);
        get anchorHeight() { return this.#anchorHeight_accessor_storage; }
        set anchorHeight(value) { this.#anchorHeight_accessor_storage = value; }
        #anchorSelector_accessor_storage = __runInitializers(this, _anchorSelector_initializers, void 0);
        get anchorSelector() { return this.#anchorSelector_accessor_storage; }
        set anchorSelector(value) { this.#anchorSelector_accessor_storage = value; }
        #anchorElement;
        #anchorElement_accessor_storage = __runInitializers(this, _anchorElement_initializers, void 0);
        get anchorElement() { return this.#anchorElement_accessor_storage; }
        set anchorElement(value) { this.#anchorElement_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        #$bg_accessor_storage = __runInitializers(this, _$bg_initializers, void 0);
        get $bg() { return this.#$bg_accessor_storage; }
        set $bg(value) { this.#$bg_accessor_storage = value; }
        #$shadow_accessor_storage = __runInitializers(this, _$shadow_initializers, void 0);
        get $shadow() { return this.#$shadow_accessor_storage; }
        set $shadow(value) { this.#$shadow_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupFocus();
            this.#setupAppendBody();
            this.#setupAnchorAdsorption();
            this.#setupArrow();
        }
        #isVerticalFlipped = false;
        #isHorizontalFlipped = false;
        updatePositionAndDirection() {
            if (!this.open)
                return;
            const popupWidth = this.clientWidth;
            const popupHeight = this.clientHeight;
            const layoutParent = getOffsetParent(this);
            if (!layoutParent)
                return;
            const { scrollTop: layoutScrollTop, scrollLeft: layoutScrollLeft, scrollWidth: layoutWidth, scrollHeight: layoutHeight, } = layoutParent;
            const { top: layoutOffsetTop, left: layoutOffsetLeft } = layoutParent.getBoundingClientRect();
            const offsetX = this.offsetX;
            const offsetY = this.offsetY;
            const { x1, y1, x2, y2 } = this.#getAnchorFrame();
            let top;
            let left;
            let originX;
            let originY;
            this.#isVerticalFlipped = this.#isHorizontalFlipped = false;
            const verticalFlip = () => {
                this.#isVerticalFlipped = true;
                originY = flipY(originY);
            };
            const horizontalFlip = () => {
                this.#isHorizontalFlipped = true;
                originX = flipX(originX);
            };
            if (this.origin.startsWith('top')) {
                top = (this.inset ? y1 : y2) + offsetY;
                originY = 'top';
                if (this.autoflip && top + popupHeight > layoutHeight) {
                    const flipTop = (this.inset ? y2 : y1) - offsetY - popupHeight;
                    if (flipTop > 0) {
                        top = flipTop;
                        verticalFlip();
                    }
                }
            }
            else if (this.origin.startsWith('right')) {
                left = (this.inset ? x2 : x1) - offsetX - popupWidth;
                originX = 'right';
                if (this.autoflip && left < 0) {
                    const flipLeft = (this.inset ? x1 : x2) + offsetX;
                    if (flipLeft + popupWidth < layoutWidth) {
                        left = flipLeft;
                        horizontalFlip();
                    }
                }
            }
            else if (this.origin.startsWith('bottom')) {
                top = (this.inset ? y2 : y1) - offsetY - popupHeight;
                originY = 'bottom';
                if (this.autoflip && top < 0) {
                    const flipTop = (this.inset ? y1 : y2) + offsetY;
                    if (flipTop + popupHeight < layoutHeight) {
                        top = flipTop;
                        verticalFlip();
                    }
                }
            }
            else if (this.origin.startsWith('left')) {
                left = (this.inset ? x1 : x2) + offsetX;
                originX = 'left';
                if (this.autoflip && left + popupWidth > layoutWidth) {
                    const flipLeft = (this.inset ? x2 : x1) - offsetX - popupWidth;
                    if (flipLeft > 0) {
                        left = flipLeft;
                        horizontalFlip();
                    }
                }
            }
            else {
                top = y1 + (y2 - y1) / 2 - popupHeight / 2 + offsetY;
                left = x1 + (x2 - x1) / 2 - popupWidth / 2 + offsetX;
                originX = 'center';
                originY = 'center';
            }
            if (this.#isVertical()) {
                if (this.origin.endsWith('start')) {
                    left = x1 + offsetX;
                    originX = 'left';
                    if (this.autoflip && left + popupWidth > layoutWidth && x2 - offsetX - popupWidth > 0) {
                        left = x2 - offsetX - popupWidth;
                        horizontalFlip();
                    }
                }
                else if (this.origin.endsWith('end')) {
                    left = x2 - offsetX - popupWidth;
                    originX = 'right';
                    if (this.autoflip && left < 0 && x1 + offsetX + popupWidth < layoutWidth) {
                        left = x1 + offsetX;
                        horizontalFlip();
                    }
                }
                else if (this.origin.endsWith('center')) {
                    left = x1 + (x2 - x1) / 2 - popupWidth / 2 + offsetX;
                    originX = 'center';
                }
            }
            else if (this.#isHorizontal()) {
                if (this.origin.endsWith('start')) {
                    top = y1 + offsetY;
                    originY = 'top';
                    if (this.autoflip && top + popupHeight > layoutHeight && y2 - offsetY - popupHeight > 0) {
                        top = y2 - offsetY - popupHeight;
                        verticalFlip();
                    }
                }
                else if (this.origin.endsWith('end')) {
                    top = y2 - offsetY - popupHeight;
                    originY = 'bottom';
                    if (this.autoflip && top < 0 && y1 + offsetY + popupHeight < layoutHeight) {
                        top = y1 + offsetY + popupHeight;
                        verticalFlip();
                    }
                }
                else if (this.origin.endsWith('center')) {
                    top = y1 + (y2 - y1) / 2 - popupHeight / 2 + offsetY;
                    originY = 'center';
                }
            }
            if (this.#isVerticalFlipped) {
                this.setAttribute('vertical-flipped', '');
            }
            else {
                this.removeAttribute('vertical-flipped');
            }
            if (this.#isHorizontalFlipped) {
                this.setAttribute('horizontal-flipped', '');
            }
            else {
                this.removeAttribute('horizontal-flipped');
            }
            this.style.transformOrigin = `${originY} ${originX}`;
            this.style.top = `${top + layoutScrollTop - layoutOffsetTop}px`;
            this.style.left = `${left + layoutScrollLeft - layoutOffsetLeft}px`;
            this.updateArrow();
        }
        #setupArrow() {
            const update = () => {
                this.updateArrow();
                this.updatePositionAndDirection();
            };
            let clear;
            const cleanup = () => {
                if (clear)
                    clear();
                clear = undefined;
            };
            this.onRender(update);
            this.onConnected(update);
            this.onAttributeChangedDep('arrow', update);
            this.onConnected(() => {
                clear = sizeObserve(this.$layout, update);
            });
            this.onDisconnected(() => {
                cleanup();
            });
        }
        updateArrow() {
            if (!this.open)
                return;
            const $svg = this.$bg;
            const origin = originTransform(this.origin, this.#isVerticalFlipped, this.#isHorizontalFlipped);
            const width = this.clientWidth;
            const height = this.clientHeight;
            const computedStyle = getComputedStyle(this);
            const radius = parseInt(computedStyle.getPropertyValue('--radius'), 10) || 2;
            const lineWidth = parseInt(computedStyle.getPropertyValue('--border-width'), 10) || 0;
            const stroke = computedStyle.getPropertyValue('--border-color') || 'transparent';
            const fill = computedStyle.getPropertyValue('--bg') || 'transparent';
            let arrowSize = this.arrow;
            const direction = origin.split('-')[0];
            for (const prop of ['top', 'right', 'bottom', 'left']) {
                this.$layout.style.setProperty(`padding-${prop}`, direction === prop ? `${this.arrow}px` : '0');
                this.$shadow.style.setProperty(prop, direction === prop ? `${this.arrow}px` : '0');
            }
            if (direction === 'center') {
                arrowSize = 0;
                this.$shadow.style.setProperty('top', `${this.arrow}px`);
            }
            updateBg({
                $svg,
                width,
                height,
                arrowSize,
                lineWidth,
                radius,
                stroke,
                fill,
                origin,
            });
        }
        #setupAppendBody() {
            this.onConnected(() => {
                if (this.appendToBody && this.parentElement !== document.body) {
                    document.body.appendChild(this);
                }
            });
            this.onAttributeChangedDep('append-to-body', () => {
                if (this.appendToBody && this.parentElement !== document.body && document.documentElement.contains(this)) {
                    document.body.appendChild(this);
                }
            });
        }
        #setupAnchorAdsorption() {
            let refreshPos;
            const _initAnchorEvent = () => {
                if (refreshPos)
                    return;
                refreshPos = this.updatePositionAndDirection.bind(this);
                window.addEventListener('scroll', refreshPos, true);
                window.addEventListener('touchstart', refreshPos);
                window.addEventListener('click', refreshPos);
                window.addEventListener('resize', refreshPos);
            };
            const _destroyAnchorEvent = () => {
                if (!refreshPos)
                    return;
                window.removeEventListener('scroll', refreshPos, true);
                window.removeEventListener('touchstart', refreshPos);
                window.removeEventListener('click', refreshPos);
                window.removeEventListener('resize', refreshPos);
                refreshPos = null;
            };
            this.onDisconnected(() => {
                _destroyAnchorEvent();
            });
            this.onConnected(() => {
                if (this.open) {
                    _initAnchorEvent();
                }
            });
            this.onAttributeChangedDep('open', () => {
                if (this.open) {
                    _initAnchorEvent();
                }
                else {
                    _destroyAnchorEvent();
                }
            });
            this.onRender(this.updatePositionAndDirection);
            this.onConnected(this.updatePositionAndDirection);
            this.onAttributeChangedDeps([
                'open',
                'anchor',
                'offset-x',
                'offset-y',
                'anchor-x',
                'anchor-y',
                'anchor-width',
                'anchor-height',
                'anchor-selector',
                'origin',
                'arrow',
            ], this.updatePositionAndDirection);
        }
        #setupFocus() {
            const initTabIndex = () => {
                if (this.focusable || this.autofocus) {
                    if (!this.hasAttribute('tabindex'))
                        this.setAttribute('tabindex', '-1');
                }
            };
            this.onConnected(initTabIndex);
            this.onAttributeChangedDeps(['focusable', 'autofocus'], initTabIndex);
            let $prevFocus;
            const _focus = () => {
                if (this.restorefocus && !$prevFocus) {
                    $prevFocus = document.activeElement;
                }
                if (this.capturefocus && this._focusCapture.$firstFocusable) {
                    this._focusCapture.$firstFocusable.focus();
                }
                else {
                    this.focus();
                }
            };
            const _blur = () => {
                if (this._focusCapture.$firstFocusable)
                    this._focusCapture.$firstFocusable.blur();
                this.blur();
                if ($prevFocus) {
                    if (this.restorefocus && typeof $prevFocus.focus === 'function') {
                        $prevFocus.focus();
                    }
                    $prevFocus = null;
                }
            };
            const onOpened = () => {
                this.updatePositionAndDirection();
                if (this.autofocus)
                    _focus();
            };
            const onClosed = () => {
                _blur();
            };
            this.onConnected(() => {
                this.addEventListener('opened', onOpened);
                this.addEventListener('closed', onClosed);
            });
            this.onDisconnected(() => {
                this.removeEventListener('opened', onOpened);
                this.removeEventListener('closed', onClosed);
            });
        }
        _focusCapture = SetupFocusCapture.setup({
            component: this,
            predicate: () => this.open,
            container: () => this.$layout,
            init: () => {
                this.onConnected(() => {
                    if (this.capturefocus)
                        this._focusCapture.start();
                });
                this.onAttributeChangedDep('capturefocus', () => {
                    if (this.capturefocus) {
                        this._focusCapture.start();
                    }
                    else {
                        this._focusCapture.stop();
                    }
                });
            },
        });
        #getAnchorFrame() {
            if (this.anchorElement || this.anchorSelector) {
                const element = this.anchorElement ? this.anchorElement() : document.querySelector(this.anchorSelector);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const y1 = Math.floor(rect.top);
                    const x1 = Math.floor(rect.left);
                    const y2 = y1 + rect.height;
                    const x2 = x1 + rect.width;
                    return { x1, y1, x2, y2 };
                }
            }
            if (this.anchorX != null && this.anchorY != null) {
                let x1 = this.anchorX ?? 0;
                let y1 = this.anchorY ?? 0;
                let x2 = x1 + (this.anchorWidth ?? 0);
                let y2 = y1 + (this.anchorHeight ?? 0);
                const { top, left } = getOffsetParent(this).getBoundingClientRect();
                x1 += left;
                x2 += left;
                y1 += top;
                y2 += top;
                return { x1, y1, x2, y2 };
            }
            const element = getOffsetParent(this);
            const rect = element.getBoundingClientRect();
            const y1 = Math.floor(rect.top);
            const x1 = Math.floor(rect.left);
            const y2 = y1 + rect.height;
            const x2 = x1 + rect.width;
            return { x1, y1, x2, y2 };
        }
        #isHorizontal() {
            return this.origin.startsWith('left') || this.origin.startsWith('right');
        }
        #isVertical() {
            return this.origin.startsWith('top') || this.origin.startsWith('bottom');
        }
    };
    return BlocksPopup = _classThis;
})();
function flipY(y) {
    return y === 'top' ? 'bottom' : y === 'bottom' ? 'top' : 'center';
}
function flipX(x) {
    return x === 'left' ? 'right' : x === 'right' ? 'left' : 'center';
}
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
function originTransform(origin, yFlipped, xFlipped) {
    switch (origin) {
        case PopupOrigin.TopStart:
            return yFlipped && xFlipped
                ? PopupOrigin.BottomEnd
                : yFlipped
                    ? PopupOrigin.BottomStart
                    : xFlipped
                        ? PopupOrigin.TopEnd
                        : PopupOrigin.TopStart;
        case PopupOrigin.TopCenter:
            return yFlipped ? PopupOrigin.BottomCenter : PopupOrigin.TopCenter;
        case PopupOrigin.TopEnd:
            return yFlipped && xFlipped
                ? PopupOrigin.BottomStart
                : yFlipped
                    ? PopupOrigin.BottomEnd
                    : xFlipped
                        ? PopupOrigin.TopStart
                        : PopupOrigin.TopEnd;
        case PopupOrigin.BottomStart:
            return yFlipped && xFlipped
                ? PopupOrigin.TopEnd
                : yFlipped
                    ? PopupOrigin.TopStart
                    : xFlipped
                        ? PopupOrigin.BottomEnd
                        : PopupOrigin.BottomStart;
        case PopupOrigin.BottomCenter:
            return yFlipped ? PopupOrigin.TopCenter : PopupOrigin.BottomCenter;
        case PopupOrigin.BottomEnd:
            return yFlipped && xFlipped
                ? PopupOrigin.TopStart
                : yFlipped
                    ? PopupOrigin.TopEnd
                    : xFlipped
                        ? PopupOrigin.BottomStart
                        : PopupOrigin.BottomEnd;
        case PopupOrigin.LeftStart:
            return yFlipped && xFlipped
                ? PopupOrigin.RightEnd
                : yFlipped
                    ? PopupOrigin.LeftEnd
                    : xFlipped
                        ? PopupOrigin.RightStart
                        : PopupOrigin.LeftStart;
        case PopupOrigin.LeftCenter:
            return xFlipped ? PopupOrigin.RightCenter : PopupOrigin.LeftCenter;
        case PopupOrigin.LeftEnd:
            return yFlipped && xFlipped
                ? PopupOrigin.RightStart
                : yFlipped
                    ? PopupOrigin.LeftStart
                    : xFlipped
                        ? PopupOrigin.RightEnd
                        : PopupOrigin.LeftEnd;
        case PopupOrigin.RightStart:
            return yFlipped && xFlipped
                ? PopupOrigin.LeftEnd
                : yFlipped
                    ? PopupOrigin.RightEnd
                    : xFlipped
                        ? PopupOrigin.LeftStart
                        : PopupOrigin.RightStart;
        case PopupOrigin.RightCenter:
            return xFlipped ? PopupOrigin.LeftCenter : PopupOrigin.RightCenter;
        case PopupOrigin.RightEnd:
            return yFlipped && xFlipped
                ? PopupOrigin.LeftStart
                : yFlipped
                    ? PopupOrigin.RightStart
                    : xFlipped
                        ? PopupOrigin.LeftEnd
                        : PopupOrigin.RightEnd;
        case PopupOrigin.Center:
            return PopupOrigin.Center;
    }
}
