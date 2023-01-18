import { boolGetter, boolSetter, enumGetter, enumSetter, numGetter, numSetter, } from '../../common/property.js';
import { Component } from '../Component.js';
import { template } from './template.js';
const valueGetter = numGetter('value');
const valueSetter = numSetter('value');
const percentageGetter = boolGetter('percentage');
const percentageSetter = boolSetter('percentage');
const status = ['success', 'error', 'warning'];
const statusGetter = enumGetter('status', status);
const statusSetter = enumSetter('status', status);
export class BlocksProgress extends Component {
    ref;
    static get observedAttributes() {
        return ['value', 'status', 'percentage'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        const $progress = shadowRoot.querySelector('#progress');
        const $value = shadowRoot.querySelector('#value');
        this.ref = {
            $progress,
            $value,
        };
    }
    get value() {
        return valueGetter(this);
    }
    set value(value) {
        valueSetter(this, value);
    }
    get status() {
        return statusGetter(this);
    }
    set status(value) {
        statusSetter(this, value);
    }
    get percentage() {
        return percentageGetter(this);
    }
    set percentage(value) {
        percentageSetter(this, value);
    }
    render() {
        this.ref.$progress.style.width = `${this.value}%`;
        if (this.percentage) {
            this.ref.$value.style.display = 'block';
            this.ref.$value.textContent = `${this.value}%`;
        }
        else {
            this.ref.$value.style.display = 'none';
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
    }
}
if (!customElements.get('bl-progress')) {
    customElements.define('bl-progress', BlocksProgress);
}
