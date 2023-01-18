import '../scrollable/index.js';
import { dispatchEvent } from '../../common/event.js';
import { intRangeGetter, intRangeSetter } from '../../common/property.js';
import { scrollTo } from '../../common/scrollTo.js';
import { find, forEach, range } from '../../common/utils.js';
import { Component, } from '../Component.js';
import { template } from './template.js';
const mutableAttrs = ['hour', 'minute', 'second', 'size'];
export class BlocksTime extends Component {
    ref;
    #scrollFlag;
    #batchChange;
    static get observedAttributes() {
        return mutableAttrs;
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template().content.cloneNode(true));
        const $layout = shadowRoot.getElementById('layout');
        const $hours = shadowRoot.getElementById('hours');
        const $minutes = shadowRoot.getElementById('minutes');
        const $seconds = shadowRoot.getElementById('seconds');
        this.ref = {
            $layout,
            $hours,
            $minutes,
            $seconds,
        };
        const handler = (prop) => {
            return (e) => {
                const target = e.target;
                if (target.classList.contains('item')) {
                    if (target.classList.contains('disabled'))
                        return;
                    const value = +target.textContent;
                    if (value === this[prop]) {
                        this.scrollToActive();
                    }
                    this[prop] = value;
                }
            };
        };
        $hours.onclick = handler('hour');
        $minutes.onclick = handler('minute');
        $seconds.onclick = handler('second');
    }
    #disabledHour;
    get disabledHour() {
        return this.#disabledHour;
    }
    set disabledHour(value) {
        this.#disabledHour = value;
        this.#renderDisabled();
    }
    #disabledMinute;
    get disabledMinute() {
        return this.#disabledMinute;
    }
    set disabledMinute(value) {
        this.#disabledMinute = value;
        this.#renderDisabled();
    }
    #disabledSecond;
    get disabledSecond() {
        return this.#disabledSecond;
    }
    set disabledSecond(value) {
        this.#disabledSecond = value;
        this.#renderDisabled();
    }
    get hour() {
        return intRangeGetter('hour', 0, 23)(this);
    }
    set hour(value) {
        intRangeSetter('hour', 0, 23)(this, value);
    }
    get minute() {
        return intRangeGetter('minute', 0, 59)(this);
    }
    set minute(value) {
        intRangeSetter('minute', 0, 59)(this, value);
    }
    get second() {
        return intRangeGetter('second', 0, 59)(this);
    }
    set second(value) {
        intRangeSetter('second', 0, 59)(this, value);
    }
    get value() {
        if (this.hour == null || this.minute == null || this.second == null) {
            return null;
        }
        return [this.hour, this.minute, this.second];
    }
    set value(value) {
        if (value == null) {
            this.hour = this.minute = this.second = null;
            return;
        }
        this.hour = value[0];
        this.minute = value[1];
        this.second = value[2];
    }
    connectedCallback() {
        super.connectedCallback();
        this.render();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        this.upgradeProperty(['disabledHour', 'disabledMinute', 'disabledSecond']);
        if (['hour', 'minute', 'second'].includes(attrName)) {
            if (newValue === null) {
                forEach(this.ref.$layout.querySelectorAll('.active'), active => {
                    active.classList.remove('active');
                });
                if (attrName !== 'hour' && this.hour !== null)
                    this.hour = null;
                if (attrName !== 'minute' && this.minute !== null)
                    this.minute = null;
                if (attrName !== 'second' && this.second !== null)
                    this.second = null;
                this.render();
            }
            else {
                const $list = this.ref[`$${attrName}s`];
                const $old = $list.querySelector('.active');
                if ($old) {
                    $old.classList.remove('active');
                }
                const $new = find($list.children, $li => +$li.textContent === +newValue);
                if ($new) {
                    $new.classList.add('active');
                }
                if (attrName !== 'hour' && !this.hour && this.hour !== 0)
                    this.hour = 0;
                if (attrName !== 'minute' && !this.minute && this.minute !== 0)
                    this.minute = 0;
                if (attrName !== 'second' && !this.second && this.second !== 0)
                    this.second = 0;
                this.render();
            }
            this.scrollToActive();
            this.triggerChange();
        }
    }
    #renderDisabled() {
        const { $hours, $minutes, $seconds } = this.ref;
        const ctx = {
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            component: this,
        };
        if (typeof this.disabledHour === 'function') {
            $hours.querySelectorAll('.item').forEach(($item, index) => {
                $item.classList.toggle('disabled', this.disabledHour(index, ctx));
            });
        }
        if (typeof this.disabledMinute === 'function') {
            $minutes.querySelectorAll('.item').forEach(($item, index) => {
                $item.classList.toggle('disabled', this.disabledMinute(index, ctx));
            });
        }
        if (typeof this.disabledSecond === 'function') {
            $seconds.querySelectorAll('.item').forEach(($item, index) => {
                $item.classList.toggle('disabled', this.disabledSecond(index, ctx));
            });
        }
    }
    render() {
        const { $hours, $minutes, $seconds } = this.ref;
        if (!$hours.children.length) {
            range(0, 23).forEach(n => {
                const $item = $hours.appendChild(document.createElement('div'));
                $item.className = 'item';
                $item.textContent = n < 10 ? '0' + n : String(n);
            });
            const $bot = $hours.appendChild(document.createElement('div'));
            $bot.className = 'bot';
        }
        if (!$minutes.children.length) {
            range(0, 59).forEach(n => {
                const $item = $minutes.appendChild(document.createElement('div'));
                $item.className = 'item';
                $item.textContent = n < 10 ? '0' + n : String(n);
            });
            const $bot = $minutes.appendChild(document.createElement('div'));
            $bot.className = 'bot';
        }
        if (!$seconds.children.length) {
            range(0, 59).forEach(n => {
                const $item = $seconds.appendChild(document.createElement('div'));
                $item.className = 'item';
                $item.textContent = n < 10 ? '0' + n : String(n);
            });
            const $bot = $seconds.appendChild(document.createElement('div'));
            $bot.className = 'bot';
        }
        this.#renderDisabled();
    }
    clear() {
        this.hour = this.minute = this.second = null;
        this.render();
    }
    _scrollToActive() {
        const { $layout, $hours, $minutes, $seconds } = this.ref;
        if (this.hour == null && this.minute == null && this.second == null) {
            forEach([$hours, $minutes, $seconds], $panel => {
                scrollTo($panel, 0, { property: 'viewportScrollTop', duration: 0.16 });
            });
        }
        else {
            forEach($layout.querySelectorAll('.active'), $active => {
                scrollTo($active.parentElement, $active.offsetTop, {
                    property: 'viewportScrollTop',
                    duration: 0.16,
                });
            });
        }
    }
    scrollToActive() {
        if (!this.#scrollFlag) {
            this.#scrollFlag = Promise.resolve().then(() => {
                this._scrollToActive();
                this.#scrollFlag = undefined;
            });
        }
    }
    triggerChange() {
        if (!this.#batchChange) {
            this.#batchChange = Promise.resolve().then(() => {
                const detail = {
                    hour: this.hour,
                    minute: this.minute,
                    second: this.second,
                };
                dispatchEvent(this, 'change', { detail });
                this.#batchChange = undefined;
            });
        }
    }
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        super.removeEventListener(type, listener, options);
    }
}
if (!customElements.get('bl-time')) {
    customElements.define('bl-time', BlocksTime);
}
