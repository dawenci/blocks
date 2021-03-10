import { intGetter, intSetter } from '../../common/property.js'
import { scrollTo } from '../../common/scrollTo.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { find, range } from '../../common/utils.js'
import { __color_primary, __height_small, __transition_duration } from '../theme/var.js'

const TEMPLATE_CSS = `<style>
:host {
  display: inline-block;
  box-sizing: border-box;
  width: 156px;
  height: 248px;
  background: #fff;
}

#layout {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
#layout > ol {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
  list-style: none;
  width: 52px;
  margin: 0;
  padding: 0;
}
#layout > ol:hover {
  overflow: auto;
  background: rgba(0,0,0,.025);
}
#layout > ol:after {
  display: block;
  content: '';
  height: calc(100% - var(--height-small, ${__height_small}));
}
#hours {}
#minutes {}
#seconds {}
li {
  height: var(--height-small, ${__height_small});
  line-height: var(--height-small, ${__height_small});
  padding: 0 0 0 12px;
  cursor: default;
}
li:hover {
  background-color: #f0f0f0;
}

li:active,
li.active,
li.active:hover {
  font-weight: 700;
  color: var(--color-primary, ${__color_primary});
}

</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <ol id="hours"></ol>
  <ol id="minutes"></ol>
  <ol id="seconds"></ol>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

class BlocksTimePanel extends HTMLElement {
  static get observedAttributes() {
    return ['hour', 'minute', 'second']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$hours = shadowRoot.getElementById('hours')
    this.$minutes = shadowRoot.getElementById('minutes')
    this.$seconds = shadowRoot.getElementById('seconds')

    const handler = (prop) => {
      return (e) => {
        const target = e.target
        if (target.tagName === 'LI') {
          const value = +target.textContent
          this[prop] = value
        }
      }
    }
    this.$hours.onclick = handler('hour')
    this.$minutes.onclick = handler('minute')
    this.$seconds.onclick = handler('second')
  }

  get hour() {
    return intGetter('hour')(this)
  }

  set hour(value) {
    intSetter('hour')(this, value)
  }

  get minute() {
    return intGetter('minute')(this)
  }

  set minute(value) {
    intSetter('minute')(this, value)
  }

  get second() {
    return intGetter('second')(this)
  }

  set second(value) {
    intSetter('second')(this, value)
  }

  render() {
    if (!this.$hours.children.length) {
      range(0, 23).forEach(n => {
        const $li = this.$hours.appendChild(document.createElement('li'))
        $li.textContent = n < 10 ? '0' + n : n
      })
    }
    if (!this.$minutes.children.length) {
      range(0, 59).forEach(n => {
        const $li = this.$minutes.appendChild(document.createElement('li'))
        $li.textContent = n < 10 ? '0' + n : n
      })
    }
    if (!this.$seconds.children.length) {
      range(0, 59).forEach(n => {
        const $li = this.$seconds.appendChild(document.createElement('li'))
        $li.textContent = n < 10 ? '0' + n : n
      })
    }
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
    if (['hour', 'minute', 'second'].includes(attrName)) {
      const $list = this[`$${attrName}s`]
      const $old = $list.querySelector('.active')
      if ($old) $old.classList.remove('active')
      const $new = find($list.children, $li => +$li.textContent === +newVal)
      if ($new) {
        $new.classList.add('active')
        scrollTo($list, $new.offsetTop, { duration: .16 })
      }

      if (newVal != null) {
        if (this.hour == null) this.hour = 0
        if (this.minute == null) this.minute = 0
        if (this.second == null) this.second = 0
      }
    }
  }
}

if (!customElements.get('bl-time-panel')) {
  customElements.define('bl-time-panel', BlocksTimePanel)
}
