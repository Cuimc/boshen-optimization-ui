<template>
  <div :class="wrapCls" :style="styles" @mouseleave.stop="handleMouseOut">
    <div class="table-main-wrap">
      <div class="table-main-header"
        ref="header"
        :style="{width: `calc(100% - ${showVerticalScrollBar ? scrollBarWidth : 0}px)`}"
        @mousewheel="handleMouseWheel" >
        <table-header
          @checked-all="selectAll"
          :prefix-cls="prefixCls"
          :style-object="tableStyle"
          :columns-width="columnsWidth"
          :columns="cloneColumns"
          :is-select-all="isSelectAll"
          :column-rows="columnRows" />
      </div>
      <div class="table-main-body" @scroll="handleBodyScroll" :style="bodyStyle" ref="body">
        <table-body
          ref="tbody"
          :prefix-cls="prefixCls"
          :edit-row="editRow"
          :disabled-hover="disabledHover"
          :draggable="draggable"
          :data-key="dataKey"
          :columns-width="columnsWidth"
          :columns="cloneColumns"
          :data="tableData" />
        <table-summary v-if="showSummary" />
      </div>
    </div>
    <div class="table-left-wrap" :style="fixedLeftTableStyle" v-if="isLeftFixed">
      <div class="table-left-heade fixed-header">
        <table-header
          fixed="left"
          @checked-all="selectAll"
          :prefix-cls="prefixCls"
          :style-object="tableStyle"
          :columns-width="columnsWidth"
          :fixed-column-rows="leftFixedColumnRows"
          :columns="leftFixedColumns"
          :is-select-all="isSelectAll"
          :column-rows="columnRows" />
      </div>
      <div class="table-left-body fixed-body"
        ref="fixedLeftBody"
        :style="fixedBodyStyle"
        @mousewheel="handleFixedMousewheel"
        @DOMMouseScroll="handleFixedMousewheel">
        <table-body
          fixed="left"
          :prefix-cls="prefixCls"
          :edit-row="editRow"
          :draggable="draggable"
          :disabled-hover="disabledHover"
          :data-key="dataKey"
          :columns-width="columnsWidth"
          :columns="leftFixedColumns"
          :data="tableData" />
        <table-summary v-if="showSummary" />
      </div>
    </div>
    <div class="table-right-wrap" :style="fixedRightTableStyle" v-if="isRightFixed">
      <div class="table-right-header fixed-header">
        <table-header
          fixed="right"
          @checked-all="selectAll"
          :prefix-cls="prefixCls"
          :style-object="tableStyle"
          :columns-width="columnsWidth"
          :fixed-column-rows="rightFixedColumnRows"
          :columns="rightFixedColumns"
          :is-select-all="isSelectAll"
          :column-rows="columnRows" />
      </div>
      <div class="table-right-body fixed-body"
        ref="fixedRightBody"
        :style="fixedBodyStyle"
        @mousewheel="handleFixedMousewheel"
        @DOMMouseScroll="handleFixedMousewheel">
        <table-body
          fixed="right"
          :prefix-cls="prefixCls"
          :disabled-hover="disabledHover"
          :edit-row="editRow"
          :draggable="draggable"
          :data-key="dataKey"
          :columns-width="columnsWidth"
          :columns="rightFixedColumns"
          :data="tableData" />
        <table-summary v-if="showSummary" />
      </div>
    </div>
    <div
      v-if="data.length < 1"
      :class="[prefixCls + '-tip']"
      :style="bodyStyle"
      @scroll="handleBodyScroll"></div>
    <div class="table-loading" v-show="loading">
      <Loading v-model="loading" size="30"></Loading>
    </div>
    <div class="virtual-table-resize-proxy" ref="resizeProxy" v-show="resizeProxyVisible"></div>
  </div>
</template>

<script>
import TableHeader from './table-head'
import TableBody from './table-body'
import TableSummary from './/table-summary'
import { addResizeListener, removeResizeListener } from '../../../utils/resize-event'
import Csv from '../../../utils/csv'
import size from '../../../mixins/size'
import ExportCsv from './export-csv'
import { getAllColumns, convertToRows, convertColumnOrder } from './utils'
import { getScrollBarWidth, deepCopy, getStyle } from '../../../utils/assist'
let columnKey = 1

export default {
  name: 'VirtualTable',
  mixins: [size],
  components: {
    TableHeader,
    TableBody,
    TableSummary
  },
  provide () {
    return {
      expand: this.expandChange,
      select: this.selectChange,
      setHover: this.handleMouseIn
    }
  },
  props: {
    data: {
      type: Array
    },
    dataKey: {
      type: String,
      default: 'id'
    },
    columns: {
      type: Array
      /**
       * [
       *   {
       *      title: String              // 列名
       *      type: String               // 列类型 [index | selection | expand | html],
       *      className: String,         // class名
       *      fixed: String,             // 是否固定 [left | right]
       *      width: Number,             // 宽度
       *      key: String,               // 列的唯一主键
       *      align: String,             // 对齐方式 [left | center | right]
       *      maxWidth: Number,          // 最大宽度
       *      minWidth: Number,          // 最小宽度
       *      _show: Boolen,             // 隐藏该列
       *      _disable: Boolen,          // 禁止选择复选框
       *      _disabledChecked: Boolen,  // 禁止显示、隐藏列
       *      _disableExpand: Boolen,    // 禁止展开、收起列
       *      _expand: Boolen,           // 展开行
       *      _checked: Boolen           // 选择列
       *   }
       * ]
       */
    },
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    stripe: {
      type: Boolean
    },
    border: {
      type: Boolean,
      default: true
    },
    editRow: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    disabledHover: {
      type: Boolean
    },
    draggable: {
      type: Boolean
    },
    spanMethod: {
      type: Function
    },
    showSummary: {
      type: Boolean
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tableWidth: 0,
      bodyHeight: 0,
      headerWidth: 0,
      headerHeight: 0,
      columnsWidth: {},
      scrollBarWidth: getScrollBarWidth(),
      prefixCls: 'sh-virtual-table',
      columnRows: [],
      leftFixedColumnRows: [],
      rightFixedColumnRows: [],
      cloneColumns: [],
      tableData: [],
      // showLeftShadow: false,
      lastHoverIndex: -1,
      observer: null,
      isSelectAll: false,
      resizeProxyVisible: false,
      showVerticalScrollBar: false,
      showHorizontalScrollBar: false
    }
  },
  computed: {
    wrapCls () {
      return [
        this.prefixCls,
        // this.showLeftShadow ? `${this.prefixCls}-show-left-shadow` : `${this.prefixCls}-show-right-shadow`,
        {
          [`${this.prefixCls}-${this.sizes}`]: !!this.sizes,
          [`${this.prefixCls}-stripe`]: this.stripe,
          [`${this.prefixCls}-border`]: this.border
        }
      ]
    },
    styles () {
      let style = {}
      let summaryHeight = 0
      if (this.showSummary) {
        if (this.sizes === 'small') summaryHeight = 40
        else if (this.sizes === 'large') summaryHeight = 60
        else summaryHeight = 48
      }
      if (this.height) {
        let height = parseInt(this.height) + summaryHeight
        style.height = `${height}px`
      }
      if (this.maxHeight) {
        const maxHeight = parseInt(this.maxHeight) + summaryHeight
        style.maxHeight = `${maxHeight}px`
      }
      if (this.width) style.width = `${this.width}px`
      return style
    },
    tableStyle () {
      let style = {}
      if (this.tableWidth !== 0) {
        let width = '100%'
        if (this.width && this.tableWidth >= parseInt(this.width)) {
          width =
            this.tableWidth -
            (this.showVerticalScrollBar ? this.scrollBarWidth : 0) + 'px'
        }
        style.width = width
      }
      return style
    },
    bodyStyle () {
      let style = {}
      if (this.bodyHeight !== 0) {
        const height = this.bodyHeight
        if (this.height) {
          style.height = `${height}px`
        } else if (this.maxHeight) {
          style.maxHeight = `${height}px`
        }
      }
      return style
    },
    fixedBodyStyle () {
      let style = {}
      if (this.bodyHeight !== 0) {
        let height =
          this.bodyHeight -
          (this.showHorizontalScrollBar ? this.scrollBarWidth : 0)
        style.height = this.showHorizontalScrollBar
          ? `${height}px`
          : `${height - 1}px`
      }
      return style
    },
    leftFixedColumns () {
      return convertColumnOrder(this.cloneColumns, 'left')
    },
    rightFixedColumns () {
      return convertColumnOrder(this.cloneColumns, 'right')
    },
    fixedLeftTableStyle () {
      let style = {}
      let width = 0
      this.leftFixedColumns.forEach(col => {
        if (col.fixed && col.fixed === 'left') width += col._width
      })
      style.width = `${width}px`
      return style
    },
    fixedRightTableStyle () {
      let style = {}
      let width = 0
      this.rightFixedColumns.forEach(col => {
        if (col.fixed && col.fixed === 'right') width += col._width
      })
      // width += this.scrollBarWidth;
      style.width = `${width}px`
      style.right = `${this.showVerticalScrollBar ? this.scrollBarWidth : 0}px`
      return style
    },
    isLeftFixed () {
      return this.columns.some(col => col.fixed && col.fixed === 'left')
    },
    isRightFixed () {
      return this.columns.some(col => col.fixed && col.fixed === 'right')
    }
  },
  watch: {
    columns: {
      deep: true,
      handler: 'handleResize'
    },
    data: {
      deep: true,
      handler () {
        this.makeTableData()
        this.handleResize()
      }
    },
    showHorizontalScrollBar () {
      this.handleResize()
    },
    showVerticalScrollBar () {
      this.handleResize()
    }
  },
  created () {
    this.makeTableData()
  },
  mounted () {
    this.addEvent()
  },
  beforeDestroy () {
    this.removeEvent()
  },
  activated () {
    this.addEvent()
  },
  deactivated () {
    this.removeEvent()
  },
  methods: {
    addEvent () {
      if (!this.observer) {
        this.observer = true
        addResizeListener(this.$el, this.handleResize)
      }
    },
    removeEvent () {
      if (this.observer) {
        this.observer = false
        removeResizeListener(this.$el, this.handleResize)
      }
    },
    exportCsv (params) {
      if (params.filename) {
        if (params.filename.indexOf('.csv') === -1) {
          params.filename += '.csv'
        }
      } else {
        params.filename = 'table.csv'
      }

      let columns = []
      let datas = []
      if (params.columns && params.data) {
        columns = params.columns
        datas = params.data
      } else {
        columns = this.allColumns
        if (!('original' in params)) params.original = true
        datas = params.original ? this.data : this.tableData
      }

      let noHeader = false
      if ('noHeader' in params) noHeader = params.noHeader

      const data = Csv(columns, datas, params, noHeader)
      if (params.callback) params.callback(data)
      else ExportCsv.download(params.filename, data)
    },
    makeColumnRows (fixedType, cols = this.columns) {
      return convertToRows(cols, fixedType)
    },
    makeColumns (cols) {
      let columns = deepCopy(getAllColumns(cols))
      let left = []
      let right = []
      let center = []

      columns.forEach((column, index) => {
        column._index = index
        column._columnKey = columnKey++
        column.width = parseInt(column.width)
        column._width = column.width ? column.width : '' // update in handleResize()
        column._sortType = 'normal'
        column._filterVisible = false
        column._isFiltered = false
        column._filterChecked = []
        column._tooltip = false

        if ('filterMultiple' in column) {
          column._filterMultiple = column.filterMultiple
        } else {
          column._filterMultiple = true
        }
        if ('filteredValue' in column) {
          column._filterChecked = column.filteredValue
          column._isFiltered = true
        }

        if ('sortType' in column) {
          column._sortType = column.sortType
        }

        if (column.fixed && column.fixed === 'left') {
          left.push(column)
        } else if (column.fixed && column.fixed === 'right') {
          right.push(column)
        } else if (column._show !== false) {
          center.push(column)
        }
      })
      return left.concat(center).concat(right)
    },
    handleResize () {
      let tableWidth = this.$el.offsetWidth - 1
      let sumMinWidth = 0
      let hasWidthColumns = []
      let noWidthColumns = []
      let maxWidthColumns = []
      let noMaxWidthColumns = []
      let columnsWidth = {}
      this.columnRows = this.makeColumnRows(false)
      this.leftFixedColumnRows = this.makeColumnRows('left')
      this.rightFixedColumnRows = this.makeColumnRows('right')
      this.cloneColumns = this.makeColumns(this.columns)
      this.cloneColumns.forEach(col => {
        if (col.width) {
          hasWidthColumns.push(col)
        } else {
          noWidthColumns.push(col)
          if (col.minWidth) {
            sumMinWidth += col.minWidth
          }
          if (col.maxWidth) {
            maxWidthColumns.push(col)
          } else {
            noMaxWidthColumns.push(col)
          }
        }
        col._width = null
      })

      let unUsableWidth = hasWidthColumns
        .map(cell => cell.width)
        .reduce((a, b) => a + b, 0)
      let usableWidth =
        tableWidth -
        unUsableWidth -
        sumMinWidth -
        (this.showVerticalScrollBar ? this.scrollBarWidth : 0) -
        1
      let usableLength = noWidthColumns.length
      let columnWidth = 0
      if (usableWidth > 0 && usableLength > 0) {
        columnWidth = parseInt(usableWidth / usableLength)
      }

      for (let i = 0; i < this.cloneColumns.length; i++) {
        const column = this.cloneColumns[i]
        let width = columnWidth + (column.minWidth ? column.minWidth : 0)
        if (column.width) {
          width = column.width
        } else {
          if (column._width) {
            width = column._width
          } else {
            if (column.minWidth > width) {
              width = column.minWidth
            } else if (column.maxWidth < width) {
              width = column.maxWidth
            }

            if (usableWidth > 0) {
              usableWidth -= width - (column.minWidth ? column.minWidth : 0)
              usableLength--
              if (usableLength > 0) {
                columnWidth = parseInt(usableWidth / usableLength)
              } else {
                columnWidth = 0
              }
            } else {
              columnWidth = 0
            }
          }
        }
        column._width = width

        columnsWidth[column._index] = {
          width: width
        }
      }
      if (usableWidth > 0) {
        usableLength = noMaxWidthColumns.length
        columnWidth = parseInt(usableWidth / usableLength)
        for (let i = 0; i < noMaxWidthColumns.length; i++) {
          const column = noMaxWidthColumns[i]
          let width = column._width + columnWidth
          if (usableLength > 1) {
            usableLength--
            usableWidth -= columnWidth
            columnWidth = parseInt(usableWidth / usableLength)
          } else {
            columnWidth = 0
          }

          column._width = width

          columnsWidth[column._index] = {
            width: width
          }
        }
      }
      this.tableWidth =
        this.cloneColumns.map(cell => cell._width).reduce((a, b) => a + b, 0) +
        (this.showVerticalScrollBar ? this.scrollBarWidth : 0)
      this.columnsWidth = columnsWidth
      this.handleFixed()
    },
    handleFixed () {
      if (this.height || this.maxHeight) {
        this.$nextTick(() => {
          const headerHeight =
            parseInt(getStyle(this.$refs.header, 'height')) || 0
          if (this.height) {
            this.bodyHeight = this.height - headerHeight - 1
          } else if (this.maxHeight) {
            this.bodyHeight = this.maxHeight - this.height - headerHeight - 1
          }
          this.$nextTick(() => this.fixedBody())
        })
      } else {
        this.bodyHeight = 0
        this.$nextTick(() => this.fixedBody())
      }
    },
    fixedBody () {
      if (this.$refs.header) {
        this.headerWidth = this.$refs.header.children[0].offsetWidth
        this.headerHeight = this.$refs.header.children[0].offsetHeight
      }

      if (!this.$refs.tbody || !this.data || this.data.length === 0) {
        this.showVerticalScrollBar = false
      } else {
        let bodyContentEl = this.$refs.tbody.$el
        let bodyEl = bodyContentEl.parentElement
        let bodyContentHeight = bodyContentEl.offsetHeight
        let bodyHeight = bodyEl.offsetHeight
        this.showHorizontalScrollBar =
          bodyEl.offsetWidth <
          bodyContentEl.offsetWidth +
            (this.showVerticalScrollBar ? this.scrollBarWidth : 0)
        this.showVerticalScrollBar = this.bodyHeight
          ? bodyHeight -
              (this.showHorizontalScrollBar ? this.scrollBarWidth : 0) <
            bodyContentHeight
          : false
        if (this.showVerticalScrollBar) {
          bodyEl.classList.add(this.prefixCls + '-overflowY')
        } else {
          bodyEl.classList.remove(this.prefixCls + '-overflowY')
        }
        if (this.showHorizontalScrollBar) {
          bodyEl.classList.add(this.prefixCls + '-overflowX')
        } else {
          bodyEl.classList.remove(this.prefixCls + '-overflowX')
        }
      }
    },
    handleMouseWheel (event) {
      const deltaX = event.deltaX
      const $body = this.$refs.body

      if (deltaX > 0) {
        $body.scrollLeft = $body.scrollLeft + 10
      } else {
        $body.scrollLeft = $body.scrollLeft - 10
      }
    },
    handleFixedMousewheel (event) {
      let deltaY = event.deltaY
      if (!deltaY && event.detail) {
        deltaY = event.detail * 40
      }
      if (!deltaY && event.wheelDeltaY) {
        deltaY = -event.wheelDeltaY
      }
      if (!deltaY && event.wheelDelta) {
        deltaY = -event.wheelDelta
      }
      if (!deltaY) return
      const body = this.$refs.body
      const currentScrollTop = body.scrollTop
      if (deltaY < 0 && currentScrollTop !== 0) {
        event.preventDefault()
      }
      if (
        deltaY > 0 &&
        body.scrollHeight - body.clientHeight > currentScrollTop
      ) {
        event.preventDefault()
      }
      // body.scrollTop += deltaY;
      let step = 0
      let timeId = setInterval(() => {
        step += 5
        if (deltaY > 0) {
          body.scrollTop += 2
        } else {
          body.scrollTop -= 2
        }
        if (step >= Math.abs(deltaY)) {
          clearInterval(timeId)
        }
      }, 5)
    },
    handleBodyScroll (event) {
      // this.showLeftShadow = event.target.scrollLeft === 0
      if (this.showHeader) { this.$refs.header.scrollLeft = event.target.scrollLeft }
      if (this.isLeftFixed) { this.$refs.fixedLeftBody.scrollTop = event.target.scrollTop }
      if (this.isRightFixed) { this.$refs.fixedRightBody.scrollTop = event.target.scrollTop }
      if (this.showSummary) { this.$refs.summary.$el.scrollLeft = event.target.scrollLeft }
      this.$emit('on-tbody-scroll', event)
    },
    makeTableData () {
      let _isChecked = true
      /**
       * 我也想深拷贝，但是谁晓得深拷贝之后virtual-wrap性能急剧下降！！！
       * 推理:
       *       a: virtual-wrap内部更新机制有误，导致有脏数据更新
       *       b: 对数据进行遍历之后 引发了未知的vue-bug
       * 结论:
       *       a: 在vue中，对引用数据类型进行深拷贝时，如有组件依赖其值，会造成重复渲染。
       *       b: 在特殊环境下，此行为会引发不必要的隐患，数据量足够大，会有很严重的性能问题。
       */
      let data = []
      this.data.forEach((_row, index) => {
        const row = { ..._row }
        // console.log(row1)
        // const row = {
        //   name: _row.name,
        //   id: _row.id,
        //   age: _row.age,
        //   address: _row.address,
        //   phone: _row.phone,
        //   mail: _row.mail,
        //   segment: _row.segment,
        //   // like: deepCopy(_row.like),
        //   like: _row.like,
        //   time: _row.time
        // }
        row._isHover = false
        if (row._disabled) {
          row._isDisabled = row._disabled
        } else {
          row._isDisabled = false
        }
        if (row._checked) {
          row._isChecked = row._checked
        } else {
          _isChecked = row._isChecked = false
        }
        if (row._expanded) {
          row._isExpanded = row._expanded
        } else {
          row._isExpanded = false
        }
        if (row._highlight) {
          row._isHighlight = row._highlight
        } else {
          row._isHighlight = false
        }
        data.push(row)
      })
      this.tableData = data
      this.isSelectAll = _isChecked
    },
    getSelection () {
      let result = []
      this.tableData.forEach(t => {
        if (t._isChecked) result.push(this.data[t._index])
      })
      return result
    },
    // child-comonents-event
    selectAll (val) {
      this.isSelectAll = val
      this.tableData = this.tableData.map(t => {
        t._isChecked = val
        return t
      })
      if (val) {
        this.$emit('on-select-all', this.getSelection())
      } else {
        this.$emit('on-select-all-cancel', this.getSelection())
      }
      this.$emit('on-selection-change', this.getSelection())
    },
    expandChange (row, index) {
      const status = !row._isExpanded
      this.$set(this.tableData[index], '_isExpanded', status)
      this.$emit('on-expand', deepCopy(row), status)
    },
    selectChange (row, index) {
      const status = !row._isChecked
      this.$set(this.tableData[index], '_isChecked', status)
      const result = this.tableData.filter(t => t._isChecked)
      this.isSelectAll = result.length === this.tableData.length

      this.$emit('on-expand', deepCopy(row), status)
    },
    handleMouseIn (index) {
      this.handleMouseOut()
      this.$set(this.tableData[index], '_isHover', true)
      this.lastHoverIndex = index
    },
    handleMouseOut () {
      if (this.lastHoverIndex > -1) this.$set(this.tableData[this.lastHoverIndex], '_isHover', false)
      this.lastHoverIndex = -1
    }
  }
}
</script>
