export class RowColumn {
  constructor(options = {}) {
    if (options instanceof RowColumn) return options

    this.headRender = options.headRender || ((column) => {
      return document.createTextNode(column.label ?? '')
    })

    this.render = options.render || ((data, column, $cell) => {
      return document.createTextNode(data[column.prop] ?? '')
    })

    this.summaryRender = options.summaryRender

    this.sortMethod = options.sortMethod

    this.label = options.label
    this.prop = options.prop
    this.align = options.align
    this.width = +options.width || 80
    this.minWidth = +options.minWidth || 0
    this.maxWidth = +options.maxWidth || Infinity
    this.fixedLeft = !!options.fixedLeft
    this.fixedRight = !!options.fixedRight
    this.sortOrder = ['none', 'ascending', 'descending'].includes(options.sortOrder) ? options.sortOrder : null
    this.resizable = !!options.resizable

    this.children = (options.children ?? []).map(child => {
      const childRow = child instanceof RowColumn ? child : new RowColumn(child)
      childRow.parent = this
      return childRow
    })
  }

  get parent() {
    return this._parent
  }

  set parent(value) {
    this._parent = value

    if (this.fixedLeft) {
      value.fixedLeft = true
    }

    else if (this.fixedRight) {
      value.fixedRight = true
    }
  }
}
