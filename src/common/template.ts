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

/**
 * 通过 html 内容（单个根节点），构造对应的 html 元素的克隆函数
 */
export const makeTemplate = <T extends HTMLElement>(html: string): (() => T) => {
  let cache: HTMLTemplateElement
  return () => {
    if (cache) {
      return cache.content.firstElementChild!.cloneNode(true) as T
    }
    cache = document.createElement('template')
    cache.innerHTML = html
    return cache.content.firstElementChild!.cloneNode(true) as T
  }
}

/**
 * 通过 html 内容（可以多个根节点），构造对应的 DocumentFragment 的克隆函数
 */
export const makeFragmentTemplate = (html: string): (() => DocumentFragment) => {
  let cache: HTMLTemplateElement
  return () => {
    if (cache) {
      return cache.content.cloneNode(true) as DocumentFragment
    }
    cache = document.createElement('template')
    cache.innerHTML = html
    return cache.content.cloneNode(true) as DocumentFragment
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
