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
import { fromAttr } from '../component/reactive.js';
import { scrollTo } from '../../common/scrollTo.js';
import { style } from './style.js';
import { strSetter } from '../../common/property.js';
import { template } from './template.js';
import { BlComponent } from '../component/Component.js';
import { computed, reactive, subscribe, unsubscribe } from '../../common/reactive.js';
export let BlBackTop = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-backtop',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _duration_decorators;
    let _duration_initializers = [];
    let _threshold_decorators;
    let _threshold_initializers = [];
    var BlBackTop = class extends BlComponent {
        static {
            _duration_decorators = [attr('number')];
            _threshold_decorators = [attr('number')];
            __esDecorate(this, null, _duration_decorators, { kind: "accessor", name: "duration", static: false, private: false, access: { has: obj => "duration" in obj, get: obj => obj.duration, set: (obj, value) => { obj.duration = value; } } }, _duration_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _threshold_decorators, { kind: "accessor", name: "threshold", static: false, private: false, access: { has: obj => "threshold" in obj, get: obj => obj.threshold, set: (obj, value) => { obj.threshold = value; } } }, _threshold_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlBackTop = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'button';
        }
        #duration_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _duration_initializers, 0));
        get duration() { return this.#duration_accessor_storage; }
        set duration(value) { this.#duration_accessor_storage = value; }
        #threshold_accessor_storage = __runInitializers(this, _threshold_initializers, 400);
        get threshold() { return this.#threshold_accessor_storage; }
        set threshold(value) { this.#threshold_accessor_storage = value; }
        #scrolled = reactive(0);
        visible = computed((scrolled, threshold) => scrolled >= threshold, [this.#scrolled, fromAttr(this, 'threshold')]);
        constructor() {
            super();
            this.appendShadowChild(template());
            this.#setupTarget();
            this.#setupButton();
        }
        #target;
        get target() {
            if (this.#target) {
                return this.#target() ?? null;
            }
            return this.getAttribute('target');
        }
        set target(value) {
            if (typeof value === 'string' || value === null) {
                strSetter('target')(this, value);
                this.#target = undefined;
                return;
            }
            if (typeof value === 'function') {
                this.#target = value;
            }
            else if (value instanceof Node) {
                this.#target = () => value;
            }
            this.removeAttribute('target');
        }
        get targetElement() {
            const target = this.target;
            if (target === null) {
                return window;
            }
            if (target instanceof Element) {
                return target;
            }
            if (typeof target === 'string') {
                try {
                    return document.querySelector(target) ?? window;
                }
                catch (error) {
                    return window;
                }
            }
            return window;
        }
        #setupButton() {
            const render = () => {
                this.style.display = this.visible.content ? '' : 'none';
            };
            const onClick = () => {
                scrollTo(this.targetElement, 0, {
                    duration: this.duration,
                    done: render,
                });
            };
            this.hook.onConnected(() => {
                this.addEventListener('click', onClick);
                subscribe(this.visible, render);
            });
            this.hook.onDisconnected(() => {
                this.removeEventListener('click', onClick);
                unsubscribe(this.visible, render);
            });
            this.hook.onRender(render);
            this.hook.onConnected(render);
        }
        #setupTarget() {
            const scrollEventOptions = {
                capture: true,
                passive: true,
            };
            const onTargetScroll = (e) => {
                if (e.target === this.targetElement) {
                    this.#scrolled.content = this.targetElement.scrollTop;
                }
            };
            this.hook.onConnected(() => {
                document.addEventListener('scroll', onTargetScroll, scrollEventOptions);
            });
            this.hook.onDisconnected(() => {
                document.removeEventListener('scroll', onTargetScroll, scrollEventOptions);
            });
        }
    };
    return BlBackTop = _classThis;
})();
