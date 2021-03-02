/**
 * 生成树
 *
 * @param {Array<any>} array
 * @param {InternalOptions} options
 * @returns
 */
function internalFn(array, options) {
  const { idField, parentIdField, childrenField, orphansAsRoot, dataField, isRoot, hasChild, parentField } = options

  // 根元素结点数组，最终的返回值
  const rootItems = []

  // 同个父结点的子结点缓存，在未遍历至父结点时，暂时存储
  const tempLists = Object.create(null)

  // 已处理过的父结点存储
  const parents = Object.create(null)

  // 按照传入顺序，在一次遍历中完成所有查找
  const count = array.length
  for (let index = 0; index < count; index += 1) {
    const item = array[index]
    // 如果指定了包裹字段，则不直接修改原始数据，而是包裹起来
    const entry = dataField === '' ? item : { [dataField]: item }

    const itemId = item[idField]
    if (itemId == null) {
      continue
    }

    // 1. 如果判定存在子结点，登记为父结点，以便子结点查找。
    // 2. 如果存在匹配当前结点的临时子列表，则将临时列表转正挂载 item 下。
    if (hasChild == null || hasChild(item)) {
      parents[itemId] = entry
      if (tempLists[itemId]) {
        entry[childrenField] = tempLists[itemId]

        // 反向引用父元素
        if (parentField !== '') {
          entry[childrenField].forEach(child => {
            child[parentField] = entry
          })
        }

        // 从临时列表移除该项
        delete tempLists[itemId]
      }
    }

    // 根结点特殊处理
    if (isRoot(item)) {
      rootItems.push(entry)
      continue
    }

    // 下面开始处理级联，查找自己的父结点，
    // 若找到，则将自己添加到父节点的子列表中

    const parentId = item[parentIdField]

    // 在已登记父结点列表中，能找到父结点，则直接访问
    const parent = parents[parentId]
    if (parent != null) {
      // 确保存在子结点列表
      if (!Array.isArray(parent[childrenField])) {
        parent[childrenField] = []
      }

      // 将结点加入父结点的子列表
      parent[childrenField].push(entry)

      // 反向引用父元素
      if (parentField !== '') {
        entry[parentField] = parent
      }

      continue
    }

    // 暂无该结点的父结点线索，先存放在临时列表
    let children = tempLists[parentId]
    if (!children) {
      children = []
      tempLists[parentId] = children
    }
    children.push(entry)
  }

  // 如果临时列表最终没有找到匹配的 parent，
  // 则这些临时列表中的结点根据该属性，确定是丢弃还是成为根节点
  if (orphansAsRoot) {
    for (const parentId in tempLists) {
      rootItems.push(...tempLists[parentId])
    }
  }

  return rootItems
}

/**
 * 扁平的数组，转换成树形数据，单次遍历算法
 *
 * @export
 * @param {Array<any>} array 必选，原始扁平数据数组
 * @param {Options} [options={}] 可选，转换的配置项
 * @param {string} [options.idField] 可选，数据的 id，不传则为 id
 * @param {string} [options.parentIdField] 可选，数据的 parentId，不传则为 parentId
 * @param {string} [options.childrenField] 可选，存放子数据的字段名称，不传则为 children
 * @param {string | boolean} [options.parentField] 可选，子元素反向持有父元素的引用的字段名称，不传则不引用父结点
 * @param {string | boolean} [options.dataField] 可选，是否将数据挂载到某个字段下（否则将会直接修改原始数据）
 * @param {boolean} [options.orphansAsRoot] 可选，没有父结点的结点，是否作为 root 结点
 * @param {any => boolean} [options.isRoot] 可选，判断是否为顶级结点的方法，默认检测父字段是否为 null
 * @param {any => boolean} [options.hasChild] 可选，辅助判断是否拥有子结点的方法，默认猜测所有节点都有子节点
 * @returns {any[]}
 */
export function arrayToTree(array, options = {}) {
  if (!array || !array.length) return []

  // default: 'id'
  const idField = typeof options.idField === 'string' ? options.idField.trim() || 'id' : 'id'

  // default: 'parentId'
  const parentIdField =
    typeof options.parentIdField === 'string' ? options.parentIdField.trim() || 'parentId' : 'parentId'

  // default: 'children'
  const childrenField =
    typeof options.childrenField === 'string' ? options.childrenField.trim() || 'children' : 'children'

  // default: ''
  const parentField =
    typeof options.parentField === 'string' ? options.parentField.trim() : options.parentField ? 'parent' : ''

  // default: 'data'
  const dataField =
    options.dataField === undefined
      ? 'data'
      : typeof options.dataField === 'string' ? options.dataField.trim() : options.dataField ? 'data' : ''

  // default: false
  const orphansAsRoot = !!options.orphansAsRoot

  // default: item => item[options.parentIdField] == null
  const isRoot = typeof options.isRoot === 'function' ? options.isRoot : item => item[parentIdField] == null

  // default: undefined
  const hasChild = typeof options.hasChild === 'function' ? options.hasChild : undefined

  return internalFn(array, {
    idField,
    parentIdField,
    childrenField,
    parentField,
    dataField,
    orphansAsRoot,
    isRoot,
    hasChild
  })
}
