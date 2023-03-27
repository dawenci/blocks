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
import { attr, attrs } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { style } from './steps.style.js';
import { template } from './steps.template.js';
import { BlocksStep } from './step.js';
import { Component } from '../component/Component.js';
export let BlocksSteps = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-stepper',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksSteps = class extends Component {
        static {
            _direction_decorators = [attr('enum', { enumValues: ['horizontal', 'vertical'] })];
            _size_decorators = [attrs.size];
            _$layout_decorators = [shadowRef('#layout')];
            _$slot_decorators = [shadowRef('slot')];
            __esDecorate(this, null, _direction_decorators, { kind: "accessor", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } } }, _direction_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSteps = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #direction_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _direction_initializers, void 0));
        get direction() { return this.#direction_accessor_storage; }
        set direction(value) { this.#direction_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            this.shadowRoot.appendChild(template());
            this.onConnected(this.render);
            this.#setupSlot();
        }
        #setupSlot() {
            const updateItemDirection = () => {
                this.$slot.assignedElements().forEach($step => {
                    if ($step instanceof BlocksStep) {
                        $step.direction = this.direction;
                    }
                });
            };
            this.onAttributeChangedDep('direction', updateItemDirection);
            this.onConnected(() => {
                updateItemDirection();
                this.$slot.addEventListener('slotchange', updateItemDirection);
            });
            this.onDisconnected(() => {
                this.$slot.removeEventListener('slotchange', updateItemDirection);
            });
        }
        stepIndex($step) {
            return this.$slot.assignedElements().findIndex($el => $el === $step);
        }
    };
    return BlocksSteps = _classThis;
})();
