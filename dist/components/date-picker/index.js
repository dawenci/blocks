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
import '../popup/index.js';
import '../button/index.js';
import { BlocksInput } from '../input/index.js';
import { BlocksDate } from '../date/index.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { dispatchEvent } from '../../common/event.js';
import { boolSetter } from '../../common/property.js';
import { Component, } from '../Component.js';
import { inputTemplate, popupTemplate } from './template.js';
import { style } from './style.js';
import { customElement } from '../../decorators/customElement.js';
import { attachShadow } from '../../decorators/shadow.js';
import { applyStyle } from '../../decorators/style.js';
export let BlocksDatePicker = (() => {
    let _classDecorators = [customElement('bl-date-picker'), attachShadow, applyStyle(style)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BlocksDatePicker = class extends Component {
        static {
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDatePicker = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #prevValue;
        #clearClickOutside;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            const $input = shadowRoot.appendChild(inputTemplate());
            const $popup = popupTemplate();
            const $date = $popup.querySelector('bl-date');
            $popup.anchor = () => $input;
            $input.onfocus = $input.onclick = () => {
                $popup.open = true;
            };
            $date.addEventListener('select', () => {
                switch ($date.mode) {
                    case 'single': {
                        this.#prevValue = null;
                        this.render();
                        $popup.open = false;
                        break;
                    }
                    case 'range': {
                        this.#prevValue = null;
                        this.render();
                        $popup.open = false;
                        break;
                    }
                    case 'multiple': {
                        this.render();
                        break;
                    }
                }
            });
            $date.addEventListener('change', () => {
                if ($date.mode !== 'multiple') {
                    dispatchEvent(this, 'change', { detail: { value: this.value } });
                }
            });
            $popup.querySelector('bl-button').onclick = this._confirm.bind(this);
            $popup.addEventListener('open-changed', () => {
                boolSetter('popup-open')(this, $popup.open);
            });
            $popup.addEventListener('opened', () => {
                if ($date.mode !== null) {
                    this.#prevValue = $date.value;
                }
                ;
                $popup.querySelector('#action').style.display =
                    $date.mode === 'multiple' ? 'block' : 'none';
                this.#initClickOutside();
                dispatchEvent(this, 'opened');
            });
            $popup.addEventListener('closed', () => {
                if ($date.mode !== null && this.#prevValue) {
                    $date.value = this.#prevValue;
                    this.#prevValue = null;
                }
                this.#destroyClickOutside();
                dispatchEvent(this, 'closed');
            });
            $input.addEventListener('click-clear', () => {
                $date.clearValue();
                this.#prevValue = $date.value;
                this.render();
            });
            this._ref = {
                $popup,
                $date,
                $input,
            };
        }
        _confirm() {
            this.#prevValue = null;
            this.value = this._ref.$date.getValues();
            dispatchEvent(this, 'change', { detail: { value: this.value } });
            this.render();
            this._ref.$popup.open = false;
        }
        render() {
            if (this._ref.$date.mode === 'range') {
                this._ref.$input.value = (this.value ?? [])
                    .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
                    .join(' ~ ');
            }
            else if (this._ref.$date.mode === 'multiple') {
                this._ref.$input.value = (this.value ?? [])
                    .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
                    .join(', ');
            }
            else {
                const date = this.value;
                this._ref.$input.value = date
                    ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    : '';
            }
        }
        get value() {
            return this._ref.$date.value;
        }
        set value(value) {
            this._ref.$date.value = value;
        }
        get disabledDate() {
            return this._ref.$date.disabledDate;
        }
        set disabledDate(value) {
            this._ref.$date.disabledDate = value;
        }
        getDateProp(prop) {
            return this._ref.$date[prop];
        }
        setDateProp(prop, value) {
            ;
            this._ref.$date[prop] = value;
        }
        getInputProp(prop) {
            return this._ref.$input[prop];
        }
        setInputProp(prop, value) {
            ;
            this._ref.$input[prop] = value;
        }
        connectedCallback() {
            super.connectedCallback();
            document.body.appendChild(this._ref.$popup);
            this.render();
            this._ref.$popup.querySelector('#action').style.display =
                this._ref.$date.mode === 'multiple' ? 'block' : 'none';
            if (this._ref.$input.placeholder == null) {
                this._ref.$input.placeholder = '请选择日期';
            }
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            document.body.removeChild(this._ref.$popup);
            this.#destroyClickOutside();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (BlocksInput.observedAttributes.includes(attrName)) {
                this._ref.$input.setAttribute(attrName, newValue);
            }
            if (BlocksDate.observedAttributes.includes(attrName)) {
                this._ref.$date.setAttribute(attrName, newValue);
            }
            this.render();
        }
        #initClickOutside() {
            if (!this.#clearClickOutside) {
                this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
                    if (this._ref.$popup.open) {
                        this._ref.$date.clearUncompleteRange();
                        this._ref.$popup.open = false;
                    }
                });
            }
        }
        #destroyClickOutside() {
            if (this.#clearClickOutside) {
                this.#clearClickOutside();
                this.#clearClickOutside = undefined;
            }
        }
        static get observedAttributes() {
            return BlocksDate.observedAttributes.concat(BlocksInput.observedAttributes);
        }
    };
    return BlocksDatePicker = _classThis;
})();
