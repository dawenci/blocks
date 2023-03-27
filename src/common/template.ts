/**
 * 通过 css 内容，构造对应的 <style> 元素的克隆函数
 */
export const makeStyleTemplate = (content: string): (() => HTMLStyleElement) => {
  let cache: HTMLStyleElement
  return () => {
    if (cache) {
      return cache.cloneNode(true) as HTMLStyleElement
    }
    cache = document.createElement('style')
    cache.textContent = content
    return cache.cloneNode(true) as HTMLStyleElement
  }
}

export interface IMakeTemplate {
  <T extends HTMLElement>(html: string): () => T
  <K extends keyof HTMLElementTagNameMap>(html: string): () => HTMLElementTagNameMap[K]
}

/**
 * 通过 html 内容（单个根节点），构造对应的 html 元素的克隆函数
 */
export const makeTemplate: IMakeTemplate = (html: string) => {
  let cloneTemplate: any
  return () => {
    if (cloneTemplate) {
      return cloneTemplate.cloneNode(true)
    }
    const $tempParent = document.createElement('div')
    $tempParent.innerHTML = html
    if ($tempParent.childElementCount > 1) {
      throw new Error('More than one root node.')
    }
    cloneTemplate = $tempParent.removeChild($tempParent.firstElementChild as any)
    return cloneTemplate.cloneNode(true)
  }
}

/**
 * 通过 html 内容（可以多个根节点），构造对应的 DocumentFragment 的克隆函数
 */
export const makeFragmentTemplate = (html: string): (() => DocumentFragment) => {
  // 注意：因为使用 `template` 标签的 `innerHTML` 方式创建的组件，表现为未链接至组件原型的情况，
  // 即构造的时候，只是一个普通的元素，直至挂载的时候，才会链接到组件原型并执行对应的构造函数、connectedCallback。
  // 因此，不能直接使用 template 标签。
  const $fragment = document.createDocumentFragment()
  const $tempParent = document.createElement('div')
  $tempParent.innerHTML = html
  while ($tempParent.children.length) {
    $fragment.appendChild($tempParent.children[0])
  }
  return () => {
    return $fragment.cloneNode(true) as DocumentFragment
  }
}

/**
 * 通过传入 DOM 元素，返回对应元素的克隆函数
 */
export const makeDomTemplate = <T extends HTMLElement>(template: T) => {
  return () => {
    return template.cloneNode(true) as T
  }
}
