import { BlocksInput } from '../input/index.js';
import { PopupOrigin } from '../popup/index.js';
import { BlocksDate } from '../date/index.js';
import { BlocksTime } from '../time/index.js';
import { onClickOutside } from '../../common/onClickOutside.js';
import { dispatchEvent } from '../../common/event.js';
import { padLeft } from '../../common/utils.js';
import { boolGetter, boolSetter, strGetter, strSetter, } from '../../common/property.js';
import { contentTemplate, popupTemplate, styleTemplate } from './template.js';
import { makeDate, makeDateFrom } from '../../common/date.js';
import { ClearableControlBox } from '../base-clearable-control-box/index.js';
export class BlocksDateTimePicker extends ClearableControlBox {
    #valueFrom = null;
    #valueTo = null;
    #prevValueFrom = null;
    #prevValueTo = null;
    #activeInput = null;
    #clearClickOutside;
    constructor() {
        super();
        this._appendStyle(styleTemplate());
        this._appendContent(contentTemplate());
        const $content = this.querySelectorShadow('#content');
        const $fromDate = this.querySelectorShadow('#from-date');
        const $toDate = this.querySelectorShadow('#to-date');
        const $popup = popupTemplate();
        const $date = $popup.querySelector('bl-date');
        const $time = $popup.querySelector('bl-time');
        const $timeValue = $popup.querySelector('#time-value');
        this._ref.$content = $content;
        this._ref.$fromDate = $fromDate;
        this._ref.$toDate = $toDate;
        this._ref.$popup = $popup;
        this._ref.$date = $date;
        this._ref.$time = $time;
        this._ref.$timeValue = $timeValue;
        this._ref.$confirm = $popup.querySelector('bl-button');
        $popup.anchor = () => this;
        const inputs = [$fromDate, $toDate];
        const onfocus = (e) => {
            if (this.disabled)
                return;
            const $target = e.target;
            const $input = inputs.find($input => $input.contains($target)) ?? null;
            if (!$popup.open) {
                $popup.open = true;
            }
            this.#switchActiveInput($input);
        };
        inputs.forEach($input => {
            $input.addEventListener('focus', onfocus);
        });
        const stage = (newValue) => {
            this.activeValue = newValue;
        };
        const discard = () => {
            this.#switchActiveInput(null);
            this.#valueFrom = this.#prevValueFrom;
            this.#valueTo = this.#prevValueTo;
            this.#prevValueFrom = this.#prevValueTo = null;
            this.#renderResult();
            $date.value = null;
        };
        const commit = () => {
            if (this.range) {
                if (this.#isFromActive()) {
                    if (!this.#valueFrom) {
                        this.#valueTo = null;
                    }
                    else if (!this.#valueTo) {
                        this.#switchActiveInput($toDate);
                        return;
                    }
                }
                if (this.#isToActive()) {
                    if (!this.#valueTo) {
                        this.#valueFrom = null;
                    }
                    else if (!this.#valueFrom) {
                        this.#switchActiveInput($fromDate);
                        return;
                    }
                }
                this.#prevValueFrom = this.#prevValueTo = null;
                dispatchEvent(this, 'change', {
                    detail: {
                        value: this.#valueFrom && this.#valueTo
                            ? [this.#valueFrom, this.#valueTo]
                            : null,
                    },
                });
                this._ref.$popup.open = false;
            }
            else {
                dispatchEvent(this, 'change', {
                    detail: { value: this.#valueTo },
                });
                this._ref.$popup.open = false;
            }
        };
        $date.addEventListener('change', e => {
            const date = e.detail.value;
            if (date) {
                const newValue = copyDate(this.activeValue ?? today());
                newValue.setFullYear(date.getFullYear());
                newValue.setMonth(date.getMonth());
                newValue.setDate(date.getDate());
                stage(newValue);
                this.#renderResult();
                if (!$time.value) {
                    this.#updateTimePanel(newValue);
                }
            }
            else {
                stage(null);
                this.#renderResult();
                if ($time.value) {
                    this.#updateTimePanel(null);
                }
            }
        });
        $time.addEventListener('change', e => {
            const { hour, minute, second } = e.detail;
            if (hour !== null && minute !== null && second !== null) {
                let newValue;
                if (this.activeValue) {
                    newValue = copyDate(this.activeValue);
                }
                else {
                    newValue = this.range
                        ? copyDate(this.#valueFrom ?? this.#valueTo ?? today())
                        : today();
                }
                newValue.setHours(hour);
                newValue.setMinutes(minute);
                newValue.setSeconds(second);
                stage(newValue);
                this.#renderResult();
                if (!$date.value) {
                    this.#updateDatePanel(newValue);
                }
            }
            else {
                stage(null);
                this.#renderResult();
                if ($date.value) {
                    this.#updateDatePanel(null);
                }
            }
        });
        const renderTimePanelTitle = () => {
            if ($time.hour == null) {
                $timeValue.textContent = '';
            }
            else {
                const h = padLeft('0', 2, String($time.hour));
                const m = padLeft('0', 2, String($time.minute));
                const s = padLeft('0', 2, String($time.second));
                $timeValue.textContent = `${h}:${m}:${s}`;
            }
        };
        $time.addEventListener('change', renderTimePanelTitle);
        $popup.addEventListener('open-changed', () => {
            boolSetter('popup-open')(this, $popup.open);
        });
        $popup.addEventListener('opened', () => {
            if (this.range) {
                this.#prevValueFrom = this.#valueFrom ?? null;
                this.#prevValueTo = this.#valueTo ?? null;
            }
            const value = this.activeValue;
            this.#updateDatePanel(value);
            this.#updateTimePanel(value);
            this.#updateLayout();
            this.#initClickOutside();
            dispatchEvent(this, 'opened');
        });
        $popup.addEventListener('closed', () => {
            if (this.range && (!this.#valueFrom || !this.#valueTo)) {
                discard();
            }
            this.#switchActiveInput(null);
            this.#destroyClickOutside();
            dispatchEvent(this, 'closed');
        });
        this._ref.$confirm.onclick = () => {
            commit();
        };
        this.addEventListener('click-clear', () => {
            this.#valueFrom = this.#valueTo = null;
            this.#switchActiveInput(null);
            dispatchEvent(this, 'change', {
                detail: { value: null },
            });
            this.render();
        });
    }
    #disabledDate;
    get disabledDate() {
        return this.#disabledDate;
    }
    set disabledDate(value) {
        this.#disabledDate = value;
    }
    #disabledHour;
    get disabledHour() {
        return this.#disabledHour;
    }
    set disabledHour(value) {
        this.#disabledHour = value;
    }
    #disabledMinute;
    get disabledMinute() {
        return this.#disabledMinute;
    }
    set disabledMinute(value) {
        this.#disabledMinute = value;
    }
    #disabledSecond;
    get disabledSecond() {
        return this.#disabledSecond;
    }
    set disabledSecond(value) {
        this.#disabledSecond = value;
    }
    get range() {
        return boolGetter('range')(this);
    }
    set range(value) {
        boolSetter('range')(this, value);
    }
    get placeholderFrom() {
        return strGetter('placeholder-from')(this);
    }
    set placeholderFrom(value) {
        strSetter('placeholder-from')(this, value);
    }
    get placeholderTo() {
        return strGetter('placeholder-to')(this);
    }
    set placeholderTo(value) {
        strSetter('placeholder-to')(this, value);
    }
    get activeValue() {
        if (!this.range) {
            return this.#valueTo;
        }
        if (this.#isFromActive()) {
            return this.#valueFrom;
        }
        else {
            return this.#valueTo;
        }
    }
    set activeValue(value) {
        if (!this.range) {
            this.#valueTo = value;
            return;
        }
        const isFromActive = this.#isFromActive();
        if (isFromActive) {
            this.#valueFrom = value;
        }
        else {
            this.#valueTo = value;
        }
        if (this.#valueFrom &&
            this.#valueTo &&
            this.#valueFrom?.getTime() > this.#valueTo.getTime()) {
            if (isFromActive) {
                this.#valueTo.setTime(this.#valueFrom.getTime());
            }
            else {
                this.#valueFrom.setTime(this.#valueTo.getTime());
            }
        }
    }
    get value() {
        if (!this.range) {
            return this.#valueTo;
        }
        if (this.#valueFrom && this.#valueTo) {
            return [this.#valueFrom, this.#valueTo];
        }
        else {
            return null;
        }
    }
    set value(value) {
        if (!this.range) {
            this.#valueTo = value;
            if (this._ref.$popup.open) {
                this.#switchActiveInput(null);
                this.#updateDatePanel(value);
                this.#updateTimePanel(value);
            }
            dispatchEvent(this, 'change', {
                detail: { value },
            });
            this.render();
        }
        else {
            if (value == null) {
                this.#valueFrom = this.#valueTo = null;
                this.#switchActiveInput(null);
                dispatchEvent(this, 'change', {
                    detail: { value: null },
                });
                if (this._ref.$popup.open) {
                    this.#updateDatePanel(null);
                    this.#updateTimePanel(null);
                }
                this.render();
            }
            else {
                const [from, to] = value;
                this.#valueFrom = from;
                this.#valueTo = to;
                if (this._ref.$popup.open) {
                    const date = this.#isFromActive() ? from : to;
                    this.#updateDatePanel(date);
                    this.#updateTimePanel(date);
                }
                dispatchEvent(this, 'change', {
                    detail: { value },
                });
                this.render();
            }
        }
    }
    #isFromActive() {
        return this.range && this.#activeInput === this._ref.$fromDate;
    }
    #isToActive() {
        return this.range && this.#activeInput === this._ref.$toDate;
    }
    #switchActiveInput($input) {
        if (!this.range)
            return;
        const { $fromDate, $toDate } = this._ref;
        const inputs = [$fromDate, $toDate];
        this.#activeInput = $input;
        if ($input == null || !this.range) {
            inputs.forEach($input => $input.classList.remove('active'));
            return;
        }
        const isFrom = this.#isFromActive();
        $fromDate.classList.toggle('active', isFrom);
        $toDate.classList.toggle('active', !isFrom);
        this._ref.$popup.origin = isFrom ? PopupOrigin.TopStart : PopupOrigin.TopEnd;
        const value = this.activeValue;
        this.#updateDatePanel(value);
        this.#updateTimePanel(value);
    }
    #updateDatePanel(date) {
        this._ref.$date.value = date;
    }
    #updateTimePanel(date) {
        const { $time } = this._ref;
        if (!date) {
            $time.hour = $time.minute = $time.second = null;
            return;
        }
        $time.hour = date.getHours();
        $time.minute = date.getMinutes();
        $time.second = date.getSeconds();
    }
    #setDisabledMethods() {
        this._ref.$date.disabledDate = (data, ctx) => {
            if (this.disabledDate && this.disabledDate(data, ctx)) {
                return true;
            }
            if (this.range) {
                if (this.#isFromActive()) {
                    if (!this.#valueTo)
                        return false;
                    const to = makeDateFrom('day', this.#valueTo);
                    const from = makeDate({
                        year: data.year,
                        monthIndex: data.month,
                        day: data.date,
                    });
                    return from.getTime() > to.getTime();
                }
                else {
                    if (!this.#valueFrom)
                        return false;
                    const from = makeDateFrom('day', this.#valueFrom);
                    const to = makeDate({
                        year: data.year,
                        monthIndex: data.month,
                        day: data.date,
                    });
                    return to.getTime() < from.getTime();
                }
            }
            return false;
        };
        this._ref.$time.disabledHour = (data, ctx) => {
            if (this.disabledHour && this.disabledHour(data, ctx)) {
                return true;
            }
            return false;
        };
        this._ref.$time.disabledMinute = (data, ctx) => {
            if (this.disabledMinute && this.disabledMinute(data, ctx)) {
                return true;
            }
            return false;
        };
        this._ref.$time.disabledSecond = (data, ctx) => {
            if (this.disabledSecond && this.disabledSecond(data, ctx)) {
                return true;
            }
            return false;
        };
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.suffixIcon) {
            this.suffixIcon = 'time';
        }
        document.body.appendChild(this._ref.$popup);
        this.#setDisabledMethods();
        this.render();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        document.body.removeChild(this._ref.$popup);
        this.#destroyClickOutside();
    }
    attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(attrName, oldValue, newValue);
        if (BlocksDate.observedAttributes.includes(attrName) &&
            attrName !== 'mode') {
            this._ref.$date.setAttribute(attrName, newValue);
        }
        if (attrName === 'range' && !this.range) {
            this.#valueFrom = this.#prevValueFrom = null;
        }
        this.render();
    }
    #initClickOutside() {
        if (!this.#clearClickOutside) {
            this.#clearClickOutside = onClickOutside([this, this._ref.$popup], () => {
                if (this._ref.$popup.open) {
                    this._ref.$popup.open = false;
                }
            });
        }
    }
    #destroyClickOutside() {
        if (this.#clearClickOutside) {
            this.#clearClickOutside();
            this.#clearClickOutside = undefined;
        }
    }
    #renderResult() {
        if (this.#valueFrom) {
            const date = this.#valueFrom;
            const year = date.getFullYear();
            const month = padLeft('0', 2, String(date.getMonth() + 1));
            const day = padLeft('0', 2, String(date.getDate()));
            const dateValue = `${year}-${month}-${day}`;
            const h = padLeft('0', 2, String(date.getHours()));
            const m = padLeft('0', 2, String(date.getMinutes()));
            const s = padLeft('0', 2, String(date.getSeconds()));
            const timeValue = `${h}:${m}:${s}`;
            this._ref.$fromDate.value = dateValue + ' ' + timeValue;
        }
        else {
            this._ref.$fromDate.value = '';
        }
        if (this.#valueTo) {
            const date = this.#valueTo;
            const year = date.getFullYear();
            const month = padLeft('0', 2, String(date.getMonth() + 1));
            const day = padLeft('0', 2, String(date.getDate()));
            const dateValue = `${year}-${month}-${day}`;
            const h = padLeft('0', 2, String(date.getHours()));
            const m = padLeft('0', 2, String(date.getMinutes()));
            const s = padLeft('0', 2, String(date.getSeconds()));
            const timeValue = `${h}:${m}:${s}`;
            this._ref.$toDate.value = dateValue + ' ' + timeValue;
        }
        else {
            this._ref.$toDate.value = '';
        }
    }
    #renderPlaceholder() {
        this._ref.$fromDate.placeholder = this.placeholderFrom ?? '选择日期时间';
        this._ref.$toDate.placeholder = this.placeholderTo ?? '选择日期时间';
    }
    render() {
        this.#renderResult();
        this.#renderPlaceholder();
    }
    #updateLayout() {
        this._ref.$time.style.height =
            this._ref.$date._ref.$content.offsetHeight + 'px';
        this._ref.$timeValue.style.height =
            this._ref.$date.offsetHeight -
                this._ref.$date._ref.$content.offsetHeight -
                1 +
                'px';
    }
    static get observedAttributes() {
        return BlocksInput.observedAttributes
            .concat(BlocksDate.observedAttributes)
            .concat(BlocksTime.observedAttributes)
            .concat(['range', 'placeholder-from', 'placeholder-to']);
    }
}
if (!customElements.get('bl-datetime-picker')) {
    customElements.define('bl-datetime-picker', BlocksDateTimePicker);
}
function copyDate(date) {
    const copy = new Date();
    copy.setTime(date.getTime());
    return copy;
}
function today() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
