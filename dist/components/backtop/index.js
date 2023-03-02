import { numGetter, numSetter } from '../../common/property.js';
import { scrollTo } from '../../common/scrollTo.js';
import { Component } from '../Component.js';
import { template } from './template.js';
const durationGetter = numGetter('duration');
const durationSetter = numSetter('duration');
const visibilityHeightGetter = numGetter('visibility-height');
const visibilityHeightSetter = numSetter('visibility-height');
export class BlocksBackTop extends Component {
    #clearup;
    #target;
    static get observedAttributes() {
        return ['duration', 'target', 'visibility-height'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        const $layout = shadowRoot.querySelector('#layout');
        this._ref = { $layout };
        this.addEventListener('click', () => {
            scrollTo(this.targetElement, 0, {
                duration: this.duration ?? undefined,
                done: () => this.render(),
            });
        });
    }
    get duration() {
        return durationGetter(this);
    }
    set duration(value) {
        durationSetter(this, value);
    }
    get target() {
        if (this.#target) {
            return this.#target() ?? null;
        }
        return this.getAttribute('target');
    }
    set target(value) {
        if (typeof value === 'string' || value === null) {
            this.setAttribute('target', value);
            this.#target = undefined;
            return;
        }
        if (typeof value === 'function') {
            this.#target = value;
        }
        else if (value instanceof Node) {
            this.#target = () => value;
        }
        this.removeAttribute('target');
    }
    get targetElement() {
        const target = this.target;
        if (target === null) {
            return window;
        }
        if (target instanceof Element) {
            return target;
        }
        if (typeof target === 'string') {
            try {
                return document.querySelector(target) ?? window;
            }
            catch (error) {
                return window;
            }
        }
        return window;
    }
    get visibilityHeight() {
        return visibilityHeightGetter(this) || 400;
    }
    set visibilityHeight(value) {
        visibilityHeightSetter(this, value);
    }
    render() {
        const scrollTop = this.targetElement.scrollTop;
        if (scrollTop >= this.visibilityHeight) {
            this.style.display = '';
        }
        else {
            this.style.display = 'none';
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
        const onTargetScroll = (e) => {
            if (e.target === this.targetElement) {
                this.render();
            }
        };
        const scrollEventOptions = {
            capture: true,
            passive: true,
        };
        document.addEventListener('scroll', onTargetScroll, scrollEventOptions);
        this.#clearup = () => {
            document.removeEventListener('scroll', onTargetScroll, scrollEventOptions);
        };
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.#clearup) {
            this.#clearup();
        }
    }
}
if (!customElements.get('bl-backtop')) {
    customElements.define('bl-backtop', BlocksBackTop);
}
