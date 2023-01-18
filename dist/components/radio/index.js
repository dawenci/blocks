import { strGetter, strSetter } from '../../common/property.js';
import { checkedGetter, checkedSetter } from '../../common/propertyAccessor.js';
import { captureEventWhenEnable } from '../../common/captureEventWhenEnable.js';
import { labelTemplate, radioTemplate, styleTemplate } from './template.js';
import { dispatchEvent } from '../../common/event.js';
import { Control } from '../base-control/index.js';
class BlocksRadio extends Control {
    static get role() {
        return 'radio';
    }
    static get observedAttributes() {
        return super.observedAttributes.concat(['name', 'checked']);
    }
    constructor() {
        super();
        this._appendStyle(styleTemplate());
        const $radio = this._ref.$layout.appendChild(radioTemplate());
        const $label = this._ref.$layout.appendChild(labelTemplate());
        const $slot = $label.querySelector('slot');
        Object.assign(this, { $radio, $label, $slot });
        const toggleEmptyClass = () => {
            $label.classList.toggle('empty', !$slot.assignedNodes().length);
        };
        toggleEmptyClass();
        $slot.addEventListener('slotchange', toggleEmptyClass);
        const check = () => {
            if (!this.checked && this.name) {
                document.getElementsByName(this.name).forEach(el => {
                    if (el !== this && el instanceof BlocksRadio) {
                        el.checked = false;
                    }
                });
                this.checked = true;
            }
        };
        captureEventWhenEnable(this, 'click', check);
        captureEventWhenEnable(this, 'keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                check();
                e.preventDefault();
            }
        });
    }
    get name() {
        return strGetter('name')(this);
    }
    set name(value) {
        strSetter('name')(this, value);
    }
    get checked() {
        return checkedGetter(this);
    }
    set checked(value) {
        checkedSetter(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        this.internalTabIndex = '0';
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'checked') {
            dispatchEvent(this, 'change', { detail: { checked: this.checked } });
        }
    }
    addEventListener(type, listener, options) {
        return super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        return super.removeEventListener(type, listener, options);
    }
}
if (!customElements.get('bl-radio')) {
    customElements.define('bl-radio', BlocksRadio);
}
export { BlocksRadio };
