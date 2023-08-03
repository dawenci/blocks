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
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { template } from './template.js';
import { BlControl } from '../base-control/index.js';
import { SetupControlEvent } from '../setup-control-event/index.js';
export let BlSwitch = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-switch',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _checked_decorators;
    let _checked_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    var BlSwitch = class extends BlControl {
        static {
            _checked_decorators = [attr('boolean')];
            _size_decorators = [attrs.size];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            __esDecorate(this, null, _checked_decorators, { kind: "accessor", name: "checked", static: false, private: false, access: { has: obj => "checked" in obj, get: obj => obj.checked, set: (obj, value) => { obj.checked = value; } } }, _checked_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlSwitch = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'switch';
        }
        #checked_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _checked_initializers, void 0));
        get checked() { return this.#checked_accessor_storage; }
        set checked(value) { this.#checked_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this._tabIndexFeature.withTabIndex(0);
            this.#setupEvents();
            this.hook.onAttributeChangedDep('checked', () => {
                dispatchEvent(this, 'change', { detail: { value: this.checked } });
            });
        }
        _controlFeature = SetupControlEvent.setup({ component: this });
        #setupEvents() {
            const onClick = () => {
                this.checked = !this.checked;
            };
            this.hook.onConnected(() => {
                this.addEventListener('click', onClick);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('click', onClick);
            });
        }
    };
    return BlSwitch = _classThis;
})();
