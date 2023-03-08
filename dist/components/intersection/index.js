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
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let BlocksIntersection = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-intersection',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _rootMargin_decorators;
    let _rootMargin_initializers = [];
    let _threshold_decorators;
    let _threshold_initializers = [];
    var BlocksIntersection = class extends Component {
        static {
            _rootMargin_decorators = [attr('string')];
            _threshold_decorators = [attr('string')];
            __esDecorate(this, null, _rootMargin_decorators, { kind: "accessor", name: "rootMargin", static: false, private: false, access: { has: obj => "rootMargin" in obj, get: obj => obj.rootMargin, set: (obj, value) => { obj.rootMargin = value; } } }, _rootMargin_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _threshold_decorators, { kind: "accessor", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold, set: (obj, value) => { obj.threshold = value; } } }, _threshold_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksIntersection = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['root', 'root-margin', 'threshold'];
        }
        #rootMargin_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _rootMargin_initializers, '0px'));
        get rootMargin() { return this.#rootMargin_accessor_storage; }
        set rootMargin(value) { this.#rootMargin_accessor_storage = value; }
        #threshold_accessor_storage = __runInitializers(this, _threshold_initializers, '0');
        get threshold() { return this.#threshold_accessor_storage; }
        set threshold(value) { this.#threshold_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
        }
        _root;
        get root() {
            if (this._root) {
                return this._root() ?? null;
            }
            return this.getAttribute('root');
        }
        set root(value) {
            if (typeof value === 'string' || value === null) {
                this.setAttribute('root', value);
                this._root = undefined;
                return;
            }
            if (typeof value === 'function') {
                this._root = value;
            }
            else if (value instanceof Node) {
                this._root = () => value;
            }
            this.removeAttribute('root');
        }
        get rootElement() {
            let root = this.root;
            if (root instanceof Element) {
                if (root.contains(this))
                    return root;
                root = null;
            }
            if (typeof root === 'string') {
                try {
                    root = document.querySelector(root);
                    if (!root.contains(this))
                        root = null;
                }
                catch (error) {
                    root = null;
                }
            }
            return root ?? undefined;
        }
        _flag;
        _observer;
        _initObserver() {
            if (!this._flag) {
                this._flag = Promise.resolve().then(() => {
                    if (this._observer) {
                        this._observer.disconnect();
                    }
                    this._observer = new IntersectionObserver((entries, observer) => {
                        dispatchEvent(this, 'intersection', {
                            detail: {
                                entries,
                                observer,
                            },
                        });
                    }, {
                        root: this.rootElement,
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
        connectedCallback() {
            super.connectedCallback();
            this.render();
            this._initObserver();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this._removeObserver();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this._initObserver();
        }
    };
    return BlocksIntersection = _classThis;
})();
