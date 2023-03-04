var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import '../loading/index.js';
import { Depth, Depths, normalizeMinDepth, normalizeViewDepth, getClosestDate, generateMonths, generateDates, generateYears, generateDecades, makeDate, normalizeNumber, yearToDecade, yearToCentury, decadeToCentury, isYearInDecade, firstYearOfDecade, isYearInCentury, firstYearOfCentury, lastYearOfCentury, lastYearOfDecade, generateWeekHeaders, isToday, isAllEqual, } from './helpers.js';
import { boolSetter, enumGetter, enumSetter, } from '../../common/property.js';
import { dispatchEvent } from '../../common/event.js';
import { Component, } from '../Component.js';
import { template } from './template.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
export let BlocksDate = (() => {
    let _classDecorators = [customElement('bl-date')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _loading_decorators;
    let _loading_initializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _depth_decorators;
    let _depth_initializers = [];
    var BlocksDate = class extends Component {
        static {
            _disabled_decorators = [attr('boolean')];
            _loading_decorators = [attr('boolean')];
            _max_decorators = [attr('int')];
            _mode_decorators = [attr('enum', { enumValues: ['single', 'multiple', 'range'] })];
            _depth_decorators = [attr('enum', { enumValues: [Depth.Month, Depth.Year, Depth.Decade] })];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _loading_decorators, { kind: "accessor", name: "loading", static: false, private: false, access: { has: obj => "loading" in obj, get: obj => obj.loading, set: (obj, value) => { obj.loading = value; } } }, _loading_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } } }, _max_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } } }, _mode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _depth_decorators, { kind: "accessor", name: "depth", static: false, private: false, access: { has: obj => "depth" in obj, get: obj => obj.depth, set: (obj, value) => { obj.depth = value; } } }, _depth_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDate = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #$pool = (__runInitializers(this, _instanceExtraInitializers), void 0);
        #value;
        constructor() {
            super();
            const shadowRoot = this.attachShadow({
                mode: 'open',
                delegatesFocus: true,
            });
            const fragment = template().content.cloneNode(true);
            shadowRoot.appendChild(fragment);
            const $panel = shadowRoot.querySelector('#layout');
            const $title = $panel.querySelector('.header-title');
            const $prevPrev = $panel.querySelector('.button-prevPrev');
            const $prev = $panel.querySelector('.button-prev');
            const $nextNext = $panel.querySelector('.button-nextNext');
            const $next = $panel.querySelector('.button-next');
            const $weekHeader = $panel.querySelector('.week-header');
            const $content = $panel.querySelector('#body');
            const $list = $panel.querySelector('.button-list');
            const $loading = $panel.querySelector('.body-loading');
            this._ref = {
                $panel,
                $title,
                $prevPrev,
                $prev,
                $nextNext,
                $next,
                $weekHeader,
                $content,
                $list,
                $loading,
            };
            this.#$pool = [];
            this.#value = [];
            this.viewDepth = this.startdepth;
            this.switchViewByDate(getClosestDate(this.#value) ?? new Date());
            $panel.onclick = e => {
                const target = e.target;
                if ($prevPrev.contains(target)) {
                    this.#onPrevPrev();
                }
                else if ($prev.contains(target)) {
                    this.#onPrev();
                }
                else if ($next.contains(target)) {
                    this.#onNext();
                }
                else if ($nextNext.contains(target)) {
                    this.#onNextNext();
                }
                else if ($title.contains(target)) {
                    this.rollUp();
                }
                else if (target.classList.contains('button-item')) {
                    this.#onClickItem(this.#getModel(target));
                }
                else if (target.parentElement?.classList.contains('button-item')) {
                    this.#onClickItem(this.#getModel(target.parentElement));
                }
                this.focus();
            };
            $panel.onmouseover = e => {
                if (!this.#isLeafDepth())
                    return;
                if (!this.isRangeMode())
                    return;
                if (!this.rangeFrom)
                    return;
                if (this.rangeTo)
                    return;
                const target = e.target;
                const $button = target.classList.contains('button-item')
                    ? target
                    : target.parentElement.classList.contains('button-item')
                        ? target.parentElement
                        : null;
                if (!$button)
                    return;
                this.maybeRangeTo = this.#getModel($button);
                this.render();
            };
        }
        #rangeFrom;
        get rangeFrom() {
            return this.#rangeFrom;
        }
        set rangeFrom(value) {
            this.#rangeFrom = value;
        }
        #rangeTo;
        maybeRangeTo;
        get rangeTo() {
            return this.#rangeTo;
        }
        set rangeTo(value) {
            if (value !== null) {
                this.maybeRangeTo = null;
            }
            this.#rangeTo = value;
        }
        #disabledDate;
        get disabledDate() {
            return this.#disabledDate;
        }
        set disabledDate(value) {
            this.#disabledDate = value;
        }
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, void 0);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #loading_accessor_storage = __runInitializers(this, _loading_initializers, void 0);
        get loading() { return this.#loading_accessor_storage; }
        set loading(value) { this.#loading_accessor_storage = value; }
        #max_accessor_storage = __runInitializers(this, _max_initializers, void 0);
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #mode_accessor_storage = __runInitializers(this, _mode_initializers, 'single');
        get mode() { return this.#mode_accessor_storage; }
        set mode(value) { this.#mode_accessor_storage = value; }
        #depth_accessor_storage = __runInitializers(this, _depth_initializers, Depth.Month);
        get depth() { return this.#depth_accessor_storage; }
        set depth(value) { this.#depth_accessor_storage = value; }
        get mindepth() {
            const value = enumGetter('mindepth', Depths)(this) ?? Depth.Century;
            return normalizeMinDepth(value, this.depth);
        }
        set mindepth(value) {
            if (Depths.includes(value)) {
                enumSetter('mindepth', Depths)(this, normalizeMinDepth(value, this.depth));
            }
        }
        get startdepth() {
            const value = enumGetter('startdepth', Depths)(this) ?? this.depth;
            return normalizeViewDepth(value, this.mindepth, this.depth);
        }
        set startdepth(value) {
            if (Depths.includes(value)) {
                enumSetter('startdepth', Depths)(this, normalizeViewDepth(value, this.mindepth, this.depth));
            }
        }
        #badges;
        get badges() {
            return this.#badges ?? [];
        }
        set badges(value) {
            this.#badges = value;
            this.render();
        }
        get startWeekOn() {
            const value = enumGetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(this) ??
                '1';
            return Number(value);
        }
        set startWeekOn(value) {
            enumSetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(this, String(value));
        }
        get multiple() {
            return this.mode === 'multiple';
        }
        #viewDepth;
        get viewDepth() {
            return normalizeViewDepth(this.#viewDepth, this.mindepth, this.depth);
        }
        set viewDepth(value) {
            if (this.#viewDepth === value)
                return;
            this.#viewDepth = normalizeViewDepth(value, this.mindepth, this.depth);
            this.render();
        }
        #viewCentury;
        get viewCentury() {
            if (this.#viewCentury != null)
                return this.#viewCentury;
            return yearToCentury(this.viewYear ?? new Date().getFullYear());
        }
        set viewCentury(value) {
            const century = normalizeNumber(value);
            if (century == null)
                return;
            if (this.#viewCentury !== century) {
                this.#viewCentury = century;
                if (!isYearInCentury(this.viewYear, century)) {
                    this.#viewYear = firstYearOfDecade(century);
                }
                this.render();
            }
        }
        #viewDecade;
        get viewDecade() {
            if (this.#viewDecade != null)
                return this.#viewDecade;
            return yearToDecade(this.viewYear ?? new Date().getFullYear());
        }
        set viewDecade(value) {
            const decade = normalizeNumber(value);
            if (decade == null)
                return;
            if (this.#viewDecade !== decade) {
                this.#viewDecade = decade;
                this.#viewCentury = decadeToCentury(decade);
                if (!isYearInDecade(this.viewYear, decade)) {
                    this.#viewYear = firstYearOfDecade(decade);
                }
                this.render();
            }
        }
        #viewYear;
        get viewYear() {
            return this.#viewYear ?? new Date().getFullYear();
        }
        set viewYear(value) {
            const year = normalizeNumber(value);
            if (year == null)
                return;
            if (this.#viewYear !== year) {
                this.#viewYear = year;
                this.#viewDecade = yearToDecade(year);
                this.#viewCentury = yearToCentury(year);
                this.render();
            }
        }
        #viewMonth;
        get viewMonth() {
            return this.#viewMonth;
        }
        set viewMonth(value) {
            if (this.#viewMonth !== value) {
                this.#viewMonth = value;
                this.render();
            }
        }
        get value() {
            switch (this.mode) {
                case 'single':
                    return this.#value.length ? this.#value[0] : null;
                case 'range':
                    return this.#value.length === 2 ? this.#value.slice() : null;
                case 'multiple':
                    return this.#value.length ? this.#value.slice() : null;
            }
        }
        set value(value) {
            switch (this.mode) {
                case 'single':
                    if (value === null || value instanceof Date) {
                        this.setValue(value);
                    }
                    else if (value[0] instanceof Date) {
                        this.setValue(value[0]);
                    }
                    break;
                case 'range':
                    if ((Array.isArray(value) && value.length === 2) || value === null) {
                        this.setRange(value);
                    }
                    break;
                case 'multiple':
                    if (value instanceof Date) {
                        this.setValues([value]);
                    }
                    else {
                        this.setValues(value);
                    }
                    break;
            }
        }
        clearUncompleteRange() {
            if (this.mode !== 'range')
                return;
            if (this.value !== null) {
                const [from, to] = this.value;
                this.rangeFrom = this.#dateToModel(from, this.viewDepth);
                this.rangeTo = this.#dateToModel(to, this.viewDepth);
            }
            else {
                this.rangeFrom = this.rangeTo = null;
            }
            this.render();
        }
        clearValue() {
            this.#value = [];
            if (this.mode === 'range') {
                this.rangeFrom = this.rangeTo = null;
            }
            this.render();
        }
        getValue() {
            return this.mode === 'single' ? this.#value[0] ?? null : null;
        }
        setValue(value) {
            if (this.mode !== 'single')
                return;
            if (value === null) {
                if (this.value !== null) {
                    this.clearValue();
                }
                return;
            }
            const currentValue = this.#value[0];
            const hasChange = currentValue !== value ||
                !currentValue ||
                currentValue.getTime() !== value.getTime();
            if (hasChange) {
                this.#value = [value];
                this.render();
                dispatchEvent(this, 'select', { detail: { value: this.value } });
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            }
        }
        getRange() {
            return this.mode === 'range' && this.#value.length === 2
                ? this.#value.slice()
                : null;
        }
        setRange(value) {
            if (this.mode !== 'range')
                return;
            if (value === null) {
                if (this.value !== null) {
                    this.clearValue();
                }
                return;
            }
            if (!Array.isArray(value)) {
                return;
            }
            if (!Array.isArray(value) ||
                value.length !== 2 ||
                !value.every(date => date instanceof Date)) {
                return;
            }
            const range = value
                .slice()
                .sort((a, b) => a.getTime() - b.getTime());
            const hasChange = !isAllEqual(this.#value, range);
            if (hasChange) {
                this.#value = range;
                this.maybeRangeTo = null;
                if (range.length) {
                    this.rangeFrom = this.#dateToModel(range[0], this.viewDepth);
                    this.rangeTo = this.#dateToModel(range[1], this.viewDepth);
                }
                else {
                    this.rangeFrom = this.rangeTo = null;
                }
                this.render();
                dispatchEvent(this, 'select', { detail: { value: this.value } });
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            }
        }
        getValues() {
            return this.mode === 'multiple' && this.#value.length
                ? this.#value.slice()
                : [];
        }
        setValues(values) {
            if (this.mode !== 'multiple')
                return;
            if (values.length === 0) {
                if (this.value !== null) {
                    this.clearValue();
                }
                return;
            }
            if (!Array.isArray(values)) {
                return;
            }
            if (!Array.isArray(values) ||
                values.length > (this.max ?? Infinity) ||
                !values.every(date => date instanceof Date)) {
                return;
            }
            const hasChange = !isAllEqual(this.#value, values);
            if (hasChange) {
                this.#value = values;
                this.render();
                dispatchEvent(this, 'select', { detail: { value: this.value } });
                dispatchEvent(this, 'change', { detail: { value: this.value } });
            }
        }
        isRangeMode() {
            return this.mode === 'range';
        }
        getDecadeRange(decade) {
            const from = decade * 10;
            const to = from + 9;
            return [from, to];
        }
        limitReached() {
            if (!this.multiple || !this.max)
                return false;
            let max = Math.trunc(this.max);
            if (max < 1)
                max = 1;
            const len = this.getValues()?.length ?? 0;
            return len >= max;
        }
        switchViewByDate(date) {
            this.viewMonth = date.getMonth();
            this.viewYear = date.getFullYear();
        }
        #getModel($item) {
            return {
                label: $item.dataset.label,
                century: +$item.dataset.century || 0,
                decade: +$item.dataset.decade,
                year: +$item.dataset.year,
                month: +$item.dataset.month,
                date: +$item.dataset.date,
            };
        }
        #renderHeaderButtons() {
            if (this.viewDepth === Depth.Month) {
                this._ref.$prevPrev.style.cssText = '';
                this._ref.$nextNext.style.cssText = '';
            }
            else {
                this._ref.$prevPrev.style.cssText = 'transfrom:scale(0,0);flex:0 0 0';
                this._ref.$nextNext.style.cssText = 'transfrom:scale(0,0);flex:0 0 0';
            }
        }
        #renderTitle() {
            let text;
            switch (this.viewDepth) {
                case Depth.Century: {
                    text = `${firstYearOfCentury(this.viewCentury)} ~ ${lastYearOfCentury(this.viewCentury)}`;
                    break;
                }
                case Depth.Decade: {
                    text = `${firstYearOfDecade(this.viewDecade)} ~ ${lastYearOfDecade(this.viewDecade)}`;
                    break;
                }
                case Depth.Year: {
                    text = `${this.viewYear}`;
                    break;
                }
                default:
                    text = `${this.viewYear} / ${this.viewMonth + 1}`;
            }
            this._ref.$title.textContent = text;
        }
        #renderWeekHeader() {
            const headers = generateWeekHeaders(this.startWeekOn);
            const $weekHeader = this._ref.$weekHeader;
            if (this.viewDepth === Depth.Month) {
                $weekHeader.style.height = '';
                $weekHeader.style.opacity = '1';
                if ($weekHeader.children.length !== 7) {
                    $weekHeader.innerHTML = headers
                        .map(header => `<span>${header}</span>`)
                        .join('');
                }
                else {
                    for (let i = 0; i < 7; i += 1) {
                        $weekHeader.children[i].textContent = headers[i];
                    }
                }
            }
            else {
                $weekHeader.style.height = '0';
                $weekHeader.style.opacity = '0';
            }
        }
        #renderLoading() {
            this._ref.$loading.style.display = this.loading ? '' : 'none';
        }
        #renderItems() {
            ;
            ['body-century', 'body-decade', 'body-year', 'body-month'].forEach(klass => {
                this._ref.$content.classList.remove(klass);
            });
            this._ref.$content.classList.add(`body-${this.viewDepth}`);
            if (this.viewDepth === Depth.Month) {
                this.#renderDateItems();
            }
            else if (this.viewDepth === Depth.Year) {
                this.#renderMonthItems();
            }
            else if (this.viewDepth === Depth.Decade) {
                this.#renderYearItems();
            }
            else if (this.viewDepth === Depth.Century) {
                this.#renderDecadeItems();
            }
        }
        #ensureItemCount(n) {
            const $list = this._ref.$list;
            let len = $list.children.length ?? 0;
            while (len++ < n) {
                if (this.#$pool.length) {
                    $list.appendChild(this.#$pool.pop());
                }
                else {
                    const el = document.createElement('button');
                    el.className = 'button-item';
                    el.appendChild(document.createElement('span'));
                    $list.appendChild(el);
                }
            }
            len = $list.children.length;
            while (len-- > n) {
                this.#$pool.push($list.removeChild($list.lastElementChild));
            }
            return Array.prototype.slice.call($list.children);
        }
        #renderDecadeItems() {
            const decades = generateDecades(this.viewCentury);
            if (!decades.length)
                return;
            this.#ensureItemCount(10).forEach(($el, i) => {
                const model = decades[i];
                boolSetter('disabled')($el, false);
                $el.classList.toggle('button-item--otherMonth', false);
                $el.classList.toggle('button-item--today', false);
                $el.classList.toggle('button-item--active', false);
                $el.classList.toggle('button-item--includesActive', this.#includesActive(model));
                $el.classList.toggle('button-item--rangeFrom', false);
                $el.classList.toggle('button-item--rangeTo', false);
                $el.classList.toggle('button-item--rangeIn', false);
                $el.dataset.century = model.century;
                $el.dataset.decade = model.decade;
                $el.dataset.year = null;
                $el.dataset.month = null;
                $el.dataset.date = null;
                $el.dataset.label = model.label;
                $el.lastElementChild.innerHTML = model.label;
                this.#renderBadge($el, model);
            });
        }
        #renderYearItems() {
            const years = generateYears(this.viewCentury, this.viewDecade);
            if (!years.length)
                return;
            this.#ensureItemCount(10).forEach(($el, i) => {
                const item = years[i];
                if (this.depth === Depth.Decade) {
                    boolSetter('disabled')($el, !this.#isActiveLeaf(item) && this.#isDisabledLeaf(item));
                }
                else {
                    boolSetter('disabled')($el, false);
                }
                $el.classList.toggle('button-item--otherMonth', false);
                $el.classList.toggle('button-item--today', false);
                $el.classList.toggle('button-item--active', this.#isActiveLeaf(item));
                $el.classList.toggle('button-item--includesActive', this.#includesActive(item));
                const isRangeMode = this.isRangeMode();
                $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(item));
                $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(item));
                $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(item));
                $el.dataset.century = item.century;
                $el.dataset.decade = item.decade;
                $el.dataset.year = item.year;
                $el.dataset.month = null;
                $el.dataset.date = null;
                $el.dataset.label = item.label;
                $el.lastElementChild.innerHTML = item.label;
                this.#renderBadge($el, item);
            });
        }
        #renderMonthItems() {
            const months = generateMonths(this.viewCentury, this.viewDecade, this.viewYear);
            if (!months.length)
                return;
            this.#ensureItemCount(12).forEach(($el, i) => {
                const item = months[i];
                $el.classList.toggle('button-item--otherMonth', false);
                $el.classList.toggle('button-item--today', false);
                $el.classList.toggle('button-item--active', this.#isActiveLeaf(item));
                $el.classList.toggle('button-item--includesActive', this.#includesActive(item));
                const isRangeMode = this.isRangeMode();
                $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(item));
                $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(item));
                $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(item));
                if (this.depth === Depth.Year) {
                    boolSetter('disabled')($el, !this.#isActiveLeaf(item) && this.#isDisabledLeaf(item));
                }
                else {
                    boolSetter('disabled')($el, false);
                }
                $el.dataset.century = item.century;
                $el.dataset.decade = item.decade;
                $el.dataset.year = item.year;
                $el.dataset.month = item.month;
                $el.dataset.date = null;
                $el.dataset.label = item.label;
                $el.lastElementChild.innerHTML = item.label;
                this.#renderBadge($el, item);
            });
        }
        #renderDateItems() {
            const dateList = generateDates(this.viewCentury, this.viewDecade, this.viewYear, this.viewMonth, this.startWeekOn);
            if (!dateList.length)
                return;
            this.#ensureItemCount(42).forEach(($el, i) => {
                const item = dateList[i];
                boolSetter('disabled')($el, !this.#isActiveLeaf(item) && this.#isDisabledLeaf(item));
                $el.classList.toggle('button-item--otherMonth', item.month !== this.viewMonth);
                $el.classList.toggle('button-item--today', isToday(item));
                $el.classList.toggle('button-item--active', this.#isActiveLeaf(item));
                $el.classList.toggle('button-item--includesActive', false);
                const isRangeMode = this.isRangeMode();
                $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(item));
                $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(item));
                $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(item));
                $el.dataset.century = item.century;
                $el.dataset.decade = item.decade;
                $el.dataset.year = item.year;
                $el.dataset.month = item.month;
                $el.dataset.date = item.date;
                $el.dataset.label = item.label;
                $el.lastElementChild.innerHTML = item.label;
                this.#renderBadge($el, item);
            });
        }
        #renderBadge($el, item) {
            const badges = this.getBadges(item);
            let $badge = $el.querySelector('.button-badge');
            if (badges.length === 0) {
                $el.title = '';
                if ($badge)
                    $el.removeChild($badge);
                return;
            }
            if (!$badge) {
                $badge = $el.appendChild(document.createElement('i'));
            }
            $badge.classList.add('button-badge');
            let title = badges
                .filter(badge => badge.label)
                .map(badge => badge.label)
                .join('\n');
            if (title.length > 100)
                title = title.slice(0, 97) + '...';
            $el.title = title;
        }
        render() {
            this.#renderHeaderButtons();
            this.#renderTitle();
            this.#renderWeekHeader();
            this.#renderLoading();
            this.#renderItems();
        }
        getBadges(item) {
            let badges;
            if (this.viewDepth === Depth.Month) {
                badges = this.badges.filter(b => item.date === b.date && item.month === b.month && b.year === item.year);
            }
            else if (this.viewDepth === Depth.Year) {
                badges = this.badges.filter(b => item.month === b.month && b.year === item.year);
            }
            else if (this.viewDepth === Depth.Decade) {
                badges = this.badges.filter(b => b.year === item.year);
            }
            else if (this.viewDepth === Depth.Century) {
                badges = this.badges.filter(b => b.year >= item.decade * 10 && b.year <= item.decade * 10 + 9);
            }
            else {
                badges = [];
            }
            return badges;
        }
        #isRangeFrom(item) {
            let obj = this.rangeFrom;
            if (!obj)
                return false;
            const obj2 = this.rangeTo ?? this.maybeRangeTo;
            if (obj2 &&
                this.#modelToDate(obj).getTime() > this.#modelToDate(obj2).getTime()) {
                obj = obj2;
            }
            return ['year', 'month', 'date'].every(key => obj[key] === item[key]);
        }
        #isRangeTo(item) {
            let obj = this.rangeFrom;
            if (!obj)
                return false;
            const obj2 = this.rangeTo ?? this.maybeRangeTo;
            if (obj2 &&
                this.#modelToDate(obj).getTime() < this.#modelToDate(obj2).getTime()) {
                obj = obj2;
            }
            return ['year', 'month', 'date'].every(key => obj[key] === item[key]);
        }
        #isDisabledLeaf(item) {
            if (this.limitReached())
                return true;
            if (this.disabledDate) {
                return this.disabledDate(item, {
                    depth: this.depth,
                    viewDepth: this.viewDepth,
                    component: this,
                });
            }
            else {
                if (this.viewDepth !== this.depth)
                    return false;
                return false;
            }
        }
        #isSameDate(item, date) {
            return (date.getFullYear() === item.year &&
                date.getMonth() === item.month &&
                date.getDate() === item.date);
        }
        #isSameMonth(item, date) {
            return date.getFullYear() === item.year && date.getMonth() === item.month;
        }
        #isSameYear(item, date) {
            return date.getFullYear() === item.year;
        }
        #isInRange(item) {
            if (!this.#isLeafDepth())
                return false;
            if (!this.rangeFrom)
                return false;
            if (!this.rangeTo && !this.maybeRangeTo)
                return false;
            let inRange;
            if (this.depth === Depth.Month) {
                inRange = (t1, t2) => {
                    const t1Time = makeDate(t1.getFullYear(), t1.getMonth(), t1.getDate()).getTime();
                    const t2Time = makeDate(t2.getFullYear(), t2.getMonth(), t2.getDate()).getTime();
                    const itemTime = makeDate(item.year, item.month, item.date).getTime();
                    return (Math.min(t1Time, t2Time) <= itemTime &&
                        Math.max(t1Time, t2Time) >= itemTime);
                };
            }
            else if (this.depth === Depth.Year) {
                inRange = (t1, t2) => {
                    const t1Time = makeDate(t1.getFullYear(), t1.getMonth(), 1).getTime();
                    const t2Time = makeDate(t2.getFullYear(), t2.getMonth(), 1).getTime();
                    const itemTime = makeDate(item.year, item.month, 1).getTime();
                    return (Math.min(t1Time, t2Time) <= itemTime &&
                        Math.max(t1Time, t2Time) >= itemTime);
                };
            }
            else if (this.depth === Depth.Decade) {
                inRange = (t1, t2) => {
                    return (Math.min(t1.getFullYear(), t2.getFullYear()) <= item.year &&
                        Math.max(t1.getFullYear(), t2.getFullYear()) >= item.year);
                };
            }
            const from = this.rangeFrom;
            const to = this.rangeTo ?? this.maybeRangeTo;
            if (this.depth === Depth.Month) {
                return inRange(makeDate(from.year, from.month, from.date), makeDate(to.year, to.month, to.date));
            }
            if (this.depth === Depth.Year) {
                return inRange(makeDate(from.year, from.month, 1), makeDate(to.year, to.month, 1));
            }
            if (this.depth === Depth.Decade) {
                return inRange(makeDate(from.year, 0, 1), makeDate(to.year, 0, 1));
            }
        }
        #isActiveLeaf(item) {
            if (!this.#isLeafDepth())
                return false;
            if (this.isRangeMode()) {
                return this.#isRangeFrom(item) || this.#isRangeTo(item);
            }
            const isActive = this.depth === Depth.Month
                ? this.#isSameDate.bind(this, item)
                : this.depth === Depth.Year
                    ? this.#isSameMonth.bind(this, item)
                    : this.depth === Depth.Decade
                        ? this.#isSameYear.bind(this, item)
                        : () => false;
            if (this.mode === 'single') {
                return this.#value.some(isActive);
            }
            if (this.mode === 'multiple') {
                return this.#value.some(isActive);
            }
        }
        #includesToday(item) {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            switch (this.viewDepth) {
                case Depth.Year:
                    return item.year === year && item.month === month;
                case Depth.Decade:
                    return item.year === year;
                case Depth.Century:
                    return Math.floor(year / 10) === item.decade;
                default:
                    return false;
            }
        }
        #includesActive(item) {
            if (!this.#value.length)
                return false;
            if (this.isRangeMode()) {
                if (this.#value.length !== 2)
                    return false;
                const fromTime = this.#value[0].getTime();
                const toTime = this.#value[1].getTime();
                switch (this.viewDepth) {
                    case Depth.Year: {
                        const t1 = makeDate(item.year, item.month, 1).getTime();
                        const t2 = makeDate(item.year, (item.month ?? 0) + 1, 0).getTime();
                        return fromTime <= t2 && toTime >= t1;
                    }
                    case Depth.Decade: {
                        const t1 = makeDate(item.year, 0, 1).getTime();
                        const t2 = makeDate(item.year, 11, 31).getTime();
                        return fromTime <= t2 && toTime >= t1;
                    }
                    case Depth.Century: {
                        const t1 = makeDate(item.decade * 10, 0, 1).getTime();
                        const t2 = makeDate(item.decade * 10 + 9, 11, 31).getTime();
                        return fromTime <= t2 && toTime >= t1;
                    }
                    default:
                        return false;
                }
            }
            else {
                switch (this.viewDepth) {
                    case Depth.Year:
                        return this.#value.some((t) => t.getMonth() === item.month && t.getFullYear() === item.year);
                    case Depth.Decade:
                        return this.#value.some((t) => t.getFullYear() === item.year);
                    case Depth.Century:
                        return this.#value.some((t) => Math.floor(t.getFullYear() / 10) === item.decade);
                    default:
                        return false;
                }
            }
        }
        #isLeafDepth() {
            return this.viewDepth === this.depth;
        }
        #onClickItem(item) {
            if (this.#isDisabledLeaf(item) && !this.#isActiveLeaf(item)) {
                return;
            }
            if (!this.#isLeafDepth()) {
                return this.drillDown(item);
            }
            this.selectByModel(item);
        }
        selectDate(date) {
            this.selectByModel(this.#dateToModel(date, this.viewDepth));
        }
        selectByModel(item) {
            if (this.disabled)
                return;
            let date;
            switch (this.viewDepth) {
                case Depth.Month: {
                    date = makeDate(item.year, item.month, item.date);
                    break;
                }
                case Depth.Year: {
                    date = makeDate(item.year, item.month, 1);
                    break;
                }
                case Depth.Decade: {
                    makeDate(item.year, 0, 1);
                    break;
                }
            }
            switch (this.mode) {
                case 'single': {
                    this.setValue(date);
                    break;
                }
                case 'range': {
                    this.maybeRangeTo = null;
                    if (!this.rangeFrom || this.rangeTo) {
                        this.clearValue();
                        this.rangeFrom = item;
                        this.render();
                        return;
                    }
                    this.rangeTo = item;
                    this.setRange([
                        makeDate(this.rangeFrom.year, this.viewDepth === Depth.Decade ? 0 : this.rangeFrom.month, this.viewDepth === Depth.Month ? this.rangeFrom.date : 1),
                        makeDate(this.rangeTo.year, this.viewDepth === Depth.Decade ? 0 : this.rangeTo.month, this.viewDepth === Depth.Month ? this.rangeTo.date : 1),
                    ]);
                    break;
                }
                case 'multiple': {
                    const values = this.#value.slice();
                    if (this.#isActiveLeaf(item)) {
                        const pred = this.viewDepth === Depth.Month
                            ? (t) => t.getDate() === item.date &&
                                t.getMonth() === item.month &&
                                t.getFullYear() === item.year
                            : this.viewDepth === Depth.Year
                                ? (t) => t.getMonth() === item.month && t.getFullYear() === item.year
                                : (t) => t.getFullYear() === item.year;
                        const index = values.findIndex(pred);
                        if (index !== -1)
                            values.splice(index, 1);
                    }
                    else {
                        values.push(date);
                    }
                    this.setValues(values);
                    break;
                }
            }
        }
        drillDown(item) {
            if (this.#isLeafDepth())
                return;
            switch (this.viewDepth) {
                case Depth.Year: {
                    this.viewMonth = item.month;
                    this.viewDepth = Depth.Month;
                    dispatchEvent(this, 'panel-change', {
                        detail: { viewDepth: this.viewDepth },
                    });
                    break;
                }
                case Depth.Decade: {
                    this.viewDepth = Depth.Year;
                    this.viewYear = item.year;
                    dispatchEvent(this, 'panel-change', {
                        detail: { viewDepth: this.viewDepth },
                    });
                    break;
                }
                default: {
                    this.viewDepth = Depth.Decade;
                    this.viewDecade = item.decade;
                    dispatchEvent(this, 'panel-change', {
                        detail: { viewDepth: this.viewDepth },
                    });
                }
            }
        }
        rollUp() {
            switch (this.viewDepth) {
                case Depth.Month: {
                    const upDepth = normalizeViewDepth(Depth.Year, this.mindepth, this.depth);
                    if (this.viewDepth !== upDepth) {
                        this.viewDepth = upDepth;
                        dispatchEvent(this, 'panel-change', {
                            detail: { viewDepth: this.viewDepth },
                        });
                    }
                    break;
                }
                case Depth.Year: {
                    const upDepth = normalizeViewDepth(Depth.Decade, this.mindepth, this.depth);
                    if (this.viewDepth !== upDepth) {
                        this.viewDepth = upDepth;
                        this.switchViewByDate(makeDate(this.viewYear, 0));
                        dispatchEvent(this, 'panel-change', {
                            detail: { viewDepth: this.viewDepth },
                        });
                    }
                    break;
                }
                case Depth.Decade: {
                    const upDepth = normalizeViewDepth(Depth.Century, this.mindepth, this.depth);
                    if (this.viewDepth !== upDepth) {
                        this.viewDepth = upDepth;
                        this.switchViewByDate(makeDate(this.viewDecade * 10, 0));
                        dispatchEvent(this, 'panel-change', {
                            detail: { viewDepth: this.viewDepth },
                        });
                    }
                    break;
                }
            }
        }
        #modelToDate(item) {
            return makeDate(item.year, item.month || 0, item.date || 1);
        }
        #dateToModel(dateObj, depth) {
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth();
            const date = dateObj.getDate();
            const century = Math.floor(year / 100);
            const decade = Math.floor(year / 10);
            const label = depth === Depth.Month
                ? String(date)
                : depth === Depth.Year
                    ? String(month + 1)
                    : depth === Depth.Decade
                        ? String(year)
                        : `${decade * 10} ~ ${decade * 10 + 9}`;
            return {
                label,
                century,
                decade,
                year,
                month,
                date,
            };
        }
        showPrevMonth() {
            if (this.viewMonth == null)
                return;
            if (this.viewMonth > 0) {
                this.viewMonth--;
            }
            else {
                if (this.viewYear) {
                    this.viewYear--;
                }
                this.viewMonth = 11;
            }
            dispatchEvent(this, 'prev-month', {
                detail: {
                    century: this.viewCentury,
                    decade: this.viewDecade,
                    year: this.viewYear,
                    month: this.viewMonth,
                },
            });
        }
        showNextMonth() {
            if (this.viewMonth == null)
                return;
            if (this.viewMonth < 11) {
                this.viewMonth++;
            }
            else {
                if (this.viewYear) {
                    this.viewYear++;
                }
                this.viewMonth = 0;
            }
            dispatchEvent(this, 'next-month', {
                detail: {
                    century: this.viewCentury,
                    decade: this.viewDecade,
                    year: this.viewYear,
                    month: this.viewMonth,
                },
            });
        }
        showPrevYear() {
            if (this.viewYear == null)
                return;
            this.viewYear--;
            dispatchEvent(this, 'prev-year', {
                detail: {
                    century: this.viewCentury,
                    decade: this.viewDecade,
                    year: this.viewYear,
                },
            });
        }
        showNextYear() {
            if (this.viewYear == null)
                return;
            this.viewYear++;
            dispatchEvent(this, 'next-year', {
                detail: {
                    century: this.viewCentury,
                    decade: this.viewDecade,
                    year: this.viewYear,
                },
            });
        }
        showPrevDecade() {
            this.viewDecade--;
            dispatchEvent(this, 'prev-decade', {
                detail: { century: this.viewCentury, decade: this.viewDecade },
            });
        }
        showNextDecade() {
            this.viewDecade++;
            dispatchEvent(this, 'next-decade', {
                detail: { century: this.viewCentury, decade: this.viewDecade },
            });
        }
        showPrevCentury() {
            this.viewCentury--;
            dispatchEvent(this, 'prev-century', {
                detail: { century: this.viewCentury },
            });
        }
        showNextCentury() {
            this.viewCentury++;
            dispatchEvent(this, 'next-century', {
                detail: { century: this.viewCentury },
            });
        }
        #onPrev() {
            if (this.viewDepth === Depth.Month) {
                this.showPrevMonth();
            }
            else if (this.viewDepth === Depth.Year) {
                this.showPrevYear();
            }
            else if (this.viewDepth === Depth.Decade) {
                this.showPrevDecade();
            }
            else {
                this.showPrevCentury();
            }
        }
        #onPrevPrev() {
            if (this.viewDepth === Depth.Month) {
                this.showPrevYear();
            }
        }
        #onNext() {
            if (this.viewDepth === Depth.Month) {
                this.showNextMonth();
            }
            else if (this.viewDepth === Depth.Year) {
                this.showNextYear();
            }
            else if (this.viewDepth === Depth.Decade) {
                this.showNextDecade();
            }
            else {
                this.showNextCentury();
            }
        }
        #onNextNext() {
            if (this.viewDepth === Depth.Month) {
                this.showNextYear();
            }
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.render();
        }
        static get Depth() {
            return Depth;
        }
        static get observedAttributes() {
            return [
                'depth',
                'disabled',
                'loading',
                'max',
                'mindepth',
                'mode',
                'startdepth',
                'start-week-on',
                'value',
            ];
        }
    };
    return BlocksDate = _classThis;
})();
