import { Component } from '../Component.js';
import { enumGetter, enumSetter } from '../../common/property.js';
import { template } from './template.js';
export class BlocksCard extends Component {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        this._ref = {
            $header: shadowRoot.getElementById('header'),
            $body: shadowRoot.getElementById('body'),
        };
        const updateSlotParent = ($slot) => {
            const childCount = $slot
                .assignedNodes()
                .filter($node => $node.nodeType === 1 || $node.nodeType === 3).length;
            $slot.parentElement?.classList?.toggle?.('empty', !childCount);
        };
        const onSlotChange = (e) => {
            updateSlotParent(e.target);
        };
        Array.prototype.forEach.call(shadowRoot.querySelectorAll('slot'), $slot => {
            $slot.addEventListener('slotchange', onSlotChange);
            updateSlotParent($slot);
        });
    }
    get shadow() {
        return enumGetter('shadow', ['hover', 'always'])(this);
    }
    set shadow(value) {
        enumSetter('shadow', ['hover', 'always'])(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    static get observedAttributes() {
        return ['shadow', 'size'];
    }
}
if (!customElements.get('bl-card')) {
    customElements.define('bl-card', BlocksCard);
}
