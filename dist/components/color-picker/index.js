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
import { onClickOutside } from '../../common/onClickOutside.js';
import { dispatchEvent } from '../../common/event.js';
import { uniqId } from '../../common/uniqId.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { style } from './style.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let BlocksColorPicker = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-color-picker',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _value_decorators;
    let _value_initializers = [];
    var BlocksColorPicker = class extends Component {
        static {
            _disabled_decorators = [attr('boolean')];
            _value_decorators = [attr('int')];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksColorPicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #disabled_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _disabled_initializers, void 0));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #value_accessor_storage = __runInitializers(this, _value_initializers, void 0);
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #clearClickOutside;
        constructor() {
            super();
            this.id = `color-picker-${uniqId()}`;
            const shadowRoot = this.shadowRoot;
            const { inputTemplate, popupTemplate } = template();
            const fragment = inputTemplate.content.cloneNode(true);
            shadowRoot.appendChild(fragment);
            const $result = shadowRoot.querySelector('#result');
            const $icon = $result.querySelector('bl-icon');
            const $popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup');
            const $color = $popup.querySelector('bl-color');
            this._ref = {
                $result,
                $icon,
                $popup,
                $color,
            };
            $popup.anchor = () => $result;
            $result.onfocus = $result.onclick = () => {
                if (this.disabled)
                    return;
                $popup.open = true;
                $color.render();
            };
            $color.addEventListener('bl:color:change', () => {
                this.value = $color.value;
                this.render();
                const payload = { detail: $color.value };
                dispatchEvent(this, 'bl:color-picker:change', payload);
                dispatchEvent(this, 'change', payload);
            });
            $popup.addEventListener('opened', () => {
                this.#initClickOutside();
            });
            $popup.addEventListener('closed', () => {
                this.#destroyClickOutside();
            });
        }
        get hex() {
            return this._ref.$color.hex;
        }
        set hex(value) {
            this._ref.$color.hex = value;
        }
        get hsl() {
            return this._ref.$color.hsl;
        }
        set hsl(value) {
            this._ref.$color.hsl = value;
        }
        get hsla() {
            return this._ref.$color.hsla;
        }
        set hsla(value) {
            this._ref.$color.hsla = value;
        }
        get hsv() {
            return this._ref.$color.hsv;
        }
        set hsv(value) {
            this._ref.$color.hsv = value;
        }
        get hsva() {
            return this._ref.$color.hsva;
        }
        set hsva(value) {
            this._ref.$color.hsva = value;
        }
        get rgb() {
            return this._ref.$color.rgb;
        }
        set rgb(value) {
            this._ref.$color.rgb = value;
        }
        get rgba() {
            return this._ref.$color.rgba;
        }
        set rgba(value) {
            this._ref.$color.rgba = value;
        }
        connectedCallback() {
            super.connectedCallback();
            super.connectedCallback();
            document.body.appendChild(this._ref.$popup);
            this.render();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            document.body.removeChild(this._ref.$popup);
            this.#destroyClickOutside();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (['clearable'].includes(attrName)) {
                this._ref.$result.setAttribute(attrName, newValue);
            }
            if (attrName === 'value') {
                if (oldValue !== newValue) {
                    this._ref.$color.setAttribute('value', newValue);
                }
            }
            this.render();
        }
        render() {
            const hsla = this._ref.$color.hsla;
            if (hsla) {
                this._ref.$result.style.backgroundColor = `hsla(${hsla[0]},${hsla[1] * 100}%,${hsla[2] * 100}%,${hsla[3]})`;
                let lightness = hsla[2] * 100;
                if (hsla[0] > 50 && hsla[0] < 195) {
                    lightness = lightness > 40 ? 0 : 100;
                }
                else {
                    lightness = lightness > 50 ? 10 : 90;
                }
                ;
                this._ref.$icon.fill = `hsla(${hsla[0]},${50}%,${lightness}%,1)`;
            }
        }
        format(fmt) {
            return this._ref.$color.format(fmt);
        }
        #initClickOutside() {
            if (!this.#clearClickOutside) {
                this.#clearClickOutside = onClickOutside([this, this._ref.$color], () => {
                    if (this._ref.$popup.open)
                        this._ref.$popup.open = false;
                });
            }
        }
        #destroyClickOutside() {
            if (this.#clearClickOutside) {
                this.#clearClickOutside();
                this.#clearClickOutside = undefined;
            }
        }
    };
    return BlocksColorPicker = _classThis;
})();
