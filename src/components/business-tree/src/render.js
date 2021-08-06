export default {
  name: 'Render',
  functional: true,
  props: {
    render: Function,
    node: Object
  },
  render: (h, ctx) => ctx.props.render(ctx.props.node)
}
