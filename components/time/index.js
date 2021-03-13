import { dispatchEvent } from '../../common/event.js'
import { intGetter, intSetter } from '../../common/property.js'
import { scrollTo } from '../../common/scrollTo.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { find, forEach, range } from '../../common/utils.js'
import { __color_primary, __height_base, __height_large, __height_small, __transition_duration } from '../../theme/var.js'

const TEMPLATE_CSS = `<style>
::-webkit-scrollbar {
  background: transparent;
  background: rgba(0, 0, 0, .075);
}
::-webkit-scrollbar:vertical {
  width: 6px;
  height: 100%;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, .2);
}
::-webkit-scrollbar-corner {
  background: transparent;
}
* {
  scrollbar-width: thin;
}

:host {
  display: inline-block;
  box-sizing: border-box;
  width: calc(var(--height-base, ${__height_base}) * 3 + 12px * 3);
  height: calc(var(--height-base, ${__height_base}) * 8 + 10px);
  background: #fff;
  user-select: none;
  font-size: 14px;
}
:host([size="small"]) {
  width: calc(var(--height-small, ${__height_small}) * 3 + 12px * 3);
  height: calc(var(--height-small, ${__height_small}) * 8 + 10px);
  font-size: 12px;
}
:host([size="large"]) {
  width: calc(var(--height-large, ${__height_large}) * 3 + 12px * 3);
  height: calc(var(--height-large, ${__height_large}) * 8 + 10px);
}

#layout {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
#layout:after {
  position: absolute;
  top: var(--height-base, ${__height_base});
  left: 0;
  right: 0;
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  background-color: rgba(0,0,0,.05);
}
:host([size="small"]) #layout:after {
  top: var(--height-small, ${__height_small});
}
:host([size="large"]) #layout:after {
  top: var(--height-large, ${__height_large});
}

#layout > ol {
  position: relative;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
  list-style: none;
  width: calc(var(--height-base, ${__height_base}) + 12px);
  margin: 0;
  padding: 0;
}
:host([size="small"]) #layout > ol {
  width: calc(var(--height-small, ${__height_small}) + 12px);
}
:host([size="large"]) #layout > ol {
  width: calc(var(--height-large, ${__height_large}) + 12px);
}

#layout > ol:hover {
  overflow: auto;
  background: rgba(0,0,0,.025);
}
#layout > ol:after {
  display: block;
  content: '';
  height: calc(100% - var(--height-base, ${__height_base}));
}
:host([size="small"]) #layout > ol:after {
  height: calc(100% - var(--height-small, ${__height_small}));
}
:host([size="large"]) #layout > ol:after {
  height: calc(100% - var(--height-large, ${__height_large}));
}

#hours {}
#minutes {}
#seconds {}
li {
  height: var(--height-base, ${__height_base});
  line-height: var(--height-base, ${__height_base});
  padding: 0 0 0 12px;
  cursor: default;
}
:host([size="small"]) li {
  height: var(--height-small, ${__height_small});
  line-height: var(--height-small, ${__height_small});
}
:host([size="large"]) li {
  height: var(--height-large, ${__height_large});
  line-height: var(--height-large, ${__height_large});
}

li:hover {
  font-weight: 700;
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

class BlocksTime extends HTMLElement {
  static get observedAttributes() {
    return ['hour', 'minute', 'second', 'size']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))
    this.$layout = shadowRoot.getElementById('layout')
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
      if (newVal === null) {
        forEach(this.$layout.querySelectorAll('.active'), active => {
          active.classList.remove('active')
        })
        this.hour = this.minute = this.second = null
        this.$hours.scrollTop = 0
        this.$minutes.scrollTop = 0
        this.$seconds.scrollTop = 0
      }
      else {
        const $list = this[`$${attrName}s`]

        const $old = $list.querySelector('.active')
        if ($old) $old.classList.remove('active')
  
        const $new = find($list.children, $li => +$li.textContent === +newVal)
        if ($new) {
          $new.classList.add('active')
          scrollTo($list, $new.offsetTop, { duration: .16 })
        }
  
        if (attrName !== 'hour' && !this.hour) this.hour = 0
        if (attrName !== 'minute' &&!this.minute) this.minute = 0
        if (attrName !== 'second' &&!this.second) this.second = 0
      }

      dispatchEvent(this, 'change', { detail: { hour: this.hour, minute: this.minute, second: this.second } })
    }
  }
}

if (!customElements.get('bl-time')) {
  customElements.define('bl-time', BlocksTime)
}
