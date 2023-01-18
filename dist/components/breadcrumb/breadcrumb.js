import { Component } from '../Component.js';
import { template } from './breadcrumb-template.js';
import { strGetter, strSetter } from '../../common/property.js';
export class BlocksBreadcrumb extends Component {
    #clearup;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        this._ref = {
            $slot: shadowRoot.querySelector('slot'),
        };
    }
    get separator() {
        return strGetter('separator')(this) ?? '/';
    }
    set separator(value) {
        strSetter('separator')(this, value);
    }
    render() {
        this._ref.$slot.assignedElements().forEach($item => {
            if (isItem($item)) {
                $item.renderSeparator(this.separator);
            }
        });
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
        const onSlotChange = () => this.render();
        this._ref.$slot.addEventListener('slotchange', onSlotChange);
        this.#clearup = () => {
            this._ref.$slot.removeEventListener('slotchange', onSlotChange);
        };
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#clearup) {
            this.#clearup();
        }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.render();
    }
    static get observedAttributes() {
        return ['separator'];
    }
}
if (!customElements.get('bl-breadcrumb')) {
    customElements.define('bl-breadcrumb', BlocksBreadcrumb);
}
function isItem(item) {
    return !!item.renderSeparator;
}
