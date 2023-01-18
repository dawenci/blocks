import { intRangeGetter, intRangeSetter } from '../../common/property.js';
import { Component } from '../Component.js';
import { template } from './column-template.js';
export class BlocksColumn extends Component {
    ref;
    static get observedAttributes() {
        return [
            'offset',
            'pull',
            'push',
            'span',
        ];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        this.ref = { $slot: shadowRoot.querySelector('slot') };
    }
    get pull() {
        return intRangeGetter('pull', 1, 23)(this);
    }
    set pull(value) {
        intRangeSetter('pull', 1, 23)(this, value);
    }
    get push() {
        return intRangeGetter('push', 1, 23)(this);
    }
    set push(value) {
        intRangeSetter('push', 1, 23)(this, value);
    }
    get span() {
        return intRangeGetter('span', 1, 24)(this);
    }
    set span(value) {
        intRangeSetter('span', 1, 24)(this, value);
    }
    get offset() {
        return intRangeGetter('offset', 1, 23)(this);
    }
    set offset(value) {
        intRangeSetter('offset', 1, 23)(this, value);
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
}
if (!customElements.get('bl-col')) {
    customElements.define('bl-col', BlocksColumn);
}
