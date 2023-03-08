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
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
import { style } from './style.js';
import { getBodyScrollBarWidth } from '../../common/getBodyScrollBarWidth.js';
import { Component } from '../Component.js';
import { WithOpenTransition, } from '../with-open-transition/index.js';
export let BlocksModalMask = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-modal-mask',
            styles: [style],
            mixins: [WithOpenTransition],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _zIndex_decorators;
    let _zIndex_initializers = [];
    var BlocksModalMask = class extends Component {
        static {
            _zIndex_decorators = [attr('int')];
            __esDecorate(this, null, _zIndex_decorators, { kind: "accessor", name: "zIndex", static: false, private: false, access: { has: obj => "zIndex" in obj, get: obj => obj.zIndex, set: (obj, value) => { obj.zIndex = value; } } }, _zIndex_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksModalMask = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #zIndex_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _zIndex_initializers, void 0));
        get zIndex() { return this.#zIndex_accessor_storage; }
        set zIndex(value) { this.#zIndex_accessor_storage = value; }
        connectedCallback() {
            super.connectedCallback();
            this.openTransitionName = 'opacity';
            this.render();
            if (this.open) {
                this._updateVisible();
            }
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            if (attrName == 'open') {
                this._onOpenAttributeChange();
                this._updateVisible();
            }
        }
        _updateVisible() {
            if (this.open) {
                this._lockScroll();
            }
            else {
                this._unlockScroll();
            }
        }
        isScrollLocked;
        bodyPaddingRight;
        bodyOverflowY;
        computedBodyPaddingRight;
        _lockScroll() {
            if (!this.isScrollLocked) {
                this.bodyPaddingRight = document.body.style.paddingRight;
                this.bodyOverflowY = document.body.style.overflowY;
                this.computedBodyPaddingRight = parseInt(getComputedStyle(document.body).paddingRight, 10);
            }
            const scrollBarWidth = getBodyScrollBarWidth();
            const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
            const bodyOverflowY = getComputedStyle(document.body).overflowY;
            if (scrollBarWidth > 0 &&
                (bodyHasOverflow || bodyOverflowY === 'scroll') &&
                !this.isScrollLocked) {
                document.body.style.paddingRight =
                    this.computedBodyPaddingRight + scrollBarWidth + 'px';
            }
            document.body.style.overflowY = 'hidden';
            this.isScrollLocked = true;
        }
        _unlockScroll() {
            if (this.isScrollLocked) {
                document.body.style.paddingRight = this.bodyPaddingRight;
                document.body.style.overflowY = this.bodyOverflowY;
                this.isScrollLocked = false;
            }
        }
    };
    return BlocksModalMask = _classThis;
})();
