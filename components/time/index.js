import '../scrollable/index.js'
import { dispatchEvent } from '../../common/event.js'
import { intRangeGetter, intRangeSetter } from '../../common/property.js'
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
  vertical-align: top;
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

.col {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  float: left;
  width: calc(var(--height-base, ${__height_base}) + 12px);
  height: 100%;
  margin: 0;
  padding: 0;
}
:host([size="small"]) .col {
  width: calc(var(--height-small, ${__height_small}) + 12px);
}
:host([size="large"]) .col {
  width: calc(var(--height-large, ${__height_large}) + 12px);
}

#layout > .col:hover {
  background: rgba(0,0,0,.025);
}
#layout > .col:after {
  display: block;
  content: '';
  height: calc(100% - var(--height-base, ${__height_base}));
}
:host([size="small"]) #layout > .col:after {
  height: calc(100% - var(--height-small, ${__height_small}));
}
:host([size="large"]) #layout > .col:after {
  height: calc(100% - var(--height-large, ${__height_large}));
}

#hours {}
#minutes {}
#seconds {}
.item {
  height: var(--height-base, ${__height_base});
  line-height: var(--height-base, ${__height_base});
  text-align: center;
  cursor: default;
}
:host([size="small"]) .item {
  height: var(--height-small, ${__height_small});
  line-height: var(--height-small, ${__height_small});
}
:host([size="large"]) .item {
  height: var(--height-large, ${__height_large});
  line-height: var(--height-large, ${__height_large});
}

.item:hover {
  font-weight: 700;
  background-color: #f0f0f0;
}

.item:active,
.item.active,
.item.active:hover {
  font-weight: 700;
  color: var(--color-primary, ${__color_primary});
}

.bot {
  height: calc(100% - var(--height-base, ${__height_base}));
}
:host([size="small"]) .bot {
  height: calc(100% - var(--height-small, ${__height_small}));
}
:host([size="large"]) .bot {
  height: calc(100% - var(--height-large, ${__height_large}));
}
</style>`

const TEMPLATE_HTML = `
<div id="layout">
  <bl-scrollable class="col" id="hours"></bl-scrollable>
  <bl-scrollable class="col" id="minutes"></bl-scrollable>
  <bl-scrollable class="col" id="seconds"></bl-scrollable>
</div>
`

const template = document.createElement('template')
template.innerHTML = TEMPLATE_CSS + TEMPLATE_HTML

export default class BlocksTime extends HTMLElement {
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
        if (target.classList.contains('item')) {
          const value = +target.textContent
          this[prop] = value

          requestAnimationFrame(() => {
            forEach(this.$layout.querySelectorAll('.active'), $active => {
              scrollTo($active.parentElement, $active.offsetTop, { duration: .16 })
            })
          })
        }
      }
    }
    this.$hours.onclick = handler('hour')
    this.$minutes.onclick = handler('minute')
    this.$seconds.onclick = handler('second')
  }

  get hour() {
    return intRangeGetter('hour', 0, 23)(this)
  }

  set hour(value) {
    intRangeSetter('hour', 0, 23)(this, value)
  }

  get minute() {
    return intRangeGetter('minute', 0, 59)(this)
  }

  set minute(value) {
    intRangeSetter('minute', 0, 59)(this, value)
  }

  get second() {
    return intRangeGetter('second', 0, 59)(this)
  }

  set second(value) {
    intRangeSetter('second', 0, 59)(this, value)
  }

  render() {
    if (!this.$hours.children.length) {
      range(0, 23).forEach(n => {
        const $item = this.$hours.appendChild(document.createElement('div'))
        $item.className = 'item'
        $item.textContent = n < 10 ? '0' + n : n
      })
      const $bot = this.$hours.appendChild(document.createElement('div'))
      $bot.className = 'bot'
    }
    if (!this.$minutes.children.length) {
      range(0, 59).forEach(n => {
        const $item = this.$minutes.appendChild(document.createElement('div'))
        $item.className = 'item'
        $item.textContent = n < 10 ? '0' + n : n
      })
      const $bot = this.$minutes.appendChild(document.createElement('div'))
      $bot.className = 'bot'
    }
    if (!this.$seconds.children.length) {
      range(0, 59).forEach(n => {
        const $item = this.$seconds.appendChild(document.createElement('div'))
        $item.className = 'item'
        $item.textContent = n < 10 ? '0' + n : n
      })
      const $bot = this.$seconds.appendChild(document.createElement('div'))
      $bot.className = 'bot'
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
