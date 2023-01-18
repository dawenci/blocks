import { boolGetter, boolSetter, intGetter, intRangeGetter, intRangeSetter, intSetter, numGetter, numSetter, } from '../../common/property.js';
import { forEach, round } from '../../common/utils.js';
import { dispatchEvent } from '../../common/event.js';
import { disabledGetter, disabledSetter, } from '../../common/propertyAccessor.js';
import { onDragMove } from '../../common/onDragMove.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { setStyles } from '../../common/style.js';
export class BlocksSlider extends Component {
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
    ref;
    #dragging = false;
    constructor() {
        super();
        const { comTemplate, cssTemplate } = template();
        const shadowRoot = this.attachShadow({ mode: 'open' });
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
    get shadowSize() {
        return intRangeGetter('shadow-size', 1, 10)(this) ?? 2;
    }
    set shadowSize(value) {
        intRangeSetter('shadow-size', 1, 10)(this, value);
    }
    get size() {
        return intRangeGetter('size', 14, 100)(this) ?? 14;
    }
    set size(value) {
        intRangeSetter('size', 14, 100)(this, value);
    }
    get min() {
        return numGetter('min')(this) ?? 0;
    }
    set min(value) {
        numSetter('min')(this, value);
    }
    get max() {
        return numGetter('max')(this) ?? 100;
    }
    set max(value) {
        numSetter('max')(this, value);
    }
    get disabled() {
        return disabledGetter(this);
    }
    set disabled(value) {
        disabledSetter(this, value);
    }
    get vertical() {
        return boolGetter('vertical')(this);
    }
    set vertical(value) {
        boolSetter('vertical')(this, value);
    }
    get round() {
        return intGetter('round')(this) ?? 2;
    }
    set round(value) {
        intSetter('round')(this, value);
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
}
if (!customElements.get('bl-slider')) {
    customElements.define('bl-slider', BlocksSlider);
}
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
