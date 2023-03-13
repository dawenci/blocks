// 可选择组件相关接口
// 用于规范选择结果处理组件、候选列表组件之间的通讯

import { ComponentEventListener, ComponentEventMap } from '../components/Component.js'

// 选择结果、候选列表之间通讯用的数据结构
export interface ISelected {
  value: any
  label: string
}

// 选择结果组件，可以实现以下事件
export interface ISelectResultEventMap extends ComponentEventMap {
  // 向候选列表通知结果已清空
  'select-result:clear': CustomEvent
  // 向候选列表通知需要搜索过滤选项
  'select-result:search': CustomEvent<{ searchString: string }>
  // 向候选列表通知需要取消选择单个条目
  'select-result:deselect': CustomEvent<{ value: ISelected }>
}

// 候选列表组件，可以实现以下事件
export interface ISelectListEventMap extends ComponentEventMap {
  // 向选择结果组件通知需要选择单个条目
  'select-list:select': CustomEvent<{ value: ISelected }>
  // 向选择结果组件通知需要取消选择单个条目
  'select-list:deselect': CustomEvent<{ value: ISelected }>
  // 向选择结果组件通知需要重设选择结果
  'select-list:change': CustomEvent<{ value: ISelected[] }>
}

// 选择结果组件，需要实现以下方法
export interface ISelectResultComponent extends HTMLElement {
  // 接受选择结果方法，候选列表会调用该方法来传递选中的值
  acceptSelected(value: ISelected[]): void
  // 处理选择一项
  select?(value: ISelected): void
  // 处理取消选择一项
  deselect?(value: ISelected): void

  addEventListener<K extends keyof ISelectResultEventMap>(
    type: K,
    listener: ComponentEventListener<ISelectResultEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ISelectResultEventMap>(
    type: K,
    listener: ComponentEventListener<ISelectResultEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// 候选列表组件，要实现以下方法
export interface ISelectableListComponent extends HTMLElement {
  // 清空选择
  clearSelected(): void
  // 过滤候选列表
  searchSelectable?(keyword: string): void
  // 选择一项
  select?(value: ISelected): void
  // 取消选择一项
  deselect(data: ISelected): void

  addEventListener<K extends keyof ISelectListEventMap>(
    type: K,
    listener: ComponentEventListener<ISelectListEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ISelectListEventMap>(
    type: K,
    listener: ComponentEventListener<ISelectListEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

export function connectSelectable(
  $result: ISelectResultComponent,
  $list: ISelectableListComponent,
  options?: {
    captureList?: boolean
    captureResult?: boolean
  }
): () => void {
  const useCaptureResult = options?.captureResult ?? false
  const useCaptureList = options?.captureList ?? false

  const onResultClear: ComponentEventListener<ISelectResultEventMap['select-result:clear']> = () => {
    if (typeof $list.clearSelected === 'function') {
      $list.clearSelected()
    }
  }
  $result.addEventListener('select-result:clear', onResultClear, useCaptureResult)

  const onResultDeselect: ComponentEventListener<ISelectResultEventMap['select-result:deselect']> = event => {
    if (typeof $list.deselect === 'function') {
      $list.deselect(event.detail.value)
    }
  }
  $result.addEventListener('select-result:deselect', onResultDeselect, useCaptureResult)

  const onResultSearch: ComponentEventListener<ISelectResultEventMap['select-result:search']> = event => {
    if (typeof $list.searchSelectable === 'function') {
      $list.searchSelectable(event.detail.searchString)
    }
  }
  $result.addEventListener('select-result:search', onResultSearch, useCaptureResult)

  // 不一定需要实现
  const onListSelect: ComponentEventListener<ISelectListEventMap['select-list:select']> = event => {
    if (typeof $result.select === 'function') {
      $result.select(event.detail.value)
    }
  }
  $list.addEventListener('select-list:select', onListSelect, useCaptureList)

  // 不一定需要实现
  const onListDeselect: ComponentEventListener<ISelectListEventMap['select-list:deselect']> = event => {
    if (typeof $result.deselect === 'function') {
      $result.deselect(event.detail.value)
    }
  }
  $list.addEventListener('select-list:deselect', onListDeselect, useCaptureList)

  const onListChange: ComponentEventListener<ISelectListEventMap['select-list:change']> = event => {
    if (typeof $result.acceptSelected === 'function') {
      $result.acceptSelected(event.detail.value)
    }
  }
  $list.addEventListener('select-list:change', onListChange, useCaptureList)

  // 返回事件清理函数
  return () => {
    $result.removeEventListener('select-result:clear', onResultClear, useCaptureResult)
    $result.removeEventListener('select-result:deselect', onResultDeselect, useCaptureResult)
    $result.removeEventListener('select-result:search', onResultSearch, useCaptureResult)
    $list.removeEventListener('select-list:select', onListSelect, useCaptureList)
    $list.removeEventListener('select-list:deselect', onListDeselect, useCaptureList)
    $list.removeEventListener('select-list:change', onListChange, useCaptureList)
  }
}
