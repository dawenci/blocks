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
import { customElement } from '../../decorators/customElement.js';
import { applyStyle } from '../../decorators/style.js';
import { domRef } from '../../decorators/domRef.js';
import { BlocksButton } from '../button/index.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { style } from './style.js';
import '../button/index.js';
export let BlocksButtonGroup = (() => {
    let _classDecorators = [customElement('bl-button-group'), applyStyle(style)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksButtonGroup = class extends Component {
        static {
            _$slot_decorators = [domRef('slot')];
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksButtonGroup = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #$slot_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _$slot_initializers, void 0));
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
            this.$slot.addEventListener('slotchange', this.render.bind(this));
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        render() {
            this.$slot.assignedElements().forEach($item => {
                if ($item instanceof BlocksButton) {
                    $item.setAttribute('group-context', '');
                }
            });
        }
    };
    return BlocksButtonGroup = _classThis;
})();
