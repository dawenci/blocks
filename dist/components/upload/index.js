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
import '../button/index.js';
import '../progress/index.js';
import { uploadRequest } from './uploadRequest.js';
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
import { strSetter } from '../../common/property.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { template } from './template.js';
import { itemTemplate } from './item.template.js';
import { style } from './style.js';
const DEFAULT_ICON_MAP = Object.freeze({
    'file-image': /^image\//,
    'file-pdf': /\/pdf$/,
    'file-word': [/msword$/, 'vnd.openxmlformats-officedocument.wordprocessingml.document'],
    'file-excel': [],
    'file-ppt': [],
});
function formatSize(size) {
    if (size > 1073741824) {
        return (size / 1073741824).toFixed(2) + 'GB';
    }
    if (size > 1048576) {
        return (size / 1048576).toFixed(2) + 'MB';
    }
    if (size > 1024) {
        return (size / 1024).toFixed(2) + 'KB';
    }
    return size + 'B';
}
function testType(rules, input) {
    if (typeof rules === 'string') {
        return input.includes(rules);
    }
    if (rules instanceof RegExp) {
        return rules.test(input);
    }
    if (Array.isArray(rules)) {
        return rules.some(rule => testType(rule, input));
    }
    return false;
}
var State;
(function (State) {
    State[State["Init"] = 0] = "Init";
    State[State["Progress"] = 1] = "Progress";
    State[State["Success"] = 2] = "Success";
    State[State["Error"] = 3] = "Error";
    State[State["Abort"] = 4] = "Abort";
})(State || (State = {}));
export let BlocksUpload = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-upload',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _accept_decorators;
    let _accept_initializers = [];
    let _action_decorators;
    let _action_initializers = [];
    let _autoUpload_decorators;
    let _autoUpload_initializers = [];
    let _disabled_decorators;
    let _disabled_initializers = [];
    let _dragDrop_decorators;
    let _dragDrop_initializers = [];
    let _multiple_decorators;
    let _multiple_initializers = [];
    let _withCredentials_decorators;
    let _withCredentials_initializers = [];
    let _name_decorators;
    let _name_initializers = [];
    var BlocksUpload = class extends Component {
        static {
            _accept_decorators = [attr('string')];
            _action_decorators = [attr('string')];
            _autoUpload_decorators = [attr('boolean')];
            _disabled_decorators = [attr('boolean')];
            _dragDrop_decorators = [attr('boolean')];
            _multiple_decorators = [attr('boolean')];
            _withCredentials_decorators = [attr('boolean')];
            _name_decorators = [attr('string')];
            __esDecorate(this, null, _accept_decorators, { kind: "accessor", name: "accept", static: false, private: false, access: { has: obj => "accept" in obj, get: obj => obj.accept, set: (obj, value) => { obj.accept = value; } } }, _accept_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _action_decorators, { kind: "accessor", name: "action", static: false, private: false, access: { has: obj => "action" in obj, get: obj => obj.action, set: (obj, value) => { obj.action = value; } } }, _action_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _autoUpload_decorators, { kind: "accessor", name: "autoUpload", static: false, private: false, access: { has: obj => "autoUpload" in obj, get: obj => obj.autoUpload, set: (obj, value) => { obj.autoUpload = value; } } }, _autoUpload_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _disabled_decorators, { kind: "accessor", name: "disabled", static: false, private: false, access: { has: obj => "disabled" in obj, get: obj => obj.disabled, set: (obj, value) => { obj.disabled = value; } } }, _disabled_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _dragDrop_decorators, { kind: "accessor", name: "dragDrop", static: false, private: false, access: { has: obj => "dragDrop" in obj, get: obj => obj.dragDrop, set: (obj, value) => { obj.dragDrop = value; } } }, _dragDrop_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _multiple_decorators, { kind: "accessor", name: "multiple", static: false, private: false, access: { has: obj => "multiple" in obj, get: obj => obj.multiple, set: (obj, value) => { obj.multiple = value; } } }, _multiple_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _withCredentials_decorators, { kind: "accessor", name: "withCredentials", static: false, private: false, access: { has: obj => "withCredentials" in obj, get: obj => obj.withCredentials, set: (obj, value) => { obj.withCredentials = value; } } }, _withCredentials_initializers, _instanceExtraInitializers);
            __esDecorate(this, null, _name_decorators, { kind: "accessor", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } } }, _name_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksUpload = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #accept_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _accept_initializers, void 0));
        get accept() { return this.#accept_accessor_storage; }
        set accept(value) { this.#accept_accessor_storage = value; }
        #action_accessor_storage = __runInitializers(this, _action_initializers, '');
        get action() { return this.#action_accessor_storage; }
        set action(value) { this.#action_accessor_storage = value; }
        #autoUpload_accessor_storage = __runInitializers(this, _autoUpload_initializers, void 0);
        get autoUpload() { return this.#autoUpload_accessor_storage; }
        set autoUpload(value) { this.#autoUpload_accessor_storage = value; }
        #disabled_accessor_storage = __runInitializers(this, _disabled_initializers, void 0);
        get disabled() { return this.#disabled_accessor_storage; }
        set disabled(value) { this.#disabled_accessor_storage = value; }
        #dragDrop_accessor_storage = __runInitializers(this, _dragDrop_initializers, void 0);
        get dragDrop() { return this.#dragDrop_accessor_storage; }
        set dragDrop(value) { this.#dragDrop_accessor_storage = value; }
        #multiple_accessor_storage = __runInitializers(this, _multiple_initializers, void 0);
        get multiple() { return this.#multiple_accessor_storage; }
        set multiple(value) { this.#multiple_accessor_storage = value; }
        #withCredentials_accessor_storage = __runInitializers(this, _withCredentials_initializers, void 0);
        get withCredentials() { return this.#withCredentials_accessor_storage; }
        set withCredentials(value) { this.#withCredentials_accessor_storage = value; }
        #name_accessor_storage = __runInitializers(this, _name_initializers, 'file');
        get name() { return this.#name_accessor_storage; }
        set name(value) { this.#name_accessor_storage = value; }
        _list = [];
        _data;
        onProgress;
        onAbort;
        onError;
        onSuccess;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template());
            const $layout = shadowRoot.getElementById('layout');
            const $list = shadowRoot.getElementById('list');
            const $dropZone = shadowRoot.getElementById('dropZone');
            const $fileInput = shadowRoot.getElementById('choose-file');
            const $chooseButton = shadowRoot.getElementById('choose');
            this.ref = {
                $layout,
                $list,
                $dropZone,
                $fileInput,
                $chooseButton,
            };
            $dropZone.onclick = $chooseButton.onclick = () => {
                if (this.disabled)
                    return;
                $fileInput.click();
            };
            $dropZone.addEventListener('dragover', e => {
                e.preventDefault();
            });
            $dropZone.addEventListener('dragenter', e => {
                e.preventDefault();
            });
            $dropZone.addEventListener('dragleave', e => {
                e.preventDefault();
            });
            $dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.disabled)
                    return;
                const files = e.dataTransfer?.files ?? [];
                if (files.length === 0)
                    return;
                if (!this.multiple) {
                    this._makeList([files[0]]);
                }
                else {
                    this._makeList(Array.prototype.slice.call(files));
                }
            });
            $fileInput.onchange = e => {
                this._makeList(Array.prototype.slice.call($fileInput.files));
            };
        }
        get data() {
            return this._data;
        }
        set data(value) {
            this._data = value && Object(value);
        }
        _headers;
        get headers() {
            return this._headers;
        }
        set headers(value) {
            this._headers = value && Object(value);
        }
        _iconMap;
        get iconMap() {
            return this._iconMap;
        }
        set iconMap(value) {
            this._iconMap = value ?? Object(value);
        }
        get list() {
            return this._list ?? [];
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
        }
        attributeChangedCallback(attrName, ov, v) {
            if (attrName === 'disabled') {
                this.ref.$chooseButton.disabled = this.disabled;
            }
        }
        upload(options) {
            const items = this._list.filter(item => {
                if (item.state === State.Init)
                    return true;
                const includesStates = options?.includes ?? [];
                if (includesStates.includes('error') && item.state === State.Error)
                    return true;
                if (includesStates.includes('abort') && item.state === State.Abort)
                    return true;
                return false;
            });
            items.forEach(item => {
                const { abort } = uploadRequest({
                    file: item.file,
                    url: this.action,
                    name: this.name,
                    data: this.data,
                    progress: this._onProgress.bind(this),
                    abort: this._onAbort.bind(this),
                    error: this._onError.bind(this),
                    success: this._onSuccess.bind(this),
                });
                item.abort = abort;
            });
        }
        abortAll() {
            this._list.forEach(item => {
                if (item.abort)
                    item.abort();
            });
        }
        abortFile(file) {
            const item = this._list.find(item => item.file === file);
            if (item && item.abort) {
                item.abort();
            }
        }
        clearFiles() {
            this._list = [];
            this.render();
        }
        render() {
            if (this.dragDrop) {
                this.ref.$dropZone.style.display = 'block';
                this.ref.$chooseButton.style.display = 'none';
            }
            else {
                this.ref.$dropZone.style.display = 'none';
                this.ref.$chooseButton.style.display = 'block';
            }
            if (this.multiple) {
                this.ref.$fileInput.setAttribute('multiple', '');
            }
            else {
                this.ref.$fileInput.removeAttribute('multiple');
            }
            strSetter('accept')(this.ref.$fileInput, this.accept ?? null);
            this._renderList();
        }
        _makeList(files) {
            files = files.filter(file => {
                return !this._list.find(item => item.file === file);
            });
            if (!files.length)
                return;
            files.forEach(file => {
                this._list.push({
                    file,
                    state: State.Init,
                    progressValue: 0,
                    filename: file.filename,
                    type: this._parseType(file.type),
                });
            });
            this.render();
            dispatchEvent(this, 'list-change', { detail: { list: this._list } });
            if (this.autoUpload) {
                this.upload();
            }
        }
        _renderList() {
            while (this.ref.$list.children.length > this._list.length) {
                this.ref.$list.removeChild(this.ref.$list.lastElementChild);
            }
            while (this.ref.$list.children.length < this._list.length) {
                this.ref.$list.appendChild(itemTemplate());
            }
            const $items = this.ref.$list.children;
            this._list.forEach((item, index) => {
                const $item = $items[index];
                $item.querySelector('.name').textContent = item.file.name;
                $item.querySelector('.size').textContent = formatSize(item.file.size);
                const $progress = $item.querySelector('bl-progress');
                $progress.value = item.progressValue;
                $progress.status = item.state === State.Success ? 'success' : item.state === State.Error ? 'error' : null;
                this._renderItemIcon($item, item.type);
            });
        }
        _parseType(input) {
            const map = (this.iconMap ?? DEFAULT_ICON_MAP);
            const types = Object.keys(map);
            for (let i = 0; i < types.length; i += 1) {
                const fileType = types[i];
                const rules = map[fileType];
                if (testType(rules, input)) {
                    return fileType;
                }
            }
            return 'file-other';
        }
        _renderItemIcon($item, fileType) {
            const $type = $item.querySelector('.type');
            if ($type.dataset.fileType === fileType)
                return;
            if ($type.dataset.fileType) {
                $type.innerHTML = '';
            }
            $type.dataset.fileType = fileType;
            const $icon = getRegisteredSvgIcon(fileType);
            if ($icon) {
                $type.appendChild($icon);
            }
        }
        _getItemByFile(file) {
            return this._list.find(item => item.file === file);
        }
        _onProgress(data, options) {
            if (this.onProgress) {
                this.onProgress(data, options);
            }
            dispatchEvent(this, 'progress', { detail: { data, options } });
            const item = this._getItemByFile(options.file);
            if (item) {
                item.progressValue = data.percent;
                item.state = State.Progress;
                this.render();
            }
        }
        _onAbort(error, options) {
            if (this.onAbort) {
                this.onAbort(error, options);
            }
            dispatchEvent(this, 'abort', { detail: { error, options } });
            const item = this._getItemByFile(options.file);
            if (item) {
                item.progressValue = 0;
                item.state = State.Abort;
                item.abort = undefined;
                this.render();
            }
        }
        _onError(error, options) {
            if (this.onError) {
                this.onError(error, options);
            }
            dispatchEvent(this, 'error', { detail: { error, options } });
            const item = this._getItemByFile(options.file);
            if (item) {
                item.progressValue = 0;
                item.state = State.Error;
                this.render();
            }
        }
        _onSuccess(data, options) {
            if (this.onSuccess) {
                this.onSuccess(data, options);
            }
            dispatchEvent(this, 'success', { detail: { data, options } });
            const item = this._getItemByFile(options.file);
            if (item) {
                item.progressValue = 100;
                item.state = State.Success;
                this.render();
            }
        }
    };
    return BlocksUpload = _classThis;
})();
