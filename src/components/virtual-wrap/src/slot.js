
export default {
  // 只是为了包装用户slot 增加响应事件
  // functional: true,
  name: 'item-slot',
  props: {
    index: Number,
    source: Object,
    renderTag: String,
    uniqueKey: [String, Number]
  },
  render (h) {
    if (this.$slots.default.length > 1) {
      if (!this.renderTag) throw Error('请传递包裹slot的tag-name')
      return h(this.renderTag, this.$slots.default)
    }
    return this.$slots.default[0]
  },
  mounted () {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        // this.dispatchSizeChange()
      })
      this.resizeObserver.observe(this.$el)
    }
  },
  updated () {
    // this.dispatchSizeChange()
  },
  beforeDestroy () {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  },
  methods: {
    getCurrentSize () {
      return this.$el
        ? {
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        }
        : {
          width: 0,
          height: 0
        }
    },
    dispatchSizeChange () {
      this.$parent.$emit('item-resize', this.uniqueKey, this.getCurrentSize())
    }
  }
}
