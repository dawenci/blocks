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
import { dispatchEvent } from '../../common/event.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { style } from './style.js';
import { template } from './template.js';
import { Component } from '../component/Component.js';
export let BlocksMessage = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-message',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _closeable_decorators;
    let _closeable_initializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _type_decorators;
    let _type_initializers = [];
    var BlocksMessage = class extends Component {
        static {
            _closeable_decorators = [attr('boolean')];
            _duration_decorators = [attr('number')];
            _type_decorators = [attr('enum', {
                    enumValues: ['message', 'success', 'error', 'info', 'warning'],
                })];
            __esDecorate(this, null, _closeable_decorators, { kind: "accessor", name: "closeable", static: false, private: false, access: { has: obj => "closeable" in obj, get: obj => obj.closeable, set: (obj, value) => { obj.closeable = value; } } }, _closeable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _duration_decorators, { kind: "accessor", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } } }, _duration_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } } }, _type_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksMessage = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #closeable_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _closeable_initializers, void 0));
        get closeable() { return this.#closeable_accessor_storage; }
        set closeable(value) { this.#closeable_accessor_storage = value; }
        #duration_accessor_storage = __runInitializers(this, _duration_initializers, 10);
        get duration() { return this.#duration_accessor_storage; }
        set duration(value) { this.#duration_accessor_storage = value; }
        #type_accessor_storage = __runInitializers(this, _type_initializers, void 0);
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            const $layout = shadowRoot.querySelector('#layout');
            const $icon = shadowRoot.querySelector('#icon');
            const $content = shadowRoot.querySelector('#content');
            this._ref = {
                $layout,
                $icon,
                $content,
            };
            this.#setupAutoClose();
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
        }
        #setupAutoClose() {
            this.onConnected(() => {
                this._setAutoClose();
            });
            this.onAttributeChangedDep('duration', () => {
                if (this.duration)
                    this._setAutoClose();
            });
            this._ref.$layout.onmouseenter = () => {
                this._clearAutoClose();
            };
            this._ref.$layout.onmouseleave = () => {
                this._setAutoClose();
            };
        }
        close() {
            if (!this.parentElement)
                return;
            this.ontransitionend = e => {
                if (e.propertyName === 'opacity' && e.target === this) {
                    dispatchEvent(this, 'closed');
                    this.destroy();
                }
            };
            if (this.parentElement.className.includes('bottom')) {
                this.style.cssText = `transform:translate(0,100%);opacity:0`;
            }
            else {
                this.style.cssText = `transform:translate(0,-100%);opacity:0`;
            }
        }
        render() {
            super.render();
            const iconName = this.type === 'warning' ? 'info' : this.type || '';
            const icon = getRegisteredSvgIcon(iconName);
            if (icon) {
                this._ref.$icon.innerHTML = '';
                this._ref.$icon.appendChild(icon);
            }
            if (this.closeable) {
                if (!this._ref.$close) {
                    this._ref.$close = this._ref.$layout.appendChild(document.createElement('button'));
                    this._ref.$close.id = 'close';
                    this._ref.$close.appendChild(getRegisteredSvgIcon('cross'));
                    this._ref.$close.onclick = () => {
                        this.close();
                    };
                }
            }
            else {
                if (this._ref.$close) {
                    this._ref.$close.parentElement.removeChild(this._ref.$close);
                    this._ref.$close = undefined;
                }
            }
        }
        destroy() {
            this._clearAutoClose();
            if (this.parentElement) {
                this.parentElement.removeChild(this);
            }
        }
        _autoCloseTimer;
        _clearAutoClose() {
            clearTimeout(this._autoCloseTimer);
        }
        _setAutoClose() {
            if (this.duration && this.duration > 0) {
                this._clearAutoClose();
                this._autoCloseTimer = setTimeout(() => {
                    this.close();
                }, this.duration * 1000);
            }
        }
    };
    return BlocksMessage = _classThis;
})();
