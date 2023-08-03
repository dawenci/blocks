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
import '../loading/index.js';
import { attr } from '../../decorators/attr/index.js';
import { defineClass } from '../../decorators/defineClass/index.js';
import { disabledSetter } from '../../common/propertyAccessor.js';
import { shadowRef } from '../../decorators/shadowRef/index.js';
import { forEach } from '../../common/utils.js';
import { onWheel } from '../../common/onWheel.js';
import { style } from './style.js';
import { template } from './template.js';
import { BlControl } from '../base-control/index.js';
import { WithOpenTransition } from '../with-open-transition/index.js';
export let BlImageViewer = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-image-viewer',
            mixins: [WithOpenTransition],
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _closeOnClickMask_decorators;
    let _closeOnClickMask_initializers = [];
    let _closeOnPressEscape_decorators;
    let _closeOnPressEscape_initializers = [];
    let _$layout_decorators;
    let _$layout_initializers = [];
    let _$slot_decorators;
    let _$slot_initializers = [];
    let _$mask_decorators;
    let _$mask_initializers = [];
    let _$toolbar_decorators;
    let _$toolbar_initializers = [];
    let _$thumbnails_decorators;
    let _$thumbnails_initializers = [];
    let _$content_decorators;
    let _$content_initializers = [];
    let _$active_decorators;
    let _$active_initializers = [];
    let _$prev_decorators;
    let _$prev_initializers = [];
    let _$next_decorators;
    let _$next_initializers = [];
    let _$closeButton_decorators;
    let _$closeButton_initializers = [];
    let _$rotateLeftButton_decorators;
    let _$rotateLeftButton_initializers = [];
    let _$rotateRightButton_decorators;
    let _$rotateRightButton_initializers = [];
    let _$zoomInButton_decorators;
    let _$zoomInButton_initializers = [];
    let _$zoomOutButton_decorators;
    let _$zoomOutButton_initializers = [];
    var BlImageViewer = class extends BlControl {
        static {
            _closeOnClickMask_decorators = [attr('boolean')];
            _closeOnPressEscape_decorators = [attr('boolean')];
            _$layout_decorators = [shadowRef('#layout')];
            _$slot_decorators = [shadowRef('slot')];
            _$mask_decorators = [shadowRef('#mask')];
            _$toolbar_decorators = [shadowRef('#toolbar')];
            _$thumbnails_decorators = [shadowRef('#thumbnails')];
            _$content_decorators = [shadowRef('#content')];
            _$active_decorators = [shadowRef('#active')];
            _$prev_decorators = [shadowRef('#prev')];
            _$next_decorators = [shadowRef('#next')];
            _$closeButton_decorators = [shadowRef('#close')];
            _$rotateLeftButton_decorators = [shadowRef('#rotate-left')];
            _$rotateRightButton_decorators = [shadowRef('#rotate-right')];
            _$zoomInButton_decorators = [shadowRef('#zoom-in')];
            _$zoomOutButton_decorators = [shadowRef('#zoom-out')];
            __esDecorate(this, null, _closeOnClickMask_decorators, { kind: "accessor", name: "closeOnClickMask", static: false, private: false, access: { has: obj => "closeOnClickMask" in obj, get: obj => obj.closeOnClickMask, set: (obj, value) => { obj.closeOnClickMask = value; } } }, _closeOnClickMask_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _closeOnPressEscape_decorators, { kind: "accessor", name: "closeOnPressEscape", static: false, private: false, access: { has: obj => "closeOnPressEscape" in obj, get: obj => obj.closeOnPressEscape, set: (obj, value) => { obj.closeOnPressEscape = value; } } }, _closeOnPressEscape_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$layout_decorators, { kind: "accessor", name: "$layout", static: false, private: false, access: { has: obj => "$layout" in obj, get: obj => obj.$layout, set: (obj, value) => { obj.$layout = value; } } }, _$layout_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$slot_decorators, { kind: "accessor", name: "$slot", static: false, private: false, access: { has: obj => "$slot" in obj, get: obj => obj.$slot, set: (obj, value) => { obj.$slot = value; } } }, _$slot_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$mask_decorators, { kind: "accessor", name: "$mask", static: false, private: false, access: { has: obj => "$mask" in obj, get: obj => obj.$mask, set: (obj, value) => { obj.$mask = value; } } }, _$mask_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$toolbar_decorators, { kind: "accessor", name: "$toolbar", static: false, private: false, access: { has: obj => "$toolbar" in obj, get: obj => obj.$toolbar, set: (obj, value) => { obj.$toolbar = value; } } }, _$toolbar_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$thumbnails_decorators, { kind: "accessor", name: "$thumbnails", static: false, private: false, access: { has: obj => "$thumbnails" in obj, get: obj => obj.$thumbnails, set: (obj, value) => { obj.$thumbnails = value; } } }, _$thumbnails_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$content_decorators, { kind: "accessor", name: "$content", static: false, private: false, access: { has: obj => "$content" in obj, get: obj => obj.$content, set: (obj, value) => { obj.$content = value; } } }, _$content_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$active_decorators, { kind: "accessor", name: "$active", static: false, private: false, access: { has: obj => "$active" in obj, get: obj => obj.$active, set: (obj, value) => { obj.$active = value; } } }, _$active_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$prev_decorators, { kind: "accessor", name: "$prev", static: false, private: false, access: { has: obj => "$prev" in obj, get: obj => obj.$prev, set: (obj, value) => { obj.$prev = value; } } }, _$prev_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$next_decorators, { kind: "accessor", name: "$next", static: false, private: false, access: { has: obj => "$next" in obj, get: obj => obj.$next, set: (obj, value) => { obj.$next = value; } } }, _$next_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$closeButton_decorators, { kind: "accessor", name: "$closeButton", static: false, private: false, access: { has: obj => "$closeButton" in obj, get: obj => obj.$closeButton, set: (obj, value) => { obj.$closeButton = value; } } }, _$closeButton_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$rotateLeftButton_decorators, { kind: "accessor", name: "$rotateLeftButton", static: false, private: false, access: { has: obj => "$rotateLeftButton" in obj, get: obj => obj.$rotateLeftButton, set: (obj, value) => { obj.$rotateLeftButton = value; } } }, _$rotateLeftButton_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$rotateRightButton_decorators, { kind: "accessor", name: "$rotateRightButton", static: false, private: false, access: { has: obj => "$rotateRightButton" in obj, get: obj => obj.$rotateRightButton, set: (obj, value) => { obj.$rotateRightButton = value; } } }, _$rotateRightButton_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$zoomInButton_decorators, { kind: "accessor", name: "$zoomInButton", static: false, private: false, access: { has: obj => "$zoomInButton" in obj, get: obj => obj.$zoomInButton, set: (obj, value) => { obj.$zoomInButton = value; } } }, _$zoomInButton_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _$zoomOutButton_decorators, { kind: "accessor", name: "$zoomOutButton", static: false, private: false, access: { has: obj => "$zoomOutButton" in obj, get: obj => obj.$zoomOutButton, set: (obj, value) => { obj.$zoomOutButton = value; } } }, _$zoomOutButton_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlImageViewer = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #closeOnClickMask_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _closeOnClickMask_initializers, void 0));
        get closeOnClickMask() { return this.#closeOnClickMask_accessor_storage; }
        set closeOnClickMask(value) { this.#closeOnClickMask_accessor_storage = value; }
        #closeOnPressEscape_accessor_storage = __runInitializers(this, _closeOnPressEscape_initializers, void 0);
        get closeOnPressEscape() { return this.#closeOnPressEscape_accessor_storage; }
        set closeOnPressEscape(value) { this.#closeOnPressEscape_accessor_storage = value; }
        #$layout_accessor_storage = __runInitializers(this, _$layout_initializers, void 0);
        get $layout() { return this.#$layout_accessor_storage; }
        set $layout(value) { this.#$layout_accessor_storage = value; }
        #$slot_accessor_storage = __runInitializers(this, _$slot_initializers, void 0);
        get $slot() { return this.#$slot_accessor_storage; }
        set $slot(value) { this.#$slot_accessor_storage = value; }
        #$mask_accessor_storage = __runInitializers(this, _$mask_initializers, void 0);
        get $mask() { return this.#$mask_accessor_storage; }
        set $mask(value) { this.#$mask_accessor_storage = value; }
        #$toolbar_accessor_storage = __runInitializers(this, _$toolbar_initializers, void 0);
        get $toolbar() { return this.#$toolbar_accessor_storage; }
        set $toolbar(value) { this.#$toolbar_accessor_storage = value; }
        #$thumbnails_accessor_storage = __runInitializers(this, _$thumbnails_initializers, void 0);
        get $thumbnails() { return this.#$thumbnails_accessor_storage; }
        set $thumbnails(value) { this.#$thumbnails_accessor_storage = value; }
        #$content_accessor_storage = __runInitializers(this, _$content_initializers, void 0);
        get $content() { return this.#$content_accessor_storage; }
        set $content(value) { this.#$content_accessor_storage = value; }
        #$active_accessor_storage = __runInitializers(this, _$active_initializers, void 0);
        get $active() { return this.#$active_accessor_storage; }
        set $active(value) { this.#$active_accessor_storage = value; }
        #$prev_accessor_storage = __runInitializers(this, _$prev_initializers, void 0);
        get $prev() { return this.#$prev_accessor_storage; }
        set $prev(value) { this.#$prev_accessor_storage = value; }
        #$next_accessor_storage = __runInitializers(this, _$next_initializers, void 0);
        get $next() { return this.#$next_accessor_storage; }
        set $next(value) { this.#$next_accessor_storage = value; }
        #$closeButton_accessor_storage = __runInitializers(this, _$closeButton_initializers, void 0);
        get $closeButton() { return this.#$closeButton_accessor_storage; }
        set $closeButton(value) { this.#$closeButton_accessor_storage = value; }
        #$rotateLeftButton_accessor_storage = __runInitializers(this, _$rotateLeftButton_initializers, void 0);
        get $rotateLeftButton() { return this.#$rotateLeftButton_accessor_storage; }
        set $rotateLeftButton(value) { this.#$rotateLeftButton_accessor_storage = value; }
        #$rotateRightButton_accessor_storage = __runInitializers(this, _$rotateRightButton_initializers, void 0);
        get $rotateRightButton() { return this.#$rotateRightButton_accessor_storage; }
        set $rotateRightButton(value) { this.#$rotateRightButton_accessor_storage = value; }
        #$zoomInButton_accessor_storage = __runInitializers(this, _$zoomInButton_initializers, void 0);
        get $zoomInButton() { return this.#$zoomInButton_accessor_storage; }
        set $zoomInButton(value) { this.#$zoomInButton_accessor_storage = value; }
        #$zoomOutButton_accessor_storage = __runInitializers(this, _$zoomOutButton_initializers, void 0);
        get $zoomOutButton() { return this.#$zoomOutButton_accessor_storage; }
        set $zoomOutButton(value) { this.#$zoomOutButton_accessor_storage = value; }
        constructor() {
            super();
            this.appendShadowChild(template());
            this._tabIndexFeature.withTabIndex(0);
            this.imgMap = new Map();
            this.#setupContent();
            this.#setupEvents();
            this.hook.onConnected(this.render);
            this.hook.onAttributeChanged(this.render);
        }
        #setupContent() {
            const onSlotChange = () => {
                const imgs = this.$slot.assignedElements().filter(el => el.nodeName === 'IMG');
                const newMap = new Map();
                imgs.forEach($img => {
                    if (this.imgMap.has($img)) {
                        newMap.set($img, this.imgMap.get($img));
                    }
                    else {
                        newMap.set($img, {
                            scale: 1,
                            rotate: 0,
                        });
                    }
                });
                this.imgMap = newMap;
                this.imgs = imgs;
            };
            this.$slot.addEventListener('slotchange', onSlotChange);
        }
        #setupEvents() {
            this.$prev.onclick = () => {
                this.prev();
            };
            this.$next.onclick = () => {
                this.next();
            };
            this.$rotateLeftButton.onclick = () => {
                this.rotateLeft();
            };
            this.$rotateRightButton.onclick = () => {
                this.rotateRight();
            };
            this.$zoomInButton.onclick = () => {
                this.zoomIn();
            };
            this.$zoomOutButton.onclick = () => {
                this.zoomOut();
            };
            this.$closeButton.onclick = () => {
                this.open = false;
            };
            this.$mask.onclick = () => {
                if (this.closeOnClickMask)
                    this.open = false;
            };
            onWheel(this, (e, data) => {
                if (data.spinY > 0) {
                    this.zoomOut();
                }
                else {
                    this.zoomIn();
                }
            });
            this.addEventListener('opened', () => {
                this.$layout.focus();
            });
            this.addEventListener('keydown', e => {
                switch (e.key) {
                    case 'Escape': {
                        if (this.closeOnPressEscape)
                            this.open = false;
                        break;
                    }
                    case 'ArrowLeft': {
                        this.prev();
                        break;
                    }
                    case 'ArrowRight': {
                        this.next();
                        break;
                    }
                    case 'ArrowUp': {
                        this.zoomIn();
                        break;
                    }
                    case 'ArrowDown': {
                        this.zoomOut();
                        break;
                    }
                }
            });
        }
        _imgs;
        get imgs() {
            return this._imgs ?? [];
        }
        set imgs(value) {
            this._imgs = value ?? [];
            this.render();
        }
        _activeImg;
        get activeImg() {
            return this._activeImg ?? this.imgs?.[0];
        }
        set activeImg(value) {
            this._activeImg = value;
            this._renderCurrent();
        }
        zoomIn() {
            if (!this.activeImg)
                return;
            const obj = this.imgMap.get(this.activeImg);
            if (obj.scale >= 1) {
                obj.scale += 1;
            }
            else if (obj.scale < 1) {
                obj.scale += 0.2;
            }
            this._renderCurrent();
            this._renderToolbar();
        }
        zoomOut() {
            if (!this.activeImg)
                return;
            const obj = this.imgMap.get(this.activeImg);
            if (obj.scale > 1) {
                obj.scale -= 1;
            }
            else if (obj.scale <= 1 && obj.scale >= 0.4) {
                obj.scale -= 0.2;
            }
            this._renderCurrent();
            this._renderToolbar();
        }
        rotateRight() {
            if (!this.activeImg)
                return;
            this.imgMap.get(this.activeImg).rotate += 90;
            this._renderCurrent();
        }
        rotateLeft() {
            if (!this.activeImg)
                return;
            this.imgMap.get(this.activeImg).rotate -= 90;
            this._renderCurrent();
        }
        next() {
            if (this.imgs.length && this.activeImg !== this.imgs[this.imgs.length - 1]) {
                const index = this.imgs.indexOf(this.activeImg);
                this.activeImg = this.imgs[index + 1];
            }
            this._renderNavButton();
            this._renderToolbar();
        }
        prev() {
            if (this.imgs.length && this.activeImg !== this.imgs[0]) {
                const index = this.imgs.indexOf(this.activeImg);
                this.activeImg = this.imgs[index - 1];
            }
            this._renderNavButton();
            this._renderToolbar();
        }
        render() {
            super.render();
            this._renderCurrent();
            this._renderNavButton();
            this._renderToolbar();
        }
        _renderCurrent() {
            if (this.activeImg) {
                const { $active } = this;
                if ($active.src !== this.activeImg.src) {
                    $active.style.opacity = '0';
                    $active.src = this.activeImg.src;
                    $active.onload = () => {
                        $active.style.opacity = '';
                        const { scale, rotate } = this.imgMap.get(this.activeImg);
                        $active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`;
                    };
                }
                else {
                    const { scale, rotate } = this.imgMap.get(this.activeImg);
                    $active.style.transform = `scale3d(${scale}, ${scale}, 1) rotate(${rotate}deg)`;
                }
            }
        }
        _renderNavButton() {
            const display = this.imgs.length > 1 ? 'block' : 'none';
            this.$prev.style.display = this.$next.style.display = display;
            disabledSetter(this.$prev, !!this.activeImg && this.activeImg === this.imgs[0]);
            disabledSetter(this.$next, !!this.activeImg && this.activeImg === this.imgs[this.imgs.length - 1]);
        }
        _renderToolbar() {
            if (!this.activeImg) {
                const buttons = this.$toolbar.querySelectorAll('.button');
                forEach(buttons, $button => {
                    disabledSetter($button, true);
                });
                return;
            }
            const buttons = this.$toolbar.querySelectorAll('.button');
            forEach(buttons, $button => {
                disabledSetter($button, false);
            });
            const { scale } = this.imgMap.get(this.activeImg);
            disabledSetter(this.$zoomOutButton, scale === 0.2);
        }
    };
    return BlImageViewer = _classThis;
})();
