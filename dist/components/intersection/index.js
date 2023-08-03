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
import { prop } from '../../decorators/prop/index.js';
import { template } from './template.js';
import { BlComponent } from '../component/Component.js';
export let BlIntersection = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-intersection',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _rootMargin_decorators;
    let _rootMargin_initializers = [];
    let _rootSelector_decorators;
    let _rootSelector_initializers = [];
    let _threshold_decorators;
    let _threshold_initializers = [];
    let _rootElement_decorators;
    let _rootElement_initializers = [];
    var BlIntersection = class extends BlComponent {
        static {
            _rootMargin_decorators = [attr('string')];
            _rootSelector_decorators = [attr('string')];
            _threshold_decorators = [attr('number')];
            _rootElement_decorators = [prop({
                    get(self) {
                        return self.#rootElement;
                    },
                    set(self, value) {
                        self.#rootElement = value;
                        self.updatePositionAndDirection();
                    },
                })];
            __esDecorate(this, null, _rootMargin_decorators, { kind: "accessor", name: "rootMargin", static: false, private: false, access: { has: obj => "rootMargin" in obj, get: obj => obj.rootMargin, set: (obj, value) => { obj.rootMargin = value; } } }, _rootMargin_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _rootSelector_decorators, { kind: "accessor", name: "rootSelector", static: false, private: false, access: { has: obj => "rootSelector" in obj, get: obj => obj.rootSelector, set: (obj, value) => { obj.rootSelector = value; } } }, _rootSelector_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _threshold_decorators, { kind: "accessor", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold, set: (obj, value) => { obj.threshold = value; } } }, _threshold_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _rootElement_decorators, { kind: "accessor", name: "rootElement", static: false, private: false, access: { has: obj => "rootElement" in obj, get: obj => obj.rootElement, set: (obj, value) => { obj.rootElement = value; } } }, _rootElement_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlIntersection = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['root'];
        }
        #rootMargin_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _rootMargin_initializers, '0px'));
        get rootMargin() { return this.#rootMargin_accessor_storage; }
        set rootMargin(value) { this.#rootMargin_accessor_storage = value; }
        #rootSelector_accessor_storage = __runInitializers(this, _rootSelector_initializers, void 0);
        get rootSelector() { return this.#rootSelector_accessor_storage; }
        set rootSelector(value) { this.#rootSelector_accessor_storage = value; }
        #threshold_accessor_storage = __runInitializers(this, _threshold_initializers, 0);
        get threshold() { return this.#threshold_accessor_storage; }
        set threshold(value) { this.#threshold_accessor_storage = value; }
        #rootElement;
        #rootElement_accessor_storage = __runInitializers(this, _rootElement_initializers, void 0);
        get rootElement() { return this.#rootElement_accessor_storage; }
        set rootElement(value) { this.#rootElement_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this.hook.onConnected(() => {
                this.render();
                this._initObserver();
            });
            this.hook.onDisconnected(() => {
                this._removeObserver();
            });
            this.hook.onAttributeChanged(() => {
                this._initObserver();
            });
        }
        _getRootElement() {
            if (this.rootElement) {
                return this.rootElement() ?? null;
            }
            if (this.rootSelector) {
                return document.querySelector(this.rootSelector);
            }
            return null;
        }
        _flag;
        _observer;
        _initObserver() {
            if (!this._flag) {
                this._flag = Promise.resolve().then(() => {
                    if (this._observer) {
                        this._observer.disconnect();
                    }
                    const root = this._getRootElement();
                    this._observer = new IntersectionObserver((entries, observer) => {
                        dispatchEvent(this, 'intersection', {
                            detail: {
                                entries,
                                observer,
                            },
                        });
                    }, {
                        root,
                        rootMargin: this.rootMargin,
                        threshold: +this.threshold,
                    });
                    this._observer.observe(this);
                    this._flag = null;
                });
            }
        }
        _removeObserver() {
            if (this._observer) {
                this._observer.disconnect();
            }
        }
    };
    return BlIntersection = _classThis;
})();
