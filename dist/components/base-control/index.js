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
import { append, mountBefore } from '../../common/mount.js';
import { strSetter } from '../../common/property.js';
import { Component } from '../Component.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let Control = (() => {
    let _classDecorators = [defineClass];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    var Control = class extends Component {
        static {
            _disabled_decorators = [attr('boolean')];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            Control = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #disabled_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _disabled_initializers, void 0));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.attachShadow({
                mode: 'open',
                delegatesFocus: true,
            });
            const $layout = document.createElement('div');
            $layout.id = 'layout';
            this._ref = {
                $layout: shadowRoot.appendChild($layout),
            };
        }
        #internalTabIndex = '-1';
        get internalTabIndex() {
            return this.#internalTabIndex;
        }
        set internalTabIndex(value) {
            this.#internalTabIndex = value;
            this._renderDisabled();
        }
        _renderDisabled() {
            if (this.disabled || this.internalTabIndex == null) {
                this.setAttribute('aria-disabled', 'true');
                strSetter('tabindex')(this._ref.$layout, null);
            }
            else {
                strSetter('tabindex')(this._ref.$layout, this.internalTabIndex);
                this.setAttribute('aria-disabled', 'false');
            }
        }
        _appendStyle($style) {
            mountBefore($style, this._ref.$layout);
        }
        _appendContent($el) {
            append($el, this._ref.$layout);
            return $el;
        }
        render() {
            this._renderDisabled();
        }
        connectedCallback() {
            super.connectedCallback();
            this._renderDisabled();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'disabled') {
                this._renderDisabled();
            }
        }
    };
    return Control = _classThis;
})();
