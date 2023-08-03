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
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { enumGetter, enumSetter } from '../../common/property.js';
import { forEach } from '../../common/utils.js';
import { style } from './style.js';
import { template } from './template.js';
import { BlControl } from '../base-control/index.js';
const halfValueGetter = enumGetter('value', ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5']);
const halfValueSetter = enumSetter('value', ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5']);
const valueGetter = enumGetter('value', ['0', '1', '2', '3', '4', '5']);
const valueSetter = enumSetter('value', ['0', '1', '2', '3', '4', '5']);
export let BlRate = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-rate',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _value_decorators;
    let _value_initializers = [];
    let _half_decorators;
    let _half_initializers = [];
    let _resultMode_decorators;
    let _resultMode_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    var BlRate = class extends BlControl {
        static {
            _value_decorators = [attr('number', {
                    get(self) {
                        if (self.resultMode)
                            return +self.getAttribute('value');
                        const value = self.half ? halfValueGetter(self) : valueGetter(self);
                        if (value == null)
                            return 0;
                        return +value;
                    },
                    set(self, value) {
                        if (self.resultMode) {
                            self.setAttribute('value', value);
                        }
                        if (self.half) {
                            halfValueSetter(self, String(value));
                        }
                        else {
                            valueSetter(self, String(value));
                        }
                    },
                })];
            _half_decorators = [attr('boolean')];
            _resultMode_decorators = [attr('boolean')];
            _$layout_decorators = [shadowRef('#layout')];
            __esDecorate(this, null, _value_decorators, { kind: "accessor", name: "value", static: false, private: false, access: { has: obj => "value" in obj, get: obj => obj.value, set: (obj, value) => { obj.value = value; } } }, _value_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _half_decorators, { kind: "accessor", name: "half", static: false, private: false, access: { has: obj => "half" in obj, get: obj => obj.half, set: (obj, value) => { obj.half = value; } } }, _half_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _resultMode_decorators, { kind: "accessor", name: "resultMode", static: false, private: false, access: { has: obj => "resultMode" in obj, get: obj => obj.resultMode, set: (obj, value) => { obj.resultMode = value; } } }, _resultMode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlRate = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #value_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _value_initializers, void 0));
        get value() { return this.#value_accessor_storage; }
        set value(value) { this.#value_accessor_storage = value; }
        #half_accessor_storage = __runInitializers(this, _half_initializers, void 0);
        get half() { return this.#half_accessor_storage; }
        set half(value) { this.#half_accessor_storage = value; }
        #resultMode_accessor_storage = __runInitializers(this, _resultMode_initializers, void 0);
        get resultMode() { return this.#resultMode_accessor_storage; }
        set resultMode(value) { this.#resultMode_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this._disabledFeature.withDisableEventTypes(['click', 'mousedown', 'focus', 'mouseover', 'mouseleave', 'keydown']);
            this._tabIndexFeature.withTarget(() => [this.$layout]).withTabIndex(0);
            this.#setupEvents();
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
            this.hook.onAttributeChangedDep('value', () => {
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            });
        }
        #hoverValue;
        get hoverValue() {
            return this.#hoverValue;
        }
        set hoverValue(value) {
            this.#hoverValue = value;
            this.render();
        }
        render() {
            if (this.resultMode) {
                this.#renderResult();
            }
            else {
                this.#renderSelection();
            }
        }
        #setupEvents() {
            const getElContainsTarget = (e, tagName) => {
                let $el = e.target;
                while ($el && $el !== this.$layout) {
                    if ($el.tagName === tagName) {
                        return $el;
                    }
                    $el = $el.parentElement;
                }
                return null;
            };
            const getValue = (e) => {
                const $button = getElContainsTarget(e, 'BUTTON');
                if (!this.half)
                    return Number($button.dataset.value);
                const $star = getElContainsTarget(e, 'SPAN');
                return Number($button.dataset.value) - ($star.classList.contains('part') ? 0.5 : 0);
            };
            const onMouseOver = (e) => {
                if (this.resultMode)
                    return;
                const $button = getElContainsTarget(e, 'BUTTON');
                if (!$button)
                    return;
                this.hoverValue = getValue(e);
            };
            const onClick = (e) => {
                if (this.resultMode)
                    return;
                const $button = getElContainsTarget(e, 'BUTTON');
                if (!$button)
                    return;
                this.value = getValue(e);
            };
            const onMouseLeave = () => {
                this.hoverValue = undefined;
            };
            const onKeydown = (e) => {
                if (this.resultMode)
                    return;
                if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    if (this.value < 5) {
                        this.value += this.half ? 0.5 : 1;
                    }
                }
                else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    if (this.value > 0) {
                        this.value -= this.half ? 0.5 : 1;
                    }
                }
            };
            this.hook.onConnected(() => {
                this.$layout.addEventListener('keydown', onKeydown);
                this.$layout.addEventListener('mouseover', onMouseOver);
                this.$layout.addEventListener('click', onClick);
                this.$layout.addEventListener('mouseleave', onMouseLeave);
            });
            this.hook.onDisconnected(() => {
                this.$layout.removeEventListener('keydown', onKeydown);
                this.$layout.removeEventListener('mouseover', onMouseOver);
                this.$layout.removeEventListener('click', onClick);
                this.$layout.removeEventListener('mouseleave', onMouseLeave);
            });
        }
        #renderSelection() {
            const value = +(this.hoverValue ?? this.value ?? 0);
            let acc = 0;
            forEach(this.$layout.children, $button => {
                if (value - acc >= 1) {
                    $button.className = 'selected';
                    acc += 1;
                }
                else if (value - acc === 0.5) {
                    $button.className = 'partially-selected';
                    $button.querySelector('.part').style.width = '';
                    acc += 0.5;
                }
                else {
                    $button.className = '';
                }
            });
        }
        #renderResult() {
            const value = this.value ?? 0;
            let acc = 0;
            forEach(this.$layout.children, $button => {
                if (value - acc >= 1) {
                    $button.className = 'selected';
                    acc += 1;
                }
                else if (value - acc > 0) {
                    $button.className = 'partially-selected';
                    const n = value - acc;
                    $button.querySelector('.part').style.width = `${n * 100}%`;
                    acc += n;
                }
                else {
                    $button.className = '';
                }
            });
        }
    };
    return BlRate = _classThis;
})();
