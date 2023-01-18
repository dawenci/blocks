import { strGetter, strSetter } from '../../common/property.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksBadge extends Component {
    ref;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        this.ref = {
            $slot: shadowRoot.querySelector('slot'),
            $badge: shadowRoot.getElementById('badge'),
        };
    }
    get value() {
        return strGetter('value')(this) ?? '';
    }
    set value(value) {
        strSetter('value')(this, value);
    }
    render() {
        this.ref.$badge.textContent = this.value;
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
    }
    static get observedAttributes() {
        return ['value'];
    }
}
if (!customElements.get('bl-badge')) {
    customElements.define('bl-badge', BlocksBadge);
}
