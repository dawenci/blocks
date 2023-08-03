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
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { template } from './template.js';
import { AriaFeature } from './AriaFeature.js';
import { BlControl } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
export let BlRadio = (() => {
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
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$radio_decorators;
    let _$radio_initializers = [];
    let _$label_decorators;
    let _$label_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlRadio = class extends BlControl {
        static {
            _name_decorators = [attr('string')];
            _checked_decorators = [attr('boolean')];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$radio_decorators = [shadowRef('[part="radio"]')];
            _$label_decorators = [shadowRef('[part="label"]')];
            _$slot_decorators = [shadowRef('[part="slot"]')];
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } } }, _checked_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$radio_decorators, { kind: "accessor", name: "$radio", static: false, private: false, access: { has: obj => "$radio" in obj, get: obj => obj.$radio, set: (obj, value) => { obj.$radio = value; } } }, _$radio_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$label_decorators, { kind: "accessor", name: "$label", static: false, private: false, access: { has: obj => "$label" in obj, get: obj => obj.$label, set: (obj, value) => { obj.$label = value; } } }, _$label_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlRadio = _classThis = _classDescriptor.value;
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
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
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
            this.appendShadowChild(template());
            this._tabIndexFeature.withTabIndex(0);
            this.#setupCheck();
        }
        _ariaFeature = AriaFeature.make('aria', this);
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
                this.hook.onConnected(() => {
                    this.$slot.addEventListener('slotchange', toggle);
                });
                this.hook.onDisconnected(() => {
                    this.$slot.removeEventListener('slotchange', toggle);
                });
            },
        });
        #setupCheck() {
            const onClick = (e) => {
                if (e.defaultPrevented)
                    return;
                if (!this.checked && this.name) {
                    document.getElementsByName(this.name).forEach($el => {
                        if ($el !== this && $el instanceof BlRadio) {
                            $el.checked = false;
                        }
                    });
                    this.checked = true;
                }
            };
            this.hook.onConnected(() => {
                this.addEventListener('click', onClick);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('click', onClick);
            });
            this.hook.onAttributeChangedDep('checked', () => {
                const payload = { detail: { checked: this.checked } };
                dispatchEvent(this, 'bl:radio:change', payload);
                dispatchEvent(this, 'change', payload);
            });
        }
    };
    return BlRadio = _classThis;
})();
