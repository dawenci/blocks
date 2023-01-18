import { padLeft } from '../../common/utils.js';
import { numGetter, numSetter, strGetter, strSetter, } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { parseDateFormat } from './parseDateFormat.js';
import { Component, } from '../Component.js';
import { template } from './template.js';
export class BlocksCountdown extends Component {
    static get observedAttributes() {
        return ['format', 'value'];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        this._ref = {
            $layout: shadowRoot.querySelector('#layout'),
        };
    }
    get value() {
        return numGetter('value')(this) ?? Date.now();
    }
    set value(value) {
        numSetter('value')(this, value);
    }
    get format() {
        return strGetter('format')(this) ?? 'H:mm:ss';
    }
    set format(value) {
        strSetter('format')(this, value);
    }
    #getOffsetByFormat() {
        const { format } = this;
        return format.includes('SSS')
            ? 0
            : format.includes('s')
                ? 999
                : format.includes('m')
                    ? 59999
                    : format.includes('H')
                        ? 3599999
                        : format.includes('D')
                            ? 86399999
                            : 0;
    }
    render() {
        const { format, value: deadline } = this;
        let day = 0;
        let hour = 0;
        let minute = 0;
        let second = 0;
        let millisecond = deadline - Date.now() + this.#getOffsetByFormat();
        if (millisecond >= 0) {
            if (format.includes('D')) {
                day = Math.floor(millisecond / 86400000);
                millisecond %= 86400000;
            }
            if (format.includes('H')) {
                hour = Math.floor(millisecond / 3600000);
                millisecond %= 3600000;
            }
            if (format.includes('m')) {
                minute = Math.floor(millisecond / 60000);
                millisecond %= 60000;
            }
            if (format.includes('s')) {
                second = Math.floor(millisecond / 1000);
                millisecond %= 1000;
            }
        }
        else {
            millisecond = 0;
        }
        patchDom(this._ref.$layout, parseDateFormat(this.format), {
            day,
            hour,
            minute,
            second,
            millisecond,
        });
    }
    #running = false;
    #rAFId;
    #timerId;
    run() {
        if (this.value - Date.now() <= 0) {
            return;
        }
        const tick = () => {
            if (this.value - Date.now() <= 0) {
                this.render();
                requestAnimationFrame(() => {
                    dispatchEvent(this, 'finish');
                });
                this.stop();
            }
            else {
                this.#rAFId = requestAnimationFrame(() => {
                    this.render();
                    tick();
                });
            }
        };
        if (!this.#running) {
            dispatchEvent(this, 'start');
            this.#running = true;
            tick();
            this.#timerId = setTimeout(tick, this.value - Date.now());
        }
    }
    stop() {
        this.#running = false;
        if (this.#rAFId) {
            this.render();
            requestAnimationFrame(() => {
                dispatchEvent(this, 'stop');
            });
            cancelAnimationFrame(this.#rAFId);
            this.#rAFId = undefined;
            clearTimeout(this.#timerId);
            this.#timerId = undefined;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.run();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.stop();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (attrName === 'value') {
            this.run();
        }
        else {
            this.render();
        }
    }
}
if (!customElements.get('bl-countdown')) {
    customElements.define('bl-countdown', BlocksCountdown);
}
function patchDom(dom, tokens, vars) {
    if (dom.textContent === tokens.map(token => token.payload).join(''))
        return;
    const children = dom.children;
    if (children.length > tokens.length) {
        let len = children.length - tokens.length;
        while (len--) {
            dom.removeChild(dom.lastElementChild);
        }
    }
    tokens.forEach((token, index) => {
        const { type, payload } = token;
        let text;
        switch (type) {
            case 'day':
            case 'hour':
            case 'minute':
            case 'second': {
                const value = String(vars[type]) ?? '';
                text = payload.length === 2 ? padLeft('0', 2, value) : value;
                break;
            }
            case 'millisecond': {
                const value = String(vars[type]) ?? '';
                text = padLeft('0', 3, value);
                break;
            }
            default:
                text = payload;
                break;
        }
        const el = children[index] ?? dom.appendChild(document.createElement('span'));
        el.setAttribute('part', type);
        el.textContent = text;
    });
}
