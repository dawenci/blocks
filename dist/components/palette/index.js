import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksPalette extends Component {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
}
if (!customElements.get('bl-palette')) {
    customElements.define('bl-palette', BlocksPalette);
}
