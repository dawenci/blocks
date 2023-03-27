// 可选择组件相关接口
// 用于规范选择结果处理组件、候选列表组件之间的通讯

import { ComponentEventListener, ComponentEventMap } from '../components/component/Component.js'

// 选择结果、候选列表之间通讯用的数据结构
export interface ISelected {
  value: any
  label: string
}

export type ISelectPair = [ISelected | null, ISelected | null]

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
  // 向选择结果组件通知需要重设选择结果
  'select-list:change': CustomEvent<{ value: ISelected[] }>
}

// 选择结果组件，需要实现以下方法
export interface ISelectResultComponent extends HTMLElement {
  // 接受选择结果方法，候选列表会调用该方法来传递选中的值
  // 用于处理 'select-list:change' 事件
  acceptSelected(value: ISelected[]): void
  // 清空搜索内容
  clearSearch?(): void

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
  // 用于处理 'select-result:clear'
  clearSelected(): void
  // 取消选择一项
  // 用于处理 'select-result:deselect'
  deselect?(data: ISelected): void
  // 过滤候选列表
  // 用于处理 'select-result:search'
  searchSelectable?(keyword: string): void

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

// Pair 选择结果组件，可以实现以下事件
export interface IPairSelectResultEventMap extends ComponentEventMap {
  // 向候选列表通知结果已清空
  'pair-result:clear': CustomEvent
}

// Pair 候选列表组件，可以实现以下事件
export interface IPairSelectListEventMap extends ComponentEventMap {
  // 向选择结果组件通知需要重设选择结果
  'pair-select-list:change': CustomEvent<{ value: ISelectPair }>
}

// Pair 选择结果组件，需要实现以下方法
export interface IPairSelectResultComponent extends HTMLElement {
  // 接受选择结果方法，候选列表会调用该方法来传递选中的值
  // 用于处理 'select-list:change' 事件
  acceptSelected(value: ISelectPair): void
  addEventListener<K extends keyof IPairSelectResultEventMap>(
    type: K,
    listener: ComponentEventListener<IPairSelectResultEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof IPairSelectResultEventMap>(
    type: K,
    listener: ComponentEventListener<IPairSelectResultEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// Pair 候选列表组件，要实现以下方法
export interface IPairSelectableListComponent extends HTMLElement {
  // 清空选择
  // 用于处理 'pair-result:clear'
  clearSelected(): void
  addEventListener<K extends keyof IPairSelectListEventMap>(
    type: K,
    listener: ComponentEventListener<IPairSelectListEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof IPairSelectListEventMap>(
    type: K,
    listener: ComponentEventListener<IPairSelectListEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

/**
 * 对接结果展示组件、选项列表组件
 * 返回清理函数
 */
export function connectSelectable(
  $result: ISelectResultComponent,
  $list: ISelectableListComponent,
  options?: {
    captureList?: boolean
    captureResult?: boolean
    transformSelectedForResult?: (selected: ISelected) => ISelected
    transformSelectedForList?: (selected: ISelected) => ISelected
    afterHandleListChange?: (selected: ISelected[]) => void
    afterHandleResultClear?: () => void
    afterHandleResultDeselect?: (selected: ISelected) => void
    afterHandleResultSearch?: (searchString: string) => void
  }
): () => void {
  const useCaptureResult = options?.captureResult ?? false
  const useCaptureList = options?.captureList ?? false
  const transformSelectedForResult = options?.transformSelectedForResult ?? ((selected: ISelected) => selected)
  const transformSelectedForList = options?.transformSelectedForList ?? ((selected: ISelected) => selected)

  const onResultClear: ComponentEventListener<ISelectResultEventMap['select-result:clear']> = () => {
    if (typeof $list.clearSelected === 'function') {
      $list.clearSelected()
      options?.afterHandleResultClear?.()
    }
  }
  $result.addEventListener('select-result:clear', onResultClear, useCaptureResult)

  const onResultDeselect: ComponentEventListener<ISelectResultEventMap['select-result:deselect']> = event => {
    if (typeof $list.deselect === 'function') {
      const selected = transformSelectedForList(event.detail.value)
      $list.deselect(selected)
      options?.afterHandleResultDeselect?.(selected)
    }
  }
  $result.addEventListener('select-result:deselect', onResultDeselect, useCaptureResult)

  const onResultSearch: ComponentEventListener<ISelectResultEventMap['select-result:search']> = event => {
    if (typeof $list.searchSelectable === 'function') {
      $list.searchSelectable(event.detail.searchString)
      options?.afterHandleResultSearch?.(event.detail.searchString)
    }
  }
  $result.addEventListener('select-result:search', onResultSearch, useCaptureResult)

  const onListChange: ComponentEventListener<ISelectListEventMap['select-list:change']> = event => {
    if (typeof $result.acceptSelected === 'function') {
      const selectedArr = event.detail.value
      const selected = selectedArr.map(transformSelectedForResult)
      $result.acceptSelected(selected)
      options?.afterHandleListChange?.(selected)
    }
  }
  $list.addEventListener('select-list:change', onListChange, useCaptureList)

  // 返回事件清理函数
  return () => {
    $result.removeEventListener('select-result:clear', onResultClear, useCaptureResult)
    $result.removeEventListener('select-result:deselect', onResultDeselect, useCaptureResult)
    $result.removeEventListener('select-result:search', onResultSearch, useCaptureResult)
    $list.removeEventListener('select-list:change', onListChange, useCaptureList)
  }
}

/**
 * 对接结果展示组件、选项列表组件
 * 返回清理函数
 */
export function connectPairSelectable(
  $result: IPairSelectResultComponent,
  $list: IPairSelectableListComponent,
  options?: {
    captureList?: boolean
    captureResult?: boolean
    transformSelectedForResult?: (selected: ISelected) => ISelected
    transformSelectedForList?: (selected: ISelected) => ISelected
    afterHandleListChange?: (pair: ISelectPair) => void
    afterHandleResultClear?: () => void
    afterHandleResultDeselect?: () => void
    afterHandleResultSearch?: () => void
  }
): () => void {
  const useCaptureResult = options?.captureResult ?? false
  const useCaptureList = options?.captureList ?? false
  const transformSelectedForResult = options?.transformSelectedForResult ?? ((selected: ISelected) => selected)

  const onResultClear: ComponentEventListener<IPairSelectResultEventMap['pair-result:clear']> = () => {
    if (typeof $list.clearSelected === 'function') {
      $list.clearSelected()
      options?.afterHandleResultClear?.()
    }
  }
  $result.addEventListener('pair-result:clear', onResultClear, useCaptureResult)

  const onListChange: ComponentEventListener<IPairSelectListEventMap['pair-select-list:change']> = event => {
    if (typeof $result.acceptSelected === 'function') {
      const [first, second] = event.detail.value
      const values: ISelectPair = [
        first ? transformSelectedForResult(first) : null,
        second ? transformSelectedForResult(second) : null,
      ]
      $result.acceptSelected(values)
      options?.afterHandleListChange?.(values)
    }
  }
  $list.addEventListener('pair-select-list:change', onListChange, useCaptureList)

  // 返回事件清理函数
  return () => {
    $result.removeEventListener('pair-result:clear', onResultClear, useCaptureResult)
    $list.removeEventListener('pair-select-list:change', onListChange, useCaptureList)
  }
}
