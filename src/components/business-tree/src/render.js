export default {
  name: 'RenderCell',
  functional: true,
  props: {
    render: Function,
    node: Object
  },
  render: (h, ctx) => ctx.props.render(ctx.props.node)
}
