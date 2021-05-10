<template>
  <table ref='table'
         cellspacing="0"
         cellpadding="0"
         border="0"
         class="table-expand-inner">
    <colgroup>
      <col v-for="(column, index) in col"
           :key="index"
           :style="{width: setCellWidth(column) + 'px'}" />
    </colgroup>
    <tbody>
      <tr v-for="(r, _index) in row"
          :key="_index">
        <td v-for="(c, i) in col"
            :key="i"
            :style="{textAlign: c.align}">
          <div class="sh-table-cell" v-if="countTdType(c) === 'normal'">
            <template v-if="c.tooltip">
              <Tooltip transfer
                       :content="r[c.key]"
                       :max-width="300"
                       class="sh-table-cell-tooltip">
                <span ref="content"
                      class="sh-table-cell-tooltip-content">{{ r[c.key] }}</span>
              </Tooltip>
            </template>
            <span v-else>{{r[c.key]}}</span>
          </div>
          <template v-if="countTdType(c) === 'expand' && r.children && r.children.length > 0">
            <Icon type="icon-right-bracket"></Icon>
          </template>
          <template v-if="countTdType(c) === 'index'">
            {{index + 1 + (_index + 1) / 10}}
          </template>
          <template v-if="countTdType(c) === 'render'">
            <table-expand :colums="col"
                          :row="row[_index]"
                          :render="c.render"
                          :index="row._index" />
          </template>
          <template v-if="countTdType(c) === 'slot'">
            <table-slot :row="r"
                        :column="c"
                        :index="index" />
          </template>
        </td>
      </tr>
      <!-- <tr v-if="row.length < 1">
        <td :colspan="col.length"
            style="text-align: center;">暂无数据</td>
      </tr> -->
    </tbody>
  </table>
</template>

<script>
import TableSlot from './slot'
export default {
  name: 'ExpandInner',
  components: {
    TableSlot
  },
  props: {
    row: {
      type: Array,
      default: function () {
        return []
      }
    },
    col: {
      type: Array,
      default: function () {
        return []
      }
    },
    index: Number,
    columnsWidth: Object
  },
  data () {
    return {
    }
  },
  watch: {
    row: {
      deep: true,
      handler: function (val) {
        this.cuuntState()
      }
    }
  },
  mounted () {
    this.cuuntState()
  },
  methods: {
    countTdType (td) {
      let result = 'normal'
      if (td.type) {
        result = td.type
      } else if (td.render) {
        result = 'render'
      }
      return result
    },
    setCellWidth (column) {
      let width = ''
      if (column.width) {
        width = column.width
      } else if (this.columnsWidth[column._index]) {
        width = this.columnsWidth[column._index].width
      }
      if (width === '0') width = ''
      return width
    },
    cuuntState (val = this.row) {
      if (val.length < 1) {
        this.$refs.table.parentNode.style.display = 'none'
      }
    }
  }
}
</script>
