// 可选择组件相关接口
// 用于规范选择结果处理组件、候选列表组件之间的通讯

import { BlComponentEventListener, BlComponentEventMap } from '../components/component/Component.js'

// 选择结果、候选列表之间通讯用的数据结构
export interface ISelected<T = any> {
  value: T
  label: string
}

export type ISelectPair<T = any> = [ISelected<T> | null, ISelected<T> | null]

// 选择结果组件事件
export interface ISelectResultEventMap<T = any> extends BlComponentEventMap {
  // 向候选列表通知结果已清空
  'select-result:clear': CustomEvent
  // 向候选列表通知需要搜索过滤选项
  'select-result:search': CustomEvent<{ searchString: string }>
  // 向候选列表通知需要取消选择单个条目
  'select-result:deselect': CustomEvent<{ value: ISelected<T> }>

  // 可选实现：
  // 通知已经接受值
  'select-result:after-accept-selected': CustomEvent
}

// 候选列表组件，可以实现以下事件
export interface ISelectListEventMap<T = any> extends BlComponentEventMap {
  // 必须实现，向选择结果组件通知需要重设选择结果
  'select-list:change': CustomEvent<{ value: ISelected<T>[] }>

  // 可选实现:
  // 通知已经完成清空
  'select-list:after-clear': CustomEvent
  // 通知已经完成取消选择
  'select-list:after-deselect': CustomEvent
  // 通知已经完成搜索
  'select-list:after-search': CustomEvent
}

// 选择结果组件，需要实现以下方法
export interface ISelectResultComponent<T = any> extends HTMLElement {
  // 接受选择结果方法，候选列表会调用该方法来传递选中的值
  // 用于处理 'select-list:change' 事件
  acceptSelected(value: ISelected<T>[]): void
  // 清空搜索内容
  clearSearch?(): void
  // 用于处理 'select-list:after-clear'
  afterListClear?(): void
  afterListDeselect?(): void
  afterListSearch?(): void

  addEventListener<K extends keyof ISelectResultEventMap<T>>(
    type: K,
    listener: BlComponentEventListener<ISelectResultEventMap<T>[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ISelectResultEventMap<T>>(
    type: K,
    listener: BlComponentEventListener<ISelectResultEventMap<T>[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// 候选列表组件，要实现以下方法
export interface ISelectableListComponent<T = any> extends HTMLElement {
  // 清空选择
  // 用于处理 'select-result:clear'
  clearSelected(): void
  // 取消选择一项
  // 用于处理 'select-result:deselect'
  deselect?(data: ISelected<T>): void

  // 用于处理 'select-result:after-accept-selected'
  afterResultAccepted?(): void

  // 过滤候选列表
  // 用于处理 'select-result:search'
  searchSelectable?(keyword: string): void

  addEventListener<K extends keyof ISelectListEventMap<T>>(
    type: K,
    listener: BlComponentEventListener<ISelectListEventMap<T>[K]>,
    options?: boolean | AddEventListenerOptions
  ): void

  removeEventListener<K extends keyof ISelectListEventMap<T>>(
    type: K,
    listener: BlComponentEventListener<ISelectListEventMap<T>[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// Pair 选择结果组件，可以实现以下事件
export interface IPairSelectResultEventMap extends BlComponentEventMap {
  // 向候选列表通知结果已清空
  'pair-result:clear': CustomEvent

  // 通知已经接受值
  'pair-result:after-accept-selected': CustomEvent
}

// Pair 候选列表组件，可以实现以下事件
export interface IPairSelectListEventMap<T = any> extends BlComponentEventMap {
  // 必须实现，向选择结果组件通知需要重设选择结果
  'pair-select-list:change': CustomEvent<{ value: ISelectPair<T> }>

  // 通知已经完成清空
  'pair-select-list:after-clear': CustomEvent
}

// Pair 选择结果组件，需要实现以下方法
export interface IPairSelectResultComponent<T = any> extends HTMLElement {
  // 接受选择结果方法，候选列表会调用该方法来传递选中的值
  // 用于处理 'select-list:change' 事件
  acceptSelected(value: ISelectPair<T>): void

  // 用于处理 'pair-select-list:after-clear'
  afterListClear?(): void
  addEventListener<K extends keyof IPairSelectResultEventMap>(
    type: K,
    listener: BlComponentEventListener<IPairSelectResultEventMap[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof IPairSelectResultEventMap>(
    type: K,
    listener: BlComponentEventListener<IPairSelectResultEventMap[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

// Pair 候选列表组件，要实现以下方法
export interface IPairSelectableListComponent<T = any> extends HTMLElement {
  // 清空选择
  // 用于处理 'pair-result:clear'
  clearSelected(): void

  // 用于处理 'pair-result:after-accept-selected'
  afterResultAccepted?(): void

  addEventListener<K extends keyof IPairSelectListEventMap<T>>(
    type: K,
    listener: BlComponentEventListener<IPairSelectListEventMap<T>[K]>,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof IPairSelectListEventMap<T>>(
    type: K,
    listener: BlComponentEventListener<IPairSelectListEventMap<T>[K]>,
    options?: boolean | EventListenerOptions
  ): void
}

/**
 * 对接结果展示组件、选项列表组件
 * 返回清理函数
 */
export function connectSelectable<T = any>(
  $result: ISelectResultComponent<T>,
  $list: ISelectableListComponent<T>,
  options?: {
    captureList?: boolean
    captureResult?: boolean
    transformSelectedForResult?: (selected: ISelected<T>) => ISelected
    transformSelectedForList?: (selected: ISelected<T>) => ISelected
    afterHandleListChange?: (selected: ISelected<T>[]) => void
    afterHandleResultClear?: () => void
    afterHandleResultDeselect?: (selected: ISelected<T>) => void
    afterHandleResultSearch?: (searchString: string) => void
  }
): () => void {
  const useCaptureResult = options?.captureResult ?? false
  const useCaptureList = options?.captureList ?? false
  const transformSelectedForResult = options?.transformSelectedForResult ?? ((selected: ISelected<T>) => selected)
  const transformSelectedForList = options?.transformSelectedForList ?? ((selected: ISelected<T>) => selected)

  const onResultClear: BlComponentEventListener<ISelectResultEventMap<T>['select-result:clear']> = () => {
    if (typeof $list.clearSelected === 'function') {
      $list.clearSelected()
      options?.afterHandleResultClear?.()
    }
  }
  $result.addEventListener('select-result:clear', onResultClear, useCaptureResult)

  const onResultDeselect: BlComponentEventListener<ISelectResultEventMap<T>['select-result:deselect']> = event => {
    if (typeof $list.deselect === 'function') {
      const selected = transformSelectedForList(event.detail.value)
      $list.deselect(selected)
      options?.afterHandleResultDeselect?.(selected)
    }
  }
  $result.addEventListener('select-result:deselect', onResultDeselect, useCaptureResult)

  const onAfterResultAccepted: BlComponentEventListener<
    ISelectResultEventMap<T>['select-result:after-accept-selected']
  > = event => {
    if (typeof $list.afterResultAccepted === 'function') {
      $list.afterResultAccepted()
    }
  }
  $result.addEventListener('select-result:after-accept-selected', onAfterResultAccepted)

  const onResultSearch: BlComponentEventListener<ISelectResultEventMap<T>['select-result:search']> = event => {
    if (typeof $list.searchSelectable === 'function') {
      $list.searchSelectable(event.detail.searchString)
      options?.afterHandleResultSearch?.(event.detail.searchString)
    }
  }
  $result.addEventListener('select-result:search', onResultSearch, useCaptureResult)

  const onListChange: BlComponentEventListener<ISelectListEventMap<T>['select-list:change']> = event => {
    if (typeof $result.acceptSelected === 'function') {
      const selectedArr = event.detail.value
      const selected = selectedArr.map(transformSelectedForResult)
      $result.acceptSelected(selected)
      options?.afterHandleListChange?.(selected)
    }
  }
  $list.addEventListener('select-list:change', onListChange, useCaptureList)

  const onAfterListClear: BlComponentEventListener<ISelectListEventMap<T>['select-list:after-clear']> = () => {
    if (typeof $result.afterListClear === 'function') {
      $result.afterListClear()
    }
  }
  $list.addEventListener('select-list:after-clear', onAfterListClear, useCaptureList)

  const onAfterListDeselect: BlComponentEventListener<ISelectListEventMap<T>['select-list:after-deselect']> = () => {
    if (typeof $result.afterListDeselect === 'function') {
      $result.afterListDeselect()
    }
  }
  $list.addEventListener('select-list:after-clear', onAfterListDeselect, useCaptureList)

  const onAfterListSearch: BlComponentEventListener<ISelectListEventMap<T>['select-list:after-search']> = () => {
    if (typeof $result.afterListSearch === 'function') {
      $result.afterListSearch()
    }
  }
  $list.addEventListener('select-list:after-clear', onAfterListSearch, useCaptureList)

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
export function connectPairSelectable<T = any>(
  $result: IPairSelectResultComponent<T>,
  $list: IPairSelectableListComponent<T>,
  options?: {
    captureList?: boolean
    captureResult?: boolean
    transformSelectedForResult?: (selected: ISelected<T>) => ISelected<T>
    transformSelectedForList?: (selected: ISelected<T>) => ISelected<T>
    afterHandleListChange?: (pair: ISelectPair<T>) => void
    afterHandleResultClear?: () => void
    afterHandleResultDeselect?: () => void
    afterHandleResultSearch?: () => void
  }
): () => void {
  const useCaptureResult = options?.captureResult ?? false
  const useCaptureList = options?.captureList ?? false
  const transformSelectedForResult = options?.transformSelectedForResult ?? ((selected: ISelected<T>) => selected)

  const onResultClear: BlComponentEventListener<IPairSelectResultEventMap['pair-result:clear']> = () => {
    if (typeof $list.clearSelected === 'function') {
      $list.clearSelected()
      options?.afterHandleResultClear?.()
    }
  }
  $result.addEventListener('pair-result:clear', onResultClear, useCaptureResult)

  const onAfterResultAccepted: BlComponentEventListener<
    ISelectResultEventMap<T>['pair-result:after-accept-selected']
  > = event => {
    if (typeof $list.afterResultAccepted === 'function') {
      $list.afterResultAccepted()
    }
  }
  $result.addEventListener('pair-result:after-accept-selected', onAfterResultAccepted)

  const onListChange: BlComponentEventListener<IPairSelectListEventMap<T>['pair-select-list:change']> = event => {
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

  const onAfterListClear: BlComponentEventListener<ISelectListEventMap<T>['pair-select-list:after-clear']> = () => {
    if (typeof $result.afterListClear === 'function') {
      $result.afterListClear()
    }
  }
  $list.addEventListener('pair-select-list:after-clear', onAfterListClear, useCaptureList)

  // 返回事件清理函数
  return () => {
    $result.removeEventListener('pair-result:clear', onResultClear, useCaptureResult)
    $list.removeEventListener('pair-select-list:change', onListChange, useCaptureList)
  }
}

export function makeISelectableProxy<T>(): ISelectResultComponent<T> & ISelectableListComponent<T> {
  return document.createElement('div') as unknown as ISelectResultComponent<T> & ISelectableListComponent<T>
}

export function makeIPairSelectableProxy<T>(): ISelectResultComponent<T> & IPairSelectableListComponent<T> {
  return document.createElement('div') as unknown as ISelectResultComponent<T> & IPairSelectableListComponent<T>
}
