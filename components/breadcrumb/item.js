import { upgradeProperty } from '../../common/upgradeProperty.js'
import { __color_primary, __color_primary_dark, __color_primary_light } from '../../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  box-sizing: border-box;
  display: inline-flex;
  flex-flow: row nowrap;
  align-items: center;
  vertical-align: middle;
}

#link {
  white-space: nowrap;
  cursor: default;
  text-decoration: none;
}
#link[href] {
  cursor: pointer;
}
#link[href]:link,
#link[href]:visited {
  color: inherit;
}
#link[href]:hover {
  color: var(--color-primary-light, ${__color_primary_light});
}
#link[href]:active {
  color: var(--color-primary-dark, ${__color_primary_dark});
}

#separator:empty {
  display: none;
}
#separator {
  margin: 0 8px;
  white-space: nowrap;
  user-select: none;
  opacity: .5;
}
</style>`

const TEMPLATE_HTML = `
<a id="link"><slot></slot></a>
<div id="separator"></div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

export class BlocksBreadcrumbItem extends HTMLElement {
  static get observedAttributes() {
    return ['href']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$link = shadowRoot.getElementById('link')
    this.$separator = shadowRoot.getElementById('separator')
  }

  get href() {
    return this.getAttribute('href') ?? 'javascript(void 0)'
  }

  set href(value) {
    this.setAttribute('href', value)
  }

  render() {}

  renderSeparator(separator) {
    if (this.parentElement.lastElementChild === this) return
    this.$separator.innerHTML = separator
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
    if (attrName === 'href') {
      if (this.href) {
        this.$link.setAttribute('href', this.href)
      }
      else {
        this.$link.removeAttribute('href')
      }
    }
  }
}

if (!customElements.get('bl-breadcrumb-item')) {
  customElements.define('bl-breadcrumb-item', BlocksBreadcrumbItem)
}
