import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js';
import { styleTemplate } from './template.js';
import { Component } from '../Component.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
import { applyMixins } from '../../common/applyMixins.js';
import { withOpenTransitionStyleTemplate } from '../with-open-transition/template.js';
export class BlocksModalMask extends Component {
    static get observedAttributes() {
        return super.observedAttributes.concat(['open', 'z-index']);
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(withOpenTransitionStyleTemplate());
        shadowRoot.appendChild(styleTemplate());
    }
    connectedCallback() {
        super.connectedCallback();
        this.openTransitionName = 'opacity';
        this.render();
        if (this.open) {
            this._updateVisible();
        }
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName == 'open') {
            this._onOpenAttributeChange();
            this._updateVisible();
        }
    }
    _updateVisible() {
        if (this.open) {
            this._lockScroll();
        }
        else {
            this._unlockScroll();
        }
    }
    isScrollLocked;
    bodyPaddingRight;
    bodyOverflowY;
    computedBodyPaddingRight;
    _lockScroll() {
        if (!this.isScrollLocked) {
            this.bodyPaddingRight = document.body.style.paddingRight;
            this.bodyOverflowY = document.body.style.overflowY;
            this.computedBodyPaddingRight = parseInt(getComputedStyle(document.body).paddingRight, 10);
        }
        const scrollBarWidth = getBodyScrollBarWidth();
        const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
        const bodyOverflowY = getComputedStyle(document.body).overflowY;
        if (scrollBarWidth > 0 &&
            (bodyHasOverflow || bodyOverflowY === 'scroll') &&
            !this.isScrollLocked) {
            document.body.style.paddingRight =
                this.computedBodyPaddingRight + scrollBarWidth + 'px';
        }
        document.body.style.overflowY = 'hidden';
        this.isScrollLocked = true;
    }
    _unlockScroll() {
        if (this.isScrollLocked) {
            document.body.style.paddingRight = this.bodyPaddingRight;
            document.body.style.overflowY = this.bodyOverflowY;
            this.isScrollLocked = false;
        }
    }
}
applyMixins(BlocksModalMask, [WithOpenTransition]);
if (!customElements.get('bl-modal-mask')) {
    customElements.define('bl-modal-mask', BlocksModalMask);
}
