import '../icon/index.js'
import { dispatchEvent } from '../../common/event.js'
import { intGetter, intSetter } from '../../common/property.js'
import { disabledGetter, disabledSetter, sizeGetter, sizeSetter } from '../../common/propertyAccessor.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { __border_color_base, __border_color_disabled, __color_primary, __color_primary_dark, __color_primary_light, __fg_base, __fg_disabled, __height_base, __height_large, __height_small, __radius_base, __transition_duration } from '../../theme/var.js'

const template = document.createElement('template')
template.innerHTML = `<style>
:host {
  --button-size: var(--height-base, ${__height_base});

  display: block;
  box-sizing: border-box;
}
:host([size="small"]) {
  --button-size: var(--height-small, ${__height_small});
}
:host([size="large"]) {
  --button-size: var(--height-large, ${__height_large});
}

#layout {
  display: flex;
  flex-flow: row nowrap;
}
button {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  min-width: var(--button-size);
  height: var(--button-size);
  line-height: var(--button-size);
  margin: 0 2px;
  padding: 0 calc(var(--button-size) / 4px);
  border: 0;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  background: none;
  border-radius: var(--radius-base, ${__radius_base});
  cursor: pointer;
  color: var(--fg-base, ${__fg_base});
  fill: var(--fg-base, ${__fg_base});
  transition: all var(--transition-duration, ${__transition_duration});
}
button.current {
  color: var(--color-primary, ${__color_primary});
  fill: var(--color-primary, ${__color_primary});
  border-color: var(--color-primary, ${__color_primary});
}
button:hover {
  color: var(--color-primary-light, ${__color_primary_light});
  fill: var(--color-primary-light, ${__color_primary_light});
  border-color: var(--color-primary-light, ${__color_primary_light});
}
button:active {
  color: var(--color-primary-dark, ${__color_primary_dark});
  fill: var(--color-primary-dark, ${__color_primary_dark});
  border-color: var(--color-primary-dark, ${__color_primary_dark});
}
button:focus {
  outline: none;
}

button[disabled],
button[disabled]:hover,
button[disabled]:active,
:host([disabled]) button,
:host([disabled]) button:hover,
:host([disabled]) button:active {
  color: var(--fg-disabled, ${__fg_disabled});
  fill: var(--fg-disabled, ${__fg_disabled});
  border-color: var(--border-color-disabled, ${__border_color_disabled});
  cursor: not-allowed;
}

bl-icon {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  cursor: inherit;
}

#pager {
  display: flex;
  flex-flow: row nowrap;
}
#items {
  display: flex;
  flex-flow: row nowrap;
}
</style>

<div id="layout">
  <div id="total"></div>
  <div id="sizes"></div>
  <div id="pager">
    <button id="prev"><bl-icon value="left"></button>
    <div id="items"></div>
    <button id="next"><bl-icon value="right"></button>
  </div>
  <div id="jump"></div>
</div>`

const itemTemplate = document.createElement('button')

const moreTemplate = document.createElement('bl-icon')
moreTemplate.value = 'more'

export class BlocksPagination extends HTMLElement {
  static get observedAttributes() {
    return ['current', 'disabled', 'page-size', 'page-sizes', 'order', 'size', 'total']
  }

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$pager = shadowRoot.getElementById('pager')
    this.$items = shadowRoot.getElementById('items')
    this.$prev = shadowRoot.getElementById('prev')
    this.$next = shadowRoot.getElementById('next')
    this.$jump = shadowRoot.getElementById('jump')
    this.$sizes = shadowRoot.getElementById('sizes')
    this.$total = shadowRoot.getElementById('total')

    this._itemPool = []

    this.$prev.onclick = e => this._prev()
    this.$next.onclick = e => this._next()

    this.$items.onclick = e => {
      if (this.disabled) return
      let $button = e.target
      if ($button.tagName === 'BL-ICON') $button = $button.parentElement
      if ($button.tagName !== 'BUTTON') return
      if ($button.classList.contains('quick-prev')) {
        return this._quickPrev()
      }
      else if ($button.classList.contains('quick-next')) {
        return this._quickNext()
      }
      this.current = $button.textContent
    }
  }

  get current() {
    return intGetter('current', 1)(this)
  }

  set current(value) {
    intSetter('current')(this, value)
  }

  get disabled() {
    return disabledGetter(this)
  }

  set disabled(value) {
    disabledSetter(this, value)
  }

  get pageSize() {
    return intGetter('page-size', 10)(this)
  }

  set pageSize(value) {
    intSetter('page-size', )(this, value)
  }

  get pageSizes() {
    return this.getAttribute('page-sizes')
  }

  set pageSizes(value) {
    this.setAttribute('page-sizes', value)
  }

  get showQuickJumper() {}

  get showSizeChanger() {}

  get showTotal() {}

  get size() {
    return sizeGetter(this)
  }

  set size(value) {
    sizeSetter(this, value)
  }

  get total() {
    return intGetter('total')(this)
  }

  set total(value) {
    intSetter('total')(this, value)
  }

  get itemCount() {
    return Math.ceil(this.total / this.pageSize)
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
    this.render()
    if (attrName === 'current') {
      dispatchEvent(this, 'change-current', { detail: { current: this.current } })
    }

    if (attrName === 'page-size') {
      dispatchEvent(this, 'change-page-size', { detail: { pageSize: this.pageSize } })
    }
  }

  render() {
    this._renderPager()
    this.$prev.disabled = this.current === 1
    this.$next.disabled = this.current === this.itemCount
  }

  _renderPager() {
    const showQuickPrev = this.current > 4
    const showQuickNext = (this.itemCount - this.current) > 3
    const count = this.itemCount < 8 ? this.itemCount : showQuickPrev && showQuickNext ? 9 : 8
    this._ensureItem(count)
    const children = this.$items.children

    forEach(children, $item => {
      if ($item.classList.contains('current')) {
        $item.classList.remove('current')
      }
      if ($item.classList.contains('quick-prev')) {
        $item.classList.remove('quick-prev')
        $item.innerHTML = ''
      }
      if ($item.classList.contains('quick-next')) {
        $item.classList.remove('quick-next')
        $item.innerHTML = ''
      }
    })

    // 小于 7 个分页，全部渲染出来
    if (this.itemCount < 8) {
      this._ensureItem(this.itemCount)
      forEach(children, ($item, index) => {
        const num = index + 1
        $item.textContent = num
        $item.classList.toggle('current', num === this.current)
      })
      return
    }

    // 除了首尾，中间保持渲染 5 个条目：
    // 1. 固定渲染第一页、最后一页的页码
    // 2. 中间渲染 5 个页码，current 在中间，左右各两个
    // 3. 如果 current 左右不足两个，则不必考虑对称，总共是 5 个即可。
    // 3.1 current 1 ~ 4 时，渲染 1-6 + ... + 末页
    // 3.2 current 与末尾相隔小于 4 个时，渲染 1 + ... + n - 末尾，n 等于 末尾 -  5

    // 3.1
    if (!showQuickPrev) {
      for (let i = 0; i < 6; i += 1) {
        const num = i + 1
        children[i].textContent = num
      }
      children[6].classList.add('quick-next')
      children[6].innerHTML = '<bl-icon value="more"></bl-icon>'
      children[7].textContent = this.itemCount
    }

    // 3.2
    else if (!showQuickNext) {
      for (let i = 0; i < 6; i += 1) {
        const num = this.itemCount - i
        children[count - (i + 1)].textContent = num
      }
      children[0].textContent = 1
      children[1].classList.add('quick-prev')
      children[1].innerHTML = '<bl-icon value="more"></bl-icon>'
    }

    else {
      children[0].textContent = 1
      children[1].classList.add('quick-prev')
      children[1].innerHTML = '<bl-icon value="more"></bl-icon>'
      children[2].textContent = this.current - 2
      children[3].textContent = this.current - 1
      children[4].textContent = this.current
      children[5].textContent = this.current + 1
      children[6].textContent = this.current + 2
      children[7].classList.add('quick-next')
      children[7].innerHTML = '<bl-icon value="more"></bl-icon>'
      children[8].textContent = this.itemCount
    }

    forEach(children, $item => {
      const current = parseInt($item.textContent)
      $item.classList.toggle('current', current === this.current)
    })
  }

  _ensureItem(n) {
    while (this.$items.children.length < n) {
      this.$items.appendChild(this._itemPool.pop() ?? itemTemplate.cloneNode(true))
    }
    while (this.$items.children.length > n) {
      this._itemPool.push(this.$items.removeChild(this.$items.lastElementChild))
    }
    if (this._itemPool.length > 7) this._itemPool.length = 7
  }

  _prev() {
    if (this.disabled || this.current === 1) return
    this.current -= 1
  }

  _next() {
    if (this.disabled || this.current === this.itemCount) return
    this.current += 1
  }

  _quickPrev() {
    const num = this.current - 5
    this.current = num >= 1 ? num : 1
  }

  _quickNext() {
    const num = this.current + 5
    this.current = num <= this.itemCount ? num : this.itemCount
  }
}

if (!customElements.get('bl-pagination')) {
  customElements.define('bl-pagination', BlocksPagination)
}
