import '../button/index.js';
import { BlocksButton } from '../button/index.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksButtonGroup extends Component {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        this._ref = {
            $slot: shadowRoot.querySelector('slot'),
        };
        this._ref.$slot.addEventListener('slotchange', this.render.bind(this));
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    render() {
        this._ref.$slot.assignedElements().forEach($item => {
            if ($item instanceof BlocksButton) {
                $item.setAttribute('group-context', '');
            }
        });
    }
}
if (!customElements.get('bl-button-group')) {
    customElements.define('bl-button-group', BlocksButtonGroup);
}
