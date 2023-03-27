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
import { style } from './style.js';
import { template } from './template.js';
import { ControlBox } from '../base-control-box/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
import { SetupEmpty } from '../setup-empty/index.js';
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
    let _block_decorators;
    let _block_initializers = [];
    let _outline_decorators;
    let _outline_initializers = [];
    let _type_decorators;
    let _type_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _$content_decorators;
    let _$content_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    var BlocksButton = class extends ControlBox {
        static {
            _block_decorators = [attr('boolean')];
            _outline_decorators = [attr('boolean')];
            _type_decorators = [attr('enum', { enumValues: types })];
            _size_decorators = [attrs.size];
            _$content_decorators = [shadowRef('[part="content"]')];
            _$slot_decorators = [shadowRef('[part="slot"]')];
            __esDecorate(this, null, _block_decorators, { kind: "accessor", name: "block", static: false, private: false, access: { has: obj => "block" in obj, get: obj => obj.block, set: (obj, value) => { obj.block = value; } } }, _block_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _outline_decorators, { kind: "accessor", name: "outline", static: false, private: false, access: { has: obj => "outline" in obj, get: obj => obj.outline, set: (obj, value) => { obj.outline = value; } } }, _outline_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _type_decorators, { kind: "accessor", name: "type", static: false, private: false, access: { has: obj => "type" in obj, get: obj => obj.type, set: (obj, value) => { obj.type = value; } } }, _type_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksButton = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'button';
        }
        static get disableEventTypes() {
            return ['click', 'keydown', 'touchstart'];
        }
        #block_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _block_initializers, void 0));
        get block() { return this.#block_accessor_storage; }
        set block(value) { this.#block_accessor_storage = value; }
        #outline_accessor_storage = __runInitializers(this, _outline_initializers, void 0);
        get outline() { return this.#outline_accessor_storage; }
        set outline(value) { this.#outline_accessor_storage = value; }
        #type_accessor_storage = __runInitializers(this, _type_initializers, void 0);
        get type() { return this.#type_accessor_storage; }
        set type(value) { this.#type_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        constructor() {
            super();
            this.appendContent(template());
            this._tabIndexFeature.withTabIndex(0);
            this.#setupContent();
        }
        _controlFeature = SetupControlEvent.setup({ component: this });
        _emptyFeature = SetupEmpty.setup({
            component: this,
            predicate: () => !this.$slot.assignedNodes().filter($node => $node.nodeType === 1 || $node.nodeType === 3).length,
            target: () => this.$layout,
        });
        #setupContent() {
            let _observer;
            const updateClass = () => {
                this._emptyFeature.update();
            };
            const updateAria = () => {
                this.setAttribute('aria-label', this.textContent ?? '');
            };
            const update = () => {
                updateAria();
                updateClass();
            };
            this.onConnected(() => {
                _observer = new MutationObserver(update);
                _observer.observe(this, { childList: true });
                update();
            });
            this.onDisconnected(() => {
                if (_observer) {
                    _observer.disconnect();
                    _observer = undefined;
                }
            });
        }
    };
    return BlocksButton = _classThis;
})();
