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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import '../loading/index.js';
import { attr } from '../../decorators/attr.js';
import { boolSetter, enumGetter, enumSetter } from '../../common/property.js';
import { compile } from '../../common/dateFormat.js';
import { computed } from '../../common/reactive.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { fromAttr } from '../component/reactive.js';
import { style } from './style.js';
import { template } from './template.js';
import { Control } from '../base-control/index.js';
import { Depth } from './type.js';
import * as Helpers from './helpers.js';
export let BlocksDate = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-date',
            styles: [style],
            attachShadow: {
                mode: 'open',
                delegatesFocus: true,
            },
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _loading_decorators;
    let _loading_initializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _mode_decorators;
    let _mode_initializers = [];
    let _depth_decorators;
    let _depth_initializers = [];
    let _minDepth_decorators;
    let _minDepth_initializers = [];
    let _startDepth_decorators;
    let _startDepth_initializers = [];
    let _startWeekOn_decorators;
    let _startWeekOn_initializers = [];
    let _format_decorators;
    let _format_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$title_decorators;
    let _$title_initializers = [];
    let _$prevPrev_decorators;
    let _$prevPrev_initializers = [];
    let _$prev_decorators;
    let _$prev_initializers = [];
    let _$nextNext_decorators;
    let _$nextNext_initializers = [];
    let _$next_decorators;
    let _$next_initializers = [];
    let _$weekHeader_decorators;
    let _$weekHeader_initializers = [];
    let _$content_decorators;
    let _$content_initializers = [];
    let _$list_decorators;
    let _$list_initializers = [];
    let _$loading_decorators;
    let _$loading_initializers = [];
    var BlocksDate = class extends Control {
        static {
            _loading_decorators = [attr('boolean')];
            _max_decorators = [attr('int')];
            _mode_decorators = [attr('enum', { enumValues: ['single', 'multiple', 'range'] })];
            _depth_decorators = [attr('enum', { enumValues: Helpers.LeafDepths })];
            _minDepth_decorators = [attr('string', {
                    get(element) {
                        const value = enumGetter('mindepth', Helpers.Depths)(element) ?? Depth.Century;
                        return Helpers.normalizeMinDepth(value, element.depth);
                    },
                    set(element, value) {
                        if (Helpers.Depths.includes(value)) {
                            enumSetter('mindepth', Helpers.Depths)(element, Helpers.normalizeMinDepth(value, element.depth));
                        }
                    },
                })];
            _startDepth_decorators = [attr('string', {
                    get(element) {
                        const value = enumGetter('startdepth', Helpers.Depths)(element) ?? element.depth;
                        return Helpers.normalizeActiveDepth(value, element.minDepth, element.depth);
                    },
                    set(element, value) {
                        if (Helpers.Depths.includes(value)) {
                            enumSetter('startdepth', Helpers.Depths)(element, Helpers.normalizeActiveDepth(value, element.minDepth, element.depth));
                        }
                    },
                })];
            _startWeekOn_decorators = [attr('string', {
                    get(element) {
                        const value = enumGetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(element) ?? '1';
                        return Number(value);
                    },
                    set(element, value) {
                        enumSetter('start-week-on', ['1', '2', '3', '4', '5', '6', '0'])(element, String(value));
                    },
                })];
            _format_decorators = [attr('string', { defaults: 'YYYY-MM-DD' })];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$title_decorators = [shadowRef('.header-title')];
            _$prevPrev_decorators = [shadowRef('.button-prevPrev')];
            _$prev_decorators = [shadowRef('.button-prev')];
            _$nextNext_decorators = [shadowRef('.button-nextNext')];
            _$next_decorators = [shadowRef('.button-next')];
            _$weekHeader_decorators = [shadowRef('.week-header')];
            _$content_decorators = [shadowRef('#body')];
            _$list_decorators = [shadowRef('.button-list')];
            _$loading_decorators = [shadowRef('.body-loading')];
            __esDecorate(this, null, _loading_decorators, { kind: "accessor", name: "loading", static: false, private: false, access: { has: obj => "loading" in obj, get: obj => obj.loading, set: (obj, value) => { obj.loading = value; } } }, _loading_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } } }, _max_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _mode_decorators, { kind: "accessor", name: "mode", static: false, private: false, access: { has: obj => "mode" in obj, get: obj => obj.mode, set: (obj, value) => { obj.mode = value; } } }, _mode_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _depth_decorators, { kind: "accessor", name: "depth", static: false, private: false, access: { has: obj => "depth" in obj, get: obj => obj.depth, set: (obj, value) => { obj.depth = value; } } }, _depth_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _minDepth_decorators, { kind: "accessor", name: "minDepth", static: false, private: false, access: { has: obj => "minDepth" in obj, get: obj => obj.minDepth, set: (obj, value) => { obj.minDepth = value; } } }, _minDepth_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _startDepth_decorators, { kind: "accessor", name: "startDepth", static: false, private: false, access: { has: obj => "startDepth" in obj, get: obj => obj.startDepth, set: (obj, value) => { obj.startDepth = value; } } }, _startDepth_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _startWeekOn_decorators, { kind: "accessor", name: "startWeekOn", static: false, private: false, access: { has: obj => "startWeekOn" in obj, get: obj => obj.startWeekOn, set: (obj, value) => { obj.startWeekOn = value; } } }, _startWeekOn_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _format_decorators, { kind: "accessor", name: "format", static: false, private: false, access: { has: obj => "format" in obj, get: obj => obj.format, set: (obj, value) => { obj.format = value; } } }, _format_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$title_decorators, { kind: "accessor", name: "$title", static: false, private: false, access: { has: obj => "$title" in obj, get: obj => obj.$title, set: (obj, value) => { obj.$title = value; } } }, _$title_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$prevPrev_decorators, { kind: "accessor", name: "$prevPrev", static: false, private: false, access: { has: obj => "$prevPrev" in obj, get: obj => obj.$prevPrev, set: (obj, value) => { obj.$prevPrev = value; } } }, _$prevPrev_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$prev_decorators, { kind: "accessor", name: "$prev", static: false, private: false, access: { has: obj => "$prev" in obj, get: obj => obj.$prev, set: (obj, value) => { obj.$prev = value; } } }, _$prev_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$nextNext_decorators, { kind: "accessor", name: "$nextNext", static: false, private: false, access: { has: obj => "$nextNext" in obj, get: obj => obj.$nextNext, set: (obj, value) => { obj.$nextNext = value; } } }, _$nextNext_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$next_decorators, { kind: "accessor", name: "$next", static: false, private: false, access: { has: obj => "$next" in obj, get: obj => obj.$next, set: (obj, value) => { obj.$next = value; } } }, _$next_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$weekHeader_decorators, { kind: "accessor", name: "$weekHeader", static: false, private: false, access: { has: obj => "$weekHeader" in obj, get: obj => obj.$weekHeader, set: (obj, value) => { obj.$weekHeader = value; } } }, _$weekHeader_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$list_decorators, { kind: "accessor", name: "$list", static: false, private: false, access: { has: obj => "$list" in obj, get: obj => obj.$list, set: (obj, value) => { obj.$list = value; } } }, _$list_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$loading_decorators, { kind: "accessor", name: "$loading", static: false, private: false, access: { has: obj => "$loading" in obj, get: obj => obj.$loading, set: (obj, value) => { obj.$loading = value; } } }, _$loading_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksDate = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['value'];
        }
        static get Depth() {
            return Depth;
        }
        #loading_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _loading_initializers, void 0));
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
        #minDepth_accessor_storage = __runInitializers(this, _minDepth_initializers, void 0);
        get minDepth() { return this.#minDepth_accessor_storage; }
        set minDepth(value) { this.#minDepth_accessor_storage = value; }
        #startDepth_accessor_storage = __runInitializers(this, _startDepth_initializers, void 0);
        get startDepth() { return this.#startDepth_accessor_storage; }
        set startDepth(value) { this.#startDepth_accessor_storage = value; }
        #startWeekOn_accessor_storage = __runInitializers(this, _startWeekOn_initializers, void 0);
        get startWeekOn() { return this.#startWeekOn_accessor_storage; }
        set startWeekOn(value) { this.#startWeekOn_accessor_storage = value; }
        #format_accessor_storage = __runInitializers(this, _format_initializers, void 0);
        get format() { return this.#format_accessor_storage; }
        set format(value) { this.#format_accessor_storage = value; }
        #formatter = computed(format => compile(format), [fromAttr(this, 'format')]);
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$title_accessor_storage = __runInitializers(this, _$title_initializers, void 0);
        get $title() { return this.#$title_accessor_storage; }
        set $title(value) { this.#$title_accessor_storage = value; }
        #$prevPrev_accessor_storage = __runInitializers(this, _$prevPrev_initializers, void 0);
        get $prevPrev() { return this.#$prevPrev_accessor_storage; }
        set $prevPrev(value) { this.#$prevPrev_accessor_storage = value; }
        #$prev_accessor_storage = __runInitializers(this, _$prev_initializers, void 0);
        get $prev() { return this.#$prev_accessor_storage; }
        set $prev(value) { this.#$prev_accessor_storage = value; }
        #$nextNext_accessor_storage = __runInitializers(this, _$nextNext_initializers, void 0);
        get $nextNext() { return this.#$nextNext_accessor_storage; }
        set $nextNext(value) { this.#$nextNext_accessor_storage = value; }
        #$next_accessor_storage = __runInitializers(this, _$next_initializers, void 0);
        get $next() { return this.#$next_accessor_storage; }
        set $next(value) { this.#$next_accessor_storage = value; }
        #$weekHeader_accessor_storage = __runInitializers(this, _$weekHeader_initializers, void 0);
        get $weekHeader() { return this.#$weekHeader_accessor_storage; }
        set $weekHeader(value) { this.#$weekHeader_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$list_accessor_storage = __runInitializers(this, _$list_initializers, void 0);
        get $list() { return this.#$list_accessor_storage; }
        set $list(value) { this.#$list_accessor_storage = value; }
        #$loading_accessor_storage = __runInitializers(this, _$loading_initializers, void 0);
        get $loading() { return this.#$loading_accessor_storage; }
        set $loading(value) { this.#$loading_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this._tabIndexFeature.withTabIndex(null);
            this.activeDepth = this.startDepth;
            this.#setupInitViewData();
            this.#setupNavButtons();
            this.#setupTitle();
            this.#setupDateButtons();
            this.#setupWeekHeader();
            this.#setupLoading();
            this.#setupFocus();
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
        }
        #$pool = [];
        #selected = [];
        get selected() {
            return this.#selected;
        }
        set selected(values) {
            let newValues;
            let currentValues;
            switch (this.mode) {
                case 'single': {
                    newValues = values[0] instanceof Date ? values.slice(0, 1) : [];
                    currentValues = this.#selected.slice(0, 1);
                    break;
                }
                case 'multiple': {
                    newValues = (values.every(value => value instanceof Date) ? values : []).slice(0, this.max ?? Infinity);
                    currentValues = this.#selected;
                    break;
                }
                case 'range': {
                    newValues = (values.length === 2 &&
                        values.every(date => {
                            return date instanceof Date && Helpers.maybeLeafModel(this.#dateToModel(date));
                        })
                        ? values
                        : []).sort((a, b) => a.getTime() - b.getTime());
                    currentValues = this.#selected;
                    break;
                }
            }
            if (currentValues.length === newValues.length &&
                currentValues.every((date, i) => this.dateEquals(date, newValues[i]))) {
                return;
            }
            this.#selected = newValues;
            if (this.mode === 'range') {
                if (!newValues.length) {
                    this.rangeFrom = this.rangeTo = this.maybeRangeTo = null;
                }
                else {
                    this.rangeFrom = this.#dateToModel(newValues[0]);
                    this.rangeTo = this.#dateToModel(newValues[1]);
                    this.maybeRangeTo = null;
                }
            }
            this.render();
            this.#notifyChange();
        }
        get selectedCount() {
            return this.#selected.length;
        }
        #activeDepth;
        get activeDepth() {
            return Helpers.normalizeActiveDepth(this.#activeDepth, this.minDepth, this.depth);
        }
        set activeDepth(value) {
            if (this.#activeDepth === value)
                return;
            this.#activeDepth = Helpers.normalizeActiveDepth(value, this.minDepth, this.depth);
            dispatchEvent(this, 'active-depth-change', { detail: { value } });
        }
        #activeCentury;
        get activeCentury() {
            if (this.#activeCentury != null)
                return this.#activeCentury;
        }
        set activeCentury(value) {
            const century = Helpers.normalizeNumber(value);
            if (century == null)
                return;
            if (this.#activeCentury !== century) {
                this.#activeCentury = century;
                dispatchEvent(this, 'active-century-change', { detail: { century } });
            }
        }
        #activeDecade;
        get activeDecade() {
            if (this.#activeDecade != null)
                return this.#activeDecade;
        }
        set activeDecade(value) {
            const decade = Helpers.normalizeNumber(value);
            if (decade == null)
                return;
            if (this.#activeDecade !== decade) {
                this.#activeDecade = decade;
                dispatchEvent(this, 'active-decade-change', { detail: { decade } });
            }
        }
        #activeYear;
        get activeYear() {
            return this.#activeYear;
        }
        set activeYear(value) {
            const year = Helpers.normalizeNumber(value);
            if (year == null)
                return;
            if (this.#activeYear !== year) {
                this.#activeYear = year;
                dispatchEvent(this, 'active-year-change', { detail: { year } });
            }
        }
        #activeMonth;
        get activeMonth() {
            return this.#activeMonth;
        }
        set activeMonth(value) {
            const month = Helpers.normalizeNumber(value);
            if (month == null)
                return;
            if (this.#activeMonth !== month) {
                this.#activeMonth = month;
                dispatchEvent(this, 'active-month-change', { detail: { month } });
            }
        }
        #rangeFrom;
        get rangeFrom() {
            return this.#rangeFrom;
        }
        set rangeFrom(value) {
            this.#rangeFrom = value;
            dispatchEvent(this, 'range-from-change', { detail: { value } });
        }
        #rangeTo;
        #maybeRangeTo;
        get maybeRangeTo() {
            return this.#maybeRangeTo;
        }
        set maybeRangeTo(value) {
            this.#maybeRangeTo = value;
            dispatchEvent(this, 'maybe-range-to-change', { detail: { value } });
        }
        get rangeTo() {
            return this.#rangeTo;
        }
        set rangeTo(value) {
            if (value !== null) {
                this.maybeRangeTo = null;
            }
            this.#rangeTo = value;
            dispatchEvent(this, 'range-to-change', { detail: { value } });
        }
        #disabledDate;
        get disabledDate() {
            return this.#disabledDate;
        }
        set disabledDate(value) {
            this.#disabledDate = value;
            dispatchEvent(this, 'disabled-date-change');
        }
        #badges;
        get badges() {
            return this.#badges ?? [];
        }
        set badges(value) {
            this.#badges = value;
            dispatchEvent(this, 'badges-change', { detail: { value } });
        }
        #setupInitViewData() {
            const date = Helpers.getClosestDate(this.selected) ?? new Date();
            switch (this.activeDepth) {
                case Depth.Month: {
                    this.activeMonth = date.getMonth();
                    this.activeYear = date.getFullYear();
                    return;
                }
                case Depth.Year: {
                    this.activeYear = date.getFullYear();
                    return;
                }
                case Depth.Decade: {
                    this.activeDecade = Helpers.yearToDecade(date.getFullYear());
                    return;
                }
                case Depth.Century: {
                    this.activeCentury = Helpers.yearToCentury(date.getFullYear());
                    return;
                }
            }
        }
        #setupNavButtons() {
            const render = () => {
                if (this.activeDepth === Depth.Month) {
                    this.$prevPrev.style.cssText = '';
                    this.$nextNext.style.cssText = '';
                }
                else {
                    this.$prevPrev.style.cssText = 'transfrom:scale(0,0);flex:0 0 0';
                    this.$nextNext.style.cssText = 'transfrom:scale(0,0);flex:0 0 0';
                }
            };
            this.onRender(render);
            this.onConnected(render);
            this.onConnected(() => {
                this.addEventListener('active-depth-change', render);
            });
            this.onDisconnected(() => {
                this.removeEventListener('active-depth-change', render);
            });
            const onPrev = () => {
                if (this.activeDepth === Depth.Month) {
                    this.showPrevMonth();
                }
                else if (this.activeDepth === Depth.Year) {
                    this.showPrevYear();
                }
                else if (this.activeDepth === Depth.Decade) {
                    this.showPrevDecade();
                }
                else {
                    this.showPrevCentury();
                }
            };
            const onPrevPrev = () => {
                if (this.activeDepth === Depth.Month) {
                    this.showPrevYear();
                }
            };
            const onNext = () => {
                if (this.activeDepth === Depth.Month) {
                    this.showNextMonth();
                }
                else if (this.activeDepth === Depth.Year) {
                    this.showNextYear();
                }
                else if (this.activeDepth === Depth.Decade) {
                    this.showNextDecade();
                }
                else {
                    this.showNextCentury();
                }
            };
            const onNextNext = () => {
                if (this.activeDepth === Depth.Month) {
                    this.showNextYear();
                }
            };
            this.onConnected(() => {
                this.$prevPrev.onclick = onPrevPrev;
                this.$prev.onclick = onPrev;
                this.$next.onclick = onNext;
                this.$nextNext.onclick = onNextNext;
            });
            this.onDisconnected(() => {
                this.$prevPrev.onclick = this.$prev.onclick = this.$next.onclick = this.$nextNext.onclick = null;
            });
        }
        #setupTitle() {
            const render = () => {
                let text;
                switch (this.activeDepth) {
                    case Depth.Century: {
                        text = `${Helpers.firstYearOfCentury(this.activeCentury)} ~ ${Helpers.lastYearOfCentury(this.activeCentury)}`;
                        break;
                    }
                    case Depth.Decade: {
                        text = `${Helpers.firstYearOfDecade(this.activeDecade)} ~ ${Helpers.lastYearOfDecade(this.activeDecade)}`;
                        break;
                    }
                    case Depth.Year: {
                        text = `${this.activeYear}`;
                        break;
                    }
                    default:
                        text = `${this.activeYear} / ${this.activeMonth + 1}`;
                }
                this.$title.textContent = text;
            };
            this.onRender(render);
            this.onConnected(render);
            this.onConnected(() => {
                this.addEventListener('active-depth-change', render);
                this.addEventListener('active-century-change', render);
                this.addEventListener('active-decade-change', render);
                this.addEventListener('active-year-change', render);
                this.addEventListener('active-month-change', render);
            });
            this.onDisconnected(() => {
                this.removeEventListener('active-depth-change', render);
                this.removeEventListener('active-century-change', render);
                this.removeEventListener('active-decade-change', render);
                this.removeEventListener('active-year-change', render);
                this.removeEventListener('active-month-change', render);
            });
            const onClick = (e) => {
                const target = e.target;
                if (this.$title.contains(target)) {
                    this.rollUp();
                }
            };
            this.onConnected(() => {
                this.$layout.addEventListener('click', onClick);
            });
            this.onDisconnected(() => {
                this.$layout.removeEventListener('click', onClick);
            });
        }
        #setupWeekHeader() {
            const render = () => {
                const headers = Helpers.generateWeekHeaders(this.startWeekOn);
                const $weekHeader = this.$weekHeader;
                if (this.activeDepth === Depth.Month) {
                    $weekHeader.style.height = '';
                    $weekHeader.style.opacity = '1';
                    if ($weekHeader.children.length !== 7) {
                        $weekHeader.innerHTML = headers.map(header => `<span>${header}</span>`).join('');
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
            };
            this.onConnected(render);
            this.onRender(render);
            this.onAttributeChangedDep('start-week-on', render);
            this.onConnected(() => {
                this.addEventListener('active-depth-change', render);
            });
            this.onDisconnected(() => {
                this.removeEventListener('active-depth-change', render);
            });
        }
        #setupDateButtons() {
            const getModel = ($item) => {
                return {
                    label: $item.dataset.label,
                    century: +$item.dataset.century || 0,
                    decade: +$item.dataset.decade,
                    year: +$item.dataset.year,
                    month: +$item.dataset.month,
                    date: +$item.dataset.date,
                };
            };
            const onClick = (e) => {
                const target = e.target;
                let itemModel;
                if (target.classList.contains('button-item')) {
                    itemModel = getModel(target);
                }
                else if (target.parentElement?.classList.contains('button-item')) {
                    itemModel = getModel(target.parentElement);
                }
                if (typeof itemModel?.year === 'number') {
                    if (isDisabledLeaf(itemModel) && !this.#isActiveLeaf(itemModel)) {
                        return;
                    }
                    if (!this.#isLeafDepth()) {
                        return this.drillDown(itemModel);
                    }
                    this.#selectByLeafModel(itemModel);
                }
            };
            const onMouseOver = (e) => {
                if (!this.#isLeafDepth())
                    return;
                if (!this.#isRangeMode())
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
                this.maybeRangeTo = getModel($button);
                render();
            };
            this.onConnected(() => {
                this.$layout.addEventListener('click', onClick);
                this.$layout.addEventListener('mouseover', onMouseOver);
            });
            this.onDisconnected(() => {
                this.$layout.removeEventListener('click', onClick);
                this.$layout.removeEventListener('mouseover', onMouseOver);
            });
            const includesToday = (item) => {
                const today = new Date();
                const year = today.getFullYear();
                const month = today.getMonth();
                switch (this.activeDepth) {
                    case Depth.Year:
                        return item.year === year && item.month === month;
                    case Depth.Decade:
                        return item.year === year;
                    case Depth.Century:
                        return Math.floor(year / 10) === item.decade;
                    default:
                        return false;
                }
            };
            const includesActive = (itemModel) => {
                if (!this.selectedCount)
                    return false;
                if (this.#isRangeMode()) {
                    if (this.selectedCount !== 2)
                        return false;
                    const [fromTime, toTime] = this.selected.map(date => date.getTime());
                    switch (this.activeDepth) {
                        case Depth.Year: {
                            itemModel = itemModel;
                            const t1 = Helpers.makeDate(itemModel.year, itemModel.month, 1).getTime();
                            const t2 = Helpers.makeDate(itemModel.year, (itemModel.month ?? 0) + 1, 0).getTime();
                            return fromTime <= t2 && toTime >= t1;
                        }
                        case Depth.Decade: {
                            itemModel = itemModel;
                            const t1 = Helpers.makeDate(itemModel.year, 0, 1).getTime();
                            const t2 = Helpers.makeDate(itemModel.year, 11, 31).getTime();
                            return fromTime <= t2 && toTime >= t1;
                        }
                        case Depth.Century: {
                            itemModel = itemModel;
                            const t1 = Helpers.makeDate(itemModel.decade * 10, 0, 1).getTime();
                            const t2 = Helpers.makeDate(itemModel.decade * 10 + 9, 11, 31).getTime();
                            return fromTime <= t2 && toTime >= t1;
                        }
                        default:
                            return false;
                    }
                }
                else {
                    switch (this.activeDepth) {
                        case Depth.Year:
                            return this.selected.some((t) => t.getMonth() === itemModel.month && t.getFullYear() === itemModel.year);
                        case Depth.Decade:
                            return this.selected.some((t) => t.getFullYear() === itemModel.year);
                        case Depth.Century:
                            return this.selected.some((t) => Math.floor(t.getFullYear() / 10) === itemModel.decade);
                        default:
                            return false;
                    }
                }
            };
            const isDisabledLeaf = (item) => {
                if (this.#limitReached())
                    return true;
                if (this.disabledDate) {
                    return this.disabledDate(item, {
                        depth: this.depth,
                        viewDepth: this.activeDepth,
                        component: this,
                    });
                }
                else {
                    if (this.activeDepth !== this.depth)
                        return false;
                    return false;
                }
            };
            const ensureItemCount = (n) => {
                const $list = this.$list;
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
            };
            const renderCenturyView = () => {
                const decades = Helpers.generateDecades(this.activeCentury);
                if (!decades.length)
                    return;
                ensureItemCount(10).forEach(($el, i) => {
                    const itemModel = decades[i];
                    boolSetter('disabled')($el, false);
                    $el.classList.toggle('button-item--otherMonth', false);
                    $el.classList.toggle('button-item--today', false);
                    $el.classList.toggle('button-item--active', false);
                    $el.classList.toggle('button-item--includesActive', includesActive(itemModel));
                    $el.classList.toggle('button-item--includesToday', includesToday(itemModel));
                    $el.classList.toggle('button-item--rangeFrom', false);
                    $el.classList.toggle('button-item--rangeTo', false);
                    $el.classList.toggle('button-item--rangeIn', false);
                    $el.dataset.century = itemModel.century;
                    $el.dataset.decade = itemModel.decade;
                    $el.dataset.year = null;
                    $el.dataset.month = null;
                    $el.dataset.date = null;
                    $el.dataset.label = itemModel.label;
                    $el.lastElementChild.innerHTML = itemModel.label;
                    renderBadge($el, itemModel);
                });
            };
            const renderDecadeView = () => {
                const years = Helpers.generateYears(Helpers.decadeToCentury(this.activeDecade), this.activeDecade);
                if (!years.length)
                    return;
                ensureItemCount(10).forEach(($el, i) => {
                    const itemModel = years[i];
                    if (this.depth === Depth.Decade) {
                        boolSetter('disabled')($el, !this.#isActiveLeaf(itemModel) && isDisabledLeaf(itemModel));
                    }
                    else {
                        boolSetter('disabled')($el, false);
                    }
                    $el.classList.toggle('button-item--otherMonth', false);
                    $el.classList.toggle('button-item--today', false);
                    $el.classList.toggle('button-item--active', this.#isActiveLeaf(itemModel));
                    $el.classList.toggle('button-item--includesActive', includesActive(itemModel));
                    $el.classList.toggle('button-item--includesToday', includesToday(itemModel));
                    const isRangeMode = this.#isRangeMode();
                    $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(itemModel));
                    $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(itemModel));
                    $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(itemModel));
                    $el.dataset.century = itemModel.century;
                    $el.dataset.decade = itemModel.decade;
                    $el.dataset.year = itemModel.year;
                    $el.dataset.month = null;
                    $el.dataset.date = null;
                    $el.dataset.label = itemModel.label;
                    $el.lastElementChild.innerHTML = itemModel.label;
                    renderBadge($el, itemModel);
                });
            };
            const renderYearView = () => {
                const months = Helpers.generateMonths(Helpers.yearToCentury(this.activeYear), Helpers.yearToDecade(this.activeYear), this.activeYear);
                if (!months.length)
                    return;
                ensureItemCount(12).forEach(($el, i) => {
                    const itemModel = months[i];
                    $el.classList.toggle('button-item--otherMonth', false);
                    $el.classList.toggle('button-item--today', false);
                    $el.classList.toggle('button-item--active', this.#isActiveLeaf(itemModel));
                    $el.classList.toggle('button-item--includesActive', includesActive(itemModel));
                    $el.classList.toggle('button-item--includesToday', includesToday(itemModel));
                    const isRangeMode = this.#isRangeMode();
                    $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(itemModel));
                    $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(itemModel));
                    $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(itemModel));
                    if (this.depth === Depth.Year) {
                        boolSetter('disabled')($el, !this.#isActiveLeaf(itemModel) && isDisabledLeaf(itemModel));
                    }
                    else {
                        boolSetter('disabled')($el, false);
                    }
                    $el.dataset.century = itemModel.century;
                    $el.dataset.decade = itemModel.decade;
                    $el.dataset.year = itemModel.year;
                    $el.dataset.month = itemModel.month;
                    $el.dataset.date = null;
                    $el.dataset.label = itemModel.label;
                    $el.lastElementChild.innerHTML = itemModel.label;
                    renderBadge($el, itemModel);
                });
            };
            const renderMonthView = () => {
                const dateList = Helpers.generateDates(Helpers.yearToCentury(this.activeYear), Helpers.yearToDecade(this.activeYear), this.activeYear, this.activeMonth, this.startWeekOn);
                if (!dateList.length)
                    return;
                ensureItemCount(42).forEach(($el, i) => {
                    const itemModel = dateList[i];
                    boolSetter('disabled')($el, !this.#isActiveLeaf(itemModel) && isDisabledLeaf(itemModel));
                    $el.classList.toggle('button-item--otherMonth', itemModel.month !== this.activeMonth);
                    $el.classList.toggle('button-item--today', Helpers.isToday(itemModel));
                    $el.classList.toggle('button-item--active', this.#isActiveLeaf(itemModel));
                    $el.classList.toggle('button-item--includesActive', false);
                    $el.classList.toggle('button-item--includesToday', includesToday(itemModel));
                    const isRangeMode = this.#isRangeMode();
                    $el.classList.toggle('button-item--rangeFrom', isRangeMode && this.#isRangeFrom(itemModel));
                    $el.classList.toggle('button-item--rangeTo', isRangeMode && this.#isRangeTo(itemModel));
                    $el.classList.toggle('button-item--rangeIn', isRangeMode && this.#isInRange(itemModel));
                    $el.dataset.century = itemModel.century;
                    $el.dataset.decade = itemModel.decade;
                    $el.dataset.year = itemModel.year;
                    $el.dataset.month = itemModel.month;
                    $el.dataset.date = itemModel.date;
                    $el.dataset.label = itemModel.label;
                    $el.lastElementChild.innerHTML = itemModel.label;
                    renderBadge($el, itemModel);
                });
            };
            const renderBadge = ($el, itemModel) => {
                const badges = this.getBadges(itemModel);
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
            };
            const render = () => {
                ;
                ['body-century', 'body-decade', 'body-year', 'body-month'].forEach(klass => {
                    this.$content.classList.remove(klass);
                });
                this.$content.classList.add(`body-${this.activeDepth}`);
                if (this.activeDepth === Depth.Month) {
                    renderMonthView();
                }
                else if (this.activeDepth === Depth.Year) {
                    renderYearView();
                }
                else if (this.activeDepth === Depth.Decade) {
                    renderDecadeView();
                }
                else if (this.activeDepth === Depth.Century) {
                    renderCenturyView();
                }
            };
            this.onRender(render);
            this.onConnected(render);
            this.onConnected(() => {
                this.addEventListener('badges-change', render);
                this.addEventListener('active-depth-change', render);
                this.addEventListener('active-century-change', render);
                this.addEventListener('active-decade-change', render);
                this.addEventListener('active-year-change', render);
                this.addEventListener('active-month-change', render);
                this.addEventListener('disabled-date-change', render);
            });
            this.onDisconnected(() => {
                this.removeEventListener('badges-change', render);
                this.removeEventListener('active-depth-change', render);
                this.removeEventListener('active-century-change', render);
                this.removeEventListener('active-decade-change', render);
                this.removeEventListener('active-year-change', render);
                this.removeEventListener('active-month-change', render);
                this.removeEventListener('disabled-date-change', render);
            });
        }
        #setupLoading() {
            const render = () => {
                this.$loading.style.display = this.loading ? '' : 'none';
            };
            this.onRender(render);
            this.onConnected(render);
            this.onAttributeChangedDep('loading', render);
        }
        #setupFocus() {
            const onClick = () => this.focus();
            this.onConnected(() => {
                this.$layout.addEventListener('click', onClick);
            });
            this.onConnected(() => {
                this.$layout.removeEventListener('click', onClick);
            });
        }
        clearUncompleteRange() {
            if (this.mode !== 'range')
                return;
            if (this.selected.length === 2) {
                const [from, to] = this.selected;
                const fromModel = this.#dateToModel(from);
                const toModel = this.#dateToModel(to);
                this.rangeFrom = fromModel;
                this.rangeTo = toModel;
            }
            else {
                this.rangeFrom = this.rangeTo = null;
            }
            this.render();
        }
        clearSelected() {
            this.selected = [];
        }
        deselect(selected) {
            const date = selected.value;
            this.selected = this.selected.filter(value => !this.dateEquals(value, date));
        }
        notifySelectListChange() {
            const value = this.selected.map(date => {
                return {
                    value: date,
                    label: this.#formatter.content(date),
                };
            });
            dispatchEvent(this, 'select-list:change', {
                detail: { value },
            });
        }
        #notifyChange() {
            this.notifySelectListChange();
            dispatchEvent(this, 'change', { detail: { selected: this.selected } });
        }
        #isRangeMode() {
            return this.mode === 'range';
        }
        #limitReached() {
            if (this.mode !== 'multiple' || !this.max)
                return false;
            let max = Math.trunc(Math.abs(this.max));
            if (max < 1)
                max = 1;
            const len = this.selected.length ?? 0;
            return len >= max;
        }
        #isRangeFrom(itemModel) {
            let obj = this.rangeFrom;
            if (!obj)
                return false;
            const obj2 = this.rangeTo ?? this.maybeRangeTo;
            if (obj2 && this.#leafModelToDate(obj).getTime() > this.#leafModelToDate(obj2).getTime()) {
                obj = obj2;
            }
            return ['year', 'month', 'date'].every(key => obj[key] === itemModel[key]);
        }
        #isRangeTo(itemModel) {
            let obj = this.rangeFrom;
            if (!obj)
                return false;
            const obj2 = this.rangeTo ?? this.maybeRangeTo;
            if (obj2 && this.#leafModelToDate(obj).getTime() < this.#leafModelToDate(obj2).getTime()) {
                obj = obj2;
            }
            return ['year', 'month', 'date'].every(key => obj[key] === itemModel[key]);
        }
        #isInRange(itemModel) {
            if (!this.#isLeafDepth())
                return false;
            if (!this.rangeFrom)
                return false;
            if (!this.rangeTo && !this.maybeRangeTo)
                return false;
            let inRange;
            if (this.depth === Depth.Month) {
                const model = itemModel;
                inRange = (t1, t2) => {
                    const t1Time = Helpers.makeDate(t1.getFullYear(), t1.getMonth(), t1.getDate()).getTime();
                    const t2Time = Helpers.makeDate(t2.getFullYear(), t2.getMonth(), t2.getDate()).getTime();
                    const itemTime = Helpers.makeDate(model.year, model.month, model.date).getTime();
                    return Math.min(t1Time, t2Time) <= itemTime && Math.max(t1Time, t2Time) >= itemTime;
                };
            }
            else if (this.depth === Depth.Year) {
                const model = itemModel;
                inRange = (t1, t2) => {
                    const t1Time = Helpers.makeDate(t1.getFullYear(), t1.getMonth(), 1).getTime();
                    const t2Time = Helpers.makeDate(t2.getFullYear(), t2.getMonth(), 1).getTime();
                    const itemTime = Helpers.makeDate(model.year, model.month, 1).getTime();
                    return Math.min(t1Time, t2Time) <= itemTime && Math.max(t1Time, t2Time) >= itemTime;
                };
            }
            else if (this.depth === Depth.Decade) {
                const model = itemModel;
                inRange = (t1, t2) => {
                    return (Math.min(t1.getFullYear(), t2.getFullYear()) <= model.year &&
                        Math.max(t1.getFullYear(), t2.getFullYear()) >= model.year);
                };
            }
            else {
                inRange = () => false;
            }
            const from = this.rangeFrom;
            const to = this.rangeTo ?? this.maybeRangeTo;
            if (this.depth === Depth.Month) {
                return inRange(Helpers.makeDate(from.year, from.month, from.date), Helpers.makeDate(to.year, to.month, to.date));
            }
            if (this.depth === Depth.Year) {
                return inRange(Helpers.makeDate(from.year, from.month, 1), Helpers.makeDate(to.year, to.month, 1));
            }
            if (this.depth === Depth.Decade) {
                return inRange(Helpers.makeDate(from.year, 0, 1), Helpers.makeDate(to.year, 0, 1));
            }
        }
        #isActiveLeaf(itemModel) {
            if (!this.#isLeafDepth())
                return false;
            if (this.#isRangeMode()) {
                return this.#isRangeFrom(itemModel) || this.#isRangeTo(itemModel);
            }
            const isSameDate = (item, date) => {
                return date.getFullYear() === item.year && date.getMonth() === item.month && date.getDate() === item.date;
            };
            const isSameMonth = (item, date) => {
                return date.getFullYear() === item.year && date.getMonth() === item.month;
            };
            const isSameYear = (item, date) => {
                return date.getFullYear() === item.year;
            };
            const isActive = this.depth === Depth.Month
                ? isSameDate.bind(this, itemModel)
                : this.depth === Depth.Year
                    ? isSameMonth.bind(this, itemModel)
                    : this.depth === Depth.Decade
                        ? isSameYear.bind(this, itemModel)
                        : () => false;
            if (this.mode === 'single') {
                return this.selected.some(isActive);
            }
            if (this.mode === 'multiple') {
                return this.selected.some(isActive);
            }
        }
        #isLeafDepth() {
            return this.activeDepth === this.depth;
        }
        selectByDate(date) {
            const itemModel = Helpers.dateToModel(date, this.depth);
            this.#selectByLeafModel(itemModel);
        }
        #selectByLeafModel(itemModel) {
            if (this.disabled)
                return;
            const date = Helpers.modelToDate(itemModel, this.depth);
            switch (this.mode) {
                case 'single': {
                    this.selected = [date];
                    break;
                }
                case 'multiple': {
                    const values = this.selected.slice();
                    if (this.#isActiveLeaf(itemModel)) {
                        const pred = this.activeDepth === Depth.Month
                            ? (t) => t.getDate() === itemModel.date &&
                                t.getMonth() === itemModel.month &&
                                t.getFullYear() === itemModel.year
                            : this.activeDepth === Depth.Year
                                ? (t) => t.getMonth() === itemModel.month && t.getFullYear() === itemModel.year
                                : (t) => t.getFullYear() === itemModel.year;
                        const index = values.findIndex(pred);
                        if (index !== -1)
                            values.splice(index, 1);
                    }
                    else {
                        values.push(date);
                    }
                    this.selected = values;
                    break;
                }
                case 'range': {
                    this.maybeRangeTo = null;
                    if (!this.rangeFrom || this.rangeTo) {
                        this.selected = [];
                        this.rangeFrom = itemModel;
                        this.render();
                        return;
                    }
                    this.rangeTo = itemModel;
                    this.selected = [
                        Helpers.makeDate(this.rangeFrom.year, this.activeDepth === Depth.Decade ? 0 : this.rangeFrom.month, this.activeDepth === Depth.Month ? this.rangeFrom.date : 1),
                        Helpers.makeDate(this.rangeTo.year, this.activeDepth === Depth.Decade ? 0 : this.rangeTo.month, this.activeDepth === Depth.Month ? this.rangeTo.date : 1),
                    ];
                    break;
                }
            }
        }
        drillDown(itemModel) {
            if (this.#isLeafDepth())
                return;
            switch (this.activeDepth) {
                case Depth.Year: {
                    this.activeCentury = undefined;
                    this.activeDecade = undefined;
                    this.activeYear = itemModel.year;
                    this.activeMonth = itemModel.month;
                    this.activeDepth = Depth.Month;
                    dispatchEvent(this, 'panel-change', {
                        detail: { activeDepth: this.activeDepth },
                    });
                    break;
                }
                case Depth.Decade: {
                    this.activeCentury = undefined;
                    this.activeDecade = undefined;
                    this.activeYear = itemModel.year;
                    this.activeMonth = undefined;
                    this.activeDepth = Depth.Year;
                    dispatchEvent(this, 'panel-change', {
                        detail: { activeDepth: this.activeDepth },
                    });
                    break;
                }
                default: {
                    this.activeCentury = undefined;
                    this.activeDecade = itemModel.decade;
                    this.activeYear = undefined;
                    this.activeMonth = undefined;
                    this.activeDepth = Depth.Decade;
                    dispatchEvent(this, 'panel-change', {
                        detail: { activeDepth: this.activeDepth },
                    });
                }
            }
        }
        rollUp() {
            switch (this.activeDepth) {
                case Depth.Month: {
                    const upDepth = Helpers.normalizeActiveDepth(Depth.Year, this.minDepth, this.depth);
                    if (this.activeDepth !== upDepth) {
                        this.activeCentury = undefined;
                        this.activeDecade = undefined;
                        this.activeYear = this.activeYear;
                        this.activeMonth = undefined;
                        this.activeDepth = upDepth;
                        dispatchEvent(this, 'panel-change', {
                            detail: { activeDepth: this.activeDepth },
                        });
                    }
                    break;
                }
                case Depth.Year: {
                    const upDepth = Helpers.normalizeActiveDepth(Depth.Decade, this.minDepth, this.depth);
                    if (this.activeDepth !== upDepth) {
                        this.activeCentury = undefined;
                        this.activeDecade = Helpers.yearToDecade(this.activeYear);
                        this.activeYear = undefined;
                        this.activeMonth = undefined;
                        this.activeDepth = upDepth;
                        dispatchEvent(this, 'panel-change', {
                            detail: { activeDepth: this.activeDepth },
                        });
                    }
                    break;
                }
                case Depth.Decade: {
                    const upDepth = Helpers.normalizeActiveDepth(Depth.Century, this.minDepth, this.depth);
                    if (this.activeDepth !== upDepth) {
                        this.activeCentury = Helpers.decadeToCentury(this.activeDecade);
                        this.activeDecade = undefined;
                        this.activeYear = undefined;
                        this.activeMonth = undefined;
                        this.activeDepth = upDepth;
                        dispatchEvent(this, 'panel-change', {
                            detail: { activeDepth: this.activeDepth },
                        });
                    }
                    break;
                }
            }
        }
        #leafModelToDate(itemModel) {
            return Helpers.makeDate(itemModel.year, itemModel.month || 0, itemModel.date || 1);
        }
        #dateToModel(dateObj) {
            return Helpers.dateToModel(dateObj, this.activeDepth);
        }
        showItemModel(itemModel) {
            if (Helpers.isDayModel(itemModel)) {
                this.activeDepth = Helpers.normalizeActiveDepth(Depth.Month, this.minDepth, this.depth);
                this.activeCentury = itemModel.century;
                this.activeDecade = itemModel.decade;
                this.activeYear = itemModel.year;
                this.activeMonth = itemModel.month;
            }
            else if (Helpers.isMonthModel(itemModel)) {
                this.activeDepth = Helpers.normalizeActiveDepth(Depth.Year, this.minDepth, this.depth);
                this.activeCentury = itemModel.century;
                this.activeDecade = itemModel.decade;
                this.activeYear = itemModel.year;
                this.activeMonth = itemModel.month;
            }
            else if (Helpers.isYearModel(itemModel)) {
                this.activeDepth = Helpers.normalizeActiveDepth(Depth.Decade, this.minDepth, this.depth);
                this.activeCentury = itemModel.century;
                this.activeDecade = itemModel.decade;
                this.activeYear = itemModel.year;
                this.activeMonth = itemModel.month;
            }
            else if (Helpers.isDecadeModel(itemModel)) {
                this.activeDepth = Helpers.normalizeActiveDepth(Depth.Century, this.minDepth, this.depth);
                this.activeCentury = itemModel.century;
                this.activeDecade = itemModel.decade;
                this.activeYear = itemModel.year;
                this.activeMonth = itemModel.month;
            }
        }
        showValue(dateObj) {
            this.activeDepth = this.depth;
            switch (this.depth) {
                case Depth.Month: {
                    this.activeCentury = undefined;
                    this.activeDecade = undefined;
                    this.activeYear = dateObj.getFullYear();
                    this.activeMonth = dateObj.getMonth();
                    break;
                }
                case Depth.Year: {
                    this.activeCentury = undefined;
                    this.activeDecade = undefined;
                    this.activeYear = dateObj.getFullYear();
                    this.activeMonth = undefined;
                    break;
                }
                case Depth.Decade: {
                    this.activeCentury = undefined;
                    this.activeDecade = Helpers.yearToDecade(dateObj.getFullYear());
                    this.activeYear = undefined;
                    this.activeMonth = undefined;
                    break;
                }
            }
        }
        showPrevMonth() {
            if (this.activeMonth == null)
                return;
            if (this.activeMonth > 0) {
                this.activeMonth--;
            }
            else {
                if (this.activeYear) {
                    this.activeYear--;
                }
                this.activeMonth = 11;
            }
            dispatchEvent(this, 'prev-month', {
                detail: {
                    century: this.activeCentury,
                    decade: this.activeDecade,
                    year: this.activeYear,
                    month: this.activeMonth,
                },
            });
        }
        showNextMonth() {
            if (this.activeMonth == null)
                return;
            if (this.activeMonth < 11) {
                this.activeMonth++;
            }
            else {
                if (this.activeYear) {
                    this.activeYear++;
                }
                this.activeMonth = 0;
            }
            dispatchEvent(this, 'next-month', {
                detail: {
                    century: this.activeCentury,
                    decade: this.activeDecade,
                    year: this.activeYear,
                    month: this.activeMonth,
                },
            });
        }
        showPrevYear() {
            if (typeof this.activeYear === 'number') {
                this.activeYear--;
                dispatchEvent(this, 'prev-year', {
                    detail: {
                        century: this.activeCentury,
                        decade: this.activeDecade,
                        year: this.activeYear,
                    },
                });
            }
        }
        showNextYear() {
            if (typeof this.activeYear === 'number') {
                this.activeYear++;
                dispatchEvent(this, 'next-year', {
                    detail: {
                        century: this.activeCentury,
                        decade: this.activeDecade,
                        year: this.activeYear,
                    },
                });
            }
        }
        showPrevDecade() {
            if (typeof this.activeDecade === 'number') {
                this.activeDecade--;
                dispatchEvent(this, 'prev-decade', {
                    detail: { century: this.activeCentury, decade: this.activeDecade },
                });
            }
        }
        showNextDecade() {
            if (typeof this.activeDecade === 'number') {
                this.activeDecade++;
                dispatchEvent(this, 'next-decade', {
                    detail: { century: this.activeCentury, decade: this.activeDecade },
                });
            }
        }
        showPrevCentury() {
            if (typeof this.activeCentury === 'number') {
                this.activeCentury--;
                dispatchEvent(this, 'prev-century', {
                    detail: { century: this.activeCentury },
                });
            }
        }
        showNextCentury() {
            if (typeof this.activeCentury === 'number') {
                this.activeCentury++;
                dispatchEvent(this, 'next-century', {
                    detail: { century: this.activeCentury },
                });
            }
        }
        dateEquals(a, b) {
            if (a === b)
                return true;
            return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
        }
        getBadges(item) {
            let badges;
            if (this.activeDepth === Depth.Month) {
                badges = this.badges.filter(b => item.date === b.date && item.month === b.month && b.year === item.year);
            }
            else if (this.activeDepth === Depth.Year) {
                badges = this.badges.filter(b => item.month === b.month && b.year === item.year);
            }
            else if (this.activeDepth === Depth.Decade) {
                badges = this.badges.filter(b => b.year === item.year);
            }
            else if (this.activeDepth === Depth.Century) {
                badges = this.badges.filter(b => b.year >= item.decade * 10 && b.year <= item.decade * 10 + 9);
            }
            else {
                badges = [];
            }
            return badges;
        }
    };
    return BlocksDate = _classThis;
})();
