import { boolGetter, boolSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import {
  __font_family,
  __border_color_base,
  __height_base,
  __height_small,
  __height_large,
  __radius_base,
  __color_primary,
  __color_danger,
  __color_success,
  __color_warning,
  __transition_duration,
} from '../theme/var.js'
import { dispatchEvent } from '../../common/event.js'

const closeableGetter = boolGetter('closeable')
const closeableSetter = boolSetter('closeable')
const outlineGetter = boolGetter('outline')
const outlineSetter = boolSetter('outline')

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  border-radius: var(--radius-base, ${__radius_base});
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  text-align: center;
  transition: color var(--transition-duration, ${__transition_duration}), border-color var(--transition-duration, ${__transition_duration});
  user-select: none;
  font-family: var(--font-family, ${__font_family});
}

#layout {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

#label   {
  flex: 1 1 100%;
  display: block;
  height: 16px;
  line-height: 16px;
  box-sizing: border-box;
  white-space: nowrap;
}

#close {
  flex: 0 0 auto;
  position: relative;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  margin: 0 6px 0 -2px;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  transform: rotate(45deg);
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  transition: transform var(--transition-duration, ${__transition_duration});
}
#close:focus {
  outline: 0 none;
}
#close::before,
#close::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  content: '';
  width: 2px;
  height: 2px;
  margin: auto;
}
#close::before {
  width: 8px;
}
#close::after {
  height: 8px;
}


/* background */
:host { background-color: #fff; }
:host([type="primary"]) { background-color: var(--color-primary, ${__color_primary}); }
:host([type="danger"]) { background-color: var(--color-danger, ${__color_danger}); }
:host([type="success"]) { background-color: var(--color-success, ${__color_success}); }
:host([type="warning"]) { background-color: var(--color-warning, ${__color_warning}); }
:host([outline]) { background-color: transparent; }


/* border-color */
:host { border-color: var(--border-color-base, ${__border_color_base}); }
:host([type="primary"]) { border-color: var(--color-primary, ${__color_primary}); }
:host([type="danger"]) { border-color: var(--color-danger, ${__color_danger}); }
:host([type="warning"]) { border-color: var(--color-warning, ${__color_warning}); }
:host([type="success"]) { border-color: var(--color-success, ${__color_success}); }


/* color */
:host([type="primary"]),
:host([type="danger"]),
:host([type="warning"]),
:host([type="success"]) { color: #fff; }
:host([type="primary"][outline]) { color: var(--color-primary, ${__color_primary}) }
:host([type="danger"][outline]) { color: var(--color-danger, ${__color_danger}) }
:host([type="warning"][outline]) { color: var(--color-warning, ${__color_warning}) }
:host([type="success"][outline])  { color: var(--color-success, ${__color_success}) }


/* close color */
#close::before,
#close::after { background: #ddd; }
#close:hover { border-color: #ccc; }
#close:hover::before,
#close:hover::after { background: #ccc; }

:host([type="primary"]) #close::before,
:host([type="primary"]) #close::after,
:host([type="danger"]) #close::before,
:host([type="danger"]) #close::after,
:host([type="warning"]) #close::before,
:host([type="warning"]) #close::after,
:host([type="success"]) #close::before,
:host([type="success"]) #close::after { background-color: #fff; }
:host([type="primary"]) #close:hover,
:host([type="danger"]) #close:hover,
:host([type="warning"]) #close:hover,
:host([type="success"]) #close:hover { border-color: #fff; }

:host([type="primary"][outline]) #close::before,
:host([type="primary"][outline]) #close::after { background-color: var(--color-primary, ${__color_primary}) }
:host([type="primary"][outline]) #close:hover { border-color: var(--color-primary, ${__color_primary}) }

:host([type="danger"][outline]) #close::before,
:host([type="danger"][outline]) #close::after { background-color: var(--color-danger, ${__color_danger}) }
:host([type="danger"][outline]) #close:hover { border-color: var(--color-danger, ${__color_danger}) }

:host([type="warning"][outline]) #close::before,
:host([type="warning"][outline]) #close::after { background-color: var(--color-warning, ${__color_warning}) }
:host([type="warning"][outline]) #close:hover { border-color: var(--color-warning, ${__color_warning}) }

:host([type="success"][outline]) #close::before,
:host([type="success"][outline]) #close::after { background-color: var(--color-success, ${__color_success}) }
:host([type="success"][outline]) #close:hover { border-color: var(--color-success, ${__color_success}) }


/* size */
:host {
  height: var(--height-base, ${__height_base});
  padding: 0 calc(var(--height-base, ${__height_base}) / 8);
  font-size: 14px;
}
:host([round]) {
  border-radius: calc(var(--height-base, ${__height_base}) / 2);
}
:host #label {
  margin: 0 calc(var(--height-base, ${__height_base}) / 4);
}

:host([size="small"]) {
  height: var(--height-small, ${__height_small});
  padding: 0 calc(var(--height-base, ${__height_small}) / 8);
  font-size: 14px;
}
:host([size="small"][round]) {
  border-radius: calc(var(--height-base, ${__height_small}) / 2);
}
:host([size="small"]) #label {
  margin: 0 calc(var(--height-base, ${__height_small}) / 4);
}

:host([size="large"]) {
  height: var(--height-large, ${__height_large});
  padding: 0 calc(var(--height-base, ${__height_large}) / 8);
  font-size: 16px;
}
:host([size="large"][round]) {
  border-radius: calc(var(--height-base, ${__height_large}) / 2);
}
:host([size="large"]) #label {
  margin: 0 calc(var(--height-base, ${__height_large}) / 4);
}
</style>`

const TEMPLATE_HTML = `
<div id="layout"><span id="label"><slot></slot></span></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksTag extends HTMLElement {
  static get observedAttributes() {
    return [ 'type', 'size', 'closeable', 'round' ]
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')

    this.shadowRoot.addEventListener('click', e => {
      if (e.target.id === 'close') {
        dispatchEvent(this, 'close')
      }
    })
  }

  get closeable() {
    return closeableGetter(this)
  }

  set closeable(value) {
    closeableSetter(this, value)
    this.render()
  }

  get outline() {
    return outlineGetter(this)
  }

  set outline(value) {
    outlineSetter(this, value)
    this.render()
  }

  render() {
    if (this.closeable) {
      if (!this.shadowRoot.getElementById('close')) {
        const button = this.$layout.appendChild(document.createElement('button'))
        button.id = 'close'
      }
    }
    else {
      const button = this.shadowRoot.getElementById('close')
      if (button) {
        button.parentElement.removeChild(button)
      }
    }
  }

  connectedCallback() {
    this.constructor.observedAttributes.forEach(attr => {
      upgradeProperty(this, attr)
    })
    this.render()
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.render()
  }
}

if (!customElements.get('blocks-tag')) {
  customElements.define('blocks-tag', BlocksTag)
}
