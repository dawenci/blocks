import * as BlNode from './node.js'

type BindingAttr = {
  type: 'attr'
  varName: string
  dataKey: string
  attrName: string
}
type BindingText = {
  type: 'text'
  varName: string
  dataKey: string
}
type BindingCond = {
  type: 'condition'
  varName: string
  dataKey: string
}
type Binding = BindingAttr | BindingText | BindingCond

type UpdateFn = (updateData: object) => void
type CreateFn = (initData: object) => UpdateFn

export function compile(root: BlNode.t): CreateFn {
  const binding: Binding[] = []
  let code = ''
  const line = (line: string, indent = 0) => {
    code += repeat('  ', indent) + line + '\n'
  }
  const index = [0]
  let indent = 0

  line(`var E = Object.create(null)`)
  line(`E['0'] = document.createDocumentFragment()`)

  // 递归处理
  const recAux = (
    $node: BlNode.t,
    conditionContext: string,
    parentKey: string
  ) => {
    if (BlNode.isElem($node)) {
      if ($node instanceof HTMLTemplateElement) return

      const attrs = BlNode.parseAttrs(BlNode.getAttrs($node))
      // 如果存在响应式内容，则声明一个数据对象用来存储每一轮渲染时的状态，更新时用来做脏比较
      if (!binding.length && attrs.some(item => item.type !== 'static')) {
        line(`var _prevData = Object.create(null)`, indent)
      }

      // 声明一个变量引用元素
      const varName = `${conditionContext}_${index[index.length - 1]++}`
      const cond = attrs.find(attr => attr.type === 'condition')
      if (cond) {
        index.push(0)
        conditionContext = varName
        // 当前元素上有 bl-if 条件渲染指令，则将当前元素子树的创建包装成一个函数调用，方便后续 update 时可复用逻辑
        line(`/*Cond*/ var render${varName} = (cond) => {`, indent++)
        // 暂存上一轮渲染的元素引用，用作 update 时，新 DOM 属的插入位置参照
        line(`var prevNode = E['${varName}']`, indent)
        line(`if (!cond) {`, indent++)
        line(
          `/*Elem*/ E['${varName}'] = document.createComment("E['${varName}']")`,
          indent--
        )
        line(`} else {`, indent++)
      }

      line(
        `/*Elem*/ E['${varName}'] = document.createElement('${$node.nodeName}')`,
        indent
      )

      attrs.forEach(attr => {
        switch (attr.type) {
          case 'static': {
            const attrValue = JSON.stringify(attr.value)
            line(
              `E['${varName}'].setAttribute('${attr.name}', ${attrValue})`,
              indent
            )
            return
          }
          case 'condition': {
            const dataKey = attr.value!
            binding.push({ type: 'condition', varName, dataKey })
            return
          }
          case 'binding': {
            const attrName = attr.name
            const dataKey = attr.value!
            binding.push({ type: 'attr', varName, attrName, dataKey })
            line(
              `if('${dataKey}' in initData) E['${varName}'].setAttribute('${attrName}', _prevData['${dataKey}'] = initData['${dataKey}'])`,
              indent
            )
          }
        }
      })

      // 递归处理子节点
      BlNode.eachChild($node, $child => {
        recAux($child, conditionContext, varName)
      })

      if (cond) {
        index.pop()
        line(`}`, --indent)
      }

      if (cond) {
        line(`if (prevNode) {`, indent++)
        line(
          `E['${parentKey}'].insertBefore(E['${varName}'], prevNode)`,
          indent
        )
        line(`E['${parentKey}'].removeChild(prevNode)`, indent--)
        // 清理树

        line(`} else {`, indent++)
        line(`E['${parentKey}'].appendChild(E['${varName}'])`, indent--)
        line(`}`, indent)
      } else {
        line(`E['${parentKey}'].appendChild(E['${varName}'])`, indent)
      }

      if (cond) {
        // render<n>() 的 }
        line(`}`, --indent)
        line(
          `render${varName}(_prevData['${cond.value}'] = initData['${cond.value}'])`,
          indent
        )
      }
    } else if (BlNode.isText($node)) {
      BlNode.parseText($node.nodeValue ?? '').forEach(record => {
        switch (record.type) {
          case 'static': {
            // static text
            const text = JSON.stringify(record.textContent)
            line(
              `E['${parentKey}'].appendChild(document.createTextNode(${text}))`,
              indent
            )
            break
          }
          case 'reactive': {
            // binding
            const dataKey = record.propName
            if (!binding.length) {
              line(`var _prevData = Object.create(null)`, indent)
            }
            const varName = `${conditionContext}_${index[index.length - 1]++}`
            binding.push({ type: 'text', varName, dataKey })
            line(
              `/*Text*/ E['${varName}'] = E['${parentKey}'].appendChild(document.createTextNode('${dataKey}' in initData ? (_prevData['${dataKey}'] = initData['${dataKey}']) : ''))`,
              indent
            )
            break
          }
        }
      })
    }
  }
  recAux(root, '0', '0', 0)

  // 生成更新函数，根据响应式属性生成更新逻辑，全静态内容，则生成空函数
  if (binding.length) {
    line(
      `var dirty = (key, data) => key in data && data[key] !== _prevData[key]`,
      indent
    )
    line(`var update = (data = {}) => {`, indent++)
    binding.forEach(item => {
      switch (item.type) {
        case 'condition': {
          const { dataKey, varName } = item
          line(
            `if(E['${varName}'] && dirty('${dataKey}', data)) render${varName}(_prevData['${dataKey}']=data['${dataKey}'])`,
            indent
          )
          break
        }
        case 'attr': {
          const { dataKey, varName, attrName } = item
          line(
            `if(E['${varName}'] && dirty('${dataKey}', data)) E['${varName}'].setAttribute('${attrName}', (_prevData['${dataKey}']=data['${dataKey}']))`,
            indent
          )
          break
        }
        case 'text': {
          // text
          const { dataKey, varName } = item
          line(
            `if(E['${varName}'] && dirty('${dataKey}', data)) E['${varName}'].nodeValue = (_prevData['${dataKey}']=data['${dataKey}'])`,
            indent
          )
          break
        }
      }
    })
    line('}', --indent)
  } else {
    line(`var update = (data) => {}`, indent)
  }

  // 返回生成的 DOM 以及对应的更新函数
  line(`return { update, $el: E[0] }`, indent)

  const createFn = new Function('initData = {}', code) as CreateFn

  console.log(code)

  return createFn
}

function repeat(c: string, n: number): string {
  let ret = ''
  while (n--) {
    ret += c
  }
  return ret
}
