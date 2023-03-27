import type { ComponentEventListener, ComponentEventMap } from '../component/Component.js'
import { attr } from '../../decorators/attr.js'
import { defineClass } from '../../decorators/defineClass.js'
import { dispatchEvent } from '../../common/event.js'
import { shadowRef } from '../../decorators/shadowRef.js'
import { forEach } from '../../common/utils.js'
import { style } from './style.js'
import { template } from './template.js'
import { Component } from '../component/Component.js'

enum State {
  // 初始化状态
  Init = 'Init',
  // 输入左操作数中
  OperandLeft = 'OperandLeft',
  // 输入左操作数结束，可被替换
  OperandLeftEnd = 'OperandLeftEnd',
  // 输入运算符状态
  Operator = 'Operator',
  // 输入右操作数中
  OperandRight = 'OperandRight',
  // 输入右操作数结束，可被替换
  OperandRightEnd = 'OperandRightEnd',
  // 显示结果中
  Result = 'Result',
}

interface CalcEventMap extends ComponentEventMap {
  'bl:calc:screen': CustomEvent<{ value: number }>
  'bl:calc:result': CustomEvent<{ value: number }>
}

export interface BlocksCalc extends Component {
  addEventListener<K extends keyof CalcEventMap>(
    type: K,
    listener: ComponentEventListener<CalcEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof CalcEventMap>(
    type: K,
    listener: ComponentEventListener<CalcEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

@defineClass({
  customElement: 'bl-calc',
  styles: [style],
})
export class BlocksCalc extends Component {
  @attr('string') accessor screen = '0'

  @shadowRef('#layout') accessor $layout!: HTMLDivElement
  @shadowRef('.Calc-screen-result') accessor $result!: HTMLDivElement
  @shadowRef('.Calc-screen-input') accessor $input!: HTMLDivElement

  memory = 0
  operand: number | null = null
  operator: string | null = null
  state = State.Init
  // 连续运算方法，用于连续按 =
  calcFn: ((n: number) => number) | null = null
  inputStyle = {}
  makeAdd = (n1: number) => (n2: number) => +(n2 + n1).toPrecision(12)
  makeSub = (n1: number) => (n2: number) => +(n2 - n1).toPrecision(12)
  makeMul = (n1: number) => (n2: number) => +(n2 * n1).toPrecision(12)
  makeDiv = (n1: number) => (n2: number) => +(n2 / n1).toPrecision(12)
  makeFn = (op: string) =>
    op === '+' ? this.makeAdd : op === '-' ? this.makeSub : op === '*' ? this.makeMul : this.makeDiv

  constructor() {
    super()
    this.shadowRoot!.appendChild(template())

    this.onConnected(() => {
      this.render()
      this.$layout.onkeypress = this.onKeyPress.bind(this)
    })
    this.onDisconnected(() => {
      this.$layout.onkeypress = null
    })

    this.onAttributeChanged(this.render)
    this.onAttributeChangedDep('screen', this.onScreenChange)
  }

  get memoryKeys() {
    return [
      { value: 'MC', label: 'MC' },
      { value: 'MR', label: 'MR' },
      { value: 'M-', label: 'M-' },
      { value: 'M+', label: 'M+' },
    ]
  }

  get actionKeys() {
    return [
      { value: 'AC', label: 'AC' },
      { value: 'CE', label: 'CE' },
      { value: 'DEL', label: 'DEL' },
    ]
  }

  get numberKeys() {
    return [
      { value: '7', label: '7' },
      { value: '8', label: '8' },
      { value: '9', label: '9' },
      { value: '4', label: '4' },
      { value: '5', label: '5' },
      { value: '6', label: '6' },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '0', label: '0' },
      { value: '00', label: '00' },
      { value: '.', label: '.' },
    ]
  }

  get operatorKeys() {
    return [
      { value: '/', label: '÷' },
      { value: '*', label: '×' },
      { value: '-', label: '-' },
      { value: '+', label: '+' },
      { value: '=', label: '=' },
    ]
  }

  get keymap() {
    return new Map([
      ['1', '1'],
      ['2', '2'],
      ['3', '3'],
      ['4', '4'],
      ['5', '5'],
      ['6', '6'],
      ['7', '7'],
      ['8', '8'],
      ['9', '9'],
      ['0', '0'],
      ['ctrl-l', 'MC'],
      ['ctrl-r', 'MR'],
      ['ctrl-q', 'M-'],
      ['ctrl-p', 'M+'],
      ['esc', 'AC'],
      ['enter', '='],
      ['+', '+'],
      ['-', '-'],
      ['*', '*'],
      ['/', '/'],
      ['.', '.'],
    ])
  }

  override render() {
    super.render()
    this.$input.innerHTML = this.screen ?? ''

    const $span = document.createElement('span')
    $span.className = 'Calc-keyboard-key'
    const makeButton = (data: { value: string; label: string }): HTMLSpanElement => {
      const $button = $span.cloneNode(true) as HTMLSpanElement
      $button.dataset.value = data.value
      $button.innerHTML = data.label
      $button.onclick = () => this.input(data.value)
      return $button
    }

    // render memory
    const $memory = this.$layout.querySelector('.Calc-keyboard-memory') as HTMLDivElement
    if (!$memory.children.length) {
      this.memoryKeys.forEach(key => {
        $memory.appendChild(makeButton(key))
      })
    }

    const $actions = this.$layout.querySelector('.Calc-keyboard-actions') as HTMLDivElement
    if (!$actions.children.length) {
      this.actionKeys.forEach(key => {
        $actions.appendChild(makeButton(key))
      })
    }

    const $numbers = this.$layout.querySelector('.Calc-keyboard-numbers') as HTMLDivElement
    if (!$numbers.children.length) {
      this.numberKeys.forEach(key => {
        $numbers.appendChild(makeButton(key))
      })
    }

    const $operators = this.$layout.querySelector('.Calc-keyboard-operators') as HTMLDivElement
    if (!$operators.children.length) {
      this.operatorKeys.forEach(key => {
        $operators.appendChild(makeButton(key))
      })
    }

    // 渲染运算符高亮
    if ([State.Operator, State.OperandRight, State.OperandRightEnd].includes(this.state)) {
      forEach($operators.querySelectorAll('.active'), $active => $active.classList.remove('active'))
      $operators.querySelector(`[data-value="${this.operator}"]`)?.classList?.add?.('active')
    } else {
      forEach($operators.querySelectorAll('.active'), $active => $active.classList.remove('active'))
    }
  }

  // 结果显示屏，根据内容自动缩放数字
  onScreenChange() {
    const { $result, $input } = this
    if (!$result || !$input) return

    requestAnimationFrame(() => {
      const wrapperWidth = $result.clientWidth
      const inputWidth = $input.clientWidth
      if (inputWidth > wrapperWidth) {
        const scaleRatio = wrapperWidth / inputWidth
        this.$input.style.transform = `scale(${scaleRatio})`
      } else {
        this.$input.style.transform = ''
      }
    })

    dispatchEvent(this, 'bl:calc:screen', {
      detail: { value: this.getScreenValue() },
    })
    if (this.state === State.Result) {
      dispatchEvent(this, 'bl:calc:result', {
        detail: { value: this.getScreenValue() },
      })
    }
  }

  onKeyPress(event: KeyboardEvent) {
    let key = ''
    if (event.ctrlKey) key = 'ctrl-'
    if (event.altKey) key += 'alt-'
    key += event.key.toLowerCase()
    const value = this.keymap.get(key)
    if (value) {
      this.input(value)
    }
  }

  getScreenValue() {
    return +(this.screen as any)
  }

  setScreenValue(n: number | string) {
    this.screen = '' + n
  }

  // MR
  memoryRecall() {
    switch (this.state) {
      case State.Init: {
        this.screen = '' + this.memory
        this.state = State.Result
        return
      }

      case State.OperandLeft: {
        this.screen = '' + this.memory
        this.state = State.OperandLeftEnd
        return
      }

      case State.OperandLeftEnd: {
        this.screen = '' + this.memory
        this.state = State.OperandLeftEnd
        return
      }

      case State.Operator: {
        this.screen = '' + this.memory
        this.state = State.OperandRightEnd
        return
      }

      case State.OperandRight: {
        this.screen = '' + this.memory
        this.state = State.OperandRightEnd
        return
      }

      case State.OperandRightEnd: {
        this.screen = '' + this.memory
        this.state = State.OperandRightEnd
        return
      }

      case State.Result: {
        this.screen = '' + this.memory
        this.state = State.Result
      }
    }
  }

  // MC
  memoryClear() {
    this.memory = 0
  }

  // M+
  memoryAdd() {
    this.memory += this.getScreenValue()
  }

  // M-
  memorySub() {
    this.memory -= this.getScreenValue()
  }

  // DEL
  deleteChar() {
    switch (this.state) {
      case State.Init: {
        return
      }

      case State.OperandLeft: {
        this.screen = (this.screen ?? '').substr(0, (this.screen ?? '').length - 1) || '0'
        return
      }

      case State.OperandLeftEnd: {
        return
      }

      case State.Operator: {
        return
      }

      case State.OperandRight: {
        this.screen = (this.screen ?? '').substr(0, (this.screen ?? '').length - 1) || '0'
      }
    }
  }

  // CE
  clearEntry() {
    switch (this.state) {
      case State.Init: {
        this.screen = '0'
        return
      }

      case State.OperandLeft: {
        this.screen = '0'
        this.state = State.Init
        return
      }

      case State.OperandLeftEnd: {
        this.screen = '0'
        this.state = State.Init
        return
      }

      case State.Operator: {
        this.operator = null
        this.state = State.OperandLeftEnd
        return
      }

      case State.OperandRight: {
        this.screen = '0'
        this.state = State.Operator
        return
      }

      case State.OperandRightEnd: {
        this.operator = null
        this.state = State.OperandLeftEnd
        return
      }

      case State.Result: {
        this.screen = '0'
        this.state = State.Init
      }
    }
  }

  // AC
  clearAll() {
    this.screen = '0'
    this.operand = null
    this.operator = null
    this.state = State.Init
    this.calcFn = null
  }

  // 输入分发
  input(key: string) {
    // 输入数字、小数点，进入连续输入数字模式
    if (/\d|\./.test(key)) {
      this.inputNumber(key)
      return
    }

    switch (key) {
      case '=':
        this.inputEqual()
        this.render()
        return

      case 'DEL':
        this.deleteChar()
        return

      case 'CE':
        this.clearEntry()
        return

      case 'AC':
        this.clearAll()
        return

      case '+':
      case '-':
      case '*':
      case '/':
        this.inputOperator(key)
        this.render()
        return

      case 'MR':
        this.memoryRecall()
        return

      case 'MC':
        this.memoryClear()
        return

      case 'M+':
        this.memoryAdd()
        return

      case 'M-':
        this.memorySub()
    }
  }

  inputNumber(n: string) {
    switch (this.state) {
      case State.Init: {
        this.screen = n === '.' ? '0.' : n === '00' ? '0' : n
        this.state = State.OperandLeft
        return
      }

      case State.OperandLeft: {
        // 已存在小数点，再次输入直接忽略
        if (n === '.' && (this.screen as string).indexOf('.') !== -1) return
        if (this.screen === '0' && n === '00') return
        if (this.screen === '0' && n !== '.') {
          this.screen = n
          return
        }
        this.screen += n
        return
      }

      case State.OperandLeftEnd: {
        this.screen = n === '.' ? '0.' : n === '00' ? '0' : n
        this.state = State.OperandLeft
        return
      }

      case State.Operator: {
        this.screen = n === '.' ? '0.' : n === '00' ? '0' : n
        this.state = State.OperandRight
        return
      }

      case State.OperandRight: {
        // 已存在小数点，再次输入直接忽略
        if (n === '.' && this.screen.indexOf('.') !== -1) return
        if (this.screen === '0' && n === '00') return
        if (this.screen === '0' && n !== '.') {
          this.screen = n
          return
        }
        this.screen += n
        return
      }

      case State.OperandRightEnd: {
        this.screen = n === '.' ? '0.' : n === '00' ? '0' : n
        this.state = State.OperandRight
        return
      }

      case State.Result: {
        this.screen = n === '.' ? '0.' : n === '00' ? '0' : n
        this.state = State.OperandLeft
      }
    }
  }

  inputOperator(op: string) {
    switch (this.state) {
      case State.Init: {
        // 将初始 0 作为左操作数
        // 设置运算符
        // 状态切换为输入运算符
        this.operand = this.getScreenValue()
        this.operator = op
        this.state = State.Operator
        return
      }

      case State.OperandLeft: {
        // 将屏幕数作为左操作数
        // 设置运算符
        // 状态设置为输入运算符
        this.operand = this.getScreenValue()
        this.operator = op
        this.state = State.Operator
        return
      }

      case State.OperandLeftEnd: {
        this.operand = this.getScreenValue()
        this.operator = op
        this.state = State.Operator
        return
      }

      case State.Operator: {
        // 切换运算符
        this.operator = op
        return
      }

      case State.OperandRight: {
        // 执行阶段结果
        // 结果作为左操作数
        // 设置运算符
        // 设置当前状态为输入运算符
        this.inputEqual()
        this.operand = this.getScreenValue()
        this.operator = op
        this.state = State.Operator
        return
      }

      case State.OperandRightEnd: {
        this.inputEqual()
        this.operand = this.getScreenValue()
        this.operator = op
        this.state = State.Operator
        return
      }

      case State.Result: {
        // 将屏幕结果作为左操作数
        // 设置运算符
        // 设置当前状态为输入运算符
        this.operand = this.getScreenValue()
        this.operator = op
        this.state = State.Operator
      }
    }
  }

  inputEqual() {
    switch (this.state) {
      case State.Init: {
        return
      }

      case State.OperandLeft: {
        this.state = State.Result
        return
      }

      case State.OperandLeftEnd: {
        this.state = State.Result
        return
      }

      case State.Operator: {
        const operandLeft = this.operand
        const operandRight = this.operand
        this.calcFn = this.makeFn(this.operator!)(operandRight!)
        const result = this.calcFn(operandLeft!)
        this.setScreenValue(result)
        this.operator = null
        this.state = State.Result
        return
      }

      case State.OperandRight: {
        const operandLeft = this.operand
        const operandRight = this.getScreenValue()
        this.calcFn = this.makeFn(this.operator!)(operandRight)
        const result = this.calcFn(operandLeft!)
        this.setScreenValue(result)
        this.operator = null
        this.state = State.Result
        return
      }

      case State.OperandRightEnd: {
        const operandLeft = this.operand
        const operandRight = this.getScreenValue()
        this.calcFn = this.makeFn(this.operator!)(operandRight)
        const result = this.calcFn(operandLeft!)
        this.setScreenValue(result)
        this.operator = null
        this.state = State.Result
        return
      }

      // 连续按 =
      case State.Result: {
        const result = this.calcFn?.(this.getScreenValue())
        this.setScreenValue(result ?? '')
        this.operator = null
        this.state = State.Result
      }
    }
  }
}
