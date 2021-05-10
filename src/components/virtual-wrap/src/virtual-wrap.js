/**
 * desc: 仅用作滚动容器，不对内容渲染做处理。只处理虚拟容器实现
 * 1. 代理子项目所有事件进行抛出。
 * 2. 响应父项目事件、及响应正确数据
 * 3. 维护外部传入数据与虚拟逻辑的交互。保证页面渲染与性能
 * 4. 目前仅支持纵向虚拟滚动，横向的预留了空间。。。。。。。。。
 * --------------------
 * 1. 继承父元素宽度高度，故父元素必须有高度宽度
 * 2. 针对v-show场景会导致组件计算失误，故在show之后显示调用this.$refs[refName].initVirtual()
 * 3. 默认抛出source即当前组件数据源，如需增加 后期考虑添加
 * 4. slot为数组时，会报错
 */

import Slot from './slot'
import Virtual from './virtual'

// const contentEvent = []

export default {
  name: 'VirtualWrap',
  props: {
    // 组件跟节点ref属性，用作操作组件对象
    refName: {
      type: String,
      required: true
    },
    // 容器根节点渲染dom-tag
    rootTag: {
      type: String,
      default: 'div'
    },
    // 虚拟滚动的容器dom-tag
    wrapTag: {
      type: String,
      default: 'div'
    },
    // 当slot为数组时dom-tag
    renderTag: {
      type: String
    },
    // 循环容器渲染dom-class
    wrapClass: String,
    // data唯一标识
    dataKey: {
      type: [String, Number],
      required: true
    },
    // 数据源
    dataSources: {
      type: Array,
      required: true
    },
    preloadSize: {
      type: Number,
      default: 30
    },
    itemSize: {
      type: Number,
      default: 40
    },
    // 顶部offset
    topThreshold: {
      type: Number,
      default: 0
    },
    // 底部最大offset
    bottomThreshold: {
      type: Number,
      default: 0
    },
    // 顶部solt高度
    slotHeaderSize: {
      type: Number,
      default: 0
    },
    // 针对table特殊dom嵌套定制化入口
    isTableBody: {
      type: Boolean
    }
    // 每个元素的宽度高度
    // itemSize: {
    //   type: Object
    // },
    // 一屏展示个数 {x: 30, y: 30} 不传递则根据容器自动计算
    // preloadSize: {
    //   type: Object
    // },
    // 初始化之后容器滚动距离 {x: 0, y: 0}
    // offset: {
    //   type: Object
    // },
    // 行数据样本（全量且要有序,每一个key作为一列 || 视可枚举属性为可用属性)传递表示开启横向虚拟滚动
    // columns: [Object, Array]
  },
  data () {
    return {
      virtualInfo: {}
    }
  },
  computed: {
    className () {
      return this.wrapClass
        ? [this.wrapClass, 'sh-virtual-content-wrap']
        : ['sh-virtual-content-wrap']
    },
    columnSouses () {
      return this.columns && this.columns.length
        ? this.columns
        : Object.keys(this.columns)
    }
  },
  watch: {
    'dataSources.length' () {
      // this.reset()
      this.virtual.updateParam('uniqueIds', this.getUniqueIds())
      this.virtual.handleDataSourcesChange()
    }
  },
  render (h) {
    /**
     * https: https://cn.vuejs.org/v2/guide/render-function.html
     * h --> createElement(compoent, params , children )
    /**
     * slot暂时支持 数据模板渲染
     * v2.0: slot-header、slot-footer
     */
    // console.log('render')
    const { model } = this.$scopedSlots
    const { header, footer } = this.$slots
    if (!model) return console.error('请传入渲染组件')
    const { rootTag, wrapTag, renderTag, className, refName, isTableBody } = this
    const children = this.setChildNode(h, model, renderTag, isTableBody)
    const wrapStyle = { padding: `${this.virtualInfo.padFront}px 0px ${this.virtualInfo.padBehind}px` }
    return h(rootTag,
      {
        ref: refName,
        on: !isTableBody
          ? {
            '&scroll': this.handlerScroll
          }
          : null,
        class: 'sh-virtual',
        style: isTableBody ? wrapStyle : null
      },
      // 需要容器去产生滚动条
      [
        header || null,
        h(wrapTag,
          {
            style: !isTableBody ? wrapStyle : null,
            class: className
          }, children),
        footer || null
      ]
    )
  },
  activated () {
    this.scrollToOffset(this.virtual.offset.top, this.virtual.offset.left)
  },
  created () {
    this.initVirtual()
    this.$on('item-reize', this.childResize)
    if (this.isTableBody) {
      this.$parent.$parent.$on('on-tbody-scroll', this.handlerScroll)
    }
  },
  beforeDestroy () {
    this.virtual.destroy()
  },
  methods: {
    reset () {
      this.virtual.destroy()
      this.scrollToOffset(0, 0)
      this.initVirtual()
    },
    initVirtual () {
      this.virtual = new Virtual({
        slotHeaderSize: this.slotHeaderSize,
        slotFooterSize: 0,
        keeps: this.preloadSize,
        estimateSize: this.itemSize,
        uniqueIds: this.getUniqueIds(),
        buffer: Math.round(this.preloadSize / 3)
      }, this.handlerUpdate)
      this.virtualInfo = this.virtual.getVirtualInfo()
    },
    getUniqueIds () {
      return this.dataSources.map((dataSource) => dataSource[this.dataKey])
    },
    // 根据id获取当前数据
    getSize (id) {
      return this.virtual.sizes.get(id)
    },
    // 获取当前显示数据长度
    getSizes () {
      return this.virtual.sizes.size
    },
    // 根据index滚动到指定index距离
    scrollToIndex (index) {
      if (index >= this.dataSources.length - 1) {
        this.scrollToBottom()
      } else {
        const offset = this.virtual.getOffset(index)
        this.scrollToOffset(offset)
      }
    },
    // 滚动到底部
    scrollToBottom () {
      const { shepherd } = this.$refs
      if (shepherd) {
        const offset = shepherd.offsetTop
        this.scrollToOffset(offset)
        setTimeout(() => {
          if (this.getOffset() + this.getClientSize() < this.getScrollSize()) {
            this.scrollToBottom()
          }
        }, 3)
      }
    },
    // 获取容器宽度高度
    getClientSize (target) {
      const el = target || this.$refs[this.refName]
      return el ? el.clientHeight : 0
    },
    // 获取滚动位移信息
    getOffset (target) {
      const el = target || this.$refs[this.refName]
      return el.scrollTop || 0
    },
    // 获取可滚动的内容长度
    getScrollSize (target) {
      const el = target || this.$refs[this.refName]
      return el.scrollHeight || 0
    },
    // --------------------event----------------------
    // virtual数据更新回调
    handlerUpdate (info) {
      this.virtualInfo = info
    },
    handlerScroll (event) {
      const offset = this.getOffset(event.target)
      const clientSize = this.getClientSize(event.target)
      const scrollSize = this.getScrollSize(event.target)

      if (offset < 0 || (offset + clientSize > scrollSize) || !scrollSize) return
      // 触发virtual滚动事件，更新其内部数据
      this.virtual.handleScroll(offset)
      this.emitEvent(offset, clientSize, scrollSize, event)
    },
    emitEvent (offset, clientSize, scrollSize, evt) {
      this.$emit('on-scroll', evt, this.virtual.getVirtualInfo())

      if (this.virtual.isFront() && !!this.dataSources.length && (offset - this.topThreshold <= 0)) {
        this.$emit('on-totop')
      } else if (this.virtual.isBehind() && (offset + clientSize + this.bottomThreshold >= scrollSize)) {
        this.$emit('on-tobottom')
      }
    },
    childResize (id, offset) {
      this.virtual.saveSize(id, offset.height)
      this.$emit('resized', id, offset.height)
    },
    scrollToOffset (top, left) {
      const el = this.$refs[this.refName]
      if (el) {
        el.scrollTop = top
        el.scrollLeft = left
      }
    },
    setChildNode (h, slot, tag, isTableBody) {
      /**
       * 1. 区间为上下和左右区间，利用props决定是否开启对应方向的虚拟滚动
       * 2. 循环数据区间复用节点，减少dom创建销毁消耗
       * Q: 横向使用什么区控制范围呢。。。key的数量嘛，还是说通过columns的长度呢？？
       * Q: 等于每行是一个虚拟容器咯，还是说 约定好key，动态设置children的孙子节点呢？？
       */
      const childNode = []
      const { dataKey, dataSources } = this
      let { start, end } = this.virtualInfo
      while (start <= end) {
        const dataSource = dataSources[start]
        if (dataSource) {
          if (Object.prototype.hasOwnProperty.call(dataSource, dataKey)) {
            /**
             * 1. 根据外部是否使用slot渲染不同的dom。以便响应事件
             * 2. 兼容横向虚拟滚动
             *    A: 使用嵌套虚拟滚动容器 纵向嵌套横向（用户自使用）
             *    B: 组件外部使用横向，内部使用纵向（内置），分别对slot的父节点子节点进行代理
            */
            if (isTableBody) {
              childNode.push(slot({
                source: dataSource,
                index: start
              }))
            } else {
              childNode.push(
                h(Slot, {
                  props: {
                    index: start,
                    source: dataSource,
                    uniqueKey: dataSource[dataKey],
                    renderTag: tag
                  }
                }, slot({
                  source: dataSource,
                  index: start
                }))
              )
            }
          } else {
            console.warn(`Cannot get the data-key '${dataKey}' from data-sources.`)
          }
        } else {
          console.warn(`Cannot get the index '${start}' from data-sources.`)
        }
        start++
      }
      return childNode
    }
  }
}
