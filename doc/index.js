import { map, forEach } from '../widgets/core/utils.js'

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
  const aside = document.querySelector('aside')
  const article = document.querySelector('article')

  const sections = article.querySelectorAll('section')


  ;(() => {
    const hash = decodeURIComponent(location.hash.slice(1))
    const section = Array.prototype.find.call(sections, section => {
      const heading = section.querySelector('h2')
      return heading && heading.textContent === hash
    })
    if (section) article.scrollTop = section.offsetTop
  })()
  


  // 导航
  map(sections, section => {
    const heading = section.querySelector('h2')
  
    const navItem = aside.appendChild(document.createElement('div'))
    navItem.textContent = heading.textContent
  
    navItem.onclick = (e) => {
      article.scrollTop = section.offsetTop
      history.pushState({}, navItem.textContent, `#${encodeURIComponent(navItem.textContent)}`)
    }
  })


  // 从页面中提取 html，作为 demo code 打印在页面中
  forEach(sections, section => {
    const blocks = section.querySelectorAll('.case')
    forEach(blocks, block => {
      forEach(block.querySelectorAll('[data-role]'), source => {
        const role = source.dataset.role
        const rawCode = source.innerHTML
        const title = source.dataset.title
        // 插入到 source 后面
        const printPart = insertAfter(document.createElement('div'), source)
        printPart.className = 'print-area'

        if (role === 'html') {
          printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 HTML'}</h3><pre data-role="html-code"><code class="html"></code></pre>`
          const printCode = printPart.querySelector('[data-role="html-code"] code')
          const code = removeLeadingSpaces(rawCode)
          printCode.textContent = code
          hljs.highlightBlock(printCode)
        }
        else if (role === 'script') {
          printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 JavaScript'}</h3><pre data-role="script-code"><code class="javascript"></code></pre>`
          const printCode = printPart.querySelector('[data-role="script-code"] code')
          const code = removeLeadingSpaces(rawCode)
          printCode.textContent = code
          hljs.highlightBlock(printCode)
        }
        else if (role === 'style') {
          printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 CSS'}</h3><pre data-role="style-code"><code class="css"></code></pre>`
          const printCode = printPart.querySelector('[data-role="style-code"] code')
          const code = removeLeadingSpaces(rawCode)
          printCode.textContent = code
          hljs.highlightBlock(printCode)
        }
        else {
          printPart.innerHTML = `<h3 class="print-title">${title ?? '对应的 代码'}</h3><pre data-role="${role}"><code class="${role}"></code></pre>`
          const printCode = printPart.querySelector('[data-role] code')
          const code = removeLeadingSpaces(rawCode)
          printCode.textContent = code
        }
      })
    })
  })


}
