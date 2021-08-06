export default {
  name: 'Render',
  functional: true,
  props: {
    render: Function,
    node: Object
  },
  // 仅支持jsx语法，不对h做适配
  render: (h, ctx) => ctx.props.render(ctx.props.node, h)
}
