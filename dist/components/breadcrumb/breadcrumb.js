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
import { style } from './breadcrumb.style.js';
import { Component } from '../Component.js';
import { template } from './breadcrumb.template.js';
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
    var BlocksBreadcrumb = class extends Component {
        static {
            _separator_decorators = [attr('string')];
            __esDecorate(this, null, _separator_decorators, { kind: "accessor", name: "separator", static: false, private: false, access: { has: obj => "separator" in obj, get: obj => obj.separator, set: (obj, value) => { obj.separator = value; } } }, _separator_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksBreadcrumb = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #separator_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _separator_initializers, '/'));
        get separator() { return this.#separator_accessor_storage; }
        set separator(value) { this.#separator_accessor_storage = value; }
        #clearup;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
            this._ref = {
                $slot: shadowRoot.querySelector('slot'),
            };
        }
        render() {
            this._ref.$slot.assignedElements().forEach($item => {
                if (isItem($item)) {
                    $item._renderSeparator(this.separator);
                }
            });
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
            const onSlotChange = () => this.render();
            this._ref.$slot.addEventListener('slotchange', onSlotChange);
            this.#clearup = () => {
                this._ref.$slot.removeEventListener('slotchange', onSlotChange);
            };
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.#clearup) {
                this.#clearup();
            }
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.render();
        }
    };
    return BlocksBreadcrumb = _classThis;
})();
function isItem(item) {
    return !!item._renderSeparator;
}
