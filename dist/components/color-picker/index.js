import { onClickOutside } from '../../common/onClickOutside.js';
import { dispatchEvent } from '../../common/event.js';
import { uniqId } from '../../common/uniqId.js';
import { disabledGetter, disabledSetter, } from '../../common/propertyAccessor.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { intGetter, intSetter } from '../../common/property.js';
export class BlocksColorPicker extends Component {
    #clearClickOutside;
    static get observedAttributes() {
        return ['value', 'disabled', 'size'];
    }
    constructor() {
        super();
        this.id = `color-picker-${uniqId()}`;
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const { inputTemplate, popupTemplate } = template();
        const fragment = inputTemplate.content.cloneNode(true);
        shadowRoot.appendChild(fragment);
        const $result = shadowRoot.querySelector('#result');
        const $icon = $result.querySelector('bl-icon');
        const $popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup');
        const $color = $popup.querySelector('bl-color');
        this._ref = {
            $result,
            $icon,
            $popup,
            $color,
        };
        $popup.anchor = () => $result;
        $result.onfocus = $result.onclick = () => {
            if (this.disabled)
                return;
            $popup.open = true;
            $color.render();
        };
        $color.addEventListener('bl:color:change', () => {
            this.value = $color.value;
            this.render();
            const payload = { detail: $color.value };
            dispatchEvent(this, 'bl:color-picker:change', payload);
            dispatchEvent(this, 'change', payload);
        });
        $popup.addEventListener('opened', () => {
            this.#initClickOutside();
        });
        $popup.addEventListener('closed', () => {
            this.#destroyClickOutside();
        });
    }
    get disabled() {
        return disabledGetter(this);
    }
    set disabled(value) {
        disabledSetter(this, value);
    }
    get hex() {
        return this._ref.$color.hex;
    }
    set hex(value) {
        this._ref.$color.hex = value;
    }
    get hsl() {
        return this._ref.$color.hsl;
    }
    set hsl(value) {
        this._ref.$color.hsl = value;
    }
    get hsla() {
        return this._ref.$color.hsla;
    }
    set hsla(value) {
        this._ref.$color.hsla = value;
    }
    get hsv() {
        return this._ref.$color.hsv;
    }
    set hsv(value) {
        this._ref.$color.hsv = value;
    }
    get hsva() {
        return this._ref.$color.hsva;
    }
    set hsva(value) {
        this._ref.$color.hsva = value;
    }
    get rgb() {
        return this._ref.$color.rgb;
    }
    set rgb(value) {
        this._ref.$color.rgb = value;
    }
    get rgba() {
        return this._ref.$color.rgba;
    }
    set rgba(value) {
        this._ref.$color.rgba = value;
    }
    get value() {
        return intGetter('value')(this);
    }
    set value(value) {
        intSetter('value')(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        super.connectedCallback();
        document.body.appendChild(this._ref.$popup);
        this.render();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.removeChild(this._ref.$popup);
        this.#destroyClickOutside();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (['clearable'].includes(attrName)) {
            this._ref.$result.setAttribute(attrName, newValue);
        }
        if (attrName === 'value') {
            if (oldValue !== newValue) {
                this._ref.$color.setAttribute('value', newValue);
            }
        }
        this.render();
    }
    render() {
        const hsla = this._ref.$color.hsla;
        if (hsla) {
            this._ref.$result.style.backgroundColor = `hsla(${hsla[0]},${hsla[1] * 100}%,${hsla[2] * 100}%,${hsla[3]})`;
            let lightness = hsla[2] * 100;
            if (hsla[0] > 50 && hsla[0] < 195) {
                lightness = lightness > 40 ? 0 : 100;
            }
            else {
                lightness = lightness > 50 ? 10 : 90;
            }
            ;
            this._ref.$icon.fill = `hsla(${hsla[0]},${50}%,${lightness}%,1)`;
        }
    }
    format(fmt) {
        return this._ref.$color.format(fmt);
    }
    #initClickOutside() {
        if (!this.#clearClickOutside) {
            this.#clearClickOutside = onClickOutside([this, this._ref.$color], () => {
                if (this._ref.$popup.open)
                    this._ref.$popup.open = false;
            });
        }
    }
    #destroyClickOutside() {
        if (this.#clearClickOutside) {
            this.#clearClickOutside();
            this.#clearClickOutside = undefined;
        }
    }
}
if (!customElements.get('bl-color-picker')) {
    customElements.define('bl-color-picker', BlocksColorPicker);
}
