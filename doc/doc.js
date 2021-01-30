import { forEach } from '../widgets/core/utils.js'
import '../widgets/button/index.js'


// html 由于缩进，每行前面有固定的空格，使用该方法移除掉每行的开头 count 个空格
// 删除的数量，以第一行的为准
const removeLeadingSpaces = (str) => {
  let lines = []
  let rawLines = str.split(/\n\r?/)

  // 移除末尾空行
  let flag = false
  rawLines.reverse().forEach(line => {
    if (flag || line.trim()) {
      flag = true
      lines.push(line)
    }
  })
  // 移除开头空行
  flag = false
  rawLines = lines
  lines = []
  rawLines.reverse().forEach(line => {
    if (flag || line.trim()) {
      flag = true
      lines.push(line)
    }
  })

  if (!lines.length) return ''

  // 所有行移除掉不必要的缩进
  const firstLine = lines[0]
  let spaceCount = 0
  for (; spaceCount < firstLine.length; spaceCount += 1) {
    if (firstLine[spaceCount] !== ' ') break
  }

  return lines.map(line => {
    let i = 0;
    for (; i < spaceCount; i += 1) {
      if (str.charCodeAt(i) > 32) break
    }
    return line.slice(i)
  }).join('\n')
}

const insertAfter = (newElement, element) => {
  const parent = element.parentElement
  const next = element.nextElementSibling
  if (next) {
    parent.insertBefore(newElement, next)
  }
  else {
    parent.appendChild(newElement)
  }
  return newElement
}


window.onload = () => {
  // 生成标题导航
  {
    const headingNav = document.createElement('div')
    headingNav.className = 'heading-nav'
    const toggle = headingNav.appendChild(document.createElement('blocks-button'))
    toggle.size = 'small'
    toggle.textContent = '显示/隐藏导航'

    const nav = headingNav.appendChild(document.createElement('ol'))
    forEach(document.querySelectorAll('.section > h2'), h2 => {
      const item = nav.appendChild(document.createElement('li'))
      item.textContent = h2.textContent
      item.onclick = () => {
        const top = h2.offsetTop
        document.querySelector('article').scrollTop = top
      }
    })
    toggle.onclick = e => {
      nav.style.display = nav.style.display ? '' : 'none'
    }
    if (nav.childElementCount > 1) {
      document.body.appendChild(headingNav)
    }
  }

  // 从页面中提取 html，作为 demo code 打印在页面中
  forEach(document.querySelectorAll('[data-codesource]'), template => {
    const role = template.dataset.codesource
    const rawCode = template.innerHTML
    const title = template.dataset.title

    // 真实内容插入到 source 前面
    if (template.tagName === 'TEMPLATE') {
      const caseBlock = document.createElement(role === 'script' ? 'script' : 'div')
      caseBlock.className = 'case'
      caseBlock.innerHTML = rawCode

      // 如果代码块是脚本，则在 dom 准备完毕后，再插入执行
      if (role === 'script') {
        setTimeout(() => {
          template.parentElement.insertBefore(caseBlock, template)
        })
      }
      else {
        template.parentElement.insertBefore(caseBlock, template)
      }
    }

    // 读取代码内容，插入到 source 后面
    const printPart = insertAfter(document.createElement('div'), template)
    printPart.className = 'print-area'
    if (role === 'html') {
      printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 HTML'}</h3><pre data-codeprint="html-code"><code class="html"></code></pre>`
      const printCode = printPart.querySelector('[data-codeprint="html-code"] code')
      const code = removeLeadingSpaces(rawCode)
      printCode.textContent = code
      hljs.highlightBlock(printCode)
    }
    else if (role === 'script') {
      printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 JavaScript'}</h3><pre data-codeprint="script-code"><code class="javascript"></code></pre>`
      const printCode = printPart.querySelector('[data-codeprint="script-code"] code')
      const code = removeLeadingSpaces(rawCode)
      printCode.textContent = code
      hljs.highlightBlock(printCode)
    }
    else if (role === 'style') {
      printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 CSS'}</h3><pre data-codeprint="style-code"><code class="css"></code></pre>`
      const printCode = printPart.querySelector('[data-codeprint="style-code"] code')
      const code = removeLeadingSpaces(rawCode)
      printCode.textContent = code
      hljs.highlightBlock(printCode)
    }
    else {
      printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 代码'}</h3><pre data-codeprint="${role}"><code class="${role}"></code></pre>`
      const printCode = printPart.querySelector('[data-codeprint] code')
      const code = removeLeadingSpaces(rawCode)
      printCode.textContent = code
    }
  })
}
