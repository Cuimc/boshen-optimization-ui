/* eslint-disable */

import VirtualWrap from '../../virtual-wrap'
import TableSlot from './table-slot'
import Mixin from './mixin'

export default {
  name: 'TableBody',
  mixins: [Mixin],
  inject: ['expand', 'select', 'setHover'],
  components: { VirtualWrap },
  props: {
    data: Array,
    fixed: String,
    disabledHover: Boolean,
    columns: Array,
    dataKey: String,
    prefixCls: String,
    editRow: Boolean,
    draggable: Boolean,
    columnsWidth: Object
  },
  computed: {
    expandRender () {
      let render = function () {
        return ''
      }
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i]
        if (column.type && column.type === 'expand') {
          if (column.render) render = column.render
        }
      }
      return render
    }
  },
  render (h) {
    return (
      <virtual-wrap
        cellspacing="0"
        cellpadding="0"
        border="0"
        data-key={this.dataKey}
        root-tag="table"
        wrap-tag="tbody"
        ref-name="virtual"
        render-tag="tr"
        data-sources={this.data}
        wrapClass="table-tbody"
        is-table-body
        scopedSlots={{
          model: props => {
            return this.renderRow(props)
          }
        }}>
        <colgroup slot="header">
          {
            this.columns.map(column => <col style={{ width: this.setCellWidth(column) }}></col>)
          }
        </colgroup>
      </virtual-wrap>
    )
  },
  methods: {
    renderRow ({ source, index }) {
      let event = !this.disabledHover
      ? {
        'mouseenter': ($event) => this.handleMouseIn($event, index)
      }
      : {}
      let props = {
        on: {
          'click': ($event) => this.clickRow($event, index),
          ...event
        }
      }
      if (this.draggable) {
        props = {
          props: {
            draggable: this.draggable
          },
          on: {
            'click': ($event) => this.clickRow($event, index),
            onDragstart: ($event) => this.dragStart($event, index),
            onDrop: ($event) => this.drop($event, index),
            onDragover: ($event) => this.dragOver($event, index),
            ...event
          }
        }
      }
      const className = [
        index % 2 !== 0 ? `${this.prefixCls}-row-even` : `${this.prefixCls}-row`,
        {
          [`${this.prefixCls}-row-hover`]: source._isHover
        }
      ]
      let node = (
        <tr {...props} class={className}>
          {this.columns.map((col, i) => {
            return (
              <td
                class={this.alignCls(col)}
                props={{ ...this.getSpan(source, col, index, i) }}>
                {this.countCell(source, col, index)}
              </td>
            )
          })}
        </tr>
      )
      let expand = null
      if (source._isExpanded) {
        expand = (
          <tr class={className} {...event}>
            <td colspan={this.columns.length}
              class={[`${this.prefixCls}-expanded-cell`, `${this.prefixCls}-cell`]}>
              <TableSlot
                is-slot={false}
                columns={this.columns}
                columnsWidth={this.columnsWidth}
                row={source}
                render={this.expandRender}
                index={index} />
            </td>
          </tr>
        )
      }
      return [
        node,
        expand
      ]
    },
    dragStart (event, index) {},
    drop (event, index) {},
    dragover (event, index) {},
    clickRow (event, index) {
      if (this.editRow) {
        // 将该行的所有数据变为可编辑状态
      }
      this.$emit('on-click-row', event, index)
    },
    getSpan (row, column, rowIndex, columnIndex) {
      const fn = this.$parent.spanMethod
      if (typeof fn === 'function') {
        const result = fn({ row, column, rowIndex, columnIndex })
        let rowspan = 1
        let colspan = 1
        if (Array.isArray(result)) {
          rowspan = result[0]
          colspan = result[1]
        } else if (typeof result === 'object') {
          rowspan = result.rowspan
          colspan = result.colspan
        }
        return {
          rowspan,
          colspan
        }
      } else {
        return {}
      }
    },
    countCell (row, column, index) {
      let node = ''
      if (column.slot) {
        let render = this.$parent.$scopedSlots[column.slot] || this.$parent.$parent.$scopedSlots[column.slot]
        node = render
          ? <TableSlot render={render} row={row} column={column} index={index} />
          : ''
        return node
      }
      switch (column.type) {
        case 'index':
          node = <span>{ column.indexMethod ? column.indexMethod(row) : (index + 1) }</span>
          break
        case 'selection':
          node = <Checkbox value={row._isChecked} vOn:change_stop_native={() => this.toggleSelect(row, index)} disabled={row._disabled} />
          break
        case 'expand':
          if (!row._disableExpand) {
            node =
            <div class={[
              `${this.prefixCls}-cell-expand`,
              {
                [`${this.prefixCls}-cell-expand-expanded`]: row._isExpanded
              }
            ]}
            vOn:click_stop={() => this.toggleExpand(row, index)}>
              <Icon type="icon-down" />
            </div>
          }
          break
        case 'html':
          node = <span domPropsInnerHTML={row[column.key]}></span>
          break

        default:
          /**
           * type: normal
           * 1. 鼠标移入在显示tooltip,节省资源
           *    a: 鼠标移入 判断是否需要显示tooltip
           *    b: 鼠标移出 移除tooltip
           */
          if (column.tooltip) {
            node =
            !column._isTooltiped
              ? <div class="sh-table-cell-tooltip" >
                <span onMouseenter={() => this.handleTooltip(column, true)} class="sh-table-cell-tooltip-content">{row[column.key]}</span>
              </div>
              : <Tooltip content={row[column.key]} max-width="300" class="sh-table-cell-tooltip">
                <span class="sh-table-cell-tooltip-content" onMouseleave={() => this.handleTooltip(column, false)}>{row[column.key]}</span>
              </Tooltip>
          } else {
            node = <span>{row[column.key]}</span>
          }
          break
      }
      return node
    },
    handleTooltip (column, val) {
      this.$set(column, '_isTooltiped', val)
      // const $content = this.$refs.content
      // this.showTooltip = $content.scrollWidth > $content.offsetWidth
    },
    toggleSelect (row, index) {
      this.select(row, index)
    },
    toggleExpand (row, index) {
      this.expand(row, index)
    },
    handleMouseIn (event, index) {
      this.setHover(index)
    }
  }
}
