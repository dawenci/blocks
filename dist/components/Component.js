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
import { defineClass } from '../decorators/defineClass.js';
import { append, mountAfter, mountBefore, prepend, unmount } from '../common/mount.js';
import { upgradeProperty } from '../common/upgradeProperty.js';
export let Component = (() => {
    let _classDecorators = [defineClass({
            attachShadow: true,
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Component = class extends HTMLElement {
        static {
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            Component = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [];
        }
        constructor() {
            super();
            const ctor = this.constructor;
            if (ctor._shadowRootInit) {
                this.attachShadow(ctor._shadowRootInit);
            }
            if (this.shadowRoot && ctor._$componentStyle) {
                const $lastStyle = this._$lastStyle ??
                    getLastItem(this.shadowRoot.children.length ? this.shadowRoot.querySelectorAll('style') : []);
                const $fragment = ctor._$componentStyle;
                const _$last = $fragment.children[$fragment.children.length - 1];
                if ($lastStyle) {
                    mountAfter($fragment.cloneNode(true), $lastStyle);
                }
                else {
                    prepend($fragment.cloneNode(true), this.shadowRoot);
                }
                ;
                this._$lastStyle = _$last;
            }
        }
        connectedCallback() {
            this.initRole();
            this.upgradeProperty();
        }
        disconnectedCallback() {
        }
        adoptedCallback() {
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
        }
        render() {
        }
        prependTo($parent) {
            prepend(this, $parent);
        }
        appendTo($parent) {
            append(this, $parent);
        }
        mountBefore($sibling) {
            mountBefore(this, $sibling);
        }
        mountAfter($sibling) {
            mountAfter(this, $sibling);
        }
        unmount() {
            unmount(this);
        }
        appendShadowChildren(nodes) {
            if (this.shadowRoot) {
                for (let i = 0; i < nodes.length; i += 1) {
                    this.shadowRoot.appendChild(nodes[i]);
                }
            }
        }
        appendChildren(nodes) {
            for (let i = 0; i < nodes.length; i += 1) {
                this.appendChild(nodes[i]);
            }
        }
        upgradeProperty(props) {
            if (!props) {
                props = this.constructor.upgradeProperties ?? [];
            }
            props.forEach(attr => {
                upgradeProperty(this, attr);
            });
        }
        initRole() {
            const role = this.constructor.role;
            if (role) {
                this.setAttribute('role', role);
            }
        }
        querySelectorHost(selector) {
            return this.querySelector(selector);
        }
        querySelectorShadow(selector) {
            return this.shadowRoot?.querySelector?.(selector) ?? null;
        }
        querySelectorAllHost(selector) {
            return this.querySelectorAll(selector);
        }
        querySelectorAllShadow(selector) {
            return this.shadowRoot?.querySelectorAll?.(selector) ?? null;
        }
    };
    return Component = _classThis;
})();
function getLastItem(arrayLike) {
    return arrayLike[arrayLike.length - 1];
}
