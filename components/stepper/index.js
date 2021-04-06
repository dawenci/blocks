import { enumGetter, enumSetter, intGetter, intSetter } from '../../common/property.js'
import { sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { parseIcon } from '../../icon/index.js'
import { __border_color_base, __color_danger, __color_primary, __color_success, __fg_placeholder, __fg_secondary, __font_size_large, __font_size_small, __height_base, __height_large, __height_small } from '../../theme/var.js'

const STEPS_TEMPLATE = `<style>
:host {
  display: block;
  box-sizing: border-box;
}

#layout {
  display: flex;
}
:host(:not([direction="vertical"])) #layout,
:host([direction="horizontal"]) #layout {
  flex-flow: row nowrap;
}
:host([direction="vertical"]) #layout {
  flex-flow: column nowrap;
}

</style>

<div id="layout">
  <slot></slot>
</div>`
const stepperTemplate = document.createElement('template')
stepperTemplate.innerHTML = STEPS_TEMPLATE

class BlocksSteps extends HTMLElement {
  static get observedAttributes() {
    return ['direction', 'size']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(stepperTemplate.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
    this.$slot = shadowRoot.querySelector('slot')
  }

  get direction() {
    return enumGetter('direction', [null, 'horizontal', 'vertical'])(this)
  }

  set direction(value) {
    enumSetter('direction', [null, 'horizontal', 'vertical'])(this, value)
  }

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  render() {}

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()    
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  attributeChangedCallback(attrName, oldVal, newVal) {}

  stepIndex($step) {
    return this.$slot.assignedElements().findIndex($el => $el === $step)
  }
}

if (!customElements.get('bl-stepper')) {
  customElements.define('bl-stepper', BlocksSteps)
}


const STEP_TEMPLATE = `<style>
:host {
  --size: var(--height-base, ${__height_base});

  flex: 1 1 auto;
  display: inline-block;
  box-sizing: border-box;
}
:host-context(bl-stepper[direction="vertical"]):host(:not(:first-child)) {
  margin-top: 10px;
}
:host-context(bl-stepper:not([direction="vertical"])):host(:not(:first-child)) {
  margin-left: 10px;
}


#layout {
  overflow: hidden;
  position: relative;
  padding-left: calc(var(--size) + 10px);
}
:host-context(bl-stepper[direction="vertical"]) #layout {
  padding-bottom: 10px;
}
:host-context(bl-stepper[direction="vertical"]) #layout:after {
  content: '';
  position: absolute;
  top: calc(var(--size) + 10px);
  left: calc(var(--size) / 2);
  margin: auto;
  width: 1px;
  height: 99999px;
  background: var(--border-color-base, ${__border_color_base});
}

:host(:last-child) #title:after,
:host(:last-child) #layout:after {
  display: none;
}

#icon.empty,
#title.empty,
#description.empty {
  display: none;
}

#icon {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
}
#icon > i {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  font-style: normal;
}

#title {
  display: inline-block;
  position: relative;
  height: var(--size);
  line-height: var(--size);
  padding-right: 10px;
  white-space: nowrap;
  font-size: var(--font-size-large, ${__font_size_large});
}
:host-context(bl-stepper:not([direction="vertical"])) #title:after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  left: 100%;
  width: 99999px;
  height: 1px;
  background: var(--border-color-base, ${__border_color_base});
}

#description {
  color: var(--fg-secondary, ${__fg_secondary});  
  font-size: var(--font-size-small, ${__font_size_small});
}

:host-context(bl-stepper[size="small"]) {
  --size: var(--height-small, ${__height_small});
}
:host-context(bl-stepper[size="large"]) {
  --size: var(--height-large, ${__height_large});
}

:host([status="success"]) {
  color: var(--color-success, ${__color_success});
  fill: var(--color-success, ${__color_success});
}
:host([status="success"]) #icon i {
  border-color: var(--color-success, ${__color_success});
}
:host([status="success"]) #description {
  color: var(--color-success, ${__color_success});
}
:host([status="success"]) #title:after {
  background-color: var(--color-success, ${__color_success});
}

:host([status="error"]) {
  color: var(--color-danger, ${__color_danger});
  fill: var(--color-danger, ${__color_danger});
}
:host([status="error"]) #icon i {
  border-color: var(--color-danger, ${__color_danger});
}
:host([status="error"]) #description {
  color: var(--color-danger, ${__color_danger});
}
:host([status="error"]) #title:after {
  background-color: var(--color-danger, ${__color_danger});
}

:host([status="process"]) {
  color: var(--color-primary, ${__color_primary});
  fill: var(--color-primary, ${__color_primary});
}
:host([status="process"]) #icon i {
  border-color: var(--color-primary, ${__color_primary});
}
:host([status="process"]) #description {
  color: var(--color-primary, ${__color_primary});
}
:host([status="process"]) #title:after {
  background-color: var(--color-primary, ${__color_primary});
}

:host([status="wait"]) {
  color: var(--fg-placeholder, ${__fg_placeholder});
  fill: var(--fg-placeholder, ${__fg_placeholder});
}
:host([status="wait"]) #icon i {
  border-color: var(--fg-placeholder, ${__fg_placeholder});
}
:host([status="wait"]) #description {
  color: var(--fg-placeholder, ${__fg_placeholder});
}
:host([status="wait"]) #title:after {
  background-color: var(--fg-placeholder, ${__fg_placeholder});
}
</style>

<div id="layout">
  <div id="icon">
    <slot name="icon"></slot>
  </div>
  <div id="content">
    <div id="title">
      <slot name="title"></slot>
    </div>
    <div id="description">
      <slot name="description"></slot>
    </div>
  </div>
</div>`
const stepTemplate = document.createElement('template')
stepTemplate.innerHTML = STEP_TEMPLATE

class BlocksStep extends HTMLElement {
  static get observedAttributes() {
    return ['step-title', 'description', 'icon', 'status']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(stepTemplate.content.cloneNode(true))

    this.$layout = shadowRoot.getElementById('layout')
    this.$icon = shadowRoot.getElementById('icon')
    this.$title = shadowRoot.getElementById('title')
    this.$description = shadowRoot.getElementById('description')

    Array.prototype.forEach.call(shadowRoot.querySelectorAll('slot'), $slot => {
      const $parent = $slot.parentElement
      $slot.addEventListener('slotchange', e => {
        switch ($parent) {
          case this.$icon: return this._renderIcon()
          case this.$title: return this._renderTitle()
          case this.$description: return this._renderDescription()
        }
      })
    })
  }

  get $stepper() {
    return this.closest('bl-stepper')
  }

  get stepTitle() {
    return this.getAttribute('step-title')
  }

  set stepTitle(value) {
    this.setAttribute('step-title', value)
  }

  get description() {
    return this.getAttribute('description')
  }

  set description(value) {
    this.setAttribute('description', value)
  }

  get icon() {
    return this.getAttribute('icon')
  }

  set icon(value) {
    this.setAttribute('icon', value)
  }

  get status() {
    return enumGetter('status', [null, 'wait', 'process', 'success', 'error'])(this)
  }

  set status(value) {
    enumSetter('status', [null, 'wait', 'process', 'success', 'error'])(this, value)
  }

  render() {
    this._renderIcon()
    this._renderTitle()
    this._renderDescription()
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
    switch (attrName) {
      case 'icon': {
        this._renderIcon()
        break
      }
      case 'step-title': {
        this._renderTitle()
        break
      }
      case 'description': {
        this._renderDescription()
        break
      }
    }
  }

  _renderContent($slotParent, $default) {
    let empty = true
    const $slot = $slotParent.querySelector('slot')
    if ($slot.assignedNodes().filter($node => $node.nodeType === 1 || $node.nodeType === 3).length) {
      empty = false
    }
    else if ($default) {
      $slotParent.innerHTML = ''
      $slotParent.appendChild($slot)
      $slotParent.appendChild($default)
      empty = false
    }
    $slotParent.classList.toggle('empty', empty)
  }

  _renderIcon() {
    let $default = parseIcon(this.icon)
    if (!$default) {
      $default = document.createElement('i')
      $default.textContent = this.$stepper.stepIndex(this) + 1
    }
    this._renderContent(this.$icon, $default)
  }

  _renderTitle() {
    this._renderContent(this.$title, document.createTextNode(this.stepTitle))
  }

  _renderDescription() {
    this._renderContent(this.$description, document.createTextNode(this.description))
  }  
}

if (!customElements.get('bl-step')) {
  customElements.define('bl-step', BlocksStep)
}
