import '../popup/index.js';
import '../button/index.js';
import { BlocksInput } from '../input/index.js';
import { BlocksDate } from '../date/index.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { dispatchEvent } from '../../common/event.js';
import { boolSetter } from '../../common/property.js';
import { Component, } from '../Component.js';
import { inputTemplate, popupTemplate, styleTemplate } from './template.js';
export class BlocksDatePicker extends Component {
    #prevValue;
    #clearClickOutside;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(styleTemplate());
        const $input = shadowRoot.appendChild(inputTemplate());
        const $popup = popupTemplate();
        const $date = $popup.querySelector('bl-date');
        $popup.anchor = () => $input;
        $input.onfocus = $input.onclick = () => {
            $popup.open = true;
        };
        $date.addEventListener('select', () => {
            switch ($date.mode) {
                case 'single': {
                    this.#prevValue = null;
                    this.render();
                    $popup.open = false;
                    break;
                }
                case 'range': {
                    this.#prevValue = null;
                    this.render();
                    $popup.open = false;
                    break;
                }
                case 'multiple': {
                    this.render();
                    break;
                }
            }
        });
        $date.addEventListener('change', () => {
            if ($date.mode !== 'multiple') {
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            }
        });
        $popup.querySelector('bl-button').onclick = this._confirm.bind(this);
        $popup.addEventListener('open-changed', () => {
            boolSetter('popup-open')(this, $popup.open);
        });
        $popup.addEventListener('opened', () => {
            if ($date.mode !== null) {
                this.#prevValue = $date.value;
            }
            ;
            $popup.querySelector('#action').style.display =
                $date.mode === 'multiple' ? 'block' : 'none';
            this.#initClickOutside();
            dispatchEvent(this, 'opened');
        });
        $popup.addEventListener('closed', () => {
            if ($date.mode !== null && this.#prevValue) {
                $date.value = this.#prevValue;
                this.#prevValue = null;
            }
            this.#destroyClickOutside();
            dispatchEvent(this, 'closed');
        });
        $input.addEventListener('click-clear', () => {
            $date.clearValue();
            this.#prevValue = $date.value;
            this.render();
        });
        this._ref = {
            $popup,
            $date,
            $input,
        };
    }
    _confirm() {
        this.#prevValue = null;
        this.value = this._ref.$date.getValues();
        dispatchEvent(this, 'change', { detail: { value: this.value } });
        this.render();
        this._ref.$popup.open = false;
    }
    render() {
        if (this._ref.$date.mode === 'range') {
            this._ref.$input.value = (this.value ?? [])
                .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
                .join(' ~ ');
        }
        else if (this._ref.$date.mode === 'multiple') {
            this._ref.$input.value = (this.value ?? [])
                .map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`)
                .join(', ');
        }
        else {
            const date = this.value;
            this._ref.$input.value = date
                ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                : '';
        }
    }
    get value() {
        return this._ref.$date.value;
    }
    set value(value) {
        this._ref.$date.value = value;
    }
    get disabledDate() {
        return this._ref.$date.disabledDate;
    }
    set disabledDate(value) {
        this._ref.$date.disabledDate = value;
    }
    getDateProp(prop) {
        return this._ref.$date[prop];
    }
    setDateProp(prop, value) {
        ;
        this._ref.$date[prop] = value;
    }
    getInputProp(prop) {
        return this._ref.$input[prop];
    }
    setInputProp(prop, value) {
        ;
        this._ref.$input[prop] = value;
    }
    connectedCallback() {
        super.connectedCallback();
        document.body.appendChild(this._ref.$popup);
        this.render();
        this._ref.$popup.querySelector('#action').style.display =
            this._ref.$date.mode === 'multiple' ? 'block' : 'none';
        if (this._ref.$input.placeholder == null) {
            this._ref.$input.placeholder = '请选择日期';
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.removeChild(this._ref.$popup);
        this.#destroyClickOutside();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (BlocksInput.observedAttributes.includes(attrName)) {
            this._ref.$input.setAttribute(attrName, newValue);
        }
        if (BlocksDate.observedAttributes.includes(attrName)) {
            this._ref.$date.setAttribute(attrName, newValue);
        }
        this.render();
    }
    #initClickOutside() {
        if (!this.#clearClickOutside) {
            this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
                if (this._ref.$popup.open) {
                    this._ref.$date.clearUncompleteRange();
                    this._ref.$popup.open = false;
                }
            });
        }
    }
    #destroyClickOutside() {
        if (this.#clearClickOutside) {
            this.#clearClickOutside();
            this.#clearClickOutside = undefined;
        }
    }
    static get observedAttributes() {
        return BlocksDate.observedAttributes.concat(BlocksInput.observedAttributes);
    }
}
if (!customElements.get('bl-date-picker')) {
    customElements.define('bl-date-picker', BlocksDatePicker);
}
