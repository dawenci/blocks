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
import './item.js';
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { style } from './breadcrumb.style.js';
import { template } from './breadcrumb.template.js';
import { Component } from '../component/Component.js';
export let BlocksBreadcrumb = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-breadcrumb',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _separator_decorators;
    let _separator_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksBreadcrumb = class extends Component {
        static {
            _separator_decorators = [attr('string')];
            _$slot_decorators = [shadowRef('slot')];
            __esDecorate(this, null, _separator_decorators, { kind: "accessor", name: "separator", static: false, private: false, access: { has: obj => "separator" in obj, get: obj => obj.separator, set: (obj, value) => { obj.separator = value; } } }, _separator_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksBreadcrumb = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #separator_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _separator_initializers, '/'));
        get separator() { return this.#separator_accessor_storage; }
        set separator(value) { this.#separator_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupSeparator();
        }
        #setupSeparator() {
            const render = () => {
                this.$slot.assignedElements().forEach($item => {
                    if (isItem($item)) {
                        $item._renderSeparator(this.separator);
                    }
                });
            };
            this.onRender(render);
            this.onConnected(render);
            this.onAttributeChangedDep('separator', render);
            this.onConnected(() => {
                this.$slot.addEventListener('slotchange', render);
            });
            this.onDisconnected(() => {
                this.$slot.removeEventListener('slotchange', render);
            });
        }
    };
    return BlocksBreadcrumb = _classThis;
})();
function isItem(item) {
    return !!item._renderSeparator;
}
