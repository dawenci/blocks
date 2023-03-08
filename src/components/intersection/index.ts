import { dispatchEvent } from '../../common/event.js'
import { Component } from '../Component.js'
import { template } from './template.js'
import { defineClass } from '../../decorators/defineClass.js'
import { attr } from '../../decorators/attr.js'

@defineClass({
  customElement: 'bl-intersection',
})
export class BlocksIntersection extends Component {
  static override get observedAttributes() {
    return ['root', 'root-margin', 'threshold']
  }

  @attr('string') accessor rootMargin = '0px'

  @attr('string') accessor threshold = '0'

  constructor() {
    super()
    const shadowRoot = this.shadowRoot!
    shadowRoot.appendChild(template().content.cloneNode(true))
  }

  _root?: any
  get root() {
    if (this._root) {
      return this._root() ?? null
    }
    return this.getAttribute('root')
  }

  set root(value) {
    if (typeof value === 'string' || value === null) {
      this.setAttribute('root', value)
      this._root = undefined
      return
    }
    if (typeof value === 'function') {
      this._root = value
    } else if (value instanceof Node) {
      this._root = () => value
    }
    this.removeAttribute('root')
  }

  get rootElement() {
    let root = this.root
    if (root instanceof Element) {
      if (root.contains(this)) return root
      root = null
    }
    if (typeof root === 'string') {
      try {
        root = document.querySelector(root)
        if (!root.contains(this)) root = null
      } catch (error) {
        root = null
      }
    }
    return root ?? undefined
  }

  _flag?: any
  _observer?: any
  _initObserver() {
    // 避免多个属性变化触发多次
    if (!this._flag) {
      this._flag = Promise.resolve().then(() => {
        if (this._observer) {
          this._observer.disconnect()
        }
        this._observer = new IntersectionObserver(
          (entries, observer) => {
            dispatchEvent(this, 'intersection', {
              detail: {
                entries,
                observer,
              },
            })
          },
          {
            root: this.rootElement,
            rootMargin: this.rootMargin,
            threshold: +this.threshold,
          }
        )
        this._observer.observe(this)

        this._flag = null
      })
    }
  }

  _removeObserver() {
    if (this._observer) {
      this._observer.disconnect()
    }
  }

  override connectedCallback() {
    super.connectedCallback()
    this.render()
    this._initObserver()
  }

  override disconnectedCallback() {
    super.disconnectedCallback()
    this._removeObserver()
  }

  override attributeChangedCallback(
    attrName: string,
    oldValue: any,
    newValue: any
  ) {
    super.attributeChangedCallback(attrName, oldValue, newValue)
    this._initObserver()
  }
}
