import type { BlComponent } from '../component/Component'
export interface InitOptions<T> {
  component: T
}

/**
 * 空格、回车触发 click，阻止空格滚动页面
 */
export class SetupControlEvent<T extends BlComponent = BlComponent> {
  static setup<T extends BlComponent = BlComponent>(options: InitOptions<T>) {
    return new SetupControlEvent(options).setup()
  }

  #setup = false
  #component: T

  constructor(options: InitOptions<T>) {
    this.#component = options.component
  }

  setup() {
    if (this.#setup) return this
    this.#setup = true

    // 原生控件（例如：button），事件的执行顺序按照绑定的顺序，
    // 注册捕获阶段的事件处理器也并不会更优先，
    // 可以理解为原生控件（如：button）没有内部结构，因此内部没有冒泡的过程，都是在 target 阶段执行。
    // 例如注册顺序：onclick, click, click(capture)，执行顺序也一样是 onclick, click, click(capture)
    // 而本组件库中的组件（例如：bl-button）有内部结构，如果不做特殊处理，则注册在捕获阶段的事件会被优先执行，与原生控件不一致，
    // 即执行顺序是：click(capture), onclick, click，因为 click 需要抵达内部结构最深处后，冒泡出来才执行。

    const onKeydown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      if (e.keyCode === 32) {
        // 阻止空格键的页面滚动行为（与原生 button 一致）
        // 但也同时会阻止 keypress
        e.preventDefault()
      }
    }
    const onKeyup = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return
      // 空格的时候，不会触发 keypress（由于 keydown 时的 preventDefault）
      // 所以模拟触发 keypress，不过 isTrusted 没办法模拟，只能为 false
      // 由于是直接在 target 上派发，执行顺序与原生一致
      if (e.keyCode === 32) {
        this.#component.dispatchEvent(
          new KeyboardEvent('keypress', {
            ...e,
            bubbles: true,
            cancelable: true,
            keyCode: 32,
            key: ' ',
          })
        )
      }

      // 按空格、回车时，模拟激发 click 事件（与原生控件一致），不过 isTrusted 没办法模拟，只能为 false
      // 同开头注释原因，捕获阶段的 keypress 会优先执行，click 则直接在 this 上派发，顺序与原生一致
      if (e.keyCode === 32 || e.keyCode === 13) {
        this.#component.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          })
        )
      }
    }
    this.#component.hook.onConnected(() => {
      this.#component.addEventListener('keydown', onKeydown)
      this.#component.addEventListener('keyup', onKeyup)
    })
    this.#component.hook.onDisconnected(() => {
      this.#component.removeEventListener('keydown', onKeydown)
      this.#component.removeEventListener('keyup', onKeyup)
    })

    return this
  }
}
