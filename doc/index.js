const forEach = (list, fn) => Array.prototype.forEach.call(list, fn)
const map = (list, fn) => Array.prototype.map.call(list, fn)

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


window.onload = () => {
  const aside = document.querySelector('aside')
  const article = document.querySelector('article')

  const sections = article.querySelectorAll('section')

  // 导航
  map(sections, section => {
    const heading = section.querySelector('h2')
  
    const navItem = aside.appendChild(document.createElement('div'))
    navItem.textContent = heading.textContent
  
    navItem.onclick = (e) => {
      article.scrollTop = section.offsetTop
    }
  })


  // 从页面中提取 html，作为 demo code 打印在页面中
  forEach(sections, section => {
    const blocks = section.querySelectorAll('.block')
    forEach(blocks, block => {
      const printArea = block.appendChild(document.createElement('div'))
      printArea.className = 'demo-block-code'

      forEach(block.querySelectorAll('[data-role="html"], [data-role="script"], [data-role="style"]'), source => {
        const printPart = printArea.appendChild(document.createElement('div'))
        printPart.className = 'part'

        if (source.dataset.role === 'html') {
          printPart.innerHTML = '<h3>HTML</h3><pre data-role="html-code"><code class="html"></code></pre>'
          const printCode = printPart.querySelector('[data-role="html-code"] code')
          const code = removeLeadingSpaces(source.innerHTML)
          printCode.textContent = code
          hljs.highlightBlock(printCode)
        }
        else if (source.dataset.role === 'script') {
          printPart.innerHTML = '<h3>JavaScript</h3><pre data-role="script-code"><code class="javascript"></code></pre>'
          const printCode = printPart.querySelector('[data-role="script-code"] code')
          const code = removeLeadingSpaces(source.innerHTML)
          printCode.textContent = code
          hljs.highlightBlock(printCode)
        }
        else {
          printPart.innerHTML = '<h3>CSS</h3><pre data-role="style-code"><code class="css"></code></pre>'
          const printCode = printPart.querySelector('[data-role="style-code"] code')
          const code = removeLeadingSpaces(source.innerHTML)
          printCode.textContent = code
          hljs.highlightBlock(printCode)
        }
      })
    })
  })


}
