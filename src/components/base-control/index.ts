import type { BlComponentEventMap } from '../component/Component.js'
import { attr } from '../../decorators/attr/index.js'
import { defineClass } from '../../decorators/defineClass/index.js'
import { BlComponent } from '../component/Component.js'
import { SetupDisabled } from '../setup-disabled/index.js'
import { SetupTabIndex } from '../setup-tab-index/index.js'

export type BlControlEventMap = BlComponentEventMap

/**
 * 控件基类
 * 提供 disabled 功能
 */
@defineClass({
  attachShadow: {
    mode: 'open',
    // https://github.com/WICG/webcomponents/blob/gh-pages/proposals/ShadowRoot-delegatesFocus-Proposal.md
    // https://github.com/TakayoshiKochi/tabindex-focus-navigation-explainer/blob/master/TabindexFocusNavigationExplainer.md
    // 该属性用于确定是否将焦点活动委托给 shadow 处理（设置后不可修改），
    //
    // 对于默认不可聚焦的元素，delegatesFocus 为 true 时的影响：
    // 1. tab 导航：
    //   对于 host 的 tabIndex >= 0 的情况，正向移动焦点过程，会跳过 host，直接聚焦到 shadow tree 中首个可聚焦的元素上，反向移动焦点时，到了第一个可聚焦的元素上，再移动也会直接跳过 host；
    //   对于 host 的 tabIndex < 0 的情况，则会直接跳过整棵 shadow tree。
    //   > 注：如果没有 delegatesFocus: true，正向 tab 移动焦点时，会先聚焦到 host（而不是跳过），继续移动时才会到第一个可聚焦的 shadow tree 元素，反向移动同理，从第一个可聚焦 shadow tree 元素上往前移动焦点时，焦点会移动到 host 上（而不是跳过）。
    //   > 注：host 上没有设置 tabIndex，等同于 tabindex="0"
    //
    // 2. focus() 方法的行为：
    //   在 host 上调用 focus() 方法，会将焦点委派给其首个可聚焦的 shadow tree 元素，如果存在嵌套 shadow tree，则会递归该过程。如果最终没有可聚焦的元素，则焦点会应用在 host 自身上面。
    //   > 注：如果没有 delegatesFocus: true，调用 host 的 focus() 方法，不会尝试进入 shadow tree 里面的可聚焦元素。
    //
    // 3. autofocus 行为：
    //   如果设置了 autofocus attribute，在页面加载完成时，会触发类似调用 focus() 方法时的焦点转移行为。
    //
    // 4. 响应鼠标 click：
    //   如果点击 shadow tree 中可聚焦的区域，则对应元素获得焦点。如果点击的是不可聚焦的区域，则 shadow tree 中首个可聚焦元素获得焦点。
    //
    // 5. CSS 的 :focus 伪类：
    //   任何后代 shadow tree 上的元素获得焦点时，host 元素上的 :focus 选择器（例如：#host:focus）将会匹配。
    //   > 注：如果没有 delegatesFocus: true，shadow tree 中的元素聚焦时，host的:focus 选择器不会匹配。
    //
    // 以上内容是针对默认不可聚焦的元素（如 div），调用 shadowRoot 的 setForceFocusable() 方法，可以无视 tabIndex、delegatesFocus 的设置，强行表现为默认可聚焦元素（类似 a）。默认可聚焦元素就算不设置 tabIndex，也等同 tabindex="0"，并且总可以聚焦。默认不可聚焦元素，没有 delegatesFocus 且不设置 tabIndex 时，是不可以聚焦的。
    //
    // 注意：自己的 slot 中的元素聚焦，宿主不会获得焦点，但是 :focus-within 生效
    //
    delegatesFocus: true,
  },
})
export class BlControl extends BlComponent {
  static override get observedAttributes(): readonly string[] {
    return ['tabindex', ...super.observedAttributes]
  }

  @attr('boolean') accessor disabled!: boolean

  constructor() {
    super()
  }

  _disabledFeature = SetupDisabled.setup({
    component: this,
    // 组件 disabled 时，禁用的事件
    disableEventTypes: ['click', 'mousedown', 'focus', 'touchstart', 'keydown'],
    predicate() {
      return this.disabled
    },
    target() {
      return [this]
    },
  })

  _tabIndexFeature = SetupTabIndex.setup({
    component: this,
    disabledPredicate() {
      return this.disabled
    },
    target() {
      const children = this.shadowRoot?.children
      if (children) return [children[children.length - 1]]
      return []
    },
  })
}
