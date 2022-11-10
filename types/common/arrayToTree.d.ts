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
export function arrayToTree<T, R>(array: T[], options: {
  idField?: string
  parentIdField?: string
  childrenField?: string
  parentField?: string | boolean
  dataField?: string | boolean
  orphansAsRoot?: boolean
  isRoot?: (item: T) => boolean
  hasChild?: (item: T) => boolean
} = {}): R[]
