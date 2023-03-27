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
import { attr } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { onDragMove } from '../../common/onDragMove.js';
import { setStyles } from '../../common/style.js';
import { shadowRef } from '../../decorators/shadowRef.js';
import { sizeObserve } from '../../common/sizeObserve.js';
import { style } from './style.js';
import { template } from './template.js';
import { Component } from '../component/Component.js';
export let BlocksScrollable = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-scrollable',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _shadow_decorators;
    let _shadow_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$viewport_decorators;
    let _$viewport_initializers = [];
    let _$horizontal_decorators;
    let _$horizontal_initializers = [];
    let _$vertical_decorators;
    let _$vertical_initializers = [];
    let _$horizontalThumb_decorators;
    let _$horizontalThumb_initializers = [];
    let _$verticalThumb_decorators;
    let _$verticalThumb_initializers = [];
    var BlocksScrollable = class extends Component {
        static {
            _shadow_decorators = [attr('boolean')];
            _$layout_decorators = [shadowRef('[part="layout"]')];
            _$viewport_decorators = [shadowRef('[part="viewport"]')];
            _$horizontal_decorators = [shadowRef('[part="horizontal-track"]')];
            _$vertical_decorators = [shadowRef('[part="vertical-track"]')];
            _$horizontalThumb_decorators = [shadowRef('[part="horizontal-thumb"]')];
            _$verticalThumb_decorators = [shadowRef('[part="vertical-thumb"]')];
            __esDecorate(this, null, _shadow_decorators, { kind: "accessor", name: "shadow", static: false, private: false, access: { has: obj => "shadow" in obj, get: obj => obj.shadow, set: (obj, value) => { obj.shadow = value; } } }, _shadow_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$viewport_decorators, { kind: "accessor", name: "$viewport", static: false, private: false, access: { has: obj => "$viewport" in obj, get: obj => obj.$viewport, set: (obj, value) => { obj.$viewport = value; } } }, _$viewport_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$horizontal_decorators, { kind: "accessor", name: "$horizontal", static: false, private: false, access: { has: obj => "$horizontal" in obj, get: obj => obj.$horizontal, set: (obj, value) => { obj.$horizontal = value; } } }, _$horizontal_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$vertical_decorators, { kind: "accessor", name: "$vertical", static: false, private: false, access: { has: obj => "$vertical" in obj, get: obj => obj.$vertical, set: (obj, value) => { obj.$vertical = value; } } }, _$vertical_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$horizontalThumb_decorators, { kind: "accessor", name: "$horizontalThumb", static: false, private: false, access: { has: obj => "$horizontalThumb" in obj, get: obj => obj.$horizontalThumb, set: (obj, value) => { obj.$horizontalThumb = value; } } }, _$horizontalThumb_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$verticalThumb_decorators, { kind: "accessor", name: "$verticalThumb", static: false, private: false, access: { has: obj => "$verticalThumb" in obj, get: obj => obj.$verticalThumb, set: (obj, value) => { obj.$verticalThumb = value; } } }, _$verticalThumb_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksScrollable = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #shadow_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _shadow_initializers, void 0));
        get shadow() { return this.#shadow_accessor_storage; }
        set shadow(value) { this.#shadow_accessor_storage = value; }
        #draggingFlag;
        #canScrollLeft;
        #canScrollRight;
        #canScrollTop;
        #canScrollBottom;
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$viewport_accessor_storage = __runInitializers(this, _$viewport_initializers, void 0);
        get $viewport() { return this.#$viewport_accessor_storage; }
        set $viewport(value) { this.#$viewport_accessor_storage = value; }
        #$horizontal_accessor_storage = __runInitializers(this, _$horizontal_initializers, void 0);
        get $horizontal() { return this.#$horizontal_accessor_storage; }
        set $horizontal(value) { this.#$horizontal_accessor_storage = value; }
        #$vertical_accessor_storage = __runInitializers(this, _$vertical_initializers, void 0);
        get $vertical() { return this.#$vertical_accessor_storage; }
        set $vertical(value) { this.#$vertical_accessor_storage = value; }
        #$horizontalThumb_accessor_storage = __runInitializers(this, _$horizontalThumb_initializers, void 0);
        get $horizontalThumb() { return this.#$horizontalThumb_accessor_storage; }
        set $horizontalThumb(value) { this.#$horizontalThumb_accessor_storage = value; }
        #$verticalThumb_accessor_storage = __runInitializers(this, _$verticalThumb_initializers, void 0);
        get $verticalThumb() { return this.#$verticalThumb_accessor_storage; }
        set $verticalThumb(value) { this.#$verticalThumb_accessor_storage = value; }
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            const $layout = shadowRoot.getElementById('layout');
            const $viewport = shadowRoot.getElementById('viewport');
            const $horizontal = shadowRoot.getElementById('horizontal');
            const $horizontalThumb = $horizontal.firstElementChild;
            const $vertical = shadowRoot.getElementById('vertical');
            const $verticalThumb = $vertical.firstElementChild;
            this._ref = {
                $layout,
                $viewport,
                $horizontal,
                $horizontalThumb,
                $vertical,
                $verticalThumb,
            };
            $layout.onmouseenter = () => {
                this._updateScrollbar();
            };
            sizeObserve($layout, size => {
                this._updateScrollbar();
                dispatchEvent(this, 'bl:resize', { detail: size });
            });
            this._initMoveEvents();
            $viewport.onscroll = () => {
                if (!this.#draggingFlag) {
                    this._updateScrollbar();
                }
                dispatchEvent(this, 'bl:scroll');
            };
            this.onConnected(this.render);
        }
        get canScrollLeft() {
            return this.#canScrollLeft;
        }
        set canScrollLeft(value) {
            if (this.#canScrollLeft !== value) {
                this.#canScrollLeft = value;
                this.$layout.classList.toggle('shadow-left', value);
                dispatchEvent(this, 'bl:change:can-scroll-left', { detail: { value } });
            }
        }
        get canScrollRight() {
            return this.#canScrollRight;
        }
        set canScrollRight(value) {
            if (this.#canScrollRight !== value) {
                this.#canScrollRight = value;
                this.$layout.classList.toggle('shadow-right', this.canScrollRight);
                dispatchEvent(this, 'bl:change:can-scroll-right', { detail: { value } });
            }
        }
        get canScrollTop() {
            return this.#canScrollTop;
        }
        set canScrollTop(value) {
            if (this.#canScrollTop !== value) {
                this.#canScrollTop = value;
                this.$layout.classList.toggle('shadow-top', this.canScrollTop);
                dispatchEvent(this, 'bl:change:can-scroll-top', { detail: { value } });
            }
        }
        get canScrollBottom() {
            return this.#canScrollBottom;
        }
        set canScrollBottom(value) {
            if (this.#canScrollBottom !== value) {
                this.#canScrollBottom = value;
                this.$layout.classList.toggle('shadow-bottom', this.canScrollBottom);
                dispatchEvent(this, 'bl:change:can-scroll-bottom', { detail: { value } });
            }
        }
        get viewportScrollLeft() {
            return this.$viewport.scrollLeft;
        }
        set viewportScrollLeft(value) {
            this.$viewport.scrollLeft = value;
            this._updateScrollbar();
        }
        get viewportScrollTop() {
            return this.$viewport.scrollTop;
        }
        set viewportScrollTop(value) {
            this.$viewport.scrollTop = value;
            this._updateScrollbar();
        }
        get hasVerticalScrollbar() {
            return this.$viewport.scrollHeight > this.$viewport.clientHeight;
        }
        get hasHorizontalScrollbar() {
            return this.$viewport.scrollWidth > this.$viewport.clientWidth;
        }
        toggleViewportClass(className, value) {
            this.$viewport.classList.toggle(className, value);
        }
        _updateScrollbar() {
            const { clientWidth: viewportWidth, clientHeight: viewportHeight, scrollWidth: contentWidth, scrollHeight: contentHeight, scrollTop: contentTopSpace, scrollLeft: contentLeftSpace, } = this.$viewport;
            const showHorizontal = contentWidth > viewportWidth;
            const showVertical = contentHeight > viewportHeight;
            if (showHorizontal) {
                this.$horizontal.style.display = 'block';
                const trackWidth = this.$horizontal.clientWidth;
                const contentRightSpace = contentWidth - contentLeftSpace - viewportWidth;
                const thumbWidth = Math.max(Math.round((viewportWidth / contentWidth) * trackWidth), 20);
                const horizontalTrackSpace = trackWidth - thumbWidth;
                const thumbLeft = horizontalTrackSpace * (contentLeftSpace / (contentLeftSpace + contentRightSpace));
                setStyles(this.$horizontalThumb, {
                    transform: `translateX(${thumbLeft}px)`,
                    width: `${thumbWidth}px`,
                });
                this._updateShadowState();
                this._udpateScrollbarState();
            }
            else {
                this.$horizontal.style.display = 'none';
            }
            if (showVertical) {
                this.$vertical.style.display = 'block';
                const trackHeight = this.$vertical.clientHeight;
                const contentBottomSpace = contentHeight - contentTopSpace - viewportHeight;
                const thumbHeight = Math.max(Math.round((viewportHeight / contentHeight) * trackHeight), 20);
                const verticalTrackSpace = trackHeight - thumbHeight;
                const thumbTop = verticalTrackSpace * (contentTopSpace / (contentTopSpace + contentBottomSpace));
                setStyles(this.$verticalThumb, {
                    transform: `translateY(${thumbTop}px)`,
                    height: `${thumbHeight}px`,
                });
                this._updateShadowState();
                this._udpateScrollbarState();
            }
            else {
                this.$vertical.style.display = 'none';
            }
        }
        _updateScrollable() {
            const { clientWidth: viewportWidth, clientHeight: viewportHeight, scrollWidth: contentWidth, scrollHeight: contentHeight, } = this.$viewport;
            const trackWidth = this.$horizontal.clientWidth;
            const trackHeight = this.$vertical.clientHeight;
            const thumbWidth = this.$horizontalThumb.offsetWidth;
            const thumbHeight = this.$verticalThumb.offsetHeight;
            const thumbTop = this._getThumbTop();
            const thumbLeft = this._getThumbLeft();
            const verticalTrackSpace = trackHeight - thumbHeight;
            const verticalContentSpace = contentHeight - viewportHeight;
            const contentOffsetTop = (thumbTop / verticalTrackSpace) * verticalContentSpace;
            const horizontalTrackSpace = trackWidth - thumbWidth;
            const horizontalContentSpace = contentWidth - viewportWidth;
            const contentOffsetLeft = (thumbLeft / horizontalTrackSpace) * horizontalContentSpace;
            this.$viewport.scrollTop = contentOffsetTop;
            this.$viewport.scrollLeft = contentOffsetLeft;
        }
        _getThumbTop() {
            return parseFloat((this.$verticalThumb.style.transform ?? '').slice(11, -3)) || 0;
        }
        _getThumbLeft() {
            return parseFloat((this.$horizontalThumb.style.transform ?? '').slice(11, -3)) || 0;
        }
        getScrollableTop() {
            return this.$viewport.scrollTop;
        }
        getScrollableRight() {
            const $viewport = this.$viewport;
            return $viewport.scrollWidth - ($viewport.scrollLeft + $viewport.clientWidth);
        }
        getScrollableBottom() {
            const $viewport = this.$viewport;
            return $viewport.scrollHeight - ($viewport.scrollTop + $viewport.clientHeight);
        }
        getScrollableLeft() {
            this.$viewport.scrollLeft;
        }
        _updateShadowState() {
            const { scrollLeft, scrollTop, scrollWidth, scrollHeight, clientWidth, clientHeight } = this.$viewport;
            this.canScrollLeft = scrollLeft > 0;
            this.canScrollRight = scrollWidth - (scrollLeft + clientWidth) > 0;
            this.canScrollTop = scrollTop > 0;
            this.canScrollBottom = scrollHeight - (scrollTop + clientHeight) > 0;
        }
        _udpateScrollbarState() {
            this.$layout.classList.toggle('vertical-scrollbar', this.hasVerticalScrollbar);
            this.$layout.classList.toggle('horizontal-scrollbar', this.hasHorizontalScrollbar);
        }
        _initMoveEvents() {
            let isVertical = false;
            let startThumbPosition;
            let startMousePosition;
            const onMove = ({ preventDefault, stopImmediatePropagation, current }) => {
                preventDefault();
                stopImmediatePropagation();
                if (isVertical) {
                    const trackHeight = this.$vertical.clientHeight;
                    const thumbHeight = this.$verticalThumb.offsetHeight;
                    let thumbTop = startThumbPosition + (current.pageY - startMousePosition);
                    if (thumbTop === 0 || thumbTop + thumbHeight === trackHeight)
                        return;
                    if (thumbTop < 0)
                        thumbTop = 0;
                    if (thumbTop + thumbHeight > trackHeight)
                        thumbTop = trackHeight - thumbHeight;
                    this.$verticalThumb.style.transform = `translateY(${thumbTop}px)`;
                }
                else {
                    const trackWidth = this.$horizontal.clientWidth;
                    const thumbWidth = this.$horizontalThumb.offsetWidth;
                    let thumbLeft = startThumbPosition + (current.pageX - startMousePosition);
                    if (thumbLeft === 0 || thumbLeft + thumbWidth === trackWidth)
                        return;
                    if (thumbLeft < 0)
                        thumbLeft = 0;
                    if (thumbLeft + thumbWidth > trackWidth)
                        thumbLeft = trackWidth - thumbWidth;
                    this.$horizontalThumb.style.transform = `translateX(${thumbLeft}px)`;
                }
                this._updateShadowState();
                this._udpateScrollbarState();
                this._updateScrollable();
            };
            const onEnd = () => {
                this.#draggingFlag = false;
                dispatchEvent(this, 'bl:drag-scroll-end');
                this.$layout.classList.remove('dragging', 'dragging-vertical');
                this.$layout.classList.remove('dragging', 'dragging-horizontal');
            };
            const onStart = ({ preventDefault, stopImmediatePropagation, $target, start }) => {
                preventDefault();
                stopImmediatePropagation();
                this.#draggingFlag = true;
                isVertical = this.$vertical.contains($target);
                if ($target.tagName !== 'B') {
                    if (isVertical) {
                        const middle = start.clientY - this.$vertical.getBoundingClientRect().top;
                        const thumbHeight = this.$verticalThumb.offsetHeight;
                        let thumbTop = middle - thumbHeight / 2;
                        if (thumbTop < 0)
                            thumbTop = 0;
                        if (thumbTop + thumbHeight > this.$vertical.clientHeight)
                            thumbTop = this.$vertical.clientHeight - thumbHeight;
                        this.$verticalThumb.style.transform = `translateY(${thumbTop}px)`;
                    }
                    else {
                        const center = start.clientX - this.$horizontal.getBoundingClientRect().left;
                        const thumbWidth = this.$horizontalThumb.offsetWidth;
                        let thumbLeft = center - thumbWidth / 2;
                        if (thumbLeft < 0)
                            thumbLeft = 0;
                        if (thumbLeft + thumbWidth > this.$horizontal.clientWidth)
                            thumbLeft = this.$horizontal.clientWidth - thumbWidth;
                        this.$horizontalThumb.style.transform = `translateX(${thumbLeft}px)`;
                    }
                    this._updateShadowState();
                    this._udpateScrollbarState();
                    this._updateScrollable();
                    return;
                }
                if (isVertical) {
                    this.$layout.classList.add('dragging', 'dragging-vertical');
                    startThumbPosition = this._getThumbTop();
                    startMousePosition = start.pageY;
                }
                else {
                    this.$layout.classList.add('dragging', 'dragging-horizontal');
                    startThumbPosition = this._getThumbLeft();
                    startMousePosition = start.pageX;
                }
                dispatchEvent(this, 'drag-scroll-start');
            };
            onDragMove(this.$vertical, {
                onStart,
                onMove,
                onEnd,
            });
            onDragMove(this.$horizontal, {
                onStart,
                onMove,
                onEnd,
            });
        }
    };
    return BlocksScrollable = _classThis;
})();
