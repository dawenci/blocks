import { makeDomTemplate } from '../../common/template.js'
import '../icon/index.js'
import { BlocksScrollable } from '../scrollable/index.js'

export const contentTemplate = (() => {
  const $scrollable = document.createElement('bl-scrollable')
  $scrollable.id = 'viewport'
  const $listSize = document.createElement('div')
  $listSize.id = 'list-size'
  const $list = document.createElement('div')
  $list.id = 'list'
  $scrollable.appendChild($listSize)
  $scrollable.appendChild($list)
  return () => {
    return $scrollable.cloneNode(true) as BlocksScrollable
  }
})()

export const loadingTemplate = (() => {
  const $loading = document.createElement('div')
  $loading.id = 'loading'
  $loading.style.display = 'none'
  const $icon = document.createElement('bl-icon')
  $icon.setAttribute('value', 'busy')
  $loading.appendChild($icon)
  return () => {
    return $loading.cloneNode(true) as HTMLElement
  }
})()

export const itemTemplate = makeDomTemplate(document.createElement('div'))