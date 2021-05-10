
// export default ({ props }) => <div>{props.render({ row: props.row, column: props.column, index: props.index })}</div>

export default {
  name: 'TableSlot',
  functional: true,
  props: {
    isSlot: {
      type: Boolean,
      default: true
    },
    row: Object,
    index: Number,
    column: Object,
    columns: Array,
    render: Function,
    columnsWidth: Object
  },
  render: (h, ctx) => {
    return ctx.props.isSlot
      ? h('div', ctx.props.render({
        row: ctx.props.row,
        column: ctx.props.column,
        index: ctx.props.index
      }))
      : ctx.props.render(h, {
        row: ctx.props.row,
        index: ctx.props.index,
        columns: ctx.props.columns,
        columnsWidth: ctx.props.columnsWidth
      })
  }
}
