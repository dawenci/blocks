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
import '../modal-mask/index.js';
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { template } from './template.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { dispatchEvent, onceEvent } from '../../common/event.js';
import { onDragMove } from '../../common/onDragMove.js';
import { onKeymap } from '../../common/onKeymap.js';
import { style } from './style.js';
import { mountBefore, unmount, append } from '../../common/mount.js';
import { BlocksPopup } from '../popup/index.js';
import { SetupClickOutside } from '../setup-click-outside/index.js';
let BlocksDialog = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-dialog',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _mask_decorators;
    let _mask_initializers = [];
    let _closeable_decorators;
    let _closeable_initializers = [];
    let _titleText_decorators;
    let _titleText_initializers = [];
    let _unmountOnClosed_decorators;
    let _unmountOnClosed_initializers = [];
    let _closeOnClickMask_decorators;
    let _closeOnClickMask_initializers = [];
    let _closeOnClickOutside_decorators;
    let _closeOnClickOutside_initializers = [];
    let _closeOnPressEscape_decorators;
    let _closeOnPressEscape_initializers = [];
    let _$close_decorators;
    let _$close_initializers = [];
    let _$header_decorators;
    let _$header_initializers = [];
    let _$body_decorators;
    let _$body_initializers = [];
    let _$footer_decorators;
    let _$footer_initializers = [];
    let _$headerSlot_decorators;
    let _$headerSlot_initializers = [];
    let _$bodySlot_decorators;
    let _$bodySlot_initializers = [];
    let _$footerSlot_decorators;
    let _$footerSlot_initializers = [];
    var BlocksDialog = class extends BlocksPopup {
        static {
            _mask_decorators = [attr('boolean')];
            _closeable_decorators = [attr('boolean')];
            _titleText_decorators = [attr('string')];
            _unmountOnClosed_decorators = [attr('boolean')];
            _closeOnClickMask_decorators = [attr('boolean')];
            _closeOnClickOutside_decorators = [attr('boolean')];
            _closeOnPressEscape_decorators = [attr('boolean')];
            _$close_decorators = [shadowRef('[part="close"]')];
            _$header_decorators = [shadowRef('[part="header"]')];
            _$body_decorators = [shadowRef('[part="body"]')];
            _$footer_decorators = [shadowRef('[part="footer"]')];
            _$headerSlot_decorators = [shadowRef('[part="header-slot"]')];
            _$bodySlot_decorators = [shadowRef('[part="default-slot"]')];
            _$footerSlot_decorators = [shadowRef('[part="footer-slot"]')];
            __esDecorate(this, null, _mask_decorators, { kind: "accessor", name: "mask", static: false, private: false, access: { has: obj => "mask" in obj, get: obj => obj.mask, set: (obj, value) => { obj.mask = value; } } }, _mask_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeable_decorators, { kind: "accessor", name: "closeable", static: false, private: false, access: { has: obj => "closeable" in obj, get: obj => obj.closeable, set: (obj, value) => { obj.closeable = value; } } }, _closeable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _titleText_decorators, { kind: "accessor", name: "titleText", static: false, private: false, access: { has: obj => "titleText" in obj, get: obj => obj.titleText, set: (obj, value) => { obj.titleText = value; } } }, _titleText_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _unmountOnClosed_decorators, { kind: "accessor", name: "unmountOnClosed", static: false, private: false, access: { has: obj => "unmountOnClosed" in obj, get: obj => obj.unmountOnClosed, set: (obj, value) => { obj.unmountOnClosed = value; } } }, _unmountOnClosed_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeOnClickMask_decorators, { kind: "accessor", name: "closeOnClickMask", static: false, private: false, access: { has: obj => "closeOnClickMask" in obj, get: obj => obj.closeOnClickMask, set: (obj, value) => { obj.closeOnClickMask = value; } } }, _closeOnClickMask_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeOnClickOutside_decorators, { kind: "accessor", name: "closeOnClickOutside", static: false, private: false, access: { has: obj => "closeOnClickOutside" in obj, get: obj => obj.closeOnClickOutside, set: (obj, value) => { obj.closeOnClickOutside = value; } } }, _closeOnClickOutside_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeOnPressEscape_decorators, { kind: "accessor", name: "closeOnPressEscape", static: false, private: false, access: { has: obj => "closeOnPressEscape" in obj, get: obj => obj.closeOnPressEscape, set: (obj, value) => { obj.closeOnPressEscape = value; } } }, _closeOnPressEscape_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$close_decorators, { kind: "accessor", name: "$close", static: false, private: false, access: { has: obj => "$close" in obj, get: obj => obj.$close, set: (obj, value) => { obj.$close = value; } } }, _$close_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$header_decorators, { kind: "accessor", name: "$header", static: false, private: false, access: { has: obj => "$header" in obj, get: obj => obj.$header, set: (obj, value) => { obj.$header = value; } } }, _$header_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$body_decorators, { kind: "accessor", name: "$body", static: false, private: false, access: { has: obj => "$body" in obj, get: obj => obj.$body, set: (obj, value) => { obj.$body = value; } } }, _$body_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$footer_decorators, { kind: "accessor", name: "$footer", static: false, private: false, access: { has: obj => "$footer" in obj, get: obj => obj.$footer, set: (obj, value) => { obj.$footer = value; } } }, _$footer_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$headerSlot_decorators, { kind: "accessor", name: "$headerSlot", static: false, private: false, access: { has: obj => "$headerSlot" in obj, get: obj => obj.$headerSlot, set: (obj, value) => { obj.$headerSlot = value; } } }, _$headerSlot_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$bodySlot_decorators, { kind: "accessor", name: "$bodySlot", static: false, private: false, access: { has: obj => "$bodySlot" in obj, get: obj => obj.$bodySlot, set: (obj, value) => { obj.$bodySlot = value; } } }, _$bodySlot_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$footerSlot_decorators, { kind: "accessor", name: "$footerSlot", static: false, private: false, access: { has: obj => "$footerSlot" in obj, get: obj => obj.$footerSlot, set: (obj, value) => { obj.$footerSlot = value; } } }, _$footerSlot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDialog = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
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
        #titleText_accessor_storage = __runInitializers(this, _titleText_initializers, '');
        get titleText() { return this.#titleText_accessor_storage; }
        set titleText(value) { this.#titleText_accessor_storage = value; }
        #unmountOnClosed_accessor_storage = __runInitializers(this, _unmountOnClosed_initializers, void 0);
        get unmountOnClosed() { return this.#unmountOnClosed_accessor_storage; }
        set unmountOnClosed(value) { this.#unmountOnClosed_accessor_storage = value; }
        #closeOnClickMask_accessor_storage = __runInitializers(this, _closeOnClickMask_initializers, void 0);
        get closeOnClickMask() { return this.#closeOnClickMask_accessor_storage; }
        set closeOnClickMask(value) { this.#closeOnClickMask_accessor_storage = value; }
        #closeOnClickOutside_accessor_storage = __runInitializers(this, _closeOnClickOutside_initializers, void 0);
        get closeOnClickOutside() { return this.#closeOnClickOutside_accessor_storage; }
        set closeOnClickOutside(value) { this.#closeOnClickOutside_accessor_storage = value; }
        #closeOnPressEscape_accessor_storage = __runInitializers(this, _closeOnPressEscape_initializers, void 0);
        get closeOnPressEscape() { return this.#closeOnPressEscape_accessor_storage; }
        set closeOnPressEscape(value) { this.#closeOnPressEscape_accessor_storage = value; }
        #$close_accessor_storage = __runInitializers(this, _$close_initializers, void 0);
        get $close() { return this.#$close_accessor_storage; }
        set $close(value) { this.#$close_accessor_storage = value; }
        #$header_accessor_storage = __runInitializers(this, _$header_initializers, void 0);
        get $header() { return this.#$header_accessor_storage; }
        set $header(value) { this.#$header_accessor_storage = value; }
        #$body_accessor_storage = __runInitializers(this, _$body_initializers, void 0);
        get $body() { return this.#$body_accessor_storage; }
        set $body(value) { this.#$body_accessor_storage = value; }
        #$footer_accessor_storage = __runInitializers(this, _$footer_initializers, void 0);
        get $footer() { return this.#$footer_accessor_storage; }
        set $footer(value) { this.#$footer_accessor_storage = value; }
        #$headerSlot_accessor_storage = __runInitializers(this, _$headerSlot_initializers, void 0);
        get $headerSlot() { return this.#$headerSlot_accessor_storage; }
        set $headerSlot(value) { this.#$headerSlot_accessor_storage = value; }
        #$bodySlot_accessor_storage = __runInitializers(this, _$bodySlot_initializers, void 0);
        get $bodySlot() { return this.#$bodySlot_accessor_storage; }
        set $bodySlot(value) { this.#$bodySlot_accessor_storage = value; }
        #$footerSlot_accessor_storage = __runInitializers(this, _$footerSlot_initializers, void 0);
        get $footerSlot() { return this.#$footerSlot_accessor_storage; }
        set $footerSlot(value) { this.#$footerSlot_accessor_storage = value; }
        constructor() {
            super();
            this.$layout.removeChild(this.$slot);
            this.$layout.appendChild(template());
            this.#setupPopup();
            this.#setupMask();
            this.#setupHeader();
            this.#setupFooter();
            this.#setupClose();
            this.#setupDragEvent();
            this.#setupClickOutside();
            this.#setupKeymap();
        }
        _clickOutside = SetupClickOutside.setup({
            component: this,
            target() {
                return this.$mask ? [this, this.$mask] : [this];
            },
            update() {
                this.open = false;
            },
        });
        #setupPopup() {
            this.onConnected(() => {
                this.autofocus = true;
                if (this.parentElement !== document.body) {
                    document.body.appendChild(this);
                }
            });
            const unmountDialog = () => {
                if (this.unmountOnClosed)
                    unmount(this);
            };
            this.onConnected(() => {
                this.addEventListener('closed', unmountDialog);
            });
            this.onDisconnected(() => {
                this.removeEventListener('closed', unmountDialog);
            });
        }
        #setupMask() {
            const _ensureMask = () => {
                if (!this.$mask) {
                    this.$mask = document.createElement('bl-modal-mask');
                    mountBefore(this.$mask, this);
                    this.$mask.open = this.open;
                    dispatchEvent(this, 'mask-mounted');
                    const _refocus = () => {
                        if (document.activeElement && !this.$layout.contains(document.activeElement)) {
                            ;
                            document.activeElement.blur();
                        }
                        this.focus();
                        this.removeEventListener('blur', _refocus);
                    };
                    this.$mask.addEventListener('mousedown', () => {
                        _refocus();
                        this.addEventListener('blur', _refocus);
                    });
                    this.$mask.addEventListener('mouseup', () => {
                        _refocus();
                        if (this.closeOnClickMask) {
                            this.open = false;
                        }
                    });
                }
            };
            const _destroyMask = () => {
                if (!this.$mask)
                    return;
                if (document.body.contains(this.$mask)) {
                    if (this.$mask.open) {
                        const destroy = () => {
                            unmount(this.$mask);
                            this.$mask = null;
                        };
                        onceEvent(this.$mask, 'closed', destroy);
                        this.$mask.open = false;
                    }
                    else {
                        unmount(this.$mask);
                        this.$mask = null;
                    }
                }
            };
            this.onConnected(() => {
                if (this.mask && this.open)
                    _ensureMask();
            });
            this.onDisconnected(() => {
                _destroyMask();
            });
            this.onAttributeChangedDeps(['mask', 'open'], () => {
                if (!this.$mask && this.mask && this.open) {
                    return _ensureMask();
                }
                if (this.$mask && !this.mask) {
                    return _destroyMask();
                }
                if (this.mask && this.$mask) {
                    this.$mask.open = this.open;
                    return;
                }
            });
        }
        #setupClose() {
            const update = () => {
                if (this.closeable && !this.$close) {
                    const $close = document.createElement('button');
                    $close.setAttribute('part', 'close');
                    $close.onclick = () => {
                        this.open = false;
                    };
                    if (this._focusCapture.$lastFocusable) {
                        mountBefore($close, this._focusCapture.$lastFocusable);
                    }
                    else {
                        append($close, this.$layout);
                    }
                    return;
                }
                if (!this.closeable && this.$close) {
                    unmount(this.$close);
                }
            };
            this.onConnected(update);
            this.onRender(update);
            this.onAttributeChangedDep('closeable', update);
        }
        #setupHeader() {
            const update = () => {
                if (this.querySelectorHost('[slot="header"]')) {
                    this.$layout.classList.remove('no-header');
                }
                else if (this.titleText) {
                    this.$layout.classList.remove('no-header');
                    const $title = this.querySelectorShadow('h1');
                    $title.innerText = this.titleText;
                }
                else {
                    this.$layout.classList.add('no-header');
                }
            };
            this.onConnected(() => {
                this.$headerSlot.addEventListener('slotchange', update);
            });
            this.onDisconnected(() => {
                this.$headerSlot.removeEventListener('slotchange', update);
            });
            this.onConnected(update);
            this.onRender(update);
            this.onAttributeChangedDep('title-text', update);
        }
        #setupFooter() {
            const update = () => {
                if (this.querySelector('[slot="footer"]')) {
                    this.$layout.classList.remove('no-footer');
                }
                else {
                    this.$layout.classList.add('no-footer');
                }
            };
            this.onConnected(update);
            this.onRender(update);
            this.onConnected(() => {
                this.$footerSlot.addEventListener('slotchange', update);
            });
            this.onDisconnected(() => {
                this.$footerSlot.removeEventListener('slotchange', update);
            });
        }
        #setupDragEvent() {
            const isBody = (target) => {
                if (this.$body.contains(target)) {
                    return true;
                }
                if (this.contains(target)) {
                    let el = target;
                    while (el && el !== this) {
                        if (el.slot === '')
                            return true;
                        el = el.parentElement;
                    }
                }
                return false;
            };
            const setupDragEvent = () => {
                let startX;
                let startY;
                onDragMove(this.$layout, {
                    onStart: ({ $target, stop }) => {
                        if (isBody($target))
                            return stop();
                        startX = this.offsetX;
                        startY = this.offsetY;
                    },
                    onMove: ({ offset }) => {
                        this.offsetX = startX + offset.x;
                        this.offsetY = startY + offset.y;
                    },
                });
            };
            setupDragEvent();
        }
        #setupKeymap() {
            let clear;
            const _initKeydown = () => {
                if (this.closeOnPressEscape && !clear) {
                    clear = onKeymap(document, [
                        {
                            key: 'escape',
                            handler: () => {
                                if (this.open)
                                    this.open = false;
                            },
                        },
                    ]);
                }
            };
            const _destroyKeydown = () => {
                if (clear) {
                    clear();
                    clear = undefined;
                }
            };
            this.onConnected(() => {
                _initKeydown();
            });
            this.onDisconnected(() => {
                _destroyKeydown();
            });
            this.onAttributeChangedDep('close-on-press-escape', () => {
                if (this.closeOnPressEscape) {
                    _initKeydown();
                }
                else {
                    _destroyKeydown();
                }
            });
        }
        #setupClickOutside() {
            this.onConnected(() => {
                this.addEventListener('opened', () => {
                    if (this.closeOnClickOutside)
                        this._clickOutside.bind();
                });
                this.addEventListener('closed', () => {
                    this._clickOutside.unbind();
                });
            });
            this.onAttributeChangedDep('close-on-click-outside', () => {
                if (this.closeOnClickOutside)
                    this._clickOutside.bind();
                else
                    this._clickOutside.unbind();
            });
        }
    };
    return BlocksDialog = _classThis;
})();
export { BlocksDialog };
