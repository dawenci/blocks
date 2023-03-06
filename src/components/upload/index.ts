import '../button/index.js'
import '../progress/index.js'
import { uploadRequest } from './uploadRequest.js'
import { strSetter } from '../../common/property.js'
import { getRegisteredSvgIcon } from '../../icon/store.js'
import { dispatchEvent } from '../../common/event.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { customElement } from '../../decorators/customElement.js'
import { attachShadow } from '../../decorators/shadow.js'
import { applyStyle } from '../../decorators/style.js'
import { attr } from '../../decorators/attr.js'

const DEFAULT_ICON_MAP = Object.freeze({
  'file-image': /^image\//,
  'file-pdf': /\/pdf$/,
  'file-word': [
    /msword$/,
    'vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  'file-excel': [],
  'file-ppt': [],
})

function formatSize(size: number) {
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

function testType(
  rules: string | RegExp | Array<string | RegExp>,
  input: string
): boolean {
  if (typeof rules === 'string') {
    return input.includes(rules)
  }
  if (rules instanceof RegExp) {
    return rules.test(input)
  }
  if (Array.isArray(rules)) {
    return rules.some(rule => testType(rule, input))
  }
  return false
}

type Options = {
  includes?: any[]
  file: any
}

enum State {
  Init = 0,
  Progress = 1,
  Success = 2,
  Error = 3,
  Abort = 4,
}

export interface BlocksUpload extends Component {
  ref: {
    $layout: HTMLElement
    $list: HTMLElement
    $dropZone: HTMLElement
    $fileInput: HTMLInputElement
    $chooseButton: HTMLButtonElement
  }
}

@customElement('bl-upload')
export class BlocksUpload extends Component {
  static override get observedAttributes() {
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

  _list: Array<{
    file: File
    filename: string
    state: State
    progressValue: number
    type: string
    abort?: () => void
  }> = []

  _data: any

  onProgress?: (data: any, options: Options) => void
  onAbort?: (error: Error, options: Options) => void
  onError?: (error: Error, options: Options) => void
  onSuccess?: (data: any, options: Options) => void

  @attr('string') accessor accept!: string | null

  @attr('string') accessor action = ''

  @attr('boolean') accessor autoUpload!: boolean

  @attr('boolean') accessor disabled!: boolean

  @attr('boolean') accessor dragDrop!: boolean

  @attr('boolean') accessor multiple!: boolean

  @attr('boolean') accessor withCredentials!: boolean

  @attr('string') accessor name = 'file'

  constructor() {
    super()

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const { comTemplate } = template()
    shadowRoot.appendChild(comTemplate.content.cloneNode(true))

    const $layout = shadowRoot.getElementById('layout')!
    const $list = shadowRoot.getElementById('list')!
    const $dropZone = shadowRoot.getElementById('dropZone')!
    const $fileInput = shadowRoot.getElementById(
      'choose-file'
    ) as HTMLInputElement
    const $chooseButton = shadowRoot.getElementById(
      'choose'
    ) as HTMLButtonElement

    this.ref = {
      $layout,
      $list,
      $dropZone,
      $fileInput,
      $chooseButton,
    }

    $dropZone.onclick = $chooseButton.onclick = () => {
      if (this.disabled) return
      $fileInput.click()
    }

    $dropZone.addEventListener('dragover', e => {
      e.preventDefault()
    })

    $dropZone.addEventListener('dragenter', e => {
      e.preventDefault()
    })

    $dropZone.addEventListener('dragleave', e => {
      e.preventDefault()
    })

    $dropZone.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault()
      if (this.disabled) return

      const files = e.dataTransfer?.files ?? []
      if (files.length === 0) return
      if (!this.multiple) {
        this._makeList([files[0]])
      } else {
        this._makeList(Array.prototype.slice.call(files))
      }
    })

    $fileInput.onchange = e => {
      this._makeList(Array.prototype.slice.call($fileInput.files))
    }
  }

  get data() {
    return this._data
  }

  set data(value) {
    this._data = value && Object(value)
  }

  _headers: any
  get headers() {
    return this._headers
  }

  set headers(value) {
    this._headers = value && Object(value)
  }

  // Record<string, RegExp | string | Array<string | RegExp>>
  // key 为 icon 名称, value 为检测文件类型的正则表达式，或者正则表达式数组
  _iconMap?: Record<string, RegExp | string | Array<string | RegExp>>
  get iconMap() {
    return this._iconMap
  }

  set iconMap(value) {
    this._iconMap = value ?? Object(value)
  }

  get list() {
    return this._list ?? []
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(attrName: string, ov: any, v: any) {
    if (attrName === 'disabled') {
      this.ref.$chooseButton.disabled = this.disabled
    }
  }

  upload(options?: Options) {
    const items = this._list.filter(item => {
      if (item.state === State.Init) return true

      const includesStates = options?.includes ?? []
      if (includesStates.includes('error') && item.state === State.Error)
        return true
      if (includesStates.includes('abort') && item.state === State.Abort)
        return true

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

  abortFile(file: File) {
    const item = this._list.find(item => item.file === file)
    if (item && item.abort) {
      item.abort()
    }
  }

  clearFiles() {
    this._list = []
    this.render()
  }

  override render() {
    if (this.dragDrop) {
      this.ref.$dropZone.style.display = 'block'
      this.ref.$chooseButton.style.display = 'none'
    } else {
      this.ref.$dropZone.style.display = 'none'
      this.ref.$chooseButton.style.display = 'block'
    }

    if (this.multiple) {
      this.ref.$fileInput.setAttribute('multiple', '')
    } else {
      this.ref.$fileInput.removeAttribute('multiple')
    }

    strSetter('accept')(this.ref.$fileInput, this.accept ?? null)

    this._renderList()
  }

  _makeList(files: any[]) {
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
    while (this.ref.$list.children.length > this._list.length) {
      this.ref.$list.removeChild(this.ref.$list.lastElementChild!)
    }

    const { itemTemplate } = template()
    while (this.ref.$list.children.length < this._list.length) {
      this.ref.$list.appendChild(
        (
          itemTemplate.content.cloneNode(true) as DocumentFragment
        ).querySelector('.item')!
      )
    }

    const $items = this.ref.$list.children as unknown as HTMLElement[]
    this._list.forEach((item, index) => {
      const $item = $items[index]
      $item.querySelector('.name')!.textContent = item.file.name
      $item.querySelector('.size')!.textContent = formatSize(item.file.size)
      const $progress = $item.querySelector('bl-progress')!
      $progress.value = item.progressValue
      $progress.status =
        item.state === State.Success
          ? 'success'
          : item.state === State.Error
          ? 'error'
          : null

      this._renderItemIcon($item, item.type)
    })
  }

  _parseType(input: string) {
    const map = (this.iconMap ?? DEFAULT_ICON_MAP) as any
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

  _renderItemIcon($item: HTMLElement, fileType: string) {
    const $type = $item.querySelector('.type') as HTMLElement
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

  _getItemByFile(file: File) {
    return this._list.find(item => item.file === file)
  }

  // { lengthComputable, loaded, target, total, percent }
  _onProgress(data: any, options: Options) {
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

  _onAbort(error: any, options: Options) {
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

  _onError(error: any, options: Options) {
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

  _onSuccess(data: any, options: Options) {
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
