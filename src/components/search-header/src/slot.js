export default {
  name: 'HeaderSlot',
  functional: true,
  inject: ['searchHeader'],
  props: {
    renderModel: Object
  },
  render: (h, ctx) => {
    const render = ctx.injections.searchHeader.$scopedSlots[ctx.props.renderModel.slot]
    return render
      ? render({
        model: ctx.props.renderModel
      })
      : ''
  }
}
