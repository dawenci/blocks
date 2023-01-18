import { BlocksInput } from '../input/index.js';
import { BlocksTime } from '../time/index.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { padLeft } from '../../common/utils.js';
import { boolSetter, intRangeGetter, intRangeSetter, } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksTimePicker extends Component {
    ref;
    #clearup;
    _prevValue = {
        hour: null,
        minute: null,
        second: null,
    };
    static get observedAttributes() {
        return [...BlocksTime.observedAttributes, ...BlocksInput.observedAttributes];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const { inputTemplate, popupTemplate } = template();
        const fragment = inputTemplate.content.cloneNode(true);
        shadowRoot.appendChild(fragment);
        const $input = this.querySelectorShadow('#result');
        const $popup = popupTemplate.content.cloneNode(true).querySelector('bl-popup');
        const $time = $popup.querySelector('bl-time');
        this.ref = {
            $popup,
            $input,
            $time,
        };
        $popup.anchor = () => $input;
        const $confirm = $popup.querySelector('bl-button');
        const onFocus = () => {
            $time.scrollToActive();
            $popup.open = true;
        };
        $input.onfocus = $input.onclick = onFocus;
        const onClear = () => {
            $time.clear();
            this._prevValue = {
                hour: null,
                minute: null,
                second: null,
            };
        };
        $input.addEventListener('click-clear', onClear);
        const onTimeChange = () => this.render();
        $time.addEventListener('change', onTimeChange);
        const onToggleOpen = () => boolSetter('popup-open')(this, $popup.open);
        $popup.addEventListener('open-changed', onToggleOpen);
        const onOpened = () => {
            this._prevValue = {
                hour: $time.hour,
                minute: $time.minute,
                second: $time.second,
            };
            this._initClickOutside();
        };
        $popup.addEventListener('opened', onOpened);
        const onClosed = () => {
            if (this._prevValue) {
                $time.hour = this._prevValue.hour;
                $time.minute = this._prevValue.minute;
                $time.second = this._prevValue.second;
                this._prevValue = null;
            }
            this._destroyClickOutside();
        };
        $popup.addEventListener('closed', onClosed);
        const onConfirm = this._confirm.bind(this);
        $confirm.onclick = onConfirm;
    }
    get hour() {
        return intRangeGetter('hour', 0, 23)(this);
    }
    set hour(value) {
        intRangeSetter('hour', 0, 23)(this, value);
    }
    get minute() {
        return intRangeGetter('minute', 0, 59)(this);
    }
    set minute(value) {
        intRangeSetter('minute', 0, 59)(this, value);
    }
    get second() {
        return intRangeGetter('second', 0, 59)(this);
    }
    set second(value) {
        intRangeSetter('second', 0, 59)(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        document.body.appendChild(this.ref.$popup);
        this.render();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.removeChild(this.ref.$popup);
        this._destroyClickOutside();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (BlocksInput.observedAttributes.includes(attrName)) {
            this.ref.$input.setAttribute(attrName, newValue);
        }
        if (BlocksTime.observedAttributes.includes(attrName)) {
            this.ref.$time.setAttribute(attrName, newValue);
        }
        this.render();
    }
    render() {
        const { $input, $time } = this.ref;
        if ([$time.hour, $time.minute, $time.second].some(v => Object.is(v, NaN) || v == null)) {
            $input.value = '';
            return;
        }
        const hour = padLeft('0', 2, String($time.hour));
        const minute = padLeft('0', 2, String($time.minute));
        const second = padLeft('0', 2, String($time.second));
        $input.value = `${hour}:${minute}:${second}`;
    }
    _confirm() {
        const { $popup, $time } = this.ref;
        this._prevValue = null;
        dispatchEvent(this, 'change', {
            detail: {
                hour: $time.hour,
                minute: $time.minute,
                second: $time.second,
            },
        });
        $popup.open = false;
    }
    _initClickOutside() {
        if (!this.#clearup) {
            this.#clearup = onClickOutside([this, this.ref.$popup], () => {
                if (this.ref.$popup.open)
                    this.ref.$popup.open = false;
            });
        }
    }
    _destroyClickOutside() {
        if (this.#clearup) {
            this.#clearup();
            this.#clearup = undefined;
        }
    }
}
if (!customElements.get('bl-time-picker')) {
    customElements.define('bl-time-picker', BlocksTimePicker);
}
