import '../icon/index.js'
import { attr, attrs } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { dispatchEvent } from '../../common/event.js'
import { forEach } from '../../common/utils.js'
import { shadowRef } from '../../decorators/shadowRef/index.js'
import { style } from './style.js'
import { template, itemTemplate } from './template.js'
import { BlComponent, BlComponentEventListener, BlComponentEventMap } from '../component/Component.js'

export type PaginationEventMap = BlComponentEventMap

export interface BlPagination extends BlComponent {
  addEventListener<K extends keyof PaginationEventMap>(
    type: K,
    listener: BlComponentEventListener<PaginationEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof PaginationEventMap>(
    type: K,
    listener: BlComponentEventListener<PaginationEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-pagination',
  styles: [style],
})
export class BlPagination extends BlComponent {
  static override get observedAttributes() {
    return ['order']
  }

  @attr('boolean') accessor disabled!: boolean

  @attr('int') accessor current = 1

  @attr('int') accessor pageSize = 10

  @attr('int') accessor total = 0

  @attr('string') accessor pageSizes!: string

  @attrs.size accessor size!: MaybeOneOf<['small', 'large']>

  @shadowRef('#pager') accessor $pager!: HTMLElement
  @shadowRef('#items') accessor $items!: HTMLElement
  @shadowRef('#prev') accessor $prev!: HTMLButtonElement
  @shadowRef('#next') accessor $next!: HTMLButtonElement
  @shadowRef('#jump') accessor $jump!: HTMLElement
  @shadowRef('#sizes') accessor $sizes!: HTMLElement
  @shadowRef('#total') accessor $total!: HTMLElement

  constructor() {
    super()

    this.appendShadowChild(template())

    this.hook.onConnected(() => {
      this.$prev.onclick = () => this._prev()
      this.$next.onclick = () => this._next()
      this.$items.onclick = e => {
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
    })
    this.hook.onDisconnected(() => {
      this.$prev.onclick = this.$next.onclick = this.$items.onclick = null
    })

    this.hook.onConnected(this.render)
    this.hook.onAttributeChanged(this.render)

    this.hook.onAttributeChangedDep('current', () => {
      dispatchEvent(this, 'bl:pagination:current-change', {
        detail: { current: this.current },
      })
    })

    this.hook.onAttributeChangedDep('page-size', () => {
      dispatchEvent(this, 'bl:pagination:page-size-change', {
        detail: { pageSize: this.pageSize },
      })
    })
  }

  _itemPool: HTMLElement[] = []

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

  override render() {
    super.render()
    this._renderPager()
    this.$prev.disabled = this.current === 1
    this.$next.disabled = this.current === this.itemCount
  }

  _renderPager() {
    const showQuickPrev = this.current > 4
    const showQuickNext = this.itemCount - this.current > 3
    const count = this.itemCount < 8 ? this.itemCount : showQuickPrev && showQuickNext ? 9 : 8
    this._ensureItem(count)
    const children = this.$items.children as unknown as HTMLElement[]

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
    while (this.$items.children.length < n) {
      this.$items.appendChild(this._itemPool.pop() ?? itemTemplate())
    }
    while (this.$items.children.length > n) {
      this._itemPool.push(this.$items.removeChild(this.$items.lastElementChild!) as HTMLElement)
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
