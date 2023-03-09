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
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
import { labelTemplate, radioTemplate } from './template.js';
import { style } from './style.js';
import { dispatchEvent } from '../../common/event.js';
import { Control } from '../base-control/index.js';
import { domRef } from '../../decorators/domRef.js';
export let BlocksRadio = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-radio',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _checked_decorators;
    let _checked_initializers = [];
    let _$radio_decorators;
    let _$radio_initializers = [];
    let _$label_decorators;
    let _$label_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksRadio = class extends Control {
        static {
            _name_decorators = [attr('string')];
            _checked_decorators = [attr('boolean')];
            _$radio_decorators = [domRef('#radio')];
            _$label_decorators = [domRef('#label')];
            _$slot_decorators = [domRef('slot')];
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } } }, _checked_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$radio_decorators, { kind: "accessor", name: "$radio", static: false, private: false, access: { has: obj => "$radio" in obj, get: obj => obj.$radio, set: (obj, value) => { obj.$radio = value; } } }, _$radio_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$label_decorators, { kind: "accessor", name: "$label", static: false, private: false, access: { has: obj => "$label" in obj, get: obj => obj.$label, set: (obj, value) => { obj.$label = value; } } }, _$label_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksRadio = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'radio';
        }
        #name_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _name_initializers, void 0));
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #checked_accessor_storage = __runInitializers(this, _checked_initializers, void 0);
        get checked() { return this.#checked_accessor_storage; }
        set checked(value) { this.#checked_accessor_storage = value; }
        #$radio_accessor_storage = __runInitializers(this, _$radio_initializers, void 0);
        get $radio() { return this.#$radio_accessor_storage; }
        set $radio(value) { this.#$radio_accessor_storage = value; }
        #$label_accessor_storage = __runInitializers(this, _$label_initializers, void 0);
        get $label() { return this.#$label_accessor_storage; }
        set $label(value) { this.#$label_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            this.$layout.appendChild(radioTemplate());
            const $label = this.$layout.appendChild(labelTemplate());
            const $slot = $label.querySelector('slot');
            const toggleEmptyClass = () => {
                $label.classList.toggle('empty', !$slot.assignedNodes().length);
            };
            toggleEmptyClass();
            $slot.addEventListener('slotchange', toggleEmptyClass);
            const check = () => {
                if (!this.checked && this.name) {
                    document.getElementsByName(this.name).forEach(el => {
                        if (el !== this && el instanceof BlocksRadio) {
                            el.checked = false;
                        }
                    });
                    this.checked = true;
                }
            };
            captureEventWhenEnable(this, 'click', check);
            captureEventWhenEnable(this, 'keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    check();
                    e.preventDefault();
                }
            });
        }
        connectedCallback() {
            super.connectedCallback();
            this.internalTabIndex = '0';
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'checked') {
                dispatchEvent(this, 'change', { detail: { checked: this.checked } });
            }
        }
    };
    return BlocksRadio = _classThis;
})();
