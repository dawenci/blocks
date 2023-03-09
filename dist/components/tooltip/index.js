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
import { BlocksPopup } from '../popup/index.js';
import { forEach } from '../../common/utils.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { style } from './style.js';
export let BlocksTooltip = (() => {
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
    var BlocksTooltip = class extends Component {
        static {
            _content_decorators = [attr('string')];
            _openDelay_decorators = [attr('int')];
            _closeDelay_decorators = [attr('int')];
            _triggerMode_decorators = [attr('enum', { enumValues: ['hover', 'click'] })];
            __esDecorate(this, null, _content_decorators, { kind: "accessor", name: "content", static: false, private: false, access: { has: obj => "content" in obj, get: obj => obj.content, set: (obj, value) => { obj.content = value; } } }, _content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _openDelay_decorators, { kind: "accessor", name: "openDelay", static: false, private: false, access: { has: obj => "openDelay" in obj, get: obj => obj.openDelay, set: (obj, value) => { obj.openDelay = value; } } }, _openDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeDelay_decorators, { kind: "accessor", name: "closeDelay", static: false, private: false, access: { has: obj => "closeDelay" in obj, get: obj => obj.closeDelay, set: (obj, value) => { obj.closeDelay = value; } } }, _closeDelay_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _triggerMode_decorators, { kind: "accessor", name: "triggerMode", static: false, private: false, access: { has: obj => "triggerMode" in obj, get: obj => obj.triggerMode, set: (obj, value) => { obj.triggerMode = value; } } }, _triggerMode_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTooltip = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return BlocksPopup.observedAttributes;
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
        $slot;
        $popup;
        _enterTimer;
        _leaveTimer;
        _clearClickOutside;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            this.$slot = shadowRoot.getElementById('slot');
            this.$popup = document.createElement('bl-popup');
            this.$popup.anchor = () => this.$slot.assignedElements()?.[0] ?? this;
            this.$popup.setAttribute('arrow', '');
            this.$popup.setAttribute('append-to-body', '');
            this.$popup.setAttribute('origin', 'bottom-center');
            forEach(this.attributes, attr => {
                if (BlocksPopup.observedAttributes.includes(attr.name)) {
                    this.$popup.setAttribute(attr.name, attr.value);
                }
            });
            this.addEventListener('click', e => {
                clearTimeout(this._leaveTimer);
                this.open = true;
            });
            const onmouseenter = () => {
                if (this.triggerMode === 'hover') {
                    clearTimeout(this._leaveTimer);
                    clearTimeout(this._enterTimer);
                    this._enterTimer = setTimeout(() => {
                        this.open = true;
                    }, this.openDelay ?? 0);
                }
            };
            const onmouseleave = () => {
                if (this.triggerMode === 'hover') {
                    clearTimeout(this._enterTimer);
                    clearTimeout(this._leaveTimer);
                    this._leaveTimer = setTimeout(() => {
                        this.open = false;
                    }, this.closeDelay ?? 0);
                }
            };
            this.addEventListener('mouseenter', onmouseenter);
            this.$popup.addEventListener('mouseenter', onmouseenter);
            this.addEventListener('mouseleave', onmouseleave);
            this.$popup.addEventListener('mouseleave', onmouseleave);
            this.$popup.addEventListener('opened', () => {
                this._initClickOutside();
            });
            this.$popup.addEventListener('closed', () => {
                this._destroyClickOutside();
            });
        }
        get open() {
            return this.$popup.open;
        }
        set open(value) {
            this.$popup.open = value;
        }
        render() {
            this.$popup.innerHTML = `<div style="padding:15px;font-size:14px;">${this.content}</div>`;
        }
        connectedCallback() {
            super.connectedCallback();
            document.body.appendChild(this.$popup);
            this.render();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            document.body.removeChild(this.$popup);
            this._destroyClickOutside();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (BlocksPopup.observedAttributes.includes(attrName)) {
                this.$popup.setAttribute(attrName, newValue);
            }
            this.render();
        }
        _initClickOutside() {
            if (!this._clearClickOutside) {
                this._clearClickOutside = onClickOutside([this, this.$popup], () => (this.open = false));
            }
        }
        _destroyClickOutside() {
            if (this._clearClickOutside) {
                this._clearClickOutside();
                this._clearClickOutside = undefined;
            }
        }
    };
    return BlocksTooltip = _classThis;
})();
