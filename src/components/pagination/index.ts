import '../icon/index.js'
import type { EnumAttrs } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr, attrs } from '../../decorators/attr.js'
import { template } from './template.js'
import { style } from './style.js'
import { dispatchEvent } from '../../common/event.js'
import { forEach } from '../../common/utils.js'
import { Component, ComponentEventListener, ComponentEventMap } from '../Component.js'

export interface PaginationEventMap extends ComponentEventMap {
  'bl:pagination:current-change': CustomEvent<{ current: number }>
  'bl:pagination:page-size-change': CustomEvent<{ pageSize: number }>
}

export interface BlocksPagination extends Component {
  _ref: {
    $pager: HTMLElement
    $items: HTMLElement
    $prev: HTMLButtonElement
    $next: HTMLButtonElement
    $jump: HTMLElement
    $sizes: HTMLElement
    $total: HTMLElement
  }

  addEventListener<K extends keyof PaginationEventMap>(
    type: K,
    listener: ComponentEventListener<PaginationEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof PaginationEventMap>(
    type: K,
    listener: ComponentEventListener<PaginationEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-pagination',
  styles: [style],
})
export class BlocksPagination extends Component {
  static override get observedAttributes() {
    return ['order']
  }

  @attr('boolean') accessor disabled!: boolean

  @attr('int') accessor current = 1

  @attr('int') accessor pageSize = 10

  @attr('int') accessor total = 0

  @attr('string') accessor pageSizes!: string | null

  @attrs.size accessor size!: EnumAttrs['size']

  _itemPool: HTMLElement[] = []

  constructor() {
    super()

    const { comTemplate } = template()

    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(comTemplate.content.cloneNode(true))

    const $pager = shadowRoot.getElementById('pager') as HTMLElement
    const $items = shadowRoot.getElementById('items') as HTMLElement
    const $prev = shadowRoot.getElementById('prev') as HTMLButtonElement
    const $next = shadowRoot.getElementById('next') as HTMLButtonElement
    const $jump = shadowRoot.getElementById('jump') as HTMLElement
    const $sizes = shadowRoot.getElementById('sizes') as HTMLElement
    const $total = shadowRoot.getElementById('total') as HTMLElement

    this._ref = {
      $pager,
      $items,
      $prev,
      $next,
      $jump,
      $sizes,
      $total,
    }

    $prev.onclick = () => this._prev()
    $next.onclick = () => this._next()

    $items.onclick = e => {
      if (this.disabled) return
      let $button = e.target as HTMLElement
      if ($button.tagName === 'BL-ICON') {
        $button = $button.parentElement!
      }
      if ($button.tagName !== 'BUTTON') return
      if ($button.classList.contains('quick-prev')) {
        return this._quickPrev()
      } else if ($button.classList.contains('quick-next')) {
        return this._quickNext()
      }
      this.current = +$button.textContent!
    }
  }

  get showQuickJumper() {
    return
  }

  get showSizeChanger() {
    return
  }

  get showTotal() {
    return
  }

  get itemCount() {
    return Math.ceil(this.total / this.pageSize)
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
  }

  override attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this.render()
    if (attrName === 'current') {
      dispatchEvent(this, 'bl:pagination:current-change', {
        detail: { current: this.current },
      })
    }

    if (attrName === 'page-size') {
      dispatchEvent(this, 'bl:pagination:page-size-change', {
        detail: { pageSize: this.pageSize },
      })
    }
  }

  override render() {
    this._renderPager()
    this._ref.$prev.disabled = this.current === 1
    this._ref.$next.disabled = this.current === this.itemCount
  }

  _renderPager() {
    const showQuickPrev = this.current > 4
    const showQuickNext = this.itemCount - this.current > 3
    const count = this.itemCount < 8 ? this.itemCount : showQuickPrev && showQuickNext ? 9 : 8
    this._ensureItem(count)
    const children = this._ref.$items.children as unknown as HTMLElement[]

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
        setTextContent($item, num)
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
        setTextContent(children[i], num)
      }
      children[6].classList.add('quick-next')
      children[6].innerHTML = '<bl-icon value="more"></bl-icon>'
      setTextContent(children[7], this.itemCount)
    }

    // 3.2
    else if (!showQuickNext) {
      for (let i = 0; i < 6; i += 1) {
        const num = this.itemCount - i
        setTextContent(children[count - (i + 1)], num)
      }
      setTextContent(children[0], 1)
      children[1].classList.add('quick-prev')
      children[1].innerHTML = '<bl-icon value="more"></bl-icon>'
    } else {
      setTextContent(children[0], 1)
      children[1].classList.add('quick-prev')
      children[1].innerHTML = '<bl-icon value="more"></bl-icon>'
      setTextContent(children[2], this.current - 2)

      setTextContent(children[3], this.current - 1)
      setTextContent(children[4], this.current)
      setTextContent(children[5], this.current + 1)
      setTextContent(children[6], this.current + 2)
      children[7].classList.add('quick-next')
      children[7].innerHTML = '<bl-icon value="more"></bl-icon>'
      setTextContent(children[8], this.itemCount)
    }

    forEach(children, $item => {
      const current = parseInt($item.textContent!)
      $item.classList.toggle('current', current === this.current)
    })
  }

  _ensureItem(n: number) {
    const { itemTemplate } = template()
    while (this._ref.$items.children.length < n) {
      this._ref.$items.appendChild(this._itemPool.pop() ?? itemTemplate.cloneNode(true))
    }
    while (this._ref.$items.children.length > n) {
      this._itemPool.push(this._ref.$items.removeChild(this._ref.$items.lastElementChild!) as HTMLElement)
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

function setTextContent(element: HTMLElement, value: any) {
  element.textContent = value
}
