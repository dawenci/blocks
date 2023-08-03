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
import { attr, attrs } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { dispatchEvent } from '../../common/event.js';
import { forEach } from '../../common/utils.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { style } from './style.js';
import { template, itemTemplate } from './template.js';
import { BlComponent } from '../component/Component.js';
export let BlPagination = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-pagination',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _current_decorators;
    let _current_initializers = [];
    let _pageSize_decorators;
    let _pageSize_initializers = [];
    let _total_decorators;
    let _total_initializers = [];
    let _pageSizes_decorators;
    let _pageSizes_initializers = [];
    let _size_decorators;
    let _size_initializers = [];
    let _$pager_decorators;
    let _$pager_initializers = [];
    let _$items_decorators;
    let _$items_initializers = [];
    let _$prev_decorators;
    let _$prev_initializers = [];
    let _$next_decorators;
    let _$next_initializers = [];
    let _$jump_decorators;
    let _$jump_initializers = [];
    let _$sizes_decorators;
    let _$sizes_initializers = [];
    let _$total_decorators;
    let _$total_initializers = [];
    var BlPagination = class extends BlComponent {
        static {
            _disabled_decorators = [attr('boolean')];
            _current_decorators = [attr('int')];
            _pageSize_decorators = [attr('int')];
            _total_decorators = [attr('int')];
            _pageSizes_decorators = [attr('string')];
            _size_decorators = [attrs.size];
            _$pager_decorators = [shadowRef('#pager')];
            _$items_decorators = [shadowRef('#items')];
            _$prev_decorators = [shadowRef('#prev')];
            _$next_decorators = [shadowRef('#next')];
            _$jump_decorators = [shadowRef('#jump')];
            _$sizes_decorators = [shadowRef('#sizes')];
            _$total_decorators = [shadowRef('#total')];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _current_decorators, { kind: "accessor", name: "current", static: false, private: false, access: { has: obj => "current" in obj, get: obj => obj.current, set: (obj, value) => { obj.current = value; } } }, _current_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _pageSize_decorators, { kind: "accessor", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } } }, _pageSize_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _total_decorators, { kind: "accessor", name: "total", static: false, private: false, access: { has: obj => "total" in obj, get: obj => obj.total, set: (obj, value) => { obj.total = value; } } }, _total_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _pageSizes_decorators, { kind: "accessor", name: "pageSizes", static: false, private: false, access: { has: obj => "pageSizes" in obj, get: obj => obj.pageSizes, set: (obj, value) => { obj.pageSizes = value; } } }, _pageSizes_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$pager_decorators, { kind: "accessor", name: "$pager", static: false, private: false, access: { has: obj => "$pager" in obj, get: obj => obj.$pager, set: (obj, value) => { obj.$pager = value; } } }, _$pager_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$items_decorators, { kind: "accessor", name: "$items", static: false, private: false, access: { has: obj => "$items" in obj, get: obj => obj.$items, set: (obj, value) => { obj.$items = value; } } }, _$items_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$prev_decorators, { kind: "accessor", name: "$prev", static: false, private: false, access: { has: obj => "$prev" in obj, get: obj => obj.$prev, set: (obj, value) => { obj.$prev = value; } } }, _$prev_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$next_decorators, { kind: "accessor", name: "$next", static: false, private: false, access: { has: obj => "$next" in obj, get: obj => obj.$next, set: (obj, value) => { obj.$next = value; } } }, _$next_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$jump_decorators, { kind: "accessor", name: "$jump", static: false, private: false, access: { has: obj => "$jump" in obj, get: obj => obj.$jump, set: (obj, value) => { obj.$jump = value; } } }, _$jump_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$sizes_decorators, { kind: "accessor", name: "$sizes", static: false, private: false, access: { has: obj => "$sizes" in obj, get: obj => obj.$sizes, set: (obj, value) => { obj.$sizes = value; } } }, _$sizes_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$total_decorators, { kind: "accessor", name: "$total", static: false, private: false, access: { has: obj => "$total" in obj, get: obj => obj.$total, set: (obj, value) => { obj.$total = value; } } }, _$total_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlPagination = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        static get observedAttributes() {
            return ['order'];
        }
        #disabled_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _disabled_initializers, void 0));
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #current_accessor_storage = __runInitializers(this, _current_initializers, 1);
        get current() { return this.#current_accessor_storage; }
        set current(value) { this.#current_accessor_storage = value; }
        #pageSize_accessor_storage = __runInitializers(this, _pageSize_initializers, 10);
        get pageSize() { return this.#pageSize_accessor_storage; }
        set pageSize(value) { this.#pageSize_accessor_storage = value; }
        #total_accessor_storage = __runInitializers(this, _total_initializers, 0);
        get total() { return this.#total_accessor_storage; }
        set total(value) { this.#total_accessor_storage = value; }
        #pageSizes_accessor_storage = __runInitializers(this, _pageSizes_initializers, void 0);
        get pageSizes() { return this.#pageSizes_accessor_storage; }
        set pageSizes(value) { this.#pageSizes_accessor_storage = value; }
        #size_accessor_storage = __runInitializers(this, _size_initializers, void 0);
        get size() { return this.#size_accessor_storage; }
        set size(value) { this.#size_accessor_storage = value; }
        #$pager_accessor_storage = __runInitializers(this, _$pager_initializers, void 0);
        get $pager() { return this.#$pager_accessor_storage; }
        set $pager(value) { this.#$pager_accessor_storage = value; }
        #$items_accessor_storage = __runInitializers(this, _$items_initializers, void 0);
        get $items() { return this.#$items_accessor_storage; }
        set $items(value) { this.#$items_accessor_storage = value; }
        #$prev_accessor_storage = __runInitializers(this, _$prev_initializers, void 0);
        get $prev() { return this.#$prev_accessor_storage; }
        set $prev(value) { this.#$prev_accessor_storage = value; }
        #$next_accessor_storage = __runInitializers(this, _$next_initializers, void 0);
        get $next() { return this.#$next_accessor_storage; }
        set $next(value) { this.#$next_accessor_storage = value; }
        #$jump_accessor_storage = __runInitializers(this, _$jump_initializers, void 0);
        get $jump() { return this.#$jump_accessor_storage; }
        set $jump(value) { this.#$jump_accessor_storage = value; }
        #$sizes_accessor_storage = __runInitializers(this, _$sizes_initializers, void 0);
        get $sizes() { return this.#$sizes_accessor_storage; }
        set $sizes(value) { this.#$sizes_accessor_storage = value; }
        #$total_accessor_storage = __runInitializers(this, _$total_initializers, void 0);
        get $total() { return this.#$total_accessor_storage; }
        set $total(value) { this.#$total_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this.hook.onConnected(() => {
                this.$prev.onclick = () => this._prev();
                this.$next.onclick = () => this._next();
                this.$items.onclick = e => {
                    if (this.disabled)
                        return;
                    let $button = e.target;
                    if ($button.tagName === 'BL-ICON') {
                        $button = $button.parentElement;
                    }
                    if ($button.tagName !== 'BUTTON')
                        return;
                    if ($button.classList.contains('quick-prev')) {
                        return this._quickPrev();
                    }
                    else if ($button.classList.contains('quick-next')) {
                        return this._quickNext();
                    }
                    this.current = +$button.textContent;
                };
            });
            this.hook.onDisconnected(() => {
                this.$prev.onclick = this.$next.onclick = this.$items.onclick = null;
            });
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
            this.hook.onAttributeChangedDep('current', () => {
                dispatchEvent(this, 'bl:pagination:current-change', {
                    detail: { current: this.current },
                });
            });
            this.hook.onAttributeChangedDep('page-size', () => {
                dispatchEvent(this, 'bl:pagination:page-size-change', {
                    detail: { pageSize: this.pageSize },
                });
            });
        }
        _itemPool = [];
        get showQuickJumper() {
            return;
        }
        get showSizeChanger() {
            return;
        }
        get showTotal() {
            return;
        }
        get itemCount() {
            return Math.ceil(this.total / this.pageSize);
        }
        render() {
            super.render();
            this._renderPager();
            this.$prev.disabled = this.current === 1;
            this.$next.disabled = this.current === this.itemCount;
        }
        _renderPager() {
            const showQuickPrev = this.current > 4;
            const showQuickNext = this.itemCount - this.current > 3;
            const count = this.itemCount < 8 ? this.itemCount : showQuickPrev && showQuickNext ? 9 : 8;
            this._ensureItem(count);
            const children = this.$items.children;
            forEach(children, $item => {
                if ($item.classList.contains('current')) {
                    $item.classList.remove('current');
                }
                if ($item.classList.contains('quick-prev')) {
                    $item.classList.remove('quick-prev');
                    $item.innerHTML = '';
                }
                if ($item.classList.contains('quick-next')) {
                    $item.classList.remove('quick-next');
                    $item.innerHTML = '';
                }
            });
            if (this.itemCount < 8) {
                this._ensureItem(this.itemCount);
                forEach(children, ($item, index) => {
                    const num = index + 1;
                    setTextContent($item, num);
                    $item.classList.toggle('current', num === this.current);
                });
                return;
            }
            if (!showQuickPrev) {
                for (let i = 0; i < 6; i += 1) {
                    const num = i + 1;
                    setTextContent(children[i], num);
                }
                children[6].classList.add('quick-next');
                children[6].innerHTML = '<bl-icon value="more"></bl-icon>';
                setTextContent(children[7], this.itemCount);
            }
            else if (!showQuickNext) {
                for (let i = 0; i < 6; i += 1) {
                    const num = this.itemCount - i;
                    setTextContent(children[count - (i + 1)], num);
                }
                setTextContent(children[0], 1);
                children[1].classList.add('quick-prev');
                children[1].innerHTML = '<bl-icon value="more"></bl-icon>';
            }
            else {
                setTextContent(children[0], 1);
                children[1].classList.add('quick-prev');
                children[1].innerHTML = '<bl-icon value="more"></bl-icon>';
                setTextContent(children[2], this.current - 2);
                setTextContent(children[3], this.current - 1);
                setTextContent(children[4], this.current);
                setTextContent(children[5], this.current + 1);
                setTextContent(children[6], this.current + 2);
                children[7].classList.add('quick-next');
                children[7].innerHTML = '<bl-icon value="more"></bl-icon>';
                setTextContent(children[8], this.itemCount);
            }
            forEach(children, $item => {
                const current = parseInt($item.textContent);
                $item.classList.toggle('current', current === this.current);
            });
        }
        _ensureItem(n) {
            while (this.$items.children.length < n) {
                this.$items.appendChild(this._itemPool.pop() ?? itemTemplate());
            }
            while (this.$items.children.length > n) {
                this._itemPool.push(this.$items.removeChild(this.$items.lastElementChild));
            }
            if (this._itemPool.length > 7)
                this._itemPool.length = 7;
        }
        _prev() {
            if (this.disabled || this.current === 1)
                return;
            this.current -= 1;
        }
        _next() {
            if (this.disabled || this.current === this.itemCount)
                return;
            this.current += 1;
        }
        _quickPrev() {
            const num = this.current - 5;
            this.current = num >= 1 ? num : 1;
        }
        _quickNext() {
            const num = this.current + 5;
            this.current = num <= this.itemCount ? num : this.itemCount;
        }
    };
    return BlPagination = _classThis;
})();
function setTextContent(element, value) {
    element.textContent = value;
}
