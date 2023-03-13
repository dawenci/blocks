var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { defineClass } from '../../decorators/defineClass.js';
import { attr } from '../../decorators/attr.js';
import { dispatchEvent } from '../../common/event.js';
import { forEach } from '../../common/utils.js';
import { Component } from '../Component.js';
import { style } from './style.js';
import { template } from './template.js';
var State;
(function (State) {
    State["Init"] = "Init";
    State["OperandLeft"] = "OperandLeft";
    State["OperandLeftEnd"] = "OperandLeftEnd";
    State["Operator"] = "Operator";
    State["OperandRight"] = "OperandRight";
    State["OperandRightEnd"] = "OperandRightEnd";
    State["Result"] = "Result";
})(State || (State = {}));
export let BlocksCalc = (() => {
    let _classDecorators = [defineClass({
            customElement: 'bl-calc',
            styles: [style],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _screen_decorators;
    let _screen_initializers = [];
    var BlocksCalc = class extends Component {
        static {
            _screen_decorators = [attr('string')];
            __esDecorate(this, null, _screen_decorators, { kind: "accessor", name: "screen", static: false, private: false, access: { has: obj => "screen" in obj, get: obj => obj.screen, set: (obj, value) => { obj.screen = value; } } }, _screen_initializers, _instanceExtraInitializers);
            __esDecorate(null, _classDescriptor = { value: this }, _classDecorators, { kind: "class", name: this.name }, null, _classExtraInitializers);
            BlocksCalc = _classThis = _classDescriptor.value;
            __runInitializers(_classThis, _classExtraInitializers);
        }
        #screen_accessor_storage = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _screen_initializers, ''));
        get screen() { return this.#screen_accessor_storage; }
        set screen(value) { this.#screen_accessor_storage = value; }
        memory = 0;
        operand = null;
        operator = null;
        state = State.Init;
        calcFn = null;
        inputStyle = {};
        makeAdd = (n1) => (n2) => +(n2 + n1).toPrecision(12);
        makeSub = (n1) => (n2) => +(n2 - n1).toPrecision(12);
        makeMul = (n1) => (n2) => +(n2 * n1).toPrecision(12);
        makeDiv = (n1) => (n2) => +(n2 / n1).toPrecision(12);
        makeFn = (op) => op === '+' ? this.makeAdd : op === '-' ? this.makeSub : op === '*' ? this.makeMul : this.makeDiv;
        constructor() {
            super();
            const shadowRoot = this.shadowRoot;
            shadowRoot.appendChild(template().content.cloneNode(true));
            const $layout = shadowRoot.getElementById('layout');
            const $result = shadowRoot.querySelector('.Calc-screen-result');
            const $input = shadowRoot.querySelector('.Calc-screen-input');
            this._ref = { $layout, $result, $input };
            this.screen = '0';
        }
        get memoryKeys() {
            return [
                { value: 'MC', label: 'MC' },
                { value: 'MR', label: 'MR' },
                { value: 'M-', label: 'M-' },
                { value: 'M+', label: 'M+' },
            ];
        }
        get actionKeys() {
            return [
                { value: 'AC', label: 'AC' },
                { value: 'CE', label: 'CE' },
                { value: 'DEL', label: 'DEL' },
            ];
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
            ];
        }
        get operatorKeys() {
            return [
                { value: '/', label: '÷' },
                { value: '*', label: '×' },
                { value: '-', label: '-' },
                { value: '+', label: '+' },
                { value: '=', label: '=' },
            ];
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
            ]);
        }
        connectedCallback() {
            super.connectedCallback();
            this.render();
            this._ref.$layout.onkeypress = this.onKeyPress.bind(this);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            this._ref.$layout.onkeypress = null;
        }
        attributeChangedCallback(attrName, oldValue, newValue) {
            super.attributeChangedCallback(attrName, oldValue, newValue);
            this.render();
            if (attrName === 'screen') {
                this.onScreenChange();
            }
        }
        render() {
            this._ref.$input.innerHTML = this.screen ?? '';
            const $span = document.createElement('span');
            $span.className = 'Calc-keyboard-key';
            const makeButton = (data) => {
                const $button = $span.cloneNode(true);
                $button.dataset.value = data.value;
                $button.innerHTML = data.label;
                $button.onclick = () => this.input(data.value);
                return $button;
            };
            const $memory = this._ref.$layout.querySelector('.Calc-keyboard-memory');
            if (!$memory.children.length) {
                this.memoryKeys.forEach(key => {
                    $memory.appendChild(makeButton(key));
                });
            }
            const $actions = this._ref.$layout.querySelector('.Calc-keyboard-actions');
            if (!$actions.children.length) {
                this.actionKeys.forEach(key => {
                    $actions.appendChild(makeButton(key));
                });
            }
            const $numbers = this._ref.$layout.querySelector('.Calc-keyboard-numbers');
            if (!$numbers.children.length) {
                this.numberKeys.forEach(key => {
                    $numbers.appendChild(makeButton(key));
                });
            }
            const $operators = this._ref.$layout.querySelector('.Calc-keyboard-operators');
            if (!$operators.children.length) {
                this.operatorKeys.forEach(key => {
                    $operators.appendChild(makeButton(key));
                });
            }
            if ([State.Operator, State.OperandRight, State.OperandRightEnd].includes(this.state)) {
                forEach($operators.querySelectorAll('.active'), $active => $active.classList.remove('active'));
                $operators.querySelector(`[data-value="${this.operator}"]`)?.classList?.add?.('active');
            }
            else {
                forEach($operators.querySelectorAll('.active'), $active => $active.classList.remove('active'));
            }
        }
        onScreenChange() {
            const { $result, $input } = this._ref;
            if (!$result || !$input)
                return;
            requestAnimationFrame(() => {
                const wrapperWidth = $result.clientWidth;
                const inputWidth = $input.clientWidth;
                if (inputWidth > wrapperWidth) {
                    const scaleRatio = wrapperWidth / inputWidth;
                    this._ref.$input.style.transform = `scale(${scaleRatio})`;
                }
                else {
                    this._ref.$input.style.transform = '';
                }
            });
            dispatchEvent(this, 'bl:calc:screen', {
                detail: { value: this.getScreenValue() },
            });
            if (this.state === State.Result) {
                dispatchEvent(this, 'bl:calc:result', {
                    detail: { value: this.getScreenValue() },
                });
            }
        }
        onKeyPress(event) {
            let key = '';
            if (event.ctrlKey)
                key = 'ctrl-';
            if (event.altKey)
                key += 'alt-';
            key += event.key.toLowerCase();
            const value = this.keymap.get(key);
            if (value) {
                this.input(value);
            }
        }
        getScreenValue() {
            return +this.screen;
        }
        setScreenValue(n) {
            this.screen = '' + n;
        }
        memoryRecall() {
            switch (this.state) {
                case State.Init: {
                    this.screen = '' + this.memory;
                    this.state = State.Result;
                    return;
                }
                case State.OperandLeft: {
                    this.screen = '' + this.memory;
                    this.state = State.OperandLeftEnd;
                    return;
                }
                case State.OperandLeftEnd: {
                    this.screen = '' + this.memory;
                    this.state = State.OperandLeftEnd;
                    return;
                }
                case State.Operator: {
                    this.screen = '' + this.memory;
                    this.state = State.OperandRightEnd;
                    return;
                }
                case State.OperandRight: {
                    this.screen = '' + this.memory;
                    this.state = State.OperandRightEnd;
                    return;
                }
                case State.OperandRightEnd: {
                    this.screen = '' + this.memory;
                    this.state = State.OperandRightEnd;
                    return;
                }
                case State.Result: {
                    this.screen = '' + this.memory;
                    this.state = State.Result;
                }
            }
        }
        memoryClear() {
            this.memory = 0;
        }
        memoryAdd() {
            this.memory += this.getScreenValue();
        }
        memorySub() {
            this.memory -= this.getScreenValue();
        }
        deleteChar() {
            switch (this.state) {
                case State.Init: {
                    return;
                }
                case State.OperandLeft: {
                    this.screen = (this.screen ?? '').substr(0, (this.screen ?? '').length - 1) || '0';
                    return;
                }
                case State.OperandLeftEnd: {
                    return;
                }
                case State.Operator: {
                    return;
                }
                case State.OperandRight: {
                    this.screen = (this.screen ?? '').substr(0, (this.screen ?? '').length - 1) || '0';
                }
            }
        }
        clearEntry() {
            switch (this.state) {
                case State.Init: {
                    this.screen = '0';
                    return;
                }
                case State.OperandLeft: {
                    this.screen = '0';
                    this.state = State.Init;
                    return;
                }
                case State.OperandLeftEnd: {
                    this.screen = '0';
                    this.state = State.Init;
                    return;
                }
                case State.Operator: {
                    this.operator = null;
                    this.state = State.OperandLeftEnd;
                    return;
                }
                case State.OperandRight: {
                    this.screen = '0';
                    this.state = State.Operator;
                    return;
                }
                case State.OperandRightEnd: {
                    this.operator = null;
                    this.state = State.OperandLeftEnd;
                    return;
                }
                case State.Result: {
                    this.screen = '0';
                    this.state = State.Init;
                }
            }
        }
        clearAll() {
            this.screen = '0';
            this.operand = null;
            this.operator = null;
            this.state = State.Init;
            this.calcFn = null;
        }
        input(key) {
            if (/\d|\./.test(key)) {
                this.inputNumber(key);
                return;
            }
            switch (key) {
                case '=':
                    this.inputEqual();
                    this.render();
                    return;
                case 'DEL':
                    this.deleteChar();
                    return;
                case 'CE':
                    this.clearEntry();
                    return;
                case 'AC':
                    this.clearAll();
                    return;
                case '+':
                case '-':
                case '*':
                case '/':
                    this.inputOperator(key);
                    this.render();
                    return;
                case 'MR':
                    this.memoryRecall();
                    return;
                case 'MC':
                    this.memoryClear();
                    return;
                case 'M+':
                    this.memoryAdd();
                    return;
                case 'M-':
                    this.memorySub();
            }
        }
        inputNumber(n) {
            switch (this.state) {
                case State.Init: {
                    this.screen = n === '.' ? '0.' : n === '00' ? '0' : n;
                    this.state = State.OperandLeft;
                    return;
                }
                case State.OperandLeft: {
                    if (n === '.' && this.screen.indexOf('.') !== -1)
                        return;
                    if (this.screen === '0' && n === '00')
                        return;
                    if (this.screen === '0' && n !== '.') {
                        this.screen = n;
                        return;
                    }
                    this.screen += n;
                    return;
                }
                case State.OperandLeftEnd: {
                    this.screen = n === '.' ? '0.' : n === '00' ? '0' : n;
                    this.state = State.OperandLeft;
                    return;
                }
                case State.Operator: {
                    this.screen = n === '.' ? '0.' : n === '00' ? '0' : n;
                    this.state = State.OperandRight;
                    return;
                }
                case State.OperandRight: {
                    if (n === '.' && this.screen.indexOf('.') !== -1)
                        return;
                    if (this.screen === '0' && n === '00')
                        return;
                    if (this.screen === '0' && n !== '.') {
                        this.screen = n;
                        return;
                    }
                    this.screen += n;
                    return;
                }
                case State.OperandRightEnd: {
                    this.screen = n === '.' ? '0.' : n === '00' ? '0' : n;
                    this.state = State.OperandRight;
                    return;
                }
                case State.Result: {
                    this.screen = n === '.' ? '0.' : n === '00' ? '0' : n;
                    this.state = State.OperandLeft;
                }
            }
        }
        inputOperator(op) {
            switch (this.state) {
                case State.Init: {
                    this.operand = this.getScreenValue();
                    this.operator = op;
                    this.state = State.Operator;
                    return;
                }
                case State.OperandLeft: {
                    this.operand = this.getScreenValue();
                    this.operator = op;
                    this.state = State.Operator;
                    return;
                }
                case State.OperandLeftEnd: {
                    this.operand = this.getScreenValue();
                    this.operator = op;
                    this.state = State.Operator;
                    return;
                }
                case State.Operator: {
                    this.operator = op;
                    return;
                }
                case State.OperandRight: {
                    this.inputEqual();
                    this.operand = this.getScreenValue();
                    this.operator = op;
                    this.state = State.Operator;
                    return;
                }
                case State.OperandRightEnd: {
                    this.inputEqual();
                    this.operand = this.getScreenValue();
                    this.operator = op;
                    this.state = State.Operator;
                    return;
                }
                case State.Result: {
                    this.operand = this.getScreenValue();
                    this.operator = op;
                    this.state = State.Operator;
                }
            }
        }
        inputEqual() {
            switch (this.state) {
                case State.Init: {
                    return;
                }
                case State.OperandLeft: {
                    this.state = State.Result;
                    return;
                }
                case State.OperandLeftEnd: {
                    this.state = State.Result;
                    return;
                }
                case State.Operator: {
                    const operandLeft = this.operand;
                    const operandRight = this.operand;
                    this.calcFn = this.makeFn(this.operator)(operandRight);
                    const result = this.calcFn(operandLeft);
                    this.setScreenValue(result);
                    this.operator = null;
                    this.state = State.Result;
                    return;
                }
                case State.OperandRight: {
                    const operandLeft = this.operand;
                    const operandRight = this.getScreenValue();
                    this.calcFn = this.makeFn(this.operator)(operandRight);
                    const result = this.calcFn(operandLeft);
                    this.setScreenValue(result);
                    this.operator = null;
                    this.state = State.Result;
                    return;
                }
                case State.OperandRightEnd: {
                    const operandLeft = this.operand;
                    const operandRight = this.getScreenValue();
                    this.calcFn = this.makeFn(this.operator)(operandRight);
                    const result = this.calcFn(operandLeft);
                    this.setScreenValue(result);
                    this.operator = null;
                    this.state = State.Result;
                    return;
                }
                case State.Result: {
                    const result = this.calcFn?.(this.getScreenValue());
                    this.setScreenValue(result ?? '');
                    this.operator = null;
                    this.state = State.Result;
                }
            }
        }
    };
    return BlocksCalc = _classThis;
})();
