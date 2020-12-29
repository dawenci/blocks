import '../button/index.js'
import {
  $fontFamily,
  $radiusBase,
} from '../theme/var.js'

const template = document.createElement('template')
template.innerHTML = `
  <style>
  :host {
    font-family: ${$fontFamily};
    position:fixed;
    display:flex;
    left:0;
    top:0;
    right:0;
    bottom:0;
    z-index:-1;
  }
  :host([open]) {
    z-index:10;
  }

  /* 遮罩 */
  #mask {
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    z-index:0;
    background: rgba(0,0,0,.3);
    opacity:0;
    transition: opacity .16;
  }
  :host([open]) #mask {
    opacity:1;
  }

  /* 对话框 */
  #dialog {
    position:relative;
    z-index: 1;
    box-sizing: border-box;
    display:inline-flex;
    flex-flow: column nowrap;
    margin:auto;
    box-sizing: border-box;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    border-radius: ${$radiusBase};
    background-color: #fff;

    opacity:0;
    transform:scale(0.5);
    transition: transform .16s cubic-bezier(.645, .045, .355, 1),
      opacity .16s cubic-bezier(.645, .045, .355, 1);
  }
  :host([open]) #dialog {
    opacity:1;
    transform:scale(1);
  }

  /* 焦点状态显示阴影 */
  #dialog:focus-within {
    outline: 0 none;
    box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
      0px 24px 38px 3px rgba(0, 0, 0, 0.14),
      0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  }

  /* 标题栏 */
  header {
    box-sizing: border-box;
    flex: 1 1 auto;
    display: flex;
    flex-flow: row nowrap;
    position: relative;
    padding: 10px 15px;
    line-height: 1.428571429;
    cursor: move;
    user-select: none;
  }
  .no-header header {
    display: none;
  }
  :host([closeable]) header {
    padding-right: 45px;
  }  

  :host([closeable]) .no-header section {
    min-height: 38px;
    padding-right: 45px;
  }
  :host([closeable]) .no-header.no-footer section {
    min-height: 78px;
  }

  h1 {
    margin: 0;
    font-weight: 700;
    font-size: 14px;
    color: #4c5161;
    user-select: none;
    cursor: default;
  }
  h1:empty {
    display: none;
  }

  /* 内容区 */
  section {
    box-sizing: border-box;
    display:flex;
    width: 100%;
    padding-left: 15px;
    padding-right: 15px;
    flex:1;
    flex-direction:column;
    overflow: auto;
  }
  .no-header section {
    padding-top: 15px;
  }
  .no-footer section {
    padding-top: 10px;
    padding-bottom: 30px;
  }
  .no-header.no-footer section {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  /* 脚部 */
  footer {
    box-sizing: border-box;
    padding: 10px 15px;
    text-align: right;
  }
  .no-footer footer {
    display: none;
  }

  /* 关闭按钮 */
  #close {
    overflow: hidden;
    position:absolute;
    z-index: 1;
    right:10px;
    top:10px;
    border:0;
    width: 19px;
    height: 19px;
    transform: rotate(45deg);
    border-radius: 50%;
  }
  #close::before,
  #close::after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: rgba(0,0,0,.2);
  }
  #close::before {
    width: 13px;
    height: 1px;
  }
  #close::after {
    width: 1px;
    height: 13px;
  }

  #close:hover,
  #close:focus {
    background-color: rgba(0,0,0,.3);
    outline: 0 none;
  }
  #close:active {
    background-color: rgba(0,0,0,.5);
    outline: 0 none;
  }
  #close:hover::before,
  #close:hover::after,
  #close:active::before,
  #close:active::after {
    background-color: rgba(255,255,255,.8);
  }

  :host(:not([closeable])) #close {
    display:none;
  }
  .no-header #close {
    top: 15px;
  }
  .no-header.no-footer #close {
    top: 30px;
  }
  </style>

  <div id="mask"></div>
  <div id="dialog" role="dialog" tabindex="-1">
    <header>  
      <slot name="header">
        <h1></h1>
      </slot>
    </header>

    <section>
      <slot></slot>
    </section>

    <footer>
      <slot name="footer">
      </slot>
    </footer>

    <button id="close"></button>
  </div>
`

function getBodyScrollBarWidth() {
  const outer = document.createElement('div')
  const inner = outer.cloneNode()
  outer.style.cssText = 'visibility: hidden;overflow:scroll;position: absolute;top: 0;left: 0;width: 100px;'
  inner.style.cssText = 'width: 100%;'
  outer.appendChild(inner)
  document.body.appendChild(outer)
  return outer.offsetWidth - inner.offsetWidth
}

function getBodyPaddingRight() {
  return parseInt(getComputedStyle(document.body).paddingRight, 10)
}

class BlocksDialog extends HTMLElement {
  static get observedAttributes() {
    return [
      'open',
      'title',
      'closeable',
      ''
    ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})

    shadowRoot.appendChild(template.content.cloneNode(true))
    this.dialog = shadowRoot.getElementById('dialog')

    this.remove = false

    const onClick = (e) => {
      const target = e.target
      if (target.id === 'close') {
        this.open = false
        return
      }
      // 点击 slot 里，非控件时，焦点会变成 body，将焦点转移回来对话框
      if (!this.contains(document.activeElement)) {
        this.dialog.focus()
      }
    }

    const onKeyDown = (e) => {
      // 让 Tab 键只能在 dialog 内部的控件之间切换
      if (e.key !== 'Tab' || document.activeElement === this.dialog) return
      if (!this.contains(document.activeElement) || document.activeElement === this) {
        this.dialog.focus()
      }
    }

    const onShow = (ev) => {
      if (ev.propertyName === 'transform' && this.open) {
        this._focus()
        this.dispatchEvent(new CustomEvent('open'))
      }
    }
    const onHide = (ev) => {
      if (ev.propertyName === 'transform' && !this.open) {
        this._blur()
        if (this.remove) {
          document.body.removeChild(this)
        }
        this.dispatchEvent(new CustomEvent('close'))
      }
    }

    const onTransitionEnd = (ev) => {
      if (ev.propertyName !== 'transform') {
        return
      }
      if (this.open) onShow(ev)
      else onHide(ev)
    }

    this.dialog.addEventListener('transitioncancel', onTransitionEnd)
    this.dialog.addEventListener('transitionend', onTransitionEnd)

    shadowRoot.addEventListener('click', onClick)
    shadowRoot.addEventListener('keydown', onKeyDown)
  }

  get open() {  
    return this.getAttribute('open') !== null
  }
  set open(value) {
    if (value === null || value === false) {
      this.removeAttribute('open')
    } else {
      this.setAttribute('open', '')
    }
  }

  get title() {
    return this.getAttribute('title')
  }
  set title(value) {
    this.setAttribute('title', value)
    this._renderHeader()
  }

  get closeable() {
    return this.getAttribute('closeable') !== null
  }
  set closeable(value) {
    if (value === null || value === false) {
      this.removeAttribute('closeable')
    } else {
      this.setAttribute('closeable', '')
    }
  }

  _lockScroll() {
    if (!this.isScrollLocked) {
      this.bodyPaddingRight = document.body.style.paddingRight
      this.bodyOverflowY = document.body.style.overflowY
      this.computedBodyPaddingRight = parseInt(getComputedStyle(document.body).paddingRight, 10)
    }

    const scrollBarWidth = getBodyScrollBarWidth()
    let bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
    let bodyOverflowY = getComputedStyle(document.body).overflowY
    if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === 'scroll') && !this.isScrollLocked) {
      document.body.style.paddingRight = this.computedBodyPaddingRight + scrollBarWidth + 'px'
    }

    document.body.style.overflowY = 'hidden'
    this.isScrollLocked = true
  }

  _unlockScroll() {
    if (this.isScrollLocked) {
      document.body.style.paddingRight = this.bodyPaddingRight
      document.body.style.overflowY = this.bodyOverflowY
      this.isScrollLocked = false
    }
  }

  _hostChild(selector) {
    return this.querySelector(selector)
  }

  _shadowChild(selector) {
    return this.shadowRoot.querySelector(selector)
  }

  _renderHeader() {
    if (this._hostChild('[slot="header"]')) {
      this.dialog.classList.remove('no-header')
    }
    else if (this.title) {
      this.dialog.classList.remove('no-header')
      const title = this._shadowChild('h1')
      title.innerText = this.title
    }
    else {
      this.dialog.classList.add('no-header')
    }
  }

  _renderFooter() {
    if (this.querySelector('[slot="footer"]')) {
      this.dialog.classList.remove('no-footer')
    }
    else {
      this.dialog.classList.add('no-footer')
    }
  }

  _focus() {
    if (!this._prevFocus) {
      this._prevFocus = document.activeElement
    }
    this.dialog.focus()
  }

  _blur() {
    this.dialog.blur()
    if (this._prevFocus) {
      this._prevFocus.focus()
      this._prevFocus = undefined
    } 
  }

  connectedCallback() {
    this._renderHeader()
    this._renderFooter()

    // 拖拽 header 移动
    {
      const dialog = this.dialog
      let offsetX = 0
      let offsetY = 0

      const isHeader = (e) => {
        return dialog.querySelector('header').contains(e.target)
      }
  
      const move = (e) => {
        dialog.style.left = (e.pageX - offsetX) + 'px'
        dialog.style.top = (e.pageY - offsetY) + 'px'
      }
  
      const up = () => {
        removeEventListener('mousemove', move)
        removeEventListener('mouseup', up)
      }
  
      dialog.onmousedown = (e) => {
        if (!isHeader(e)) return
        const marginLeft = parseFloat(window.getComputedStyle(dialog).marginLeft || '0')
        const marginTop = parseFloat(window.getComputedStyle(dialog).marginTop || '0')
        offsetX = (e.pageX - dialog.offsetLeft + marginLeft)
        offsetY = (e.pageY - dialog.offsetTop + marginTop)
        addEventListener('mousemove', move)
        addEventListener('mouseup', up)
      }
    }
  }

  disconnectedCallback() {
    this.dialog.onmousedown = null
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == 'open' && this.shadowRoot) {
      if (this.open) {
        this._lockScroll()
      }
      else {
        this._unlockScroll()
      }

      if (newValue !== null) this._focus()
      else this._blur()
    }
  }
}

if (!customElements.get('blocks-dialog')) {
  customElements.define('blocks-dialog', BlocksDialog)
}
