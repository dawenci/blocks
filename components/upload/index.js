import '../button/index.js'
import '../progress/index.js'
import { uploadRequest } from './uploadRequest.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __border_color_base, __color_primary, __fg_secondary, __height_base, __height_small, __radius_base } from '../theme/var.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { disabledGetter, disabledSetter } from '../../common/propertyAccessor.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  width: 300px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
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
  width: 100%;
  height: 100px;
  border: 1px dashed var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  background-color: #fafafa;
  text-align: center;
  line-height: 100px;
  font-size: 14px;
  color: var(--fg-secondary, ${__fg_secondary});
  cursor: pointer;
}
#dropZone:hover {
  border-color: var(--color-primary, ${__color_primary});
}
.item {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  margin-top: 5px;
  box-sizing: border-box;
  height: var(--height-small, ${__height_small});
  line-height: var(--height-small, ${__height_small});
  border: 1px solid var(--border-color-base, ${__border_color_base});
  font-size: 12px;
}
.type {
  flex: 0 0 var(--height-small, ${__height_small});
}
.name {
  overflow: hidden;
  flex: 1 1 auto;
}
.size {
  flex: 0 0 calc(var(--height-small, ${__height_small}) * 2);
  padding: 0 5px;
  text-align: right;
}
bl-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
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
  <div class="type">类型</div>
  <div class="name">名称</div>
  <div class="size">10k</div>
  <bl-progress class="progress"></bl-progress>
</div>`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksUpload extends HTMLElement {
  static get observedAttributes() {
    return ['auto-upload', 'disabled', 'drag-drop', 'multiple']
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
      const files = e.dataTransfer.files
      if (files.length === 0) return
      if (!this.multiple) {
        this.makeList([files[0]])
      }
      else {
        this.makeList(Array.prototype.slice.call(files))
      }
    })

    this.$fileInput.onchange = (e) => {
      this.makeList(Array.prototype.slice.call(this.$fileInput.files))
    }

    this._list = []
  }

  get autoUpload() {
    return boolGetter('auto-upload')(this)
  }

  set autoUpload(value) {
    boolSetter('auto-upload')(this, value)
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

  get multiple() {
    return boolGetter('multiple')(this)
  }

  set multiple(value) {
    boolSetter('multiple')(this, value)
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

    this.renderList()
  }

  renderList() {
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
      $item.querySelector('.size').textContent = (item.file.size / 1024).toFixed(2)
    })
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

  _upload() {
    this._list
      .filter(item => !!item.state)
      .forEach(item => {
        item.abort = uploadRequest({
          file: item.file,
          url: this.url,
          name: 'file',
          data: this.data,
          progress: this.onProgress,
          abort: this.onAbort,
          error: this.onError,
          success: this.onSuccess,
        })
      })
  }

  makeList(files) {
    files = files.filter(file => {
      return !this._list.find(item => item.file === file)
    })
    if (!files.length) return

    files.forEach(file => {
      this._list.push({
        file,
        state: 0,
        filename: file.filename,
        type: parseType(file.type),
      })
    })

    this.render()

    if (this.autoUpload) {
      this._upload()
    }
  }
}

if (!customElements.get('bl-upload')) {
  customElements.define('bl-upload', BlocksUpload)
}

function parseType(type) {
  if (type.startsWith('image/')) return 'image'
  if (type.endsWith('/pdf')) return 'pdf'
  if (type.endsWith('msword')) return 'word'
  if (type.endsWith('vnd.openxmlformats-officedocument.wordprocessingml.document')) return 'word'

  return 'other'
}
