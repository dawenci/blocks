import {
  __font_family,
  __color_primary,
  __color_primary_light,
  __color_primary_dark,
  __color_danger,
  __color_danger_light,
  __color_danger_dark,
  __color_success,
  __color_success_light,
  __color_success_dark,
  __color_warning,
  __color_warning_light,
  __color_warning_dark,
  __fg_disabled,

  __border_color_disabled,
  __bg_disabled,
  __transition_duration,
  __fg_base,
  __border_color_base,

  __radius_base,

  __height_base,
  __height_small,
  __height_large,
} from '../../theme/var.js'

import { getRegisteredSvgIcon } from '../../icon/index.js'
import { setDisabled, setRole, setTabindex } from '../../common/accessibility.js'
import { boolGetter, boolSetter, enumGetter, enumSetter } from '../../common/property.js'

const disabledGetter = boolGetter('disabled')
const disabledSetter = boolSetter('disabled')
const loadingGetter = boolGetter('loading')
const loadingSetter = boolSetter('loading')
const blockGetter = boolGetter('block')
const blockSetter = boolSetter('block')
const typeGetter = enumGetter('type', [null, 'primary', 'danger', 'warning', 'success', 'link'])
const typeSetter = enumSetter('type', [null, 'primary', 'danger', 'warning', 'success', 'link'])
const sizeGetter = enumGetter('size', [null, 'small', 'large'])
const sizeSetter = enumSetter('size', [null, 'small', 'large'])

const TEMPLATE_CSS = `
<style>
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
:host {
  display: inline-block;
  vertical-align: middle;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  border-radius: var(--radius-base, ${__radius_base});
  font-family: var(--font-family, ${__font_family});
  cursor: pointer;
  text-align: center;
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  user-select: none;
}
:host([block]) {
  display: block;
}
:host(:focus) {
  outline: 0 none;
}
:host([disabled]),
:host([loading]) {
  outline: 0 none;
  cursor: not-allowed;
}
:host([hidden]) {
  display: none;
}

#layout {
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.icon {
  flex: 0 0 auto;
  display: block;
  position: relative;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  transition: transform var(--transition-duration, ${__transition_duration});
}
.icon svg {
  display: block;
  width: 100%;
  height: 100%;
}
.loading svg {
  position: relative;
  animation: 1s linear infinite rotate360;
}

#label {
  flex: 0 0 auto;
  display: block;
  height: 16px;
  line-height: 16px;
  box-sizing: border-box;
  white-space: nowrap;
}


/* background */
:host,
:host(:hover),
:host(:active) { background-color: #fff; }

:host([type="primary"]) { background-color: var(--color-primary, ${__color_primary}); }
:host([type="primary"]:hover),
:host([type="primary"]:focus) { background-color: var(--color-primary-light, ${__color_primary_light}); }
:host([type="primary"]:active) { background-color: var(--color-primary-dark, ${__color_primary_dark}); }

:host([type="danger"]) { background-color: var(--color-danger, ${__color_danger}); }
:host([type="danger"]:hover),
:host([type="danger"]:focus) { background-color: var(--color-danger-light, ${__color_danger_light}); }
:host([type="danger"]:active) { background-color: ${__color_danger_dark}; }

:host([type="success"]) { background-color: var(--color-success, ${__color_success}); }
:host([type="success"]:hover),
:host([type="success"]:focus) { background-color: var(--color-success-light, ${__color_success_light}); }
:host([type="success"]:active) { background-color: var(--color-success-dark, ${__color_success_dark}); }

:host([type="warning"]) { background-color: var(--color-warning, ${__color_warning}); }
:host([type="warning"]:hover),
:host([type="warning"]:focus) { background-color: var(--color-warning-light, ${__color_warning_light}); }
:host([type="warning"]:active) { background-color: var(--color-danger-dark, var(--color-warning-dark, ${__color_warning_dark})); }

:host([disabled]),
:host([disabled]:hover),
:host([disabled]:focus),
:host([disabled]:active) { background-color: var(--bg-disabled, ${__bg_disabled}); }

:host([loading]),
:host([loading]:hover),
:host([loading]:focus),
:host([loading]:active) {}

:host([outline]),
:host([outline]:hover),
:host([outline]:focus),
:host([outline]:active) { background-color: transparent; }

:host([type="link"]),
:host([type="link"]:hover),
:host([type="link"]:focus),
:host([type="link"]:active) { background-color: transparent; }


/* border-color */
:host { border-color: var(--border-color-base, ${__border_color_base}); }
:host(:hover),
:host(:focus) { border-color: var(--color-primary-light, ${__color_primary_light}); }
:host(:active) { border-color: var(--color-primary-dark, ${__color_primary_dark}); }

:host([type="primary"]) { border-color: var(--color-primary, ${__color_primary}); }
:host([type="primary"]:hover),
:host([type="primary"]:focus) { border-color: var(--color-primary-light, ${__color_primary_light}); }
:host([type="primary"]:active) {border-color: var(--color-primary-dark, ${__color_primary_dark}); }

:host([type="danger"]) { border-color: var(--color-danger, ${__color_danger}); }
:host([type="danger"]:hover),
:host([type="danger"]:focus) { border-color: var(--color-danger-light, ${__color_danger_light}); }
:host([type="danger"]:active) { border-color: ${__color_danger_dark}; }

:host([type="warning"]) { border-color: var(--color-warning, ${__color_warning}); }
:host([type="warning"]:hover),
:host([type="warning"]:focus) { border-color: var(--color-warning-light, ${__color_warning_light}); }
:host([type="warning"]:active) { border-color: var(--color-danger-dark, var(--color-warning-dark, ${__color_warning_dark})); }

:host([type="success"]) { border-color: var(--color-success, ${__color_success}); }
:host([type="success"]:hover),
:host([type="success"]:focus) { border-color: var(--color-success-light, ${__color_success_light}); }
:host([type="success"]:active) { border-color: var(--color-success-dark, ${__color_success_dark}); }

:host([disabled]),
:host([disabled]:hover),
:host([disabled]:focus),
:host([disabled]:active) { border-color: var(--border-color-disabled, ${__border_color_disabled}); }

:host([type="link"]),
:host([type="link"]:hover),
:host([type="link"]:focus),
:host([type="link"]:active) { border-color: transparent; }


/* color */
:host { fill: var(--fg-base, ${__fg_base}); color: var(--fg-base, ${__fg_base}); }
:host(:hover),
:host(:focus) { fill: var(--color-primary-light, ${__color_primary_light}); color: var(--color-primary-light, ${__color_primary_light}); }
:host(:active) { fill: var(--color-primary-dark, ${__color_primary_dark}); color: var(--color-primary-dark, ${__color_primary_dark}); }

:host([type="primary"]),
:host([type="primary"]:hover),
:host([type="primary"]:focus),
:host([type="primary"]:active),
:host([type="danger"]),
:host([type="danger"]:hover),
:host([type="danger"]:focus),
:host([type="danger"]:active),
:host([type="warning"]),
:host([type="warning"]:hover),
:host([type="warning"]:focus),
:host([type="warning"]:active),
:host([type="success"]),
:host([type="success"]:hover),
:host([type="success"]:focus),
:host([type="success"]:active) { fill: #fff; color: #fff; }

:host([type="primary"][outline]) { fill: var(--color-primary, ${__color_primary}); color: var(--color-primary, ${__color_primary}); }
:host([type="primary"][outline]:hover),
:host([type="primary"][outline]:focus) { fill: var(--color-primary-light, ${__color_primary_light}); color: var(--color-primary-light, ${__color_primary_light}); }
:host([type="primary"][outline]:active) { fill: var(--color-primary-dark, ${__color_primary_dark}); color: var(--color-primary-dark, ${__color_primary_dark}); }

:host([type="danger"][outline]) { fill: var(--color-danger, ${__color_danger}); color: var(--color-danger, ${__color_danger}); }
:host([type="danger"][outline]:hover),
:host([type="danger"][outline]:focus) { fill: var(--color-danger-light, ${__color_danger_light}); color: var(--color-danger-light, ${__color_danger_light}); }
:host([type="danger"][outline]:active) { fill: ${__color_danger_dark}; color: ${__color_danger_dark}; }

:host([type="warning"][outline]) { fill: var(--color-warning, ${__color_warning}); color: var(--color-warning, ${__color_warning}); }
:host([type="warning"][outline]:hover),
:host([type="warning"][outline]:focus) { fill: var(--color-warning-light, ${__color_warning_light}); color: var(--color-warning-light, ${__color_warning_light}); }
:host([type="warning"][outline]:active) { fill: var(--color-danger-dark, var(--color-warning-dark, ${__color_warning_dark})); color: var(--color-danger-dark, var(--color-warning-dark, ${__color_warning_dark})); }

:host([type="success"][outline]) { fill: var(--color-success, ${__color_success}); color: var(--color-success, ${__color_success}); }
:host([type="success"][outline]:hover),
:host([type="success"][outline]:focus) { fill: var(--color-success-light, ${__color_success_light}); color: var(--color-success-light, ${__color_success_light}); }
:host([type="success"][outline]:active) { fill: var(--color-success-dark, ${__color_success_dark}); color: var(--color-success-dark, ${__color_success_dark}); }

:host([type="link"]) { fill: var(--color-primary, ${__color_primary}); color: var(--color-primary, ${__color_primary}); }
:host([type="link"]:hover),
:host([type="link"]:focus) { fill: var(--color-primary-light, ${__color_primary_light}); color: var(--color-primary-light, ${__color_primary_light}); }
:host([type="link"]:active) { fill: var(--color-primary-dark, ${__color_primary_dark}); color: var(--color-primary-dark, ${__color_primary_dark}); }

:host([disabled]),
:host([disabled]:hover),
:host([disabled]:focus),
:host([disabled]:active),
:host([disabled][outline]),
:host([disabled][outline]:hover),
:host([disabled][outline]:focus),
:host([disabled][outline]:active) { fill: var(--color-disabled, ${__fg_disabled}); color: var(--color-disabled, ${__fg_disabled}); }


/* size */
:host {
  height: var(--height-base, ${__height_base});
  padding: 0 calc(var(--height-base, ${__height_base}) / 4);
  font-size: 14px;
}
:host([icon]) #layout:not(.empty) .icon {
  margin: 0 2px 0 4px;
}
:host #layout:not(.empty) #label {
  margin: 0 4px;
}
:host([round]) {
  border-radius: calc(var(--height-base, ${__height_base}) / 2);
}

:host([size="small"]) {
  height: var(--height-small, ${__height_small});
  padding: 0 calc(var(--height-base, ${__height_small}) / 4 - 2px);
  font-size: 14px;
}
:host([size="small"][round]) {
  border-radius: calc(var(--height-base, ${__height_small}) / 2);
}

:host([size="large"]) {
  height: var(--height-large, ${__height_large});
  padding: 0 calc(var(--height-base, ${__height_large}) / 4 + 1px);
  font-size: 16px;
}
:host([size="large"][round]) {
  border-radius: calc(var(--height-base, ${__height_large}) / 2);
}


/* button group */
:host-context(bl-button-group) {
  position: relative;
  vertical-align: top;
}
:host-context(bl-button-group):host(:hover),
:host-context(bl-button-group):host(:focus-within) {
  z-index: 1;
}
:host-context(bl-button-group):host(:not(:first-of-type)) {
  margin-left: -1px;
}
:host-context(bl-button-group) {
  border-radius: 0;
}
:host-context(bl-button-group):host(:first-of-type) {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
:host-context(bl-button-group):host(:last-of-type) {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
</style>
`
const TEMPLATE_HTML = `
<div id="layout"><span id="label"><slot id="slot"></slot></span></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksButton extends HTMLElement {
  static get observedAttributes() {
    return [ 'type', 'size', 'disabled', 'loading', 'icon' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$label = shadowRoot.getElementById('label')
    this.$slot = shadowRoot.getElementById('slot')

    this.addEventListener('keydown', (e) => {
      if (this.disabled) {
        e.preventDefault()
        e.stopImmediatePropagation()
        return
      }
      if (e.keyCode === 32 || e.keyCode === 13) {
        this.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true
          })
        )
      }
    })

    // disabled 状态，阻止点击，使用捕获模式，
    // 因为经过测试，在组件外面绑定的事件，会先于此处触发
    // 导致无法成功阻止
    this.addEventListener('click', (e) => {
      if (this.disabled || this.loading) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }, true)

    this._observer = new MutationObserver(() => {
      this.setAttribute('aria-label', this.textContent)
    })
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get loading() {
    return loadingGetter(this)
  }

  set loading(value) {
    loadingSetter(this, value)
  }

  get block() {
    return blockGetter(this)
  }

  set block(value) {
    blockSetter(this, value)
  }

  get type() {
    return typeGetter(this)
  }

  set type(value) {
    typeSetter(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get icon() {
    return this.getAttribute('icon')
  }

  set icon(value) {
    this.setAttribute('icon', value)
  }

  render() {
    this.$layout.classList[this.$slot.assignedNodes().length ? 'remove' : 'add']('empty')

    const icon = this.loading
      ? getRegisteredSvgIcon('loading')
      : getRegisteredSvgIcon(this.icon)
    if (icon) {
      if (this.$icon) {
        this.$layout.removeChild(this.$icon)
      }
      this.$icon = this.$layout.insertBefore(document.createElement('span'), this.$label)
      this.$icon.className = 'icon'
      this.$icon.classList[this.loading ? 'add' : 'remove']('loading')
      this.$icon.setAttribute('part', 'prefix')
      this.$icon.appendChild(icon)
    }
    else {
      if (this.$icon) {
        if (this.$icon.parentElement) this.$icon.parentElement.removeChild(this.$icon)
        this.$icon = null
      }
    }
  }

  connectedCallback() {
    setRole(this, 'button')
    setDisabled(this, this.disabled)
    setTabindex(this, !this.disabled)

    this._observer.observe(this, {
      childList: true,
      characterData: true,
      subtree: true
    })

    this.render()
  }

  disconnectedCallback() {
    this._observer.disconnect()
  }

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'disabled') {
      setDisabled(this, this.disabled)
      setTabindex(this, !this.disabled)
    }
    this.render()
  }
}

if (!customElements.get('bl-button')) {
  customElements.define('bl-button', BlocksButton)
}
