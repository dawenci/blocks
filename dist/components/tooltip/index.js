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
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { forEach } from '../../common/utils.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { style } from './style.js';
import { template } from './template.js';
import { BlPopup } from '../popup/index.js';
import { BlComponent } from '../component/Component.js';
export let BlTooltip = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-tooltip',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _content_decorators;
    let _content_initializers = [];
    let _openDelay_decorators;
    let _openDelay_initializers = [];
    let _closeDelay_decorators;
    let _closeDelay_initializers = [];
    let _triggerMode_decorators;
    let _triggerMode_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlTooltip = class extends BlComponent {
        static {
            _content_decorators = [attr('string')];
            _openDelay_decorators = [attr('int')];
            _closeDelay_decorators = [attr('int')];
            _triggerMode_decorators = [attr('enum', { enumValues: ['hover', 'click', 'manual'] })];
            _$slot_decorators = [shadowRef('#slot')];
            __esDecorate(this, null, _content_decorators, { kind: "accessor", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } } }, _content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _openDelay_decorators, { kind: "accessor", name: "openDelay", static: false, private: false, access: { has: obj => "openDelay" in obj, get: obj => obj.openDelay, set: (obj, value) => { obj.openDelay = value; } } }, _openDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeDelay_decorators, { kind: "accessor", name: "closeDelay", static: false, private: false, access: { has: obj => "closeDelay" in obj, get: obj => obj.closeDelay, set: (obj, value) => { obj.closeDelay = value; } } }, _closeDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _triggerMode_decorators, { kind: "accessor", name: "triggerMode", static: false, private: false, access: { has: obj => "triggerMode" in obj, get: obj => obj.triggerMode, set: (obj, value) => { obj.triggerMode = value; } } }, _triggerMode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlTooltip = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'tooltip';
        }
        static get observedAttributes() {
            return BlPopup.observedAttributes;
        }
        #content_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _content_initializers, ''));
        get content() { return this.#content_accessor_storage; }
        set content(value) { this.#content_accessor_storage = value; }
        #openDelay_accessor_storage = __runInitializers(this, _openDelay_initializers, 200);
        get openDelay() { return this.#openDelay_accessor_storage; }
        set openDelay(value) { this.#openDelay_accessor_storage = value; }
        #closeDelay_accessor_storage = __runInitializers(this, _closeDelay_initializers, 200);
        get closeDelay() { return this.#closeDelay_accessor_storage; }
        set closeDelay(value) { this.#closeDelay_accessor_storage = value; }
        #triggerMode_accessor_storage = __runInitializers(this, _triggerMode_initializers, 'hover');
        get triggerMode() { return this.#triggerMode_accessor_storage; }
        set triggerMode(value) { this.#triggerMode_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        $popup;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            this.#setupPopup();
            this.#setupShowHide();
            this.hook.onConnected(() => {
                document.body.appendChild(this.$popup);
                this.render();
            });
            this.hook.onDisconnected(() => {
                document.body.removeChild(this.$popup);
            });
            this.hook.onAttributeChanged(this.render);
        }
        get open() {
            return this.$popup.open;
        }
        set open(value) {
            this.$popup.open = value;
        }
        #anchorElement;
        get anchorElement() {
            return this.#anchorElement ?? (() => this.$slot.assignedElements()?.[0] ?? this);
        }
        set anchorElement(value) {
            this.#anchorElement = value;
        }
        render() {
            super.render();
            this.$popup.innerHTML = `<div style="padding:15px;font-size:14px;">${this.content}</div>`;
        }
        #setupPopup() {
            this.$popup = document.createElement('bl-popup');
            this.$popup.anchorElement = this.anchorElement;
            this.$popup.setAttribute('arrow', '8');
            this.$popup.setAttribute('append-to-body', '');
            this.$popup.setAttribute('origin', 'bottom-center');
            forEach(this.attributes, attr => {
                if (BlPopup.observedAttributes.includes(attr.name)) {
                    this.$popup.setAttribute(attr.name, attr.value);
                }
            });
            this.hook.onAttributeChangedDeps(BlPopup.observedAttributes, (name, _, val) => {
                this.$popup.setAttribute(name, val);
            });
        }
        #setupShowHide() {
            let _enterTimer;
            let _leaveTimer;
            let _clearClickOutside;
            this.addEventListener('click', e => {
                clearTimeout(_leaveTimer);
                this.open = true;
            });
            const onmouseenter = () => {
                if (this.triggerMode === 'hover') {
                    clearTimeout(_leaveTimer);
                    clearTimeout(_enterTimer);
                    _enterTimer = setTimeout(() => {
                        this.open = true;
                    }, this.openDelay ?? 0);
                }
            };
            const onmouseleave = () => {
                if (this.triggerMode === 'hover') {
                    clearTimeout(_enterTimer);
                    clearTimeout(_leaveTimer);
                    _leaveTimer = setTimeout(() => {
                        this.open = false;
                    }, this.closeDelay ?? 0);
                }
            };
            this.addEventListener('mouseenter', onmouseenter);
            this.$popup.addEventListener('mouseenter', onmouseenter);
            this.addEventListener('mouseleave', onmouseleave);
            this.$popup.addEventListener('mouseleave', onmouseleave);
            const _initClickOutside = () => {
                if (!_clearClickOutside) {
                    _clearClickOutside = onClickOutside([this, this.$popup], () => (this.open = false));
                }
            };
            const _destroyClickOutside = () => {
                if (_clearClickOutside) {
                    _clearClickOutside();
                    _clearClickOutside = undefined;
                }
            };
            this.$popup.addEventListener('opened', () => {
                _initClickOutside();
            });
            this.$popup.addEventListener('closed', () => {
                _destroyClickOutside();
            });
            this.hook.onDisconnected(() => {
                _destroyClickOutside();
            });
        }
    };
    return BlTooltip = _classThis;
})();
