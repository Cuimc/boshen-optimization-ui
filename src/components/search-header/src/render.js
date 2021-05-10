export default {
  name: 'HeaderRender',
  functional: true,
  props: {
    renderModel: Object
  },
  render: (h, ctx) => {
    return ctx.props.renderModel.render(h, ctx.props.renderModel)
  }
}
