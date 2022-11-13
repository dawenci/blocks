import { forEach } from '../dist/common/utils.js'
import '../dist/components/button/index.js'


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
  // 生成 h2 标题导航
  {
    const headingNav = document.createElement('div')
    headingNav.className = 'heading-nav'

    const nav = headingNav.appendChild(document.createElement('ol'))
    forEach(document.querySelectorAll('.section > h2'), h2 => {
      const item = nav.appendChild(document.createElement('li'))
      item.textContent = h2.textContent
      item.onclick = () => {
        const top = h2.offsetTop
        document.querySelector('article').scrollTop = top
      }
    })
    if (nav.childElementCount > 2) {
      document.body.appendChild(headingNav)
    }
  }

  // 渲染页面中标记为 code-source 的 html
  // 并将这些 html 的文本值本身作为 code 内容，打印在页面中
  forEach(document.querySelectorAll('[data-codesource]'), $codeSource => {
    const role = $codeSource.dataset.codesource
    let rawCode = $codeSource.innerHTML

    // 第一步：渲染
    // 如果 $codeSource 是 template 标签，
    // 则因为 template 里面的东西不会真正渲染，
    // 需要将内容提取出来，插入到 source 前面以触发真正渲染
    if ($codeSource.tagName === 'TEMPLATE') {
      let $exampleBlock

      if (role === 'script') {
        // js 代码写在 template 里面的 script 标签里面的情况
        if ($codeSource.content.querySelector('script')) {
          $exampleBlock = $codeSource.content.querySelector('script').cloneNode(true)
        }
        // template 里面没有 script 标签，直接就是 js 代码的情况
        else {
          $exampleBlock = document.createElement('script')
          $exampleBlock.appendChild($codeSource.content.cloneNode(true))
        }
        rawCode = $exampleBlock.innerHTML
        // 如果代码块是脚本，则在 dom 准备完毕后，再插入执行
        setTimeout(() => {
          $codeSource.parentElement.insertBefore($exampleBlock, $codeSource)
        })
      }

      // 非 js 代码
      else {
        $exampleBlock =document.createElement('div')
        $exampleBlock.appendChild($codeSource.content.cloneNode(true))
        $codeSource.parentElement.insertBefore($exampleBlock, $codeSource)
      }
    }
    
    // 第二步：打印原始代码
    // 读取代码内容，插入到 source 后面
    const title = $codeSource.dataset.title
    const $printArea = insertAfter(document.createElement('div'), $codeSource)
    $printArea.className = 'print-area'
    const defaultExapnd = $codeSource.hasAttribute('on')
    if (role === 'html') {
      $printArea.innerHTML = `
      <h3 class="print-title"><span>${title ?? '对应的 HTML'}</span><i class="toggle"></i></h3>
      <pre data-codeprint="html-code" style="display:${defaultExapnd ? 'block' : 'none'}"><code class="html"></code></pre>
      `
      const $code = $printArea.querySelector('[data-codeprint="html-code"] code')
      const code = removeLeadingSpaces(rawCode)
      $code.textContent = code
      hljs.highlightBlock($code)
    }
    else if (role === 'script') {
      $printArea.innerHTML = `
      <h3 class="print-title"><span>${title ?? '对应的 JavaScript'}</span><i class="toggle"></i></h3>
      <pre data-codeprint="script-code" style="display:${defaultExapnd ? 'block' : 'none'}"><code class="javascript"></code></pre>
      `
      const $code = $printArea.querySelector('[data-codeprint="script-code"] code')
      const code = removeLeadingSpaces(rawCode)
      $code.textContent = code
      hljs.highlightBlock($code)
    }
    else if (role === 'style') {
      $printArea.innerHTML = `
      <h3 class="print-title"><span>${title ?? '对应的 CSS'}</span><i class="toggle"></i></h3>
      <pre data-codeprint="style-code" style="display:${defaultExapnd ? 'block' : 'none'}"><code class="css"></code></pre>
      `
      const $code = $printArea.querySelector('[data-codeprint="style-code"] code')
      const code = removeLeadingSpaces(rawCode)
      $code.textContent = code
      hljs.highlightBlock($code)
    }
    else {
      $printArea.innerHTML = `
      <h3 class="print-title"><span>${title ?? '对应的 代码'}</span><i class="toggle"></i></h3>
      <pre data-codeprint="${role}" style="display:${defaultExapnd ? 'block' : 'none'}"><code class="${role}"></code></pre>
      `
      const $code = $printArea.querySelector('[data-codeprint] code')
      const code = removeLeadingSpaces(rawCode)
      $code.textContent = code
    }

    // 步骤三：显示隐藏交互
    // 代码区域，标题栏点击切换代码显示隐藏
    forEach(document.querySelectorAll('.print-area'), $printArea => {
      const $heading = $printArea.querySelector('h3')
      const $toggle = $printArea.querySelector('.toggle')
      const $codeWrapper = $printArea.querySelector('pre')
      const update = () => {
        $toggle.classList[getComputedStyle($codeWrapper).display === 'none' ? 'remove' : 'add']('on')
      }
      $heading.onclick = () => {
        $codeWrapper.style.display = getComputedStyle($codeWrapper).display === 'none' ? 'block' : 'none'
        update()
      }
      update()
    })

  })
}
