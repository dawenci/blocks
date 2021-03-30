import '../button/index.js'
import '../progress/index.js'
import { uploadRequest } from './uploadRequest.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __color_primary, __fg_secondary, __fg_base, __height_base, __radius_base, __transition_duration } from '../../theme/var.js'
import { boolGetter, boolSetter, enumGetter } from '../../common/property.js'
import { disabledGetter, disabledSetter } from '../../common/propertyAccessor.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { dispatchEvent } from '../../common/event.js'

const DEFAULT_ICON_MAP = Object.freeze({
  'file-image': /^image\//,
  'file-pdf': /\/pdf$/,
  'file-word': [/msword$/, 'vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'file-excel': [],
  'file-ppt': [],
})

function formatSize(size) {
  if (size > 1073741824) {
    return (size / 1073741824).toFixed(2) + 'GB'
  }
  if (size > 1048576) {
    return (size / 1048576).toFixed(2) + 'MB'
  }
  if (size > 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  }
  return size + 'B'
}

function testType(rules, input) {
  if (typeof rules === 'string') return input.includes(rules)
  if (rules instanceof RegExp) return rules.test(input)
  if (Array.isArray(rules)) return rules.some(rule => testType(rule, input))
  return false
}

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  width: 300px;
  box-sizing: border-box;
}
#layout {
  position: relative;
}
#choose-file {
  position: absolute;
  overflow: hidden;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
  visibility: hidden;
}
#choose {
  position: relative;
  overflow: hidden;
}

#choose input:hover {
  outline: none;
}
#dropZone {
  position: relative;
  width: 100%;
  height: 100px;
  border: 1px dashed var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  background-color: rgba(0,0,0,.025);
  text-align: center;
  line-height: 100px;
  font-size: 14px;
  color: var(--fg-secondary, ${__fg_secondary});
  user-select: none;
  cursor: pointer;
  transition: all var(--transition-duration, ${__transition_duration});
}
:host(:not([disabled])) #dropZone:hover {
  border-color: var(--color-primary, ${__color_primary});
  color: var(--color-primary, ${__color_primary});
}

:host([disabled]) #dropZone {
  cursor: not-allowed;
}


.item {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  margin-top: 5px;
  box-sizing: border-box;
  height: var(--height-base, ${__height_base});
  line-height: var(--height-base, ${__height_base});
  border-radius: var(--radius-base, ${__radius_base});
  background-color: rgba(0,0,0,.025);
  font-size: 12px;
}
bl-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
}
.type {
  position: relative;
  flex: 0 0 var(--height-base, ${__height_base});
  fill: var(--fg-base, ${__fg_base});
}
.type svg {
  margin: 4px;
  width: calc(var(--height-base, ${__height_base}) - 8px);
  height: calc(var(--height-base, ${__height_base}) - 8px);
}
.name {
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.size {
  position: relative;
  flex: 0 0 calc(var(--height-base, ${__height_base}) * 2);
  padding: 0 5px;
  text-align: right;
  color: var(--fg-secondary, ${__fg_secondary});
  font-size: 10px;
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <input id="choose-file" type="file">

  <div id="dropZone">
    点击或拖拽文件到此处
  </div>

  <bl-button id="choose">选择文件</bl-button>

  <div id="list"></div>
</div>
`

const itemTemplate = document.createElement('template')
itemTemplate.innerHTML = `<div class="item">
  <bl-progress class="progress"></bl-progress>
  <div class="type"></div>
  <div class="name">名称</div>
  <div class="size">10k</div>
</div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

const State = Object.freeze({
  Init: 0,
  Progress: 1,
  Success: 2,
  Error: 3,
  Abort: 4,
})

class BlocksUpload extends HTMLElement {
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
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$layout = shadowRoot.getElementById('layout')
    this.$list = shadowRoot.getElementById('list')
    this.$dropZone = shadowRoot.getElementById('dropZone')
    this.$fileInput = shadowRoot.getElementById('choose-file')
    this.$chooseButton = shadowRoot.getElementById('choose')

    this.$dropZone.onclick = this.$chooseButton.onclick = () => {
      if (this.disabled) return
      this.$fileInput.click()
    }

    this.$dropZone.addEventListener('dragover', e => {
      e.preventDefault()
    })

    this.$dropZone.addEventListener('dragenter', e => {
      e.preventDefault()
    })

    this.$dropZone.addEventListener('dragleave', e => {
      e.preventDefault()
    })

    this.$dropZone.addEventListener('drop', e => {
      e.preventDefault()
      if (this.disabled) return

      const files = e.dataTransfer.files
      if (files.length === 0) return
      if (!this.multiple) {
        this._makeList([files[0]])
      }
      else {
        this._makeList(Array.prototype.slice.call(files))
      }
    })

    this.$fileInput.onchange = (e) => {
      this._makeList(Array.prototype.slice.call(this.$fileInput.files))
    }

    this._list = []
  }

  get accept() {
    return this.getAttribute('accept')
  }

  set accept(value) {
    this.setAttribute('accept', value)
  }

  get action() {
    return this.getAttribute('action')
  }

  set action(value) {
    this.setAttribute('action', value)
  }

  get autoUpload() {
    return boolGetter('auto-upload')(this)
  }

  set autoUpload(value) {
    boolSetter('auto-upload')(this, value)
  }

  get data() {
    return this._data
  }

  set data(value) {
    this._data = value && Object(value)
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get dragDrop() {
    return boolGetter('drag-drop')(this)
  }

  set dragDrop(value) {
    boolSetter('drag-drop')(this, value)
  }

  get headers() {
    return this._headers
  }

  set headers(value) {
    this._headers = value && Object(value)
  }

  // Record<string, RexExp | string | Array<string | RegExp>>
  // key 为 icon 名称, value 为检测文件类型的正则表达式，或者正则表达式数组
  get iconMap() {
    return this._iconMap
  }

  set iconMap(value) {
    this._iconMap = value ?? Object(value)
  }

  get list() {
    return this._list ?? []
  }

  get multiple() {
    return boolGetter('multiple')(this)
  }

  set multiple(value) {
    boolSetter('multiple')(this, value)
  }

  get name() {
    return this.getAttribute('name') ?? 'file'
  }

  set name(value) {
    this.setAttribute('name', value)
  }

  get withCredentials() {
    return boolGetter('with-credentials')(this)
  }

  set withCredentials(value) {
    boolSetter('with-credentials')(this, value)
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })

    this.render()
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'disabled') {
      this.$chooseButton.disabled = this.disabled
    }
  }

  upload(options = {}) {
    const items = this._list
      .filter(item => {
        if (item.state === State.Init) return true

        const includesStates = options.includes || []
        if (includesStates.includes('error') && item.state === State.Error) return true
        if (includesStates.includes('abort') && item.state === State.Abort) return true

        return false
      })

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
      })

      item.abort = abort
    })
  }

  abortAll() {
    this._list.forEach(item => {
      if (item.abort) item.abort()
    })
  }

  abortFile(file) {
    const item = this._list.find(item => item.file === file)
    if (item && item.abort) {
      item.abort()
    }
  }

  clearFiles() {
    this._list = []
    this.render()
  }

  render() {
    if (this.dragDrop) {
      this.$dropZone.style.display = 'block'
      this.$chooseButton.style.display = 'none'
    }
    else {
      this.$dropZone.style.display = 'none'
      this.$chooseButton.style.display = 'block'
    }

    if (this.multiple) {
      this.$fileInput.setAttribute('multiple', '')
    }
    else {
      this.$fileInput.removeAttribute('multiple')
    }

    this.$fileInput.setAttribute('accept', this.accept ?? null)

    this._renderList()
  }

  _makeList(files) {
    files = files.filter(file => {
      return !this._list.find(item => item.file === file)
    })
    if (!files.length) return

    files.forEach(file => {
      this._list.push({
        file,
        state: State.Init,
        progressValue: 0,
        filename: file.filename,
        type: this._parseType(file.type),
      })
    })

    this.render()

    dispatchEvent(this, 'list-change', { detail: { list: this._list } })

    if (this.autoUpload) {
      this.upload()
    }
  }

  _renderList() {
    while (this.$list.children.length > this._list.length) {
      this.$list.removeChild(this.$list.lastElementChild)
    }
    while (this.$list.children.length < this._list.length) {
      this.$list.appendChild(itemTemplate.content.cloneNode(true).querySelector('.item'))
    }

    const $items = this.$list.children
    this._list.forEach((item, index) => {
      const $item = $items[index]
      $item.querySelector('.name').textContent = item.file.name
      $item.querySelector('.size').textContent = formatSize(item.file.size)
      const $progress = $item.querySelector('bl-progress')
      $progress.value = item.progressValue
      $progress.status = item.state === State.Success ? 'success' : item.state === State.Error ? 'error' : null

      this._renderItemIcon($item, item.type)
    })
  }

  _parseType(input) {
    const map = this.iconMap ?? DEFAULT_ICON_MAP
    const types = Object.keys(map)
    for (let i = 0; i < types.length; i += 1) {
      const fileType = types[i]
      const rules = map[fileType]
      if (testType(rules, input)) {
        return fileType
      }
    }
    return 'file-other'
  }

  _renderItemIcon($item, fileType) {
    const $type = $item.querySelector('.type')
    if ($type.dataset.fileType === fileType) return
    if ($type.dataset.fileType) {
      $type.innerHTML = ''
    }
    $type.dataset.fileType = fileType
    const $icon = getRegisteredSvgIcon(fileType)
    if ($icon) {
      $type.appendChild($icon)
    }
  }

  _getItemByFile(file) {
    return this._list.find(item => item.file === file)
  }

  // { lengthComputable, loaded, target, total, percent }
  _onProgress(data, options) {
    if (this.onProgress) {
      this.onProgress(data, options)
    }
    dispatchEvent(this, 'progress', { detail: { data, options } })
    const item = this._getItemByFile(options.file)
    if (item) {
      item.progressValue = data.percent
      item.state = State.Progress
      this.render()
    }
  }

  _onAbort(error, options) {
    if (this.onAbort) {
      this.onAbort(error, options)
    }
    dispatchEvent(this, 'abort', { detail: { error, options } })
    const item = this._getItemByFile(options.file)
    if (item) {
      item.progressValue = 0
      item.state = State.Abort
      item.abort = undefined
      this.render()
    }
  }

  _onError(error, options) {
    if (this.onError) {
      this.onError(error, options)
    }
    dispatchEvent(this, 'error', { detail: { error, options } })
    const item = this._getItemByFile(options.file)
    if (item) {
      item.progressValue = 0
      item.state = State.Error
      this.render()
    }
  }

  _onSuccess(data, options) {
    if (this.onSuccess) {
      this.onSuccess(data, options)
    }
    dispatchEvent(this, 'success', { detail: { data, options } })
    const item = this._getItemByFile(options.file)
    if (item) {
      item.progressValue = 100
      item.state = State.Success
      this.render()
    }
  }
}

if (!customElements.get('bl-upload')) {
  customElements.define('bl-upload', BlocksUpload)
}
