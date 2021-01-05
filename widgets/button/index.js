import {
  $fontFamily,
  $radiusSmall,
  $colorPrimary,
  $colorPrimaryLight,
  $colorPrimaryDark,
  $colorDisabled,
  $borderColorBase,
  $borderColorDisabled,
  $backgroundColorDisabled,
  $transitionDuration,
} from '../theme/var.js'

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      font-family: ${$fontFamily};
      all: initial;
      contain: content;
      box-sizing: border-box;
      display: inline-block;
      height: 32px;
      line-height: 30px;
      padding: 0 15px;
      border-radius: 3px;
      border-width: 1px;
      border-style: solid;
      cursor: pointer;
      font-size: 14px;
      text-align: center;
      transition: color ${$transitionDuration}, border-color ${$transitionDuration};
      user-select: none;
    }

    /* background */
    :host { background-color: #fff; }
    :host([type="primary"]) { background-color: #1890ff; }
    :host([type="danger"]) { background-color: #ff4d4f; }
    :host([type="danger"]:hover),
    :host([type="danger"]:focus) { background-color: #ff7875; }
    :host([type="primary"]:hover),
    :host([type="primary"]:focus) { background-color: #40a9ff; }
    :host([type="primary"]:active) { background-color: #096dd9; }
    :host([type="danger"]:active) { background-color: #d9363e; }

    :host([type="link"]),
    :host([outline]),
    :host([outline]:hover),
    :host([outline]:focus),
    :host([outline]:active),
    :host([type="link"]:hover),
    :host([type="link"]:active) { background-color: transparent; }

    :host([disabled]) {
      background-color: ${$backgroundColorDisabled};
    }

    /* border-color */
    :host { border-color: rgba(217, 217, 217); }
    :host(:hover),
    :host(:focus),
    :host([type="primary"]) { border-color: #1890ff; }
    :host(:active),
    :host([type="primary"]:active) { border-color: #096dd9; }
    :host([type="primary"]:hover),
    :host([type="primary"]:focus) { border-color: #40a9ff; }
    :host([type="danger"]) { border-color: #ff4d4f; }
    :host([type="danger"]:hover),
    :host([type="danger"]:focus) { border-color: #ff7875; }
    :host([type="danger"]:active) { border-color: #d9363e; }
    :host([type="link"]),
    :host([type="link"]:hover),
    :host([type="link"]:focus),
    :host([type="link"]:active) { border-color: transition; }
    :host([disabled]) {
      border-color: ${$borderColorDisabled};
    }


    /* color */
    :host { color: #314659; }

    :host(:hover),
    :host(:focus),
    :host([outline]:hover),
    :host([outline]:focus),
    :host([type="primary"][outline]),
    :host([type="link"]) { color: #1890ff; }

    :host([type="primary"][outline]:hover),
    :host([type="primary"][outline]:focus),
    :host([type="link"]:hover) { color: #40a9ff; }

    :host(:active),
    :host([outline]:active),
    :host([type="primary"][outline]:active),
    :host([type="link"]:active) { color: #096dd9; }

    :host([outline]),
    :host([type="primary"]),
    :host([type="primary"]:hover),
    :host([type="primary"]:focus),
    :host([type="primary"]:active),
    :host([type="danger"]),
    :host([type="danger"]:hover),
    :host([type="danger"]:focus),
    :host([type="danger"]:active) { color: #fff; }
    :host([type="danger"][outline]) { color: #ff4d4f; }
    :host([type="danger"][outline]:hover),
    :host([type="danger"][outline]:focus) { color: #ff7875; }
    :host([type="danger"][outline]:active) { color: #d9363e; }

    :host([disabled]) {
      color: ${$colorDisabled};
    }

    :host([disabled]) {
      outline: 0 none;
      cursor: not-allowed;
    }

    :host([size="large"]) {
      height: 40px;
      line-height: 38px;
      padding-left: 15px;
      padding-right: 15px;
      font-size: 16px;
    }

    :host([size="small"]) {
      height: 24px;
      line-height: 22px;
      padding-left: 8px;
      padding-right: 8px;
    }

    :host(:focus) {
      outline: 0 none;
    }    

    :host([hidden]) {
      display: none;
    }
  </style>
  <slot></slot>
`

class BlocksButton extends HTMLElement {
  static get observedAttributes() {
    return [ 'disabled' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})

    shadowRoot.appendChild(template.content.cloneNode(true))

    this.addEventListener('keydown', (e) => {
      if (e.keyCode === 32 || e.keyCode === 13) {
        this.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true
          })
        )
      }
    })

    this.addEventListener('click', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopPropagation()
      }
    })

    this._observer = new MutationObserver(() => {
      this.setAttribute('aria-label', this.textContent)
    })
  }

  connectedCallback() {
    this.setAttribute('role', 'button')
    this.setAttribute('tabindex', '0')
    this._observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true
    })
  }

  disconnectedCallback() {
    this._observer.disconnect()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    // only is called for the disabled attribute due to observedAttributes
    if (this.disabled) {
      this.removeAttribute('tabindex')
      this.setAttribute('aria-disabled', 'true')
    }
    else {
      this.setAttribute('tabindex', '0')
      this.setAttribute('aria-disabled', 'false')
    }
  }

  get disabled() {
    return this.getAttribute('disabled') !== null
  }

  set disabled(value) {
    if (value === null || value === false) {
      this.removeAttribute('disabled')
    } 
    else {
      this.setAttribute('disabled', '')
    }
  }
}

if (!customElements.get('blocks-button')) {
  customElements.define('blocks-button', BlocksButton)
}
