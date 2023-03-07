var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { BlocksInput } from '../input/index.js';
import { BlocksTime } from '../time/index.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { padLeft } from '../../common/utils.js';
import { boolSetter } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
export let BlocksTimePicker = (() => {
    let _classDecorators = [customElement('bl-time-picker')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _hour_decorators;
    let _hour_initializers = [];
    let _minute_decorators;
    let _minute_initializers = [];
    let _second_decorators;
    let _second_initializers = [];
    var BlocksTimePicker = class extends Component {
        static {
            _hour_decorators = [attr('intRange', { min: 0, max: 23 })];
            _minute_decorators = [attr('intRange', { min: 0, max: 59 })];
            _second_decorators = [attr('intRange', { min: 0, max: 59 })];
            __esDecorate(this, null, _hour_decorators, { kind: "accessor", name: "hour", static: false, private: false, access: { has: obj => "hour" in obj, get: obj => obj.hour, set: (obj, value) => { obj.hour = value; } } }, _hour_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minute_decorators, { kind: "accessor", name: "minute", static: false, private: false, access: { has: obj => "minute" in obj, get: obj => obj.minute, set: (obj, value) => { obj.minute = value; } } }, _minute_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _second_decorators, { kind: "accessor", name: "second", static: false, private: false, access: { has: obj => "second" in obj, get: obj => obj.second, set: (obj, value) => { obj.second = value; } } }, _second_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksTimePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [...BlocksTime.observedAttributes, ...BlocksInput.observedAttributes];
        }
        #clearup = (__runInitializers(this, _instanceExtraInitializers), void 0);
        _prevValue = {
            hour: null,
            minute: null,
            second: null,
        };
        #hour_accessor_storage = __runInitializers(this, _hour_initializers, void 0);
        get hour() { return this.#hour_accessor_storage; }
        set hour(value) { this.#hour_accessor_storage = value; }
        #minute_accessor_storage = __runInitializers(this, _minute_initializers, void 0);
        get minute() { return this.#minute_accessor_storage; }
        set minute(value) { this.#minute_accessor_storage = value; }
        #second_accessor_storage = __runInitializers(this, _second_initializers, void 0);
        get second() { return this.#second_accessor_storage; }
        set second(value) { this.#second_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            const { inputTemplate, popupTemplate } = template();
            const fragment = inputTemplate.content.cloneNode(true);
            shadowRoot.appendChild(fragment);
            const $input = this.querySelectorShadow('#result');
            const $popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup');
            const $time = $popup.querySelector('bl-time');
            this._ref = {
                $popup,
                $input,
                $time,
            };
            $popup.anchor = () => $input;
            const $confirm = $popup.querySelector('bl-button');
            const onFocus = () => {
                $time.scrollToActive();
                $popup.open = true;
            };
            $input.onfocus = $input.onclick = onFocus;
            const onClear = () => {
                $time.clear();
                this._prevValue = {
                    hour: null,
                    minute: null,
                    second: null,
                };
            };
            $input.addEventListener('click-clear', onClear);
            const onTimeChange = () => this.render();
            $time.addEventListener('change', onTimeChange);
            const onToggleOpen = () => boolSetter('popup-open')(this, $popup.open);
            $popup.addEventListener('open-changed', onToggleOpen);
            const onOpened = () => {
                this._prevValue = {
                    hour: $time.hour,
                    minute: $time.minute,
                    second: $time.second,
                };
                this._initClickOutside();
            };
            $popup.addEventListener('opened', onOpened);
            const onClosed = () => {
                if (this._prevValue) {
                    $time.hour = this._prevValue.hour;
                    $time.minute = this._prevValue.minute;
                    $time.second = this._prevValue.second;
                    this._prevValue = null;
                }
                this._destroyClickOutside();
            };
            $popup.addEventListener('closed', onClosed);
            const onConfirm = this._confirm.bind(this);
            $confirm.onclick = onConfirm;
        }
        connectedCallback() {
            super.connectedCallback();
            document.body.appendChild(this._ref.$popup);
            this.render();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            document.body.removeChild(this._ref.$popup);
            this._destroyClickOutside();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (BlocksInput.observedAttributes.includes(attrName)) {
                this._ref.$input.setAttribute(attrName, newValue);
            }
            if (BlocksTime.observedAttributes.includes(attrName)) {
                this._ref.$time.setAttribute(attrName, newValue);
            }
            this.render();
        }
        render() {
            const { $input, $time } = this._ref;
            if ([$time.hour, $time.minute, $time.second].some(v => Object.is(v, NaN) || v == null)) {
                $input.value = '';
                return;
            }
            const hour = padLeft('0', 2, String($time.hour));
            const minute = padLeft('0', 2, String($time.minute));
            const second = padLeft('0', 2, String($time.second));
            $input.value = `${hour}:${minute}:${second}`;
        }
        _confirm() {
            const { $popup, $time } = this._ref;
            this._prevValue = null;
            dispatchEvent(this, 'change', {
                detail: {
                    hour: $time.hour,
                    minute: $time.minute,
                    second: $time.second,
                },
            });
            $popup.open = false;
        }
        _initClickOutside() {
            if (!this.#clearup) {
                this.#clearup = onClickOutside([this, this._ref.$popup], () => {
                    if (this._ref.$popup.open)
                        this._ref.$popup.open = false;
                });
            }
        }
        _destroyClickOutside() {
            if (this.#clearup) {
                this.#clearup();
                this.#clearup = undefined;
            }
        }
    };
    return BlocksTimePicker = _classThis;
})();
