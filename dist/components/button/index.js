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
import { style } from './style.js';
import { ControlBox } from '../base-control-box/index.js';
import { labelTemplate } from './template.js';
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
const types = ['primary', 'danger', 'warning', 'success', 'link'];
export let BlocksButton = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-button',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _icon_decorators;
    let _icon_initializers = [];
    let _block_decorators;
    let _block_initializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    var BlocksButton = class extends ControlBox {
        static {
            _icon_decorators = [attr('string')];
            _block_decorators = [attr('boolean')];
            _type_decorators = [attr('enum', {
                    enumValues: types,
                })];
            _size_decorators = [attr('enum', { enumValues: ['small', 'large'] })];
            __esDecorate(this, null, _icon_decorators, { kind: "accessor", name: "icon", static: false, private: false, access: { has: obj => "icon" in obj, get: obj => obj.icon, set: (obj, value) => { obj.icon = value; } } }, _icon_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _block_decorators, { kind: "accessor", name: "block", static: false, private: false, access: { has: obj => "block" in obj, get: obj => obj.block, set: (obj, value) => { obj.block = value; } } }, _block_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } } }, _type_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksButton = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'button';
        }
        static get observedAttributes() {
            return super.observedAttributes.concat(['type', 'size']);
        }
        #icon_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _icon_initializers, void 0));
        get icon() { return this.#icon_accessor_storage; }
        set icon(value) { this.#icon_accessor_storage = value; }
        #block_accessor_storage = __runInitializers(this, _block_initializers, void 0);
        get block() { return this.#block_accessor_storage; }
        set block(value) { this.#block_accessor_storage = value; }
        #type_accessor_storage = __runInitializers(this, _type_initializers, void 0);
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        constructor() {
            super();
            this._appendContent(labelTemplate());
            this._ref.$content = this.querySelectorShadow('#content');
            this._ref.$slot = this.querySelectorShadow('slot');
            captureEventWhenEnable(this, 'keydown', e => {
                if (e.keyCode === 32 || e.keyCode === 13) {
                    e.preventDefault();
                    this.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                    }));
                }
            });
            captureEventWhenEnable(this, 'click', () => {
            });
            this._observer = new MutationObserver(() => {
                this.setAttribute('aria-label', this.textContent ?? '');
            });
        }
        render() {
            super.render();
            this._ref.$layout.classList.toggle('empty', !this._ref.$slot.assignedNodes().length);
        }
        connectedCallback() {
            super.connectedCallback();
            this.internalTabIndex = '0';
            this._observer.observe(this, {
                childList: true,
                characterData: true,
                subtree: true,
            });
            this.render();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this._observer.disconnect();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            switch (attrName) {
                case 'type': {
                    return this.render();
                }
                case 'size': {
                    return this.render();
                }
            }
        }
    };
    return BlocksButton = _classThis;
})();
