import { forEach } from '../widgets/core/utils.js'


// html 由于缩进，每行前面有固定的空格，使用该方法移除掉每行的开头 count 个空格
// 删除的数量，以第一行的为准
const removeLeadingSpaces = (str) => {
  const lines = str.split(/\n\r?/)
    .filter(line => !!line.trim())
  if (!lines.length) return ''

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
  // 从页面中提取 html，作为 demo code 打印在页面中
  const blocks = document.querySelectorAll('.case')
  forEach(blocks, block => {
    forEach(block.querySelectorAll('[data-codesource]'), source => {
      const role = source.dataset.codesource
      const rawCode = source.innerHTML
      const title = source.dataset.title
      // 插入到 source 后面
      const printPart = insertAfter(document.createElement('div'), source)
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
  })
}