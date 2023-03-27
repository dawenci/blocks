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
import '../icon/index.js';
import '../scrollable/index.js';
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { doTransitionEnter, doTransitionLeave } from '../../common/animation.js';
import { dispatchEvent } from '../../common/event.js';
import { find, findLast, forEach } from '../../common/utils.js';
import { contentTemplate, itemTemplate, loadingTemplate } from './template.js';
import { style } from './style.js';
import { BinaryIndexedTree } from './BinaryIndexedTree.js';
import { Component } from '../component/Component.js';
const FORCE_SLICE = true;
const Direction = {
    Vertical: 'vertical',
    Horizontal: 'horizontal',
};
const ITEMS_SIZE_UPDATE = 'items-size-change';
const DATA_BOUND = 'data-bound';
const DATA_VIEW_CHANGE = 'view-data-change';
const SLICE_CHANGE = 'slice-change';
export class VirtualItem {
    constructor(options) {
        this.virtualKey = options.virtualKey;
        this.height = (options.height ?? 0) >> 0;
        this.calculated = !!options.calculated;
        this.virtualViewIndex = options.virtualViewIndex ?? -1;
        this.data = options.data;
    }
}
export let BlocksVList = (() => {
    let _classDecorators = [defineClass({
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _defaultItemSize_decorators;
    let _defaultItemSize_initializers = [];
    let _shadow_decorators;
    let _shadow_initializers = [];
    let _crossSize_decorators;
    let _crossSize_initializers = [];
    var BlocksVList = class extends Component {
        static {
            _direction_decorators = [attr('enum', { enumValues: [Direction.Vertical, Direction.Horizontal] })];
            _defaultItemSize_decorators = [attr('int', {
                    defaults: (self) => {
                        const size = parseInt(getComputedStyle(self).getPropertyValue('--item-height'), 10) || 32;
                        return size;
                    },
                })];
            _shadow_decorators = [attr('boolean')];
            _crossSize_decorators = [attr('number', {
                    defaults(self) {
                        return self.viewportCrossSize;
                    },
                })];
            __esDecorate(this, null, _direction_decorators, { kind: "accessor", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } } }, _direction_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _defaultItemSize_decorators, { kind: "accessor", name: "defaultItemSize", static: false, private: false, access: { has: obj => "defaultItemSize" in obj, get: obj => obj.defaultItemSize, set: (obj, value) => { obj.defaultItemSize = value; } } }, _defaultItemSize_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _shadow_decorators, { kind: "accessor", name: "shadow", static: false, private: false, access: { has: obj => "shadow" in obj, get: obj => obj.shadow, set: (obj, value) => { obj.shadow = value; } } }, _shadow_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _crossSize_decorators, { kind: "accessor", name: "crossSize", static: false, private: false, access: { has: obj => "crossSize" in obj, get: obj => obj.crossSize, set: (obj, value) => { obj.crossSize = value; } } }, _crossSize_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksVList = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['show-busy'];
        }
        #direction_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _direction_initializers, Direction.Vertical));
        get direction() { return this.#direction_accessor_storage; }
        set direction(value) { this.#direction_accessor_storage = value; }
        #defaultItemSize_accessor_storage = __runInitializers(this, _defaultItemSize_initializers, void 0);
        get defaultItemSize() { return this.#defaultItemSize_accessor_storage; }
        set defaultItemSize(value) { this.#defaultItemSize_accessor_storage = value; }
        #shadow_accessor_storage = __runInitializers(this, _shadow_initializers, void 0);
        get shadow() { return this.#shadow_accessor_storage; }
        set shadow(value) { this.#shadow_accessor_storage = value; }
        #crossSize_accessor_storage = __runInitializers(this, _crossSize_initializers, void 0);
        get crossSize() { return this.#crossSize_accessor_storage; }
        set crossSize(value) { this.#crossSize_accessor_storage = value; }
        sliceFrom;
        sliceTo;
        anchorIndex;
        anchorOffsetRatio;
        #$pool = [];
        #rawData = [];
        isDataBound = false;
        isDataBinding = false;
        virtualData = [];
        virtualViewData = [];
        virtualSliceData = [];
        virtualDataMap = Object.create(null);
        itemHeightStore;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(contentTemplate());
            shadowRoot.appendChild(loadingTemplate());
            const $viewport = shadowRoot.getElementById('viewport');
            const $listSize = shadowRoot.getElementById('list-size');
            const $list = shadowRoot.getElementById('list');
            const $busy = shadowRoot.getElementById('loading');
            this.$viewport = $viewport;
            this.$listSize = $listSize;
            this.$list = $list;
            this.$busy = $busy;
            this.itemHeightStore = new BinaryIndexedTree({
                defaultFrequency: this.defaultItemSize,
                maxVal: 0,
            });
            this.onConnected(() => {
                this.initDomEvent();
                this.upgradeProperty(['data']);
            });
            this.onDisconnected(() => {
                if (this.clearDomEvents) {
                    this.clearDomEvents();
                }
            });
        }
        initDomEvent() {
            if (this.clearDomEvents) {
                this.clearDomEvents();
            }
            const onScroll = this._updateSliceRange.bind(this, undefined);
            this.$viewport.addEventListener('bl:scroll', onScroll);
            const onResize = () => {
                this._resetCalculated();
                this.redraw();
                this.restoreAnchor();
            };
            this.$viewport.addEventListener('bl:resize', onResize);
            this.clearDomEvents = () => {
                this.$viewport.removeEventListener('bl:scroll', onScroll);
                this.$viewport.removeEventListener('bl:resize', onResize);
                this.clearDomEvents = undefined;
            };
        }
        get data() {
            return this.#rawData;
        }
        set data(value) {
            const data = Array.isArray(value) ? value : [];
            this.bindData(data);
        }
        get viewportWidth() {
            return this.$viewport.clientWidth;
        }
        get viewportHeight() {
            return this.$viewport.clientHeight;
        }
        get viewportMainSize() {
            return this.direction === Direction.Vertical ? this.viewportHeight : this.viewportWidth;
        }
        get viewportCrossSize() {
            return this.direction === Direction.Vertical ? this.viewportWidth : this.viewportHeight;
        }
        get mainSize() {
            return this.itemHeightStore.read(this.itemHeightStore.maxVal);
        }
        get hasMainScrollbar() {
            return this.direction === Direction.Vertical
                ? this.$viewport.hasVerticalScrollbar
                : this.$viewport.hasHorizontalScrollbar;
        }
        get hasCrossScrollbar() {
            return this.direction === Direction.Vertical
                ? this.$viewport.hasHorizontalScrollbar
                : this.$viewport.hasVerticalScrollbar;
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (BlocksVList.observedAttributes.includes(attrName)) {
                this.redraw();
            }
            if (attrName === 'shadow') {
                this.$viewport.shadow = this.shadow;
            }
        }
        itemSizeMethod($node, options) {
            return options.calculated
                ? options.height
                : options.direction === Direction.Horizontal
                    ? $node.offsetWidth
                    : $node.offsetHeight;
        }
        hasKey(virtualKey) {
            return !!this.virtualDataMap[virtualKey];
        }
        render() {
            super.render();
            if (!this.isDataBound && !this.isDataBinding && this.virtualData.length) {
                this.generateViewData();
                return;
            }
            if (this.beforeRender) {
                this.beforeRender();
            }
            dispatchEvent(this, 'before-render');
            this._updateListSize();
            const renderCount = this.virtualSliceData.length;
            if (renderCount === 0) {
                this.$list.style.transform = '';
                this.$list.innerHTML = '';
                return;
            }
            const transitionItemCount = this.$list.querySelectorAll('.transition').length;
            if (this.direction === Direction.Horizontal) {
                this.$list.style.transform = `translateX(${this._itemOffset(this.sliceFrom)}px)`;
            }
            else {
                this.$list.style.transform = `translateY(${this._itemOffset(this.sliceFrom)}px)`;
            }
            const sliceItems = this.virtualSliceData;
            const getFirst = () => transitionItemCount
                ? find(this.$list.children, $item => $item.virtualViewIndex != null)
                : this.$list.firstElementChild;
            const getLast = () => transitionItemCount
                ? findLast(this.$list.children, $item => $item.virtualViewIndex != null)
                : this.$list.lastElementChild;
            const startKey = sliceItems[0].virtualViewIndex;
            const endKey = sliceItems[sliceItems.length - 1].virtualViewIndex;
            const startItemKey = getFirst()?.virtualViewIndex;
            const endItemKey = getLast()?.virtualViewIndex;
            if (endKey < endItemKey || (endKey === endItemKey && startKey < startItemKey)) {
                let $last;
                while (this.$list.children.length && ($last = getLast())?.virtualViewIndex !== endKey) {
                    $last && this.#$pool.push(this.$list.removeChild($last));
                }
                while (this.$list.children.length > renderCount + transitionItemCount) {
                    this.#$pool.push(this.$list.removeChild(this.$list.firstElementChild));
                }
                while (this.$list.children.length < renderCount + transitionItemCount) {
                    this.$list.insertBefore(this.#$pool.pop() ?? itemTemplate(), this.$list.firstElementChild);
                }
            }
            else {
                if (startKey > startItemKey || (startKey === startItemKey && endKey > endItemKey)) {
                    let $first;
                    while (this.$list.children.length && ($first = getFirst())?.virtualViewIndex !== startKey) {
                        $first && this.#$pool.push(this.$list.removeChild($first));
                    }
                }
                while (this.$list.children.length > renderCount + transitionItemCount) {
                    this.#$pool.push(this.$list.removeChild(this.$list.lastElementChild));
                }
                while (this.$list.children.length < renderCount + transitionItemCount) {
                    this.$list.appendChild(this.#$pool.pop() ?? itemTemplate());
                }
            }
            this.#$pool = [];
            let i = -1;
            let j = -1;
            while (++i < this.$list.children.length) {
                const $item = this.$list.children[i];
                if ($item.classList.contains('transition'))
                    continue;
                const vitem = sliceItems[++j];
                if (!vitem)
                    return;
                $item.virtualKey = $item.dataset.virtualKey = vitem.virtualKey;
                $item.virtualViewIndex = vitem.virtualViewIndex;
                this.itemRender($item, vitem);
            }
            this._updateSizeByItems(this.$list.children);
            if (this.afterRender) {
                this.afterRender();
            }
            dispatchEvent(this, 'after-render');
        }
        redraw() {
            this._updateListSize();
            this._updateSliceRange(FORCE_SLICE);
        }
        async bindData(data) {
            if (this.isDataBound && data === this.#rawData) {
                return;
            }
            this.#rawData = data;
            this.isDataBinding = true;
            this.$busy.style.display = '';
            await new Promise(resolve => {
                setTimeout(resolve);
            });
            const virtualData = await this.virtualMap(data);
            const virtualDataMap = Object.create(null);
            let i = virtualData.length;
            while (i--) {
                virtualDataMap[virtualData[i].virtualKey] = virtualData[i];
            }
            const oldVirtualDataMap = this.virtualDataMap;
            if (oldVirtualDataMap && this.keyMethod) {
                let i = virtualData.length;
                while (i--) {
                    const vItem = virtualData[i];
                    const oldVItem = oldVirtualDataMap[vItem.virtualKey];
                    if (oldVItem) {
                        vItem.height = oldVItem.height;
                    }
                }
            }
            this.virtualData = virtualData;
            this.virtualDataMap = virtualDataMap;
            this.$busy.style.display = 'none';
            this.isDataBinding = false;
            this.isDataBound = true;
            dispatchEvent(this, DATA_BOUND, {
                detail: { virtualData, virtualDataMap },
            });
            return this.generateViewData();
        }
        async virtualMap(data) {
            const chunkSize = 10000;
            const virtualData = [];
            const len = data.length;
            let index = 0;
            const convert = (data) => {
                const virtualKey = this.keyMethod ? this.keyMethod(data) : String(index);
                const vitem = new VirtualItem({
                    virtualKey,
                    height: this.defaultItemSize,
                    data,
                });
                virtualData.push(vitem);
            };
            return new Promise(resolve => {
                const loop = () => {
                    for (; index < len;) {
                        convert(data[index]);
                        index += 1;
                        if (index && index % chunkSize === 0) {
                            setTimeout(loop);
                            break;
                        }
                    }
                    if (index >= len) {
                        resolve(virtualData);
                    }
                };
                loop();
            });
        }
        async generateViewData() {
            const { virtualData, filterMethod, sortMethod } = this;
            let data = virtualData.slice();
            if (typeof sortMethod === 'function') {
                data = await sortMethod.call(this, data);
            }
            if (typeof filterMethod === 'function') {
                data = await filterMethod.call(this, data);
            }
            let i = virtualData.length;
            while (i--)
                virtualData[i].virtualViewIndex = -1;
            i = data.length;
            while (i--)
                data[i].virtualViewIndex = i;
            this.itemHeightStore = new BinaryIndexedTree({
                defaultFrequency: this.defaultItemSize,
                maxVal: data.length,
            });
            for (let index = 0, size = data.length; index < size; index += 1) {
                const node = data[index];
                this.itemHeightStore.writeSingle(index, 1 / node.height > 0 ? node.height : 0);
            }
            this.virtualViewData = data;
            this._updateListSize();
            this.setScrollMain(0);
            this.anchorIndex = 0;
            this.anchorOffsetRatio = 0;
            this._updateSliceRange(FORCE_SLICE);
            dispatchEvent(this, DATA_VIEW_CHANGE, {
                detail: this._pluckData(this.virtualViewData),
            });
        }
        async showByKeys(keys, withoutAnimation) {
            await this._clearTransition();
            const changes = keys
                .map(key => this.virtualDataMap[key])
                .filter(vItem => Number(vItem?.height) <= 0)
                .map(vItem => {
                const height = -vItem.height || this.defaultItemSize;
                const hasChange = this._updateSize(vItem, height);
                return hasChange ? { key: vItem.virtualKey, value: height } : null;
            })
                .filter(item => !!item);
            this._updateSliceRange(FORCE_SLICE);
            if (withoutAnimation) {
                if (changes.length) {
                    dispatchEvent(this, ITEMS_SIZE_UPDATE, {
                        detail: changes,
                    });
                }
                this.redraw();
                return;
            }
            const $collapse = document.createElement('div');
            $collapse.classList.add('transition');
            const items = [];
            let $first;
            forEach(this.$list.children, ($item) => {
                if (keys.includes($item.virtualKey)) {
                    if (!$first)
                        $first = $item;
                    items.push($item);
                }
            });
            const size = items.reduce((acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'], 0);
            this.$list.insertBefore($collapse, $first);
            items.reverse();
            while (items.length) {
                $collapse.appendChild(items.pop());
            }
            if ($collapse.children.length) {
                $collapse.style[this.direction === Direction.Horizontal ? 'width' : 'height'] = `${size}px`;
                doTransitionLeave($collapse, 'collapse', () => {
                    Array.prototype.slice.call($collapse.children).forEach($item => {
                        this.$list.insertBefore($item, $collapse);
                    });
                    this.$list.removeChild($collapse);
                    this.nextTick(() => this.redraw());
                });
            }
            if (changes.length) {
                dispatchEvent(this, ITEMS_SIZE_UPDATE, { detail: changes });
            }
        }
        async hideByKeys(keys, withoutAnimation) {
            await this._clearTransition();
            const changes = keys
                .map(key => this.virtualDataMap[key])
                .filter(vItem => Number(vItem?.height) > 0)
                .map(vItem => {
                const height = -vItem.height;
                vItem.height = height;
                const hasChange = this._updateSize(vItem, height);
                return hasChange ? { key: vItem.virtualKey, value: height } : null;
            })
                .filter(item => !!item);
            if (withoutAnimation) {
                if (changes.length) {
                    dispatchEvent(this, ITEMS_SIZE_UPDATE, { detail: changes });
                }
                this.redraw();
                return;
            }
            const $collapse = document.createElement('div');
            $collapse.classList.add('transition');
            const items = [];
            let $first;
            forEach(this.$list.children, $item => {
                if (keys.includes($item.virtualKey)) {
                    if (!$first)
                        $first = $item;
                    items.push($item);
                }
            });
            const size = items.reduce((acc, $item) => acc + $item[this.direction === Direction.Horizontal ? 'offsetWidth' : 'offsetHeight'], 0);
            if ($first) {
                this.$list.insertBefore($collapse, $first);
            }
            items.reverse();
            while (items.length) {
                $collapse.appendChild(items.pop());
            }
            if ($collapse.children.length) {
                $collapse.style[this.direction === Direction.Horizontal ? 'width' : 'height'] = `${size}px`;
                doTransitionEnter($collapse, 'collapse', () => {
                    this.$list.removeChild($collapse);
                    this.redraw();
                });
            }
            this.nextTick(() => this.redraw());
            if (changes.length) {
                dispatchEvent(this, ITEMS_SIZE_UPDATE, {
                    detail: changes,
                });
            }
        }
        showAll() {
            const changes = this.virtualViewData
                .map(vItem => {
                const height = -vItem.height || this.defaultItemSize;
                const hasChange = this._updateSize(vItem, height);
                return hasChange ? { key: vItem.virtualKey, value: height } : null;
            })
                .filter(item => !!item);
            this.redraw();
            if (changes.length) {
                dispatchEvent(this, ITEMS_SIZE_UPDATE, {
                    detail: changes,
                });
            }
        }
        nextTick(callback) {
            return Promise.resolve().then(callback);
        }
        preRenderingCount(viewportSize) {
            return 0;
        }
        preRenderingThreshold(viewportSize) {
            return 0;
        }
        scrollToIndex(anchorIndex, anchorOffsetRatio = 0) {
            if (anchorIndex >= 0 && anchorIndex < this.virtualViewData.length) {
                const start = this._itemOffset(anchorIndex);
                const offset = Math.floor(this._itemSize(anchorIndex) * anchorOffsetRatio);
                let scroll = start - offset;
                if (scroll < 0)
                    scroll = 0;
                if (scroll > this.mainSize - this.viewportMainSize)
                    scroll = this.mainSize - this.viewportMainSize;
                this.setScrollMain(scroll);
            }
        }
        backScrollToIndex(anchorIndex, anchorOffsetRatio = 0) {
            if (anchorIndex >= 0 && anchorIndex < this.virtualViewData.length) {
                const start = this._itemOffset(anchorIndex) + this._itemSize(anchorIndex) - this.viewportMainSize;
                const offset = Math.floor(this._itemSize(anchorIndex) * anchorOffsetRatio);
                let scroll = start + offset;
                if (scroll < 0)
                    scroll = 0;
                if (scroll > this.mainSize - this.viewportMainSize)
                    scroll = this.mainSize - this.viewportMainSize;
                this.setScrollMain(scroll);
            }
        }
        scrollToKey(key, anchorOffsetRatio) {
            const vitem = this.virtualDataMap[key];
            if (vitem.virtualViewIndex !== -1) {
                this.scrollToIndex(vitem.virtualViewIndex, anchorOffsetRatio);
            }
        }
        backScrollToKey(key, anchorOffsetRatio) {
            const vitem = this.virtualDataMap[key];
            if (vitem.virtualViewIndex !== -1) {
                this.backScrollToIndex(vitem.virtualViewIndex, anchorOffsetRatio);
            }
        }
        restoreAnchor() {
            if (this.anchorIndex) {
                this.scrollToIndex(this.anchorIndex, this.anchorOffsetRatio);
            }
        }
        getScrollMain() {
            return this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollLeft' : 'viewportScrollTop'];
        }
        getScrollCross() {
            return this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollTop' : 'viewportScrollLeft'];
        }
        setScrollMain(value) {
            this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollLeft' : 'viewportScrollTop'] = value;
        }
        setScrollCross(value) {
            this.$viewport[this.direction === Direction.Horizontal ? 'viewportScrollTop' : 'viewportScrollLeft'] = value;
        }
        _updateSliceRange(forceUpdate) {
            const viewportSize = this.direction === Direction.Horizontal ? this.$viewport.clientWidth : this.$viewport.clientHeight;
            const viewportStart = this.direction === Direction.Horizontal ? this.$viewport.viewportScrollLeft : this.$viewport.viewportScrollTop;
            const range = this._calcSliceRange(viewportSize, viewportStart);
            if (range.sliceFrom === this.sliceFrom && range.sliceTo === this.sliceTo && !forceUpdate) {
                return;
            }
            this.anchorIndex = range.sliceFrom;
            this.anchorOffsetRatio = range.anchorOffsetRatio;
            const COUNT = this.preRenderingCount(viewportSize);
            const THRESHOLD = this.preRenderingThreshold(viewportSize);
            const MAX = this.virtualViewData.length;
            let fromThreshold = range.sliceFrom - THRESHOLD;
            if (fromThreshold < 0)
                fromThreshold = 0;
            let toThreshold = range.sliceTo + THRESHOLD;
            if (toThreshold > MAX)
                toThreshold = MAX;
            if (!forceUpdate && this.sliceFrom <= fromThreshold && this.sliceTo >= toThreshold) {
                return;
            }
            let { sliceFrom, sliceTo } = range;
            sliceFrom = sliceFrom > COUNT ? sliceFrom - COUNT : 0;
            sliceTo = sliceTo + COUNT > MAX ? MAX : sliceTo + COUNT;
            const shouldDoSlice = forceUpdate || this.sliceFrom !== sliceFrom || this.sliceTo !== sliceTo;
            this.sliceFrom = sliceFrom;
            this.sliceTo = sliceTo;
            if (shouldDoSlice) {
                this._doSlice(sliceFrom, sliceTo);
            }
        }
        _calcSliceRange(viewportSize, viewportStart) {
            if (!this.virtualViewData.length) {
                return { sliceFrom: 0, sliceTo: 0, anchorOffsetRatio: 0 };
            }
            const MIN_INDEX = 0;
            const MAX_INDEX = this.virtualViewData.length - 1;
            const viewportEnd = viewportStart + viewportSize;
            const estimatedItemSize = this.defaultItemSize;
            let min = MIN_INDEX;
            let max = MAX_INDEX;
            let itemTop;
            let itemOffset;
            let itemHeight;
            let itemBottom;
            let anchorOffsetRatio;
            let loopTime = 10000;
            let sliceFrom = Math.floor(viewportStart / estimatedItemSize);
            if (sliceFrom > MAX_INDEX)
                sliceFrom = MAX_INDEX;
            while (sliceFrom >= MIN_INDEX && sliceFrom <= MAX_INDEX) {
                if (!loopTime--) {
                    console.warn('可能存在死循环');
                    break;
                }
                itemTop = this._itemOffset(sliceFrom);
                itemHeight = this._itemSize(sliceFrom);
                itemOffset = itemTop - viewportStart;
                anchorOffsetRatio = itemOffset / itemHeight;
                if (itemOffset > 0) {
                    max = Math.min(sliceFrom, max);
                    const diff1 = itemOffset / ((itemTop + estimatedItemSize) / (sliceFrom + 1));
                    const halfDiff1 = Math.ceil(Math.min(diff1 / 2, (max - min) / 2));
                    sliceFrom -= halfDiff1;
                    if (sliceFrom < MIN_INDEX)
                        sliceFrom = MIN_INDEX;
                    continue;
                }
                if (itemOffset === 0)
                    break;
                if (-itemOffset < itemHeight)
                    break;
                {
                    min = Math.max(sliceFrom, min);
                    const diff2 = -itemOffset / ((itemTop + estimatedItemSize) / (sliceFrom + 1));
                    const halfDiff2 = Math.ceil(Math.min(diff2 / 2, (max - min) / 2));
                    sliceFrom += halfDiff2;
                    if (sliceFrom > MAX_INDEX)
                        sliceFrom = MAX_INDEX;
                }
            }
            loopTime = 10000;
            min = MIN_INDEX;
            max = MAX_INDEX;
            let sliceTo = sliceFrom + Math.floor(viewportSize / estimatedItemSize);
            if (sliceTo > MAX_INDEX)
                sliceTo = MAX_INDEX;
            while (sliceTo > MIN_INDEX && sliceTo <= MAX_INDEX) {
                if (!loopTime--) {
                    console.warn('可能存在死循环');
                    break;
                }
                itemTop = this._itemOffset(sliceTo);
                itemHeight = this._itemSize(sliceTo);
                itemBottom = itemTop + itemHeight;
                itemOffset = itemBottom - viewportEnd;
                if (itemOffset < 0) {
                    min = Math.max(sliceTo, min);
                    const diff3 = -itemOffset / ((itemTop + estimatedItemSize) / (sliceTo + 1));
                    const halfDiff3 = Math.ceil(Math.min(diff3 / 2, (max - min) / 2));
                    sliceTo += halfDiff3;
                    if (sliceTo >= MAX_INDEX) {
                        break;
                    }
                    continue;
                }
                if (itemOffset === 0)
                    break;
                if (itemOffset < itemHeight)
                    break;
                {
                    max = Math.min(sliceTo, max);
                    const diff4 = itemOffset / ((itemTop + estimatedItemSize) / (sliceTo + 1));
                    const halfDiff4 = Math.ceil(Math.min(diff4 / 2, (max - min) / 2));
                    sliceTo -= halfDiff4;
                    if (sliceTo < sliceFrom)
                        sliceTo = sliceFrom;
                }
            }
            sliceTo += 1;
            return { sliceFrom, sliceTo, anchorOffsetRatio };
        }
        _doSlice(fromIndex, toIndex) {
            const virtualViewItems = this.virtualViewData;
            const slice = [];
            for (let i = fromIndex; i < toIndex; i += 1) {
                const vItem = virtualViewItems[i];
                if (vItem.height > 0)
                    slice.push(vItem);
            }
            const oldSlice = this.virtualSliceData.slice();
            this.virtualSliceData = slice;
            dispatchEvent(this, SLICE_CHANGE, {
                detail: {
                    slice: this._pluckData(slice),
                    oldSlice: this._pluckData(oldSlice),
                },
            });
            this.render();
        }
        _updateSizeByItems(nodeItems) {
            if (!nodeItems?.length)
                return;
            const batch = [];
            forEach(nodeItems, $node => {
                const vItem = this.getVirtualItemByNode($node);
                if (!vItem)
                    return;
                const height = this.itemSizeMethod($node, {
                    virtualKey: vItem.virtualKey,
                    height: vItem.height,
                    calculated: vItem.calculated,
                    virtualViewIndex: vItem.virtualViewIndex,
                    direction: this.direction,
                }) >> 0;
                if (height === 0)
                    return;
                if (vItem.height === height) {
                    vItem.calculated = true;
                }
                else {
                    batch.push({ vItem, height, calculated: true });
                }
            });
            if (batch.length) {
                this._batchUpdateHeight(batch);
            }
        }
        _batchUpdateHeight(records) {
            const changes = records
                .map(({ vItem, height, calculated }) => {
                const hasChange = this._updateSize(vItem, height, calculated);
                return hasChange ? { key: vItem.virtualKey, value: height } : null;
            })
                .filter(item => !!item);
            if (changes.length) {
                this._updateListSize();
                this._updateSliceRange(true);
                dispatchEvent(this, ITEMS_SIZE_UPDATE, {
                    detail: changes,
                });
            }
        }
        _updateSize(vItem, height, calculated) {
            height = height >> 0;
            const hasChange = height !== vItem.height;
            vItem.height = height;
            if (calculated != null) {
                vItem.calculated = calculated;
            }
            const index = vItem.virtualViewIndex;
            if (index !== -1) {
                this.itemHeightStore.writeSingle(index, height > 0 ? height : 0);
            }
            return hasChange;
        }
        getVirtualItemByNode($node) {
            return this.virtualDataMap[$node.virtualKey];
        }
        getVirtualItemByKey(virtualKey) {
            return this.virtualDataMap[virtualKey];
        }
        getNodeByVirtualKey(virtualKey) {
            return this.$list.querySelector(`[data-virtual-key="${virtualKey}"]`);
        }
        _pluckData(virtualData) {
            const data = [];
            for (let i = 0, len = virtualData.length; i < len; i += 1) {
                data.push(virtualData[i].data);
            }
            return data;
        }
        _updateListSize() {
            const { itemHeightStore } = this;
            if (itemHeightStore) {
                if (this.direction === Direction.Horizontal) {
                    this.$list.style.width = '';
                    this.$list.style.height = this.$listSize.style.height = this.crossSize ? `${this.crossSize}px` : '';
                    this.$listSize.style.width = `${itemHeightStore.read(itemHeightStore.maxVal)}px`;
                }
                else {
                    this.$list.style.height = '';
                    this.$list.style.width = this.$listSize.style.width = this.crossSize ? `${this.crossSize}px` : '';
                    this.$listSize.style.height = `${itemHeightStore.read(itemHeightStore.maxVal)}px`;
                }
            }
            this.$viewport.toggleViewportClass('main-scrollbar', this.hasMainScrollbar);
            this.$viewport.toggleViewportClass('cross-scrollbar', this.hasCrossScrollbar);
        }
        _resetCalculated() {
            const virtualData = this.virtualData;
            let i = virtualData.length;
            while (i--)
                virtualData[i].calculated = false;
        }
        _itemSize(index) {
            if (index >= this.itemHeightStore.maxVal)
                index = this.itemHeightStore.maxVal - 1;
            return this.itemHeightStore.readSingle(index);
        }
        _itemOffset(index) {
            return this.itemHeightStore.read(index);
        }
        _clearTransition() {
            let flag = false;
            forEach(this.$list.querySelectorAll('.transition'), $transition => {
                flag = true;
                $transition.className = 'transition';
            });
            if (!flag)
                return Promise.resolve(flag);
            return new Promise(resolve => setTimeout(() => resolve(flag), 50));
        }
        addEventListener(type, listener, options) {
            super.addEventListener(type, listener, options);
        }
        removeEventListener(type, listener, options) {
            super.removeEventListener(type, listener, options);
        }
    };
    return BlocksVList = _classThis;
})();
