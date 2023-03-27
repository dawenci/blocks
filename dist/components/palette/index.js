import { template } from './template.js';
import { Component } from '../component/Component.js';
export class BlocksPalette extends Component {
    constructor() {
        super();
        const shadowRoot = this.shadowRoot;
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
