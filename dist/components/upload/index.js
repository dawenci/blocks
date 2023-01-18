import '../button/index.js';
import '../progress/index.js';
import { uploadRequest } from './uploadRequest.js';
import { boolGetter, boolSetter, strGetter, strSetter, } from '../../common/property.js';
import { disabledGetter, disabledSetter, } from '../../common/propertyAccessor.js';
import { getRegisteredSvgIcon } from '../../icon/store.js';
import { dispatchEvent } from '../../common/event.js';
import { Component } from '../Component.js';
import { template } from './template.js';
const DEFAULT_ICON_MAP = Object.freeze({
    'file-image': /^image\//,
    'file-pdf': /\/pdf$/,
    'file-word': [
        /msword$/,
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
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
export class BlocksUpload extends Component {
    ref;
    _list = [];
    _data;
    onProgress;
    onAbort;
    onError;
    onSuccess;
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        const { comTemplate } = template();
        shadowRoot.appendChild(comTemplate.content.cloneNode(true));
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
    get accept() {
        return strGetter('accept')(this);
    }
    set accept(value) {
        strSetter('accept')(this, value);
    }
    get action() {
        return strGetter('action')(this) ?? '';
    }
    set action(value) {
        strSetter('action')(this, value);
    }
    get autoUpload() {
        return boolGetter('auto-upload')(this);
    }
    set autoUpload(value) {
        boolSetter('auto-upload')(this, value);
    }
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value && Object(value);
    }
    get disabled() {
        return disabledGetter(this);
    }
    set disabled(value) {
        disabledSetter(this, value);
    }
    get dragDrop() {
        return boolGetter('drag-drop')(this);
    }
    set dragDrop(value) {
        boolSetter('drag-drop')(this, value);
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
    get multiple() {
        return boolGetter('multiple')(this);
    }
    set multiple(value) {
        boolSetter('multiple')(this, value);
    }
    get name() {
        return this.getAttribute('name') ?? 'file';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get withCredentials() {
        return boolGetter('with-credentials')(this);
    }
    set withCredentials(value) {
        boolSetter('with-credentials')(this, value);
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
        const { itemTemplate } = template();
        while (this.ref.$list.children.length < this._list.length) {
            this.ref.$list.appendChild(itemTemplate.content.cloneNode(true).querySelector('.item'));
        }
        const $items = this.ref.$list.children;
        this._list.forEach((item, index) => {
            const $item = $items[index];
            $item.querySelector('.name').textContent = item.file.name;
            $item.querySelector('.size').textContent = formatSize(item.file.size);
            const $progress = $item.querySelector('bl-progress');
            $progress.value = item.progressValue;
            $progress.status =
                item.state === State.Success
                    ? 'success'
                    : item.state === State.Error
                        ? 'error'
                        : null;
            this._renderItemIcon($item, item.type);
        });
    }
    _parseType(input) {
        const map = this.iconMap ?? DEFAULT_ICON_MAP;
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
    static get observedAttributes() {
        return [
            'accept',
            'action',
            'auto-upload',
            'disabled',
            'drag-drop',
            'multiple',
            'name',
            'with-credentials',
        ];
    }
}
if (!customElements.get('bl-upload')) {
    customElements.define('bl-upload', BlocksUpload);
}
