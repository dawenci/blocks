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
import { attr, attrs } from '../../decorators/attr.js';
import { defineClass } from '../../decorators/defineClass.js';
import { dispatchEvent } from '../../common/event.js';
import { forEach } from '../../common/utils.js';
import { style } from './style.js';
import { template } from './template.js';
import { Component } from '../component/Component.js';
export let BlocksPagination = (() => {
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
    var BlocksPagination = class extends Component {
        static {
            _disabled_decorators = [attr('boolean')];
            _current_decorators = [attr('int')];
            _pageSize_decorators = [attr('int')];
            _total_decorators = [attr('int')];
            _pageSizes_decorators = [attr('string')];
            _size_decorators = [attrs.size];
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _current_decorators, { kind: "accessor", name: "current", static: false, private: false, access: { has: obj => "current" in obj, get: obj => obj.current, set: (obj, value) => { obj.current = value; } } }, _current_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _pageSize_decorators, { kind: "accessor", name: "pageSize", static: false, private: false, access: { has: obj => "pageSize" in obj, get: obj => obj.pageSize, set: (obj, value) => { obj.pageSize = value; } } }, _pageSize_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _total_decorators, { kind: "accessor", name: "total", static: false, private: false, access: { has: obj => "total" in obj, get: obj => obj.total, set: (obj, value) => { obj.total = value; } } }, _total_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _pageSizes_decorators, { kind: "accessor", name: "pageSizes", static: false, private: false, access: { has: obj => "pageSizes" in obj, get: obj => obj.pageSizes, set: (obj, value) => { obj.pageSizes = value; } } }, _pageSizes_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _size_decorators, { kind: "accessor", name: "size", static: false, private: false, access: { has: obj => "size" in obj, get: obj => obj.size, set: (obj, value) => { obj.size = value; } } }, _size_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksPagination = _classThis = _classDescriptor.value;
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
        _itemPool = [];
        constructor() {
            super();
            const { comTemplate } = template();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(comTemplate.content.cloneNode(true));
            const $pager = shadowRoot.getElementById('pager');
            const $items = shadowRoot.getElementById('items');
            const $prev = shadowRoot.getElementById('prev');
            const $next = shadowRoot.getElementById('next');
            const $jump = shadowRoot.getElementById('jump');
            const $sizes = shadowRoot.getElementById('sizes');
            const $total = shadowRoot.getElementById('total');
            this._ref = {
                $pager,
                $items,
                $prev,
                $next,
                $jump,
                $sizes,
                $total,
            };
            this.onConnected(() => {
                $prev.onclick = () => this._prev();
                $next.onclick = () => this._next();
                $items.onclick = e => {
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
            this.onDisconnected(() => {
                $prev.onclick = $next.onclick = $items.onclick = null;
            });
            this.onConnected(this.render);
            this.onAttributeChanged(this.render);
            this.onAttributeChangedDep('current', () => {
                dispatchEvent(this, 'bl:pagination:current-change', {
                    detail: { current: this.current },
                });
            });
            this.onAttributeChangedDep('page-size', () => {
                dispatchEvent(this, 'bl:pagination:page-size-change', {
                    detail: { pageSize: this.pageSize },
                });
            });
        }
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
            this._ref.$prev.disabled = this.current === 1;
            this._ref.$next.disabled = this.current === this.itemCount;
        }
        _renderPager() {
            const showQuickPrev = this.current > 4;
            const showQuickNext = this.itemCount - this.current > 3;
            const count = this.itemCount < 8 ? this.itemCount : showQuickPrev && showQuickNext ? 9 : 8;
            this._ensureItem(count);
            const children = this._ref.$items.children;
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
            const { itemTemplate } = template();
            while (this._ref.$items.children.length < n) {
                this._ref.$items.appendChild(this._itemPool.pop() ?? itemTemplate.cloneNode(true));
            }
            while (this._ref.$items.children.length > n) {
                this._itemPool.push(this._ref.$items.removeChild(this._ref.$items.lastElementChild));
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
    return BlocksPagination = _classThis;
})();
function setTextContent(element, value) {
    element.textContent = value;
}
