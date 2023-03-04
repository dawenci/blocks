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
import { dispatchEvent } from '../../common/event.js';
import { onDragMove } from '../../common/onDragMove.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { customElement } from '../../decorators/customElement.js';
import { attr } from '../../decorators/attr.js';
export let BlocksSplitter = (() => {
    let _classDecorators = [customElement('bl-splitter')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _direction_decorators;
    let _direction_initializers = [];
    let _handleSize_decorators;
    let _handleSize_initializers = [];
    var BlocksSplitter = class extends Component {
        static {
            _direction_decorators = [attr('enum', { enumValues: ['horizontal', 'vertical'] })];
            _handleSize_decorators = [attr('int')];
            __esDecorate(this, null, _direction_decorators, { kind: "accessor", name: "direction", static: false, private: false, access: { has: obj => "direction" in obj, get: obj => obj.direction, set: (obj, value) => { obj.direction = value; } } }, _direction_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _handleSize_decorators, { kind: "accessor", name: "handleSize", static: false, private: false, access: { has: obj => "handleSize" in obj, get: obj => obj.handleSize, set: (obj, value) => { obj.handleSize = value; } } }, _handleSize_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksSplitter = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        panes = (__runInitializers(this, _instanceExtraInitializers), []);
        handles = [];
        static get observedAttributes() {
            return ['direction', 'handle-size'];
        }
        #direction_accessor_storage = __runInitializers(this, _direction_initializers, 'horizontal');
        get direction() { return this.#direction_accessor_storage; }
        set direction(value) { this.#direction_accessor_storage = value; }
        #handleSize_accessor_storage = __runInitializers(this, _handleSize_initializers, 6);
        get handleSize() { return this.#handleSize_accessor_storage; }
        set handleSize(value) { this.#handleSize_accessor_storage = value; }
        constructor() {
            super();
            const { comTemplate } = template();
            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(comTemplate.content.cloneNode(true));
            const $layout = shadowRoot.getElementById('layout');
            const $panes = shadowRoot.getElementById('panes');
            const $cover = shadowRoot.getElementById('cover');
            const $slot = $panes.querySelector('slot');
            this._ref = { $layout, $panes, $cover, $slot };
            $slot.addEventListener('slotchange', () => {
                this.panes = $slot
                    .assignedElements()
                    .filter($item => $item instanceof BlocksSplitterPane);
                this._renderDirection();
                this.layout();
            });
            this._initResizeEvents();
        }
        _renderDirection() {
            this.panes.forEach($pane => {
                $pane.classList.toggle('horizontal', this.direction === 'horizontal');
                $pane.classList.toggle('vertical', this.direction === 'vertical');
            });
        }
        get size() {
            return this._ref.$panes[this.direction === 'horizontal' ? 'clientWidth' : 'clientHeight'];
        }
        _offSizeObserve;
        connectedCallback() {
            super.connectedCallback();
            this.render();
            this._offSizeObserve = sizeObserve(this, this.layout.bind(this));
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            if (this._offSizeObserve) {
                this._offSizeObserve();
                this._offSizeObserve = undefined;
            }
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName === 'direction') {
                this._renderDirection();
            }
            if (attrName === 'handle-size') {
                this.layout();
            }
        }
        renderHandles() {
            const { $layout, $cover } = this._ref;
            const count = this.panes.length - 1;
            let len = $layout.querySelectorAll('.handle').length;
            const { $handleTemplate } = template();
            while (len++ < count) {
                $layout.insertBefore($handleTemplate.cloneNode(true), $cover);
            }
            len = $layout.querySelectorAll('.handle').length;
            while (len-- > count) {
                $layout.removeChild($layout.querySelector('.handle'));
            }
            this.handles = Array.prototype.slice.call($layout.querySelectorAll('.handle'));
            this.handles.forEach(($handle, index) => {
                const offset = this.getPanePosition(this.panes[index + 1]) - this.handleSize / 2;
                const sizeProp = this.direction === 'horizontal' ? 'width' : 'height';
                const posProp = this.direction === 'horizontal' ? 'left' : 'top';
                $handle.style.cssText = `${sizeProp}:${this.handleSize}px;${posProp}:${offset}px;`;
            });
        }
        getPaneSize($pane) {
            let size = $pane.size || 0;
            size = Math.max(size, $pane.min);
            size = Math.min(size, $pane.max);
            return size;
        }
        isSizeFrozen($pane) {
            return $pane.max === $pane.min;
        }
        getPanePosition($pane) {
            if (this.panes.length) {
                const index = this.panes.indexOf($pane);
                if (index !== -1) {
                    return this.panes.slice(0, index).reduce((acc, pane) => {
                        return acc + this.getPaneSize(pane);
                    }, 0);
                }
            }
            return 0;
        }
        getHandlerSize() {
            return this.handleSize;
        }
        getPaneIndex($pane) {
            return this.panes.indexOf($pane);
        }
        resizePane($pane, newSize) {
            const panes = this.panes;
            if (this.isSizeFrozen($pane))
                return;
            const index = panes.indexOf($pane);
            if (index < 1)
                return;
            const $prevPane = panes[index - 1];
            if (this.isSizeFrozen($prevPane))
                return;
            const totalSize = $pane.size + $prevPane.size;
            const splitterSize = this.size;
            const min = $pane.min;
            const max = Math.min(splitterSize, $pane.max);
            const prevMin = $prevPane.min;
            const prevMax = Math.min(splitterSize, $prevPane.max);
            let prevNewSize = totalSize - newSize;
            if (newSize < min) {
                newSize = min;
                prevNewSize = totalSize - newSize;
            }
            if (prevNewSize < prevMin) {
                prevNewSize = prevMin;
                newSize = totalSize - prevNewSize;
            }
            if (newSize > max) {
                newSize = max;
                prevNewSize = totalSize - newSize;
            }
            if (prevNewSize > prevMax) {
                prevNewSize = prevMax;
                newSize = totalSize - prevNewSize;
            }
            const offset = newSize - $pane.size;
            $pane.size = newSize;
            $prevPane.size = prevNewSize;
            $prevPane.updateStyle();
            $pane.updateStyle();
            dispatchEvent(this, 'pane-resized', {
                detail: { offset, $pane, $prevPane },
            });
            if (offset < 0) {
                if ($pane.size <= min) {
                    dispatchEvent(this, 'pane-close', { detail: { $pane } });
                }
                if ($prevPane.size === prevMin - offset) {
                    dispatchEvent(this, 'pane-open', { detail: { $pane: $prevPane } });
                }
            }
            if (offset > 0) {
                if ($pane.size === offset + min) {
                    dispatchEvent(this, 'pane-open', { detail: { $pane } });
                }
                if ($prevPane.size <= prevMin) {
                    dispatchEvent(this, 'pane-close', { detail: { $pane: $prevPane } });
                }
            }
        }
        collapsePane($pane) {
            $pane.collapseSize = $pane.size;
            this.resizePane($pane, 0);
        }
        expandPane($pane) {
            this.resizePane($pane, $pane.collapseSize || 0);
        }
        layout() {
            const sum = this.panes.reduce((acc, $pane) => acc + $pane.size, 0);
            const rest = this.size - sum;
            if (rest === 0) {
                this.panes.forEach($pane => $pane.updateStyle());
                this.renderHandles();
                dispatchEvent(this, 'layout');
                return;
            }
            if (rest > 0) {
                this._growPanes(rest, this.panes);
                dispatchEvent(this, 'layout');
                return;
            }
            this._shrinkPanes(-rest, this.panes);
            dispatchEvent(this, 'layout');
        }
        setActiveHandle($pane) {
            this.clearActiveHandle();
            const index = this.getPaneIndex($pane);
            this.handles[index] && this.handles[index].classList.add('active');
            this.handles[index - 1] && this.handles[index - 1].classList.add('active');
        }
        clearActiveHandle() {
            this.handles.forEach($handle => $handle.classList.remove('active'));
        }
        getHandleIndex($handle) {
            return Array.prototype.indexOf.call(this._ref.$layout.querySelectorAll('.handle'), $handle);
        }
        _initResizeEvents() {
            let startSize = 0;
            let $handle = null;
            let $pane = null;
            onDragMove(this._ref.$layout, {
                onStart: ({ stop, $target }) => {
                    if (!$target.classList.contains('handle')) {
                        return stop();
                    }
                    $handle = $target;
                    $pane = this.panes[this.getHandleIndex($handle) + 1];
                    (startSize = $pane.size), this.toggleCover(true);
                    $handle.classList.add('dragging');
                },
                onMove: ({ offset }) => {
                    const axis = this.direction === 'horizontal' ? 'x' : 'y';
                    const mouseOffset = offset[axis];
                    const newSize = startSize - mouseOffset;
                    this.resizePane($pane, newSize);
                    this.renderHandles();
                },
                onEnd: () => {
                    this.toggleCover(false);
                    $handle.classList.remove('dragging');
                    $handle = null;
                    $pane = null;
                },
                onCancel: () => {
                    this.toggleCover(false);
                    $handle.classList.remove('dragging');
                    $handle = null;
                    $pane = null;
                },
            });
        }
        _getGrowSize($pane) {
            if (this.isSizeFrozen($pane))
                return 0;
            if ($pane.grow <= 0)
                return 0;
            return $pane.max - $pane.size;
        }
        _getShrinkSize($pane) {
            if (this.isSizeFrozen($pane))
                return 0;
            if ($pane.shrink <= 0)
                return 0;
            return $pane.max - $pane.size;
        }
        _growPanes(rest, panes) {
            let refresh = false;
            const loop = (rest, panes) => {
                const $list = panes.filter($pane => this._getGrowSize($pane) >= 1);
                if (!$list.length)
                    return;
                refresh = true;
                const totalGrow = $list.reduce((acc, $pane) => acc + $pane.grow, 0);
                const growSizes = $list.map($pane => ($pane.grow / totalGrow) * rest);
                $list.forEach(($pane, index) => {
                    const growSize = growSizes[index];
                    const actual = Math.min(this._getGrowSize($pane), growSize);
                    $pane.size += actual;
                    rest -= actual;
                });
                if (rest >= 1) {
                    loop(rest, $list);
                }
            };
            loop(rest, panes);
            if (refresh) {
                panes.forEach($pane => $pane.updateStyle());
                this.renderHandles();
            }
        }
        _shrinkPanes(rest, panes) {
            let refresh = false;
            const loop = (rest, panes) => {
                const $list = panes.filter($pane => this._getShrinkSize($pane) >= 1);
                if (!$list.length)
                    return;
                refresh = true;
                const totalShrink = $list.reduce((acc, $pane) => acc + $pane.shrink, 0);
                const shrinkSizes = $list.map($pane => ($pane.shrink / totalShrink) * rest);
                $list.forEach(($pane, index) => {
                    const shrinkSize = shrinkSizes[index];
                    const actual = Math.min(this._getShrinkSize($pane), shrinkSize);
                    $pane.size -= actual;
                    rest -= actual;
                    $pane.updateStyle();
                });
                if (rest >= 1) {
                    loop(rest, $list);
                }
            };
            loop(rest, panes);
            if (refresh) {
                panes.forEach($pane => $pane.updateStyle());
                this.renderHandles();
            }
        }
        toggleCover(visible) {
            this._ref.$cover.style.display = visible ? 'block' : 'none';
        }
    };
    return BlocksSplitter = _classThis;
})();
export let BlocksSplitterPane = (() => {
    let _classDecorators_1 = [customElement('bl-splitter-pane')];
    let _classDescriptor_1;
    let _classExtraInitializers_1 = [];
    let _classThis_1;
    let _instanceExtraInitializers_1 = [];
    let _basis_decorators;
    let _basis_initializers = [];
    let _grow_decorators;
    let _grow_initializers = [];
    let _shrink_decorators;
    let _shrink_initializers = [];
    let _max_decorators;
    let _max_initializers = [];
    let _min_decorators;
    let _min_initializers = [];
    var BlocksSplitterPane = class extends Component {
        static {
            _basis_decorators = [attr('number')];
            _grow_decorators = [attr('number')];
            _shrink_decorators = [attr('number')];
            _max_decorators = [attr('number')];
            _min_decorators = [attr('number')];
            __esDecorate(this, null, _basis_decorators, { kind: "accessor", name: "basis", static: false, private: false, access: { has: obj => "basis" in obj, get: obj => obj.basis, set: (obj, value) => { obj.basis = value; } } }, _basis_initializers, _instanceExtraInitializers_1);
            __esDecorate(this, null, _grow_decorators, { kind: "accessor", name: "grow", static: false, private: false, access: { has: obj => "grow" in obj, get: obj => obj.grow, set: (obj, value) => { obj.grow = value; } } }, _grow_initializers, _instanceExtraInitializers_1);
            __esDecorate(this, null, _shrink_decorators, { kind: "accessor", name: "shrink", static: false, private: false, access: { has: obj => "shrink" in obj, get: obj => obj.shrink, set: (obj, value) => { obj.shrink = value; } } }, _shrink_initializers, _instanceExtraInitializers_1);
            __esDecorate(this, null, _max_decorators, { kind: "accessor", name: "max", static: false, private: false, access: { has: obj => "max" in obj, get: obj => obj.max, set: (obj, value) => { obj.max = value; } } }, _max_initializers, _instanceExtraInitializers_1);
            __esDecorate(this, null, _min_decorators, { kind: "accessor", name: "min", static: false, private: false, access: { has: obj => "min" in obj, get: obj => obj.min, set: (obj, value) => { obj.min = value; } } }, _min_initializers, _instanceExtraInitializers_1);
            __esDecorate(null, _classDescriptor_1 = { value: this }, _classDecorators_1, { kind: "class", name: this.name }, null, _classExtraInitializers_1);
            BlocksSplitterPane = _classThis_1 = _classDescriptor_1.value;
            __runInitializers(_classThis_1, _classExtraInitializers_1);
        }
        static get observedAttributes() {
            return [
                'basis',
                'grow',
                'max',
                'min',
                'shrink',
            ];
        }
        #basis_accessor_storage = (__runInitializers(this, _instanceExtraInitializers_1), __runInitializers(this, _basis_initializers, 0));
        get basis() { return this.#basis_accessor_storage; }
        set basis(value) { this.#basis_accessor_storage = value; }
        #grow_accessor_storage = __runInitializers(this, _grow_initializers, 1);
        get grow() { return this.#grow_accessor_storage; }
        set grow(value) { this.#grow_accessor_storage = value; }
        #shrink_accessor_storage = __runInitializers(this, _shrink_initializers, 1);
        get shrink() { return this.#shrink_accessor_storage; }
        set shrink(value) { this.#shrink_accessor_storage = value; }
        #max_accessor_storage = __runInitializers(this, _max_initializers, Infinity);
        get max() { return this.#max_accessor_storage; }
        set max(value) { this.#max_accessor_storage = value; }
        #min_accessor_storage = __runInitializers(this, _min_initializers, 0);
        get min() { return this.#min_accessor_storage; }
        set min(value) { this.#min_accessor_storage = value; }
        collapseSize;
        constructor() {
            super();
            const shadowRoot = this.attachShadow({ mode: 'open' });
            const { paneTemplate } = template();
            shadowRoot.appendChild(paneTemplate.content.cloneNode(true));
            this.addEventListener('mouseenter', () => {
                this.getSplitter().setActiveHandle(this);
            });
        }
        _size;
        get size() {
            return this._size ?? this.basis;
        }
        set size(value) {
            this._size = value;
        }
        getSplitter() {
            return this.closest('bl-splitter');
        }
        updateStyle() {
            const sizeProp = this.getSplitter().direction === 'horizontal' ? 'width' : 'height';
            const posProp = this.getSplitter().direction === 'horizontal' ? 'left' : 'top';
            this.style[sizeProp] = this.getSplitter().getPaneSize(this) + 'px';
            this.style[posProp] = this.getSplitter().getPanePosition(this) + 'px';
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        collapse() {
            this.getSplitter().collapsePane(this);
        }
        expand() {
            this.getSplitter().expandPane(this);
        }
    };
    return BlocksSplitterPane = _classThis_1;
})();
