var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { forEach } from '../../common/utils.js';
import { enumGetter, enumSetter } from '../../common/property.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
const halfValueGetter = enumGetter('value', [
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
]);
const halfValueSetter = enumSetter('value', [
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
]);
const valueGetter = enumGetter('value', ['1', '2', '3', '4', '5']);
const valueSetter = enumSetter('value', ['1', '2', '3', '4', '5']);
const $STAR_ICON = getRegisteredSvgIcon('star');
export let BlocksRate = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-rate',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _clearable_decorators;
    let _clearable_initializers = [];
    let _half_decorators;
    let _half_initializers = [];
    let _resultMode_decorators;
    let _resultMode_initializers = [];
    var BlocksRate = class extends Component {
        static {
            _clearable_decorators = [attr('boolean')];
            _half_decorators = [attr('boolean')];
            _resultMode_decorators = [attr('boolean')];
            __esDecorate(this, null, _clearable_decorators, { kind: "accessor", name: "clearable", static: false, private: false, access: { has: obj => "clearable" in obj, get: obj => obj.clearable, set: (obj, value) => { obj.clearable = value; } } }, _clearable_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _half_decorators, { kind: "accessor", name: "half", static: false, private: false, access: { has: obj => "half" in obj, get: obj => obj.half, set: (obj, value) => { obj.half = value; } } }, _half_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _resultMode_decorators, { kind: "accessor", name: "resultMode", static: false, private: false, access: { has: obj => "resultMode" in obj, get: obj => obj.resultMode, set: (obj, value) => { obj.resultMode = value; } } }, _resultMode_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksRate = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return [
                'value',
                'half',
                'clearable',
                'result-mode',
            ];
        }
        _hoverValue = (__runInitializers(this, _instanceExtraInitializers), void 0);
        #clearable_accessor_storage = __runInitializers(this, _clearable_initializers, void 0);
        get clearable() { return this.#clearable_accessor_storage; }
        set clearable(value) { this.#clearable_accessor_storage = value; }
        #half_accessor_storage = __runInitializers(this, _half_initializers, void 0);
        get half() { return this.#half_accessor_storage; }
        set half(value) { this.#half_accessor_storage = value; }
        #resultMode_accessor_storage = __runInitializers(this, _resultMode_initializers, void 0);
        get resultMode() { return this.#resultMode_accessor_storage; }
        set resultMode(value) { this.#resultMode_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
            const $layout = shadowRoot.getElementById('layout');
            this.ref = { $layout };
            forEach($layout.children, ($button, index) => {
                $button.onmouseover = e => {
                    if (this.resultMode)
                        return;
                    if (!this.half) {
                        this._hoverValue = index + 1;
                    }
                    else {
                        let el = e.target;
                        while (!el.classList.contains('star')) {
                            el = el.parentElement;
                        }
                        this._hoverValue = index + (el.classList.contains('part') ? 0.5 : 1);
                    }
                    this.updateSelect();
                };
                $button.onclick = e => {
                    if (this.resultMode)
                        return;
                    if (!this.half) {
                        this.value = index + 1;
                    }
                    else {
                        let el = e.target;
                        while (!el.classList.contains('star')) {
                            el = el.parentElement;
                        }
                        this.value = index + (el.classList.contains('part') ? 0.5 : 1);
                    }
                    this.updateSelect();
                };
            });
            $layout.onmouseleave = e => {
                this._hoverValue = undefined;
                this.updateSelect();
            };
        }
        get value() {
            const value = this.resultMode
                ? this.getAttribute('value')
                : this.half
                    ? halfValueGetter(this)
                    : valueGetter(this);
            if (value == null)
                return null;
            return +value;
        }
        set value(value) {
            if (this.resultMode) {
                this.setAttribute('value', value);
            }
            if (this.half) {
                halfValueSetter(this, '' + value);
            }
            else {
                valueSetter(this, '' + value);
            }
        }
        updateSelect() {
            if (this.resultMode) {
                const value = this.value ?? 0;
                let acc = 0;
                forEach(this.ref.$layout.children, $button => {
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
                return;
            }
            const value = +(this._hoverValue ?? this.value ?? 0);
            let acc = 0;
            forEach(this.ref.$layout.children, $button => {
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
        render() {
            const star = document.createElement('span');
            star.className = 'star';
            star.appendChild($STAR_ICON.cloneNode(true));
            forEach(this.ref.$layout.children, $button => {
                if ($button.children.length !== 2) {
                    $button.innerHTML = '';
                    $button.appendChild(star.cloneNode(true));
                    $button
                        .appendChild(star.cloneNode(true))
                        .classList.add('part');
                }
            });
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
            this.updateSelect();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.render();
            this.updateSelect();
        }
    };
    return BlocksRate = _classThis;
})();
