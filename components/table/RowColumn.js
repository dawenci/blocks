export default class RowColumn {
  constructor(options = {}) {
    if (options instanceof RowColumn) return options

    this.render = options.render || ((data, column, $cell) => {
      return document.createTextNode(data[column.prop] ?? '')
    })

    this.headRender = options.headRender || ((column) => {
      return document.createTextNode(column.label ?? '')
    })

    this.label = options.label
    this.prop = options.prop
    this.align = options.align
    this.width = +options.width || 80
    this.minWidth = +options.minWidth || 0
    this.maxWidth = +options.maxWidth || Infinity
    this.fixedLeft = !!options.fixedLeft
    this.fixedRight = !!options.fixedRight
    this.sortOrder = ['none', 'ascending', 'descending'].includes(options.sortOrder) ? options.sortOrder : 'none'
    this.resizable = !!options.resizable
    this.summaryMethod = options.summaryMethod
    this.children = (options.children ?? []).map(child => {
      const childRow = child instanceof RowColumn ? child : new RowColumn(child)
      childRow.parent = this
      return childRow
    })
  }
}
