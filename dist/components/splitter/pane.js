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
import { style } from './pane.style.js';
import { template } from './pane.template.js';
import { Component } from '../component/Component.js';
export let BlocksSplitterPane = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-splitter-pane',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _basis_decorators;
    let _basis_initializers = [];
    let _grow_decorators;
    let _grow_initializers = [];
    let _shrink_decorators;
    let _shrink_initializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _min_decorators;
    let _min_initializers = [];
    var BlocksSplitterPane = class extends Component {
        static {
            _basis_decorators = [attr('number')];
            _grow_decorators = [attr('number')];
            _shrink_decorators = [attr('number')];
            _max_decorators = [attr('number')];
            _min_decorators = [attr('number')];
            __esDecorate(this, null, _basis_decorators, { kind: "accessor", name: "basis", static: false, private: false, access: { has: obj => "basis" in obj, get: obj => obj.basis, set: (obj, value) => { obj.basis = value; } } }, _basis_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _grow_decorators, { kind: "accessor", name: "grow", static: false, private: false, access: { has: obj => "grow" in obj, get: obj => obj.grow, set: (obj, value) => { obj.grow = value; } } }, _grow_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _shrink_decorators, { kind: "accessor", name: "shrink", static: false, private: false, access: { has: obj => "shrink" in obj, get: obj => obj.shrink, set: (obj, value) => { obj.shrink = value; } } }, _shrink_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } } }, _max_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } } }, _min_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSplitterPane = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [
                'basis',
                'grow',
                'max',
                'min',
                'shrink',
            ];
        }
        #basis_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _basis_initializers, 0));
        get basis() { return this.#basis_accessor_storage; }
        set basis(value) { this.#basis_accessor_storage = value; }
        #grow_accessor_storage = __runInitializers(this, _grow_initializers, 1);
        get grow() { return this.#grow_accessor_storage; }
        set grow(value) { this.#grow_accessor_storage = value; }
        #shrink_accessor_storage = __runInitializers(this, _shrink_initializers, 1);
        get shrink() { return this.#shrink_accessor_storage; }
        set shrink(value) { this.#shrink_accessor_storage = value; }
        #max_accessor_storage = __runInitializers(this, _max_initializers, Infinity);
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #min_accessor_storage = __runInitializers(this, _min_initializers, 0);
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        collapseSize;
        constructor() {
            super();
            this.shadowRoot.appendChild(template());
            const onMouseEnter = () => {
                this.getSplitter().setActiveHandle(this);
            };
            this.onConnected(() => {
                this.addEventListener('mouseenter', onMouseEnter);
            });
            this.onDisconnected(() => {
                this.removeEventListener('mouseenter', onMouseEnter);
            });
            this.onConnected(this.render);
        }
        _size;
        get size() {
            return this._size ?? this.basis;
        }
        set size(value) {
            this._size = value;
        }
        getSplitter() {
            return this.closest('bl-splitter');
        }
        updateStyle() {
            const sizeProp = this.getSplitter().direction === 'horizontal' ? 'width' : 'height';
            const posProp = this.getSplitter().direction === 'horizontal' ? 'left' : 'top';
            this.style[sizeProp] = this.getSplitter().getPaneSize(this) + 'px';
            this.style[posProp] = this.getSplitter().getPanePosition(this) + 'px';
        }
        collapse() {
            this.getSplitter().collapsePane(this);
        }
        expand() {
            this.getSplitter().expandPane(this);
        }
    };
    return BlocksSplitterPane = _classThis;
})();
