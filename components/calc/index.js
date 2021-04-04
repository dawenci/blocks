import { dispatchEvent } from '../../common/event.js'
import { boolGetter, boolSetter } from '../../common/property.js'
import { upgradeProperty } from '../../common/upgradeProperty.js'
import { forEach } from '../../common/utils.js'
import { __bg_base, __bg_base_header, __border_color_base, __color_primary, __dark_bg_base, __dark_bg_base_active, __dark_border_color_base, __dark_fg_base, __fg_base, __font_family, __height_base, __radius_base } from '../../theme/var.js'

const State = {
  // 初始化状态
  Init: 'Init',
  // 输入左操作数中
  OperandLeft: 'OperandLeft',
  // 输入左操作数结束，可被替换
  OperandLeftEnd: 'OperandLeftEnd',
  // 输入运算符状态
  Operator: 'Operator',
  // 输入右操作数中
  OperandRight: 'OperandRight',
  // 输入右操作数结束，可被替换
  OperandRightEnd: 'OperandRightEnd',
  // 显示结果中
  Result: 'Result'
}

const template = document.createElement('template')
template.innerHTML = `<style>
:host {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  background-color: var(--bg-base, ${__bg_base});
  color: var(--fg-base, ${__fg_base});
  width: calc(var(--height-base, ${__height_base}) * 6 + 8px);
  height: calc(var(--height-base, ${__height_base}) * 7.5 + 8px);
  padding: 4px;
  border: 1px solid var(--border-color-base, ${__border_color_base});
  border-radius: var(--radius-base, ${__radius_base});
  font-family: var(--font-family, ${__font_family});
}

#layout {
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-base, ${__radius_base});
  font-family: Arial, Helvetica, sans-serif;
}
#layout:focus {
  outline: none;
}
#layout * {
  box-sizing: border-box;
}

.Calc-screen {
  flex: 0 0 auto;
  overflow: hidden;
  position: relative;
  width: 100%;
  margin-bottom: 1px;
  padding: 0 8px;
  border-radius: var(--radius-base, ${__radius_base});
  height: calc(var(--height-base, ${__height_base}) * 1.5);
  line-height: calc(var(--height-base, ${__height_base}) * 1.5);
  background-color: var(--bg-base-header, ${__bg_base_header});
}
.Calc-screen-result {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: right;
}
.Calc-screen-input {
  position: absolute;
  right: 0;
  top: 0;
  text-align: right;
  font-size: 1.5em;
  transform-origin: right;
}
.Calc-screen-cursor {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
}

.Calc-keyboard {
  flex: 1 1 100%;
  overflow: hidden;
  width: 100%;
  border-radius: var(--radius-base, ${__radius_base});
  font-size: 14px;
}

.Calc-keyboard-area {
  overflow: hidden;
}
.Calc-keyboard-key {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  float: left;
  vertical-align: top;
  position: relative;
  z-index: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: 0;
  padding: 0;
  border: 0 none;
  text-align: center;
  cursor: pointer;
  user-select: none;
  transition: 0.2s all;
}

.Calc-keyboard-key:hover,
.Calc-keyboard-key:focus {
  z-index: 1;
  outline: none;
  background-color: rgba(255, 255, 255, 0.1);
}

.Calc-keyboard-key.active {
  color: var(--color-primary, ${__color_primary});
}

.Calc-keyboard-memory {
  width: 100%;
  height: 16.6666%;
  font-size: 12px;
}
.Calc-keyboard-memory .Calc-keyboard-key {
  width: 25%;
  height: 100%;
  font-size: 12px;
}

.Calc-keyboard-group {
  float: left;
  width: 75%;
  height: 83.3333%;
}
.Calc-keyboard-actions {
  width: 100%;
  height: 20%;
}
.Calc-keyboard-actions .Calc-keyboard-key {
  width: 33.3333%;
  height: 100%;
  font-size: 12px;
}

.Calc-keyboard-numbers {
  width: 100%;
  height: 80%;
}
.Calc-keyboard-numbers .Calc-keyboard-key {
  width: 33.3333%;
  height: 25%;
}

.Calc-keyboard-operators {
  float: left;
  width: 25%;
  height: 83.3333%;
}
.Calc-keyboard-operators .Calc-keyboard-key {
  width: 100%;
  height: 20%;
  font-size: 16px;
}

.Calc-keyboard-key:hover,
.Calc-keyboard-key:focus {
  z-index: 1;
  outline: none;
  background-color: rgba(0, 0, 0, 0.05);
}

/* dark theme */
:host([dark]) {
  border: 1px solid var(--dark-border-color-base, ${__dark_border_color_base});
  background-color: var(--dark-bg-base, ${__dark_bg_base});
  color: var(--dark-fg-base, ${__dark_fg_base});
}
:host([dark]) .Calc-screen {
  background-color: var(--dark-bg-base-active, ${__dark_bg_base_active});
}
:host([dark]) .Calc-keyboard {
  background-color: rgba(0, 0, 0, 0.2);
}
:host([dark]) .Calc-keyboard-key:hover,
:host([dark]) .Calc-keyboard-key:focus {
  z-index: 1;
  outline: none;
  background-color: rgba(255, 255, 255, 0.1);
}

</style>

<div id="layout" tabindex="0">
  <div class="Calc-screen">
    <div
      ref="result"
      class="Calc-screen-result">
      <div class="Calc-screen-input"></div>
    </div>
  </div>

  <div class="Calc-keyboard">
    <div class="Calc-keyboard-area Calc-keyboard-memory"></div>
    <div class="Calc-keyboard-group">
      <div class="Calc-keyboard-area Calc-keyboard-actions"></div>
      <div class="Calc-keyboard-area Calc-keyboard-numbers"></div>
    </div>
    <div class="Calc-keyboard-area Calc-keyboard-operators"></div>
  </div>
</div>
`

export default class BlocksCalc extends HTMLElement {
  static get observedAttributes() {
    return ['dark', 'screen']
  }

  get dark() {
    return boolGetter('dark')(this)
  }

  set dark(value) {
    boolSetter('dark')(this, value)
  }

  get screen() {
    return this.getAttribute('screen')
  }

  set screen(value) {
    this.setAttribute('screen', value)
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

  constructor() {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.appendChild(template.content.cloneNode(true))

    this.$layout = shadowRoot.getElementById('layout')
    this.$result = shadowRoot.querySelector('.Calc-screen-result')
    this.$input = shadowRoot.querySelector('.Calc-screen-input')

    this.memory = 0
    this.operand = null
    this.operator = null
    this.screen = '0'
    this.state = State.Init
    // 连续运算方法，用于连续按 =
    this.calcFn = null
    this.inputStyle = {}

    this.$layout.onkeypress = this.onKeyPress.bind(this)

    this.makeAdd = (n1) => (n2) => +(n2 + n1).toPrecision(12)
    this.makeSub = (n1) => (n2) => +(n2 - n1).toPrecision(12)
    this.makeMul = (n1) => (n2) => +(n2 * n1).toPrecision(12)
    this.makeDiv = (n1) => (n2) => +(n2 / n1).toPrecision(12)
    this.makeFn = (op) => (op === '+' ? this.makeAdd : op === '-' ? this.makeSub : op === '*' ? this.makeMul : this.makeDiv)
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

    if (attrName === 'screen') {
      this.onScreenChange()
    }
  }

  render() {
    this.$input.innerHTML = this.screen

    const $span = document.createElement('span')
    $span.className = 'Calc-keyboard-key'
    const makeButton = (data) => {
      const $button = $span.cloneNode(true)
      $button.dataset.value = data.value
      $button.innerHTML = data.label
      $button.onclick = () => this.input(data.value)
      return $button
    }

    // render memory
    const $memory = this.$layout.querySelector('.Calc-keyboard-memory')
    if (!$memory.children.length) {
      this.memoryKeys.forEach(key => {
        $memory.appendChild(makeButton(key))
      })
    }

    const $actions = this.$layout.querySelector('.Calc-keyboard-actions')
    if (!$actions.children.length) {
      this.actionKeys.forEach(key => {
        $actions.appendChild(makeButton(key))
      })
    }

    const $numbers = this.$layout.querySelector('.Calc-keyboard-numbers')
    if (!$numbers.children.length) {
      this.numberKeys.forEach(key => {
        $numbers.appendChild(makeButton(key))
      })
    }

    const $operators = this.$layout.querySelector('.Calc-keyboard-operators')
    if (!$operators.children.length) {
      this.operatorKeys.forEach(key => {
        $operators.appendChild(makeButton(key))
      })
    }

    // 渲染运算符高亮
    if ([State.Operator, State.OperandRight, State.OperandRightEnd].includes(this.state)) {
      forEach($operators.querySelectorAll('.active'), $active => $active.classList.remove('active'))
      $operators.querySelector(`[data-value="${this.operator}"]`).classList.add('active')
    }
    else {
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

    dispatchEvent(this, 'screen', { detail: { value: this.getScreenValue() } })
    if (this.state === State.Result) {
      dispatchEvent(this, 'result', { detail: { value: this.getScreenValue() } })
    }
  }

  onKeyPress(event) {
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
    return +this.screen
  }

  setScreenValue(n) {
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
        this.screen = this.screen.substr(0, this.screen.length - 1) || '0'
        return
      }

      case State.OperandLeftEnd: {
        return
      }

      case State.Operator: {
        return
      }

      case State.OperandRight: {
        this.screen = this.screen.substr(0, this.screen.length - 1) || '0'
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
  input(key) {
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

  inputNumber(n) {
    switch (this.state) {
      case State.Init: {
        this.screen = n === '.' ? '0.' : n === '00' ? '0' : n
        this.state = State.OperandLeft
        return
      }

      case State.OperandLeft: {
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

  inputOperator(op) {
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
        this.calcFn = this.makeFn(this.operator)(operandRight)
        const result = this.calcFn(operandLeft)
        this.setScreenValue(result)
        this.operator = null
        this.state = State.Result
        return
      }

      case State.OperandRight: {
        const operandLeft = this.operand
        const operandRight = this.getScreenValue()
        this.calcFn = this.makeFn(this.operator)(operandRight)
        const result = this.calcFn(operandLeft)
        this.setScreenValue(result)
        this.operator = null
        this.state = State.Result
        return
      }

      case State.OperandRightEnd: {
        const operandLeft = this.operand
        const operandRight = this.getScreenValue()
        this.calcFn = this.makeFn(this.operator)(operandRight)
        const result = this.calcFn(operandLeft)
        this.setScreenValue(result)
        this.operator = null
        this.state = State.Result
        return
      }

      // 连续按 =
      case State.Result: {
        const result = this.calcFn(this.getScreenValue())
        this.setScreenValue(result)
        this.operator = null
        this.state = State.Result
      }
    }
  }
}

if (!customElements.get('bl-calc')) {
  customElements.define('bl-calc', BlocksCalc)
}
