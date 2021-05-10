export default {
  methods: {
    setCellWidth (column) {
      let width = ''
      if (column.width) {
        width = column.width
      } else if (this.columnsWidth[column._index]) {
        width = this.columnsWidth[column._index].width
      }
      if (width === '0') width = ''
      return `${width}px`
    },
    alignCls (column, row = {}) {
      let cellClassName = ''
      if (row.cellClassName && column.key && row.cellClassName[column.key]) {
        cellClassName = row.cellClassName[column.key]
      }
      return [
        `${this.prefixCls}-cell`,
        {
          [`${cellClassName}`]: cellClassName, // cell className
          [`${column.className}`]: column.className, // column className
          [`${this.prefixCls}-cell-ellipsis`]: column.ellipsis,
          [`${this.prefixCls}-cell-${column.align}`]: column.align,
          [`${this.prefixCls}-cell-with-index`]: column.type === 'index',
          [`${this.prefixCls}-hidden`]: (this.fixed === 'left' && column.fixed !== 'left') || (this.fixed === 'right' && column.fixed !== 'right') || (!this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'))
        }
      ]
    },
    isPopperShow (column) {
      return column.filters && ((!this.fixed && !column.fixed) || (this.fixed === 'left' && column.fixed === 'left') || (this.fixed === 'right' && column.fixed === 'right'))
    }
  }
}