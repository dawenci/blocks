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
import { numGetter, numSetter } from '../../common/property.js';
import { forEach, round } from '../../common/utils.js';
import { dispatchEvent } from '../../common/event.js';
import { onDragMove } from '../../common/onDragMove.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { setStyles } from '../../common/style.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
export let BlocksSlider = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-slider',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _shadowSize_decorators;
    let _shadowSize_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _min_decorators;
    let _min_initializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _vertical_decorators;
    let _vertical_initializers = [];
    let _round_decorators;
    let _round_initializers = [];
    var BlocksSlider = class extends Component {
        static {
            _shadowSize_decorators = [attr('intRange', { min: 1, max: 10 })];
            _size_decorators = [attr('intRange', { min: 14, max: 100 })];
            _min_decorators = [attr('number')];
            _max_decorators = [attr('number')];
            _disabled_decorators = [attr('boolean')];
            _vertical_decorators = [attr('boolean')];
            _round_decorators = [attr('int')];
            __esDecorate(this, null, _shadowSize_decorators, { kind: "accessor", name: "shadowSize", static: false, private: false, access: { has: obj => "shadowSize" in obj, get: obj => obj.shadowSize, set: (obj, value) => { obj.shadowSize = value; } } }, _shadowSize_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } } }, _min_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } } }, _max_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _vertical_decorators, { kind: "accessor", name: "vertical", static: false, private: false, access: { has: obj => "vertical" in obj, get: obj => obj.vertical, set: (obj, value) => { obj.vertical = value; } } }, _vertical_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _round_decorators, { kind: "accessor", name: "round", static: false, private: false, access: { has: obj => "round" in obj, get: obj => obj.round, set: (obj, value) => { obj.round = value; } } }, _round_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSlider = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get role() {
            return 'slider';
        }
        static get observedAttributes() {
            return [
                'disabled',
                'max',
                'min',
                'size',
                'step',
                'round',
                'value',
                'vertical',
            ];
        }
        ref = (__runInitializers(this, _instanceExtraInitializers), void 0);
        #dragging = false;
        #shadowSize_accessor_storage = __runInitializers(this, _shadowSize_initializers, 2);
        get shadowSize() { return this.#shadowSize_accessor_storage; }
        set shadowSize(value) { this.#shadowSize_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, 14);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #min_accessor_storage = __runInitializers(this, _min_initializers, 0);
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        #max_accessor_storage = __runInitializers(this, _max_initializers, 100);
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, void 0);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #vertical_accessor_storage = __runInitializers(this, _vertical_initializers, void 0);
        get vertical() { return this.#vertical_accessor_storage; }
        set vertical(value) { this.#vertical_accessor_storage = value; }
        #round_accessor_storage = __runInitializers(this, _round_initializers, 2);
        get round() { return this.#round_accessor_storage; }
        set round(value) { this.#round_accessor_storage = value; }
        constructor() {
            super();
            const { comTemplate, cssTemplate } = template();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(cssTemplate.cloneNode(true));
            shadowRoot.appendChild(comTemplate.content.cloneNode(true));
            const $layout = shadowRoot.getElementById('layout');
            const $track = shadowRoot.getElementById('track');
            const $trackBg = shadowRoot.getElementById('track__bg');
            const $point = shadowRoot.getElementById('point');
            this.ref = {
                $layout,
                $track,
                $point,
                $trackBg,
            };
        }
        get value() {
            const value = numGetter('value')(this) ?? this.min;
            return round(value, this.round);
        }
        set value(value) {
            if (!this.#validate(value) || this.value === value)
                return;
            numSetter('value')(this, round(value, this.round));
        }
        render() {
            const { $layout, $point, $trackBg } = this.ref;
            const layoutSize = this.size + this.shadowSize * 2;
            const layoutPadding = this.shadowSize;
            const trackSize = this.size / 4 >= 2 ? this.size / 4 : 2;
            $layout.style.padding = layoutPadding + 'px';
            $point.style.width = $point.style.height = this.size + 'px';
            if (this.vertical) {
                setStyles($layout, {
                    width: layoutSize + 'px',
                    height: '100%',
                });
                setStyles($trackBg, {
                    width: `${trackSize}px`,
                    height: 'auto',
                    right: '0',
                    top: `${this.size / 2}px`,
                    bottom: `${this.size / 2}px`,
                });
            }
            else {
                setStyles($layout, {
                    height: layoutSize + 'px',
                    width: 'auto',
                });
                setStyles($trackBg, {
                    height: `${trackSize}px`,
                    width: 'auto',
                    top: '0',
                    left: `${this.size / 2}px`,
                    right: `${this.size / 2}px`,
                });
            }
            this.#renderPoint();
            this._renderDisabled();
        }
        _renderDisabled() {
            if (this.disabled) {
                this.setAttribute('aria-disabled', 'true');
            }
            else {
                this.setAttribute('aria-disabled', 'false');
            }
        }
        #renderPoint() {
            const pos = fromRatio(getRatio(this.value, this.min, this.max), this.#posMin(), this.#posMax());
            this.ref.$point.style[this.vertical ? 'top' : 'left'] = `${pos}px`;
        }
        #clearDragEvents;
        connectedCallback() {
            super.connectedCallback();
            this._renderDisabled();
            this.#updateTabindex();
            this.render();
            this.#clearDragEvents = this.#initDragEvents();
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this.#clearDragEvents)
                this.#clearDragEvents();
            this.ref.$layout.onmousedown = null;
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'disabled') {
                this._renderDisabled();
                this.#updateTabindex();
            }
            if (attrName === 'size') {
                this.render();
            }
            if (attrName === 'value') {
                if (!this.#dragging) {
                    this.#renderPoint();
                }
                else {
                    this.#renderPoint();
                }
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            }
        }
        #initDragEvents() {
            this.#dragging = false;
            let positionStart;
            return onDragMove(this.ref.$track, {
                onStart: ({ start, $target, stop }) => {
                    if (this.disabled) {
                        stop();
                        return;
                    }
                    if ($target === this.ref.$track) {
                        const rect = this.ref.$track.getBoundingClientRect();
                        if (this.vertical) {
                            positionStart = this.#trackSize() - (start.clientY - rect.y) - 7;
                        }
                        else {
                            positionStart = start.clientX - rect.x - 7;
                        }
                        this.value = fromRatio(getRatio(positionStart, this.#posMin(), this.#posMax()), this.min, this.max);
                        positionStart = undefined;
                        this.#dragging = false;
                        return stop();
                    }
                    if ($target === this.ref.$point) {
                        this.#dragging = true;
                        positionStart = getPosition(this.ref.$point, this.vertical);
                        return;
                    }
                },
                onMove: ({ offset, preventDefault }) => {
                    preventDefault();
                    const moveOffset = this.vertical ? -offset.y : offset.x;
                    const position = positionStart + moveOffset;
                    this.value = fromRatio(getRatio(position, this.#posMin(), this.#posMax()), this.min, this.max);
                },
                onEnd: ({ offset }) => {
                    const moveOffset = this.vertical ? -offset.y : offset.x;
                    const position = positionStart + moveOffset;
                    this.value = fromRatio(getRatio(position, this.#posMin(), this.#posMax()), this.min, this.max);
                    positionStart = undefined;
                    this.#dragging = false;
                },
            });
        }
        #validate(n) {
            return typeof n === 'number' && n === n && n >= this.min && n <= this.max;
        }
        #trackSize() {
            return parseFloat(getComputedStyle(this.ref.$track).getPropertyValue(this.vertical ? 'height' : 'width'));
        }
        #posMin() {
            return 0;
        }
        #posMax() {
            return this.#trackSize() - this.size;
        }
        #updateTabindex() {
            const $buttons = this.shadowRoot.querySelectorAll('.point');
            if (this.disabled) {
                forEach($buttons, button => {
                    button.removeAttribute('tabindex');
                });
            }
            else {
                forEach($buttons, button => {
                    button.setAttribute('tabindex', '0');
                });
            }
        }
    };
    return BlocksSlider = _classThis;
})();
function getRatio(current, min, max) {
    const span = max - min;
    const offset = current - min;
    return offset / span;
}
function fromRatio(ratio, min, max) {
    return ratio * (max - min) - min;
}
function getPosition($point, vertical) {
    return parseFloat($point.style[vertical ? 'top' : 'left']) || 0;
}
