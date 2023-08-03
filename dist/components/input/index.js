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
import { attr, attrs } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { disabledSetter } from '../../common/propertyAccessor.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { template } from './template.js';
import { BlClearableControlBox } from '../base-clearable-control-box/index.js';
const INPUT_ATTRS = [
    'value',
    'type',
    'step',
    'readonly',
    'placeholder',
    'name',
    'multiple',
    'min',
    'max',
    'minlength',
    'maxlength',
    'autocomplete',
];
export let BlInput = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-input',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _step_decorators;
    let _step_initializers = [];
    let _readonly_decorators;
    let _readonly_initializers = [];
    let _placeholder_decorators;
    let _placeholder_initializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _minlength_decorators;
    let _minlength_initializers = [];
    let _maxlength_decorators;
    let _maxlength_initializers = [];
    let _autocomplete_decorators;
    let _autocomplete_initializers = [];
    let _autofocus_decorators;
    let _autofocus_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _$input_decorators;
    let _$input_initializers = [];
    var BlInput = class extends BlClearableControlBox {
        static {
            _value_decorators = [attr('string')];
            _type_decorators = [attr('string')];
            _step_decorators = [attr('string')];
            _readonly_decorators = [attr('boolean')];
            _placeholder_decorators = [attr('string')];
            _name_decorators = [attr('string')];
            _min_decorators = [attr('string')];
            _max_decorators = [attr('string')];
            _minlength_decorators = [attr('string')];
            _maxlength_decorators = [attr('string')];
            _autocomplete_decorators = [attr('boolean')];
            _autofocus_decorators = [attr('boolean')];
            _size_decorators = [attrs.size];
            _multiple_decorators = [attr('boolean')];
            _$input_decorators = [shadowRef('[part="content"]')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } } }, _type_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _step_decorators, { kind: "accessor", name: "step", static: false, private: false, access: { has: obj => "step" in obj, get: obj => obj.step, set: (obj, value) => { obj.step = value; } } }, _step_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _readonly_decorators, { kind: "accessor", name: "readonly", static: false, private: false, access: { has: obj => "readonly" in obj, get: obj => obj.readonly, set: (obj, value) => { obj.readonly = value; } } }, _readonly_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _placeholder_decorators, { kind: "accessor", name: "placeholder", static: false, private: false, access: { has: obj => "placeholder" in obj, get: obj => obj.placeholder, set: (obj, value) => { obj.placeholder = value; } } }, _placeholder_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } } }, _min_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } } }, _max_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minlength_decorators, { kind: "accessor", name: "minlength", static: false, private: false, access: { has: obj => "minlength" in obj, get: obj => obj.minlength, set: (obj, value) => { obj.minlength = value; } } }, _minlength_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _maxlength_decorators, { kind: "accessor", name: "maxlength", static: false, private: false, access: { has: obj => "maxlength" in obj, get: obj => obj.maxlength, set: (obj, value) => { obj.maxlength = value; } } }, _maxlength_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _autocomplete_decorators, { kind: "accessor", name: "autocomplete", static: false, private: false, access: { has: obj => "autocomplete" in obj, get: obj => obj.autocomplete, set: (obj, value) => { obj.autocomplete = value; } } }, _autocomplete_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _autofocus_decorators, { kind: "accessor", name: "autofocus", static: false, private: false, access: { has: obj => "autofocus" in obj, get: obj => obj.autofocus, set: (obj, value) => { obj.autofocus = value; } } }, _autofocus_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } } }, _multiple_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$input_decorators, { kind: "accessor", name: "$input", static: false, private: false, access: { has: obj => "$input" in obj, get: obj => obj.$input, set: (obj, value) => { obj.$input = value; } } }, _$input_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlInput = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'input';
        }
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #type_accessor_storage = __runInitializers(this, _type_initializers, void 0);
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #step_accessor_storage = __runInitializers(this, _step_initializers, void 0);
        get step() { return this.#step_accessor_storage; }
        set step(value) { this.#step_accessor_storage = value; }
        #readonly_accessor_storage = __runInitializers(this, _readonly_initializers, void 0);
        get readonly() { return this.#readonly_accessor_storage; }
        set readonly(value) { this.#readonly_accessor_storage = value; }
        #placeholder_accessor_storage = __runInitializers(this, _placeholder_initializers, void 0);
        get placeholder() { return this.#placeholder_accessor_storage; }
        set placeholder(value) { this.#placeholder_accessor_storage = value; }
        #name_accessor_storage = __runInitializers(this, _name_initializers, void 0);
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #min_accessor_storage = __runInitializers(this, _min_initializers, void 0);
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = __runInitializers(this, _max_initializers, void 0);
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #minlength_accessor_storage = __runInitializers(this, _minlength_initializers, void 0);
        get minlength() { return this.#minlength_accessor_storage; }
        set minlength(value) { this.#minlength_accessor_storage = value; }
        #maxlength_accessor_storage = __runInitializers(this, _maxlength_initializers, void 0);
        get maxlength() { return this.#maxlength_accessor_storage; }
        set maxlength(value) { this.#maxlength_accessor_storage = value; }
        #autocomplete_accessor_storage = __runInitializers(this, _autocomplete_initializers, void 0);
        get autocomplete() { return this.#autocomplete_accessor_storage; }
        set autocomplete(value) { this.#autocomplete_accessor_storage = value; }
        #autofocus_accessor_storage = __runInitializers(this, _autofocus_initializers, void 0);
        get autofocus() { return this.#autofocus_accessor_storage; }
        set autofocus(value) { this.#autofocus_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #multiple_accessor_storage = __runInitializers(this, _multiple_initializers, void 0);
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #$input_accessor_storage = __runInitializers(this, _$input_initializers, void 0);
        get $input() { return this.#$input_accessor_storage; }
        set $input(value) { this.#$input_accessor_storage = value; }
        constructor() {
            super();
            this.appendContent(template());
            this._tabIndexFeature
                .withTabIndex(0)
                .withTarget(() => [this.$input])
                .withPostUpdate(() => {
                if (this.$layout.hasAttribute('tabindex')) {
                    this.$layout.removeAttribute('tabindex');
                }
            });
            this.#setupDisableFeature();
            this.#setupValueModify();
        }
        #setupDisableFeature() {
            this._disabledFeature.withPostUpdate(() => {
                disabledSetter(this.$input, this.disabled);
            });
        }
        #notifyClear() {
            dispatchEvent(this, 'select-result:clear');
        }
        #notifyDeselect() {
            dispatchEvent(this, 'select-result:deselect');
        }
        #notifySearch(searchString) {
            dispatchEvent(this, 'select-result:search', { detail: { searchString } });
        }
        #setupValueModify() {
            this._emptyFeature.withPredicate(() => {
                return !this.value;
            });
            const onChange = () => {
                this.value = this.$input.value;
            };
            const onClear = () => {
                this.value = '';
                this.#notifyClear();
            };
            this.hook.onConnected(() => {
                this.$input.oninput = this.$input.onchange = onChange;
                this.addEventListener('click-clear', onClear);
            });
            this.hook.onDisconnected(() => {
                this.$input.oninput = this.$input.onchange = null;
                this.removeEventListener('click-clear', onClear);
            });
            this.hook.onAttributeChangedDeps(INPUT_ATTRS, (name, _, val) => {
                if (name === 'value') {
                    if (this.$input.value !== val) {
                        this.$input.value = val;
                    }
                }
                else {
                    this.$input.setAttribute(name, val);
                }
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            });
            this.hook.onAttributeChangedDep('value', () => {
                this._emptyFeature.update();
            });
        }
        acceptSelected(value) {
            const label = value.map(item => item.label).join(', ');
            this.value = label;
            dispatchEvent(this, 'select-result:after-accept-selected');
        }
        clearSearch() {
            this.#notifySearch('');
        }
        focus() {
            this.$input.focus();
        }
    };
    return BlInput = _classThis;
})();
