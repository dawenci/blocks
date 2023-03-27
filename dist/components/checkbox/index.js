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
import { shadowRef } from '../../decorators/shadowRef.js';
import { style } from './style.js';
import { template } from './template.js';
import { Control } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
export let BlocksCheckbox = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-checkbox',
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
    let _indeterminate_decorators;
    let _indeterminate_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$checkbox_decorators;
    let _$checkbox_initializers = [];
    let _$label_decorators;
    let _$label_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksCheckbox = class extends Control {
        static {
            _name_decorators = [attr('string')];
            _checked_decorators = [attr('boolean')];
            _indeterminate_decorators = [attr('boolean')];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$checkbox_decorators = [shadowRef('[part="checkbox"]')];
            _$label_decorators = [shadowRef('[part="label"]')];
            _$slot_decorators = [shadowRef('[part="slot"]')];
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } } }, _checked_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _indeterminate_decorators, { kind: "accessor", name: "indeterminate", static: false, private: false, access: { has: obj => "indeterminate" in obj, get: obj => obj.indeterminate, set: (obj, value) => { obj.indeterminate = value; } } }, _indeterminate_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$checkbox_decorators, { kind: "accessor", name: "$checkbox", static: false, private: false, access: { has: obj => "$checkbox" in obj, get: obj => obj.$checkbox, set: (obj, value) => { obj.$checkbox = value; } } }, _$checkbox_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$label_decorators, { kind: "accessor", name: "$label", static: false, private: false, access: { has: obj => "$label" in obj, get: obj => obj.$label, set: (obj, value) => { obj.$label = value; } } }, _$label_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksCheckbox = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'checkbox';
        }
        static get disableEventTypes() {
            return ['click', 'keydown', 'touchstart'];
        }
        #name_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _name_initializers, void 0));
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        #checked_accessor_storage = __runInitializers(this, _checked_initializers, void 0);
        get checked() { return this.#checked_accessor_storage; }
        set checked(value) { this.#checked_accessor_storage = value; }
        #indeterminate_accessor_storage = __runInitializers(this, _indeterminate_initializers, void 0);
        get indeterminate() { return this.#indeterminate_accessor_storage; }
        set indeterminate(value) { this.#indeterminate_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$checkbox_accessor_storage = __runInitializers(this, _$checkbox_initializers, void 0);
        get $checkbox() { return this.#$checkbox_accessor_storage; }
        set $checkbox(value) { this.#$checkbox_accessor_storage = value; }
        #$label_accessor_storage = __runInitializers(this, _$label_initializers, void 0);
        get $label() { return this.#$label_accessor_storage; }
        set $label(value) { this.#$label_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this._tabIndexFeature.withTabIndex(0);
            this.#setupCheck();
            this.#setupIndeterminate();
        }
        _controlFeature = SetupControlEvent.setup({ component: this });
        _emptyFeature = SetupEmpty.setup({
            component: this,
            predicate: () => {
                const $nodes = this.$slot.assignedNodes();
                for (let i = 0; i < $nodes.length; ++i) {
                    if ($nodes[i].nodeType === 1)
                        return false;
                    if ($nodes[i].nodeType === 3 && $nodes[i].nodeValue?.trim())
                        return false;
                }
                return true;
            },
            target: () => this.$label,
            init: () => {
                const toggle = () => this._emptyFeature.update();
                this.onConnected(() => {
                    this.$slot.addEventListener('slotchange', toggle);
                });
                this.onDisconnected(() => {
                    this.$slot.removeEventListener('slotchange', toggle);
                });
            },
        });
        #setupIndeterminate() {
            const render = () => {
                if (this.indeterminate) {
                    this.$checkbox.setAttribute('indeterminate', '');
                }
                else {
                    this.$checkbox.removeAttribute('indeterminate');
                }
            };
            this.onRender(render);
            this.onConnected(render);
            this.onAttributeChangedDep('indeterminate', () => {
                if (this.indeterminate)
                    this.checked = false;
                render();
            });
            this.onAttributeChangedDep('checked', () => {
                if (this.checked)
                    this.indeterminate = false;
            });
        }
        #setupCheck() {
            const onClick = (e) => {
                if (!e.defaultPrevented) {
                    this.checked = !this.checked;
                }
            };
            this.onConnected(() => {
                this.addEventListener('click', onClick);
            });
            this.onDisconnected(() => {
                this.removeEventListener('click', onClick);
            });
            this.onAttributeChangedDep('checked', () => {
                const payload = { detail: { checked: this.checked } };
                dispatchEvent(this, 'bl:checkbox:change', payload);
                dispatchEvent(this, 'change', payload);
            });
        }
    };
    return BlocksCheckbox = _classThis;
})();
