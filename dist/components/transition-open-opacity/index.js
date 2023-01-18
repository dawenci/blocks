import { dispatchEvent } from '../../common/event.js';
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js';
import { openGetter, openSetter } from '../../common/propertyAccessor.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksTransitionOpenOpacity extends Component {
    onOpen;
    onClose;
    static get observedAttributes() {
        return ['open'];
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const shadowRoot = this.shadowRoot;
        shadowRoot.appendChild(template().content.cloneNode(true));
    }
    get open() {
        return openGetter(this);
    }
    set open(value) {
        openSetter(this, value);
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName == 'open') {
            if (this.open) {
                doTransitionEnter(this, 'opacity', () => {
                    if (this.onOpen)
                        this.onOpen();
                    dispatchEvent(this, 'opened');
                });
            }
            else {
                doTransitionLeave(this, 'opacity', () => {
                    if (this.onClose)
                        this.onClose();
                    dispatchEvent(this, 'closed');
                });
            }
            dispatchEvent(this, 'open-changed');
        }
    }
}
