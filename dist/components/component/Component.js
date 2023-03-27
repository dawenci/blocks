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
import { append, mountAfter, mountBefore, prepend, unmount } from '../../common/mount.js';
import { defineClass } from '../../decorators/defineClass.js';
import { uniqId } from '../../common/uniqId.js';
import { upgradeProperty } from '../../common/upgradeProperty.js';
import * as hook from './hook-internal.js';
let cidSeed = uniqId();
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
            hook.setCurrentHook(this.#hook);
            const ctor = this.constructor;
            if (ctor._shadowRootInit) {
                this.attachShadow(ctor._shadowRootInit);
            }
            if (this.shadowRoot && ctor._$componentStyle) {
                this.insertStyle(ctor._$componentStyle);
            }
            if (this.setupMixin) {
                ;
                this.setupMixin();
            }
        }
        #cid = ++cidSeed;
        get cid() {
            return this.#cid;
        }
        #hook = new hook.Hook();
        onConnected(callback) {
            hook.onConnected(this.#hook, callback);
        }
        onDisconnected(callback) {
            hook.onDisconnected(this.#hook, callback);
        }
        onAdopted(callback) {
            hook.onAdopted(this.#hook, callback);
        }
        onAttributeChanged(callback) {
            hook.onAttributeChanged(this.#hook, callback);
        }
        onAttributeChangedDep(dep, callback) {
            hook.onAttributeChangedDep(this.#hook, callback, dep);
        }
        onAttributeChangedDeps(deps, callback) {
            hook.onAttributeChangedDeps(this.#hook, callback, deps);
        }
        onRender(callback) {
            hook.onRender(this.#hook, callback);
        }
        clearHooks() {
            hook.clearHooks(this.#hook);
        }
        connectedCallback() {
            this.initRole();
            this.upgradeProperty();
            this.#hook.call(this, 0);
        }
        disconnectedCallback() {
            this.#hook.call(this, 1);
        }
        adoptedCallback() {
            this.#hook.call(this, 2);
        }
        attributeChangedCallback(name, oldValue, newValue) {
            this.#hook.call(this, 3, name, oldValue, newValue);
        }
        render() {
            this.#hook.call(this, 4);
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
        appendShadowChild(node) {
            if (this.shadowRoot) {
                this.shadowRoot.appendChild(node);
            }
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
        insertStyle($style) {
            if (this.shadowRoot) {
                const $lastStyle = this._$lastStyle ??
                    getLastItem(this.shadowRoot.children.length ? this.shadowRoot.querySelectorAll('style') : []);
                if (typeof $style === 'string') {
                    const textContent = $style;
                    $style = document.createElement('style');
                    $style.textContent = textContent;
                }
                const _$last = $style.nodeType === 11 ? $style.children[$style.children.length - 1] : $style;
                if ($lastStyle) {
                    mountAfter($style.cloneNode(true), $lastStyle);
                }
                else {
                    prepend($style.cloneNode(true), this.shadowRoot);
                }
                ;
                this._$lastStyle = _$last;
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
            if (this.shadowRoot) {
                return this.shadowRoot.querySelector(selector);
            }
            return null;
        }
        querySelectorAllHost(selector) {
            return this.querySelectorAll(selector);
        }
        querySelectorAllShadow(selector) {
            if (this.shadowRoot) {
                return Array.from(this.shadowRoot.querySelectorAll(selector));
            }
            return [];
        }
    };
    return Component = _classThis;
})();
function getLastItem(arrayLike) {
    return arrayLike[arrayLike.length - 1];
}
