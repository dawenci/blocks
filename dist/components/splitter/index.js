import { dispatchEvent } from '../../common/event.js';
import { onDragMove } from '../../common/onDragMove.js';
import { enumGetter, enumSetter, intGetter, intSetter, numGetter, numSetter, } from '../../common/property.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { Component } from '../Component.js';
import { template } from './template.js';
export class BlocksSplitter extends Component {
    ref;
    panes = [];
    handles = [];
    static get observedAttributes() {
        return ['direction', 'handle-size'];
    }
    constructor() {
        super();
        const { comTemplate } = template();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(comTemplate.content.cloneNode(true));
        const $layout = shadowRoot.getElementById('layout');
        const $panes = shadowRoot.getElementById('panes');
        const $cover = shadowRoot.getElementById('cover');
        const $slot = $panes.querySelector('slot');
        this.ref = { $layout, $panes, $cover, $slot };
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
    get direction() {
        return (enumGetter('direction', ['horizontal', 'vertical'])(this) ?? 'horizontal');
    }
    set direction(value) {
        enumSetter('direction', ['horizontal', 'vertical'])(this, value);
    }
    get handleSize() {
        return intGetter('handle-size')(this) ?? 6;
    }
    set handleSize(value) {
        intSetter('handle-size')(this, value);
    }
    get size() {
        return this.ref.$panes[this.direction === 'horizontal' ? 'clientWidth' : 'clientHeight'];
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
    }
    renderHandles() {
        const { $layout, $cover } = this.ref;
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
        return Array.prototype.indexOf.call(this.ref.$layout.querySelectorAll('.handle'), $handle);
    }
    _initResizeEvents() {
        let startSize = 0;
        let $handle = null;
        let $pane = null;
        onDragMove(this.ref.$layout, {
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
        this.ref.$cover.style.display = visible ? 'block' : 'none';
    }
}
export class BlocksSplitterPane extends Component {
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
    get basis() {
        return numGetter('basis')(this) ?? 0;
    }
    set basis(value) {
        numSetter('basis')(this, value);
    }
    get grow() {
        return numGetter('grow')(this) ?? 1;
    }
    set grow(value) {
        numSetter('grow')(this, value);
    }
    get shrink() {
        return numGetter('shrink')(this) ?? 1;
    }
    set shrink(value) {
        numSetter('shrink')(this, value);
    }
    get max() {
        return intGetter('max')(this) ?? Infinity;
    }
    set max(value) {
        intSetter('max')(this, value);
    }
    get min() {
        return intGetter('min')(this) ?? 0;
    }
    set min(value) {
        intSetter('min')(this, value);
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
    static get observedAttributes() {
        return [
            'basis',
            'grow',
            'max',
            'min',
            'shrink',
        ];
    }
}
if (!customElements.get('bl-splitter')) {
    customElements.define('bl-splitter', BlocksSplitter);
}
if (!customElements.get('bl-splitter-pane')) {
    customElements.define('bl-splitter-pane', BlocksSplitterPane);
}
