import { dispatchEvent } from '../../common/event.js';
import { checkedGetter, checkedSetter, sizeGetter, sizeSetter, } from '../../common/propertyAccessor.js';
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
import { switchStyleTemplate } from './template.js';
import { Control } from '../base-control/index.js';
export class BlocksSwitch extends Control {
    static get role() {
        return 'switch';
    }
    constructor() {
        super();
        this._appendStyle(switchStyleTemplate());
        captureEventWhenEnable(this, 'click', () => {
            this.checked = !this.checked;
        });
        captureEventWhenEnable(this, 'keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.checked = !this.checked;
            }
        });
    }
    get checked() {
        return checkedGetter(this);
    }
    set checked(value) {
        checkedSetter(this, value);
    }
    get size() {
        return sizeGetter(this);
    }
    set size(value) {
        sizeSetter(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'checked') {
            dispatchEvent(this, 'change', { detail: { value: this.checked } });
        }
    }
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
    }
    static get observedAttributes() {
        return ['checked', 'disabled', 'size'];
    }
}
if (!customElements.get('bl-switch')) {
    customElements.define('bl-switch', BlocksSwitch);
}
