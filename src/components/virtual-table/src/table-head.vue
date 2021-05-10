<template>
  <table cellspacing="0" cellpadding="0" border="0" :style="styles">
    <colgroup>
      <col v-for="(column, index) in columns" :style="{width: setCellWidth(column)}" />
    </colgroup>
    <thead>
      <tr v-for="cols in headRows">
        <th
          v-for="(column, index) in cols"
          :colspan="column.colSpan"
          :rowspan="column.rowSpan"
          :class="alignCls(column)" >
          <template v-if="column.type === 'expand'">
            <span v-if="!column.renderHeader">{{ column.title || '' }}</span>
            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
          </template>
          <template v-else-if="column.type === 'selection'">
            <Checkbox :value="isSelectAll" :disabled="isSelectDisabled" @on-change="selectAll"></Checkbox>
          </template>
          <template v-else>
            <span
              v-if="!column.renderHeader"
              :class="{[prefixCls + '-cell-sort']: column.sortable}"
              @click="handleSortByHead(getColumn(rowIndex, index)._index)"
            >{{ column.title || '#' }}</span>
            <render-header v-else :render="column.renderHeader" :column="column" :index="index"></render-header>
            <span :class="[prefixCls + '-sort']" v-if="column.sortable">
              <Icon
                class="sh-icon"
                type="icon-up"
                :class="{on: getColumn(rowIndex, index)._sortType === 'asc'}"
                @click="handleSort(getColumn(rowIndex, index)._index, 'asc')"
              />
              <Icon
                class="sh-icon"
                type="icon-down"
                :class="{on: getColumn(rowIndex, index)._sortType === 'desc'}"
                @click="handleSort(getColumn(rowIndex, index)._index, 'desc')"
              />
            </span>
            <Poptip
              v-if="isPopperShow(column)"
              v-model="getColumn(rowIndex, index)._filterVisible"
              placement="bottom"
              popper-class="sh-table-popper"
              transfer
              :capture="false"
              @on-popper-hide="handleFilterHide(getColumn(rowIndex, index)._index)"
            >
              <span :class="[prefixCls + '-filter']">
                <Icon
                  type="icon-filter"
                  class="sh-icon"
                  :class="{on: getColumn(rowIndex, index)._isFiltered}"
                />
              </span>

              <div
                slot="content"
                :class="[prefixCls + '-filter-list']"
                v-if="getColumn(rowIndex, index)._filterMultiple"
              >
                <div :class="[prefixCls + '-filter-list-item']">
                  <checkbox-group v-model="getColumn(rowIndex, index)._filterChecked">
                    <checkbox
                      v-for="(item, index) in column.filters"
                      :key="index"
                      :label="item.value"
                    >{{ item.label }}</checkbox>
                  </checkbox-group>
                </div>
                <div :class="[prefixCls + '-filter-footer']">
                  <Button
                    type="text"
                    size="small"
                    :disabled="!getColumn(rowIndex, index)._filterChecked.length"
                    @click="handleFilter(getColumn(rowIndex, index)._index)"
                  >{{ t('b.table.confirmFilter') }}</Button>
                  <Button
                    type="text"
                    size="small"
                    @click="handleReset(getColumn(rowIndex, index)._index)"
                  >{{ t('b.table.resetFilter') }}</Button>
                </div>
              </div>
              <div slot="content" :class="[prefixCls + '-filter-list']" v-else>
                <ul :class="[prefixCls + '-filter-list-single']">
                  <li
                    :class="itemAllClasses(getColumn(rowIndex, index))"
                    @click="handleReset(getColumn(rowIndex, index)._index)"
                  >{{ t('b.table.clearFilter') }}</li>
                  <li
                    :class="itemClasses(getColumn(rowIndex, index), item)"
                    v-for="item in column.filters"
                    @click="handleSelect(getColumn(rowIndex, index)._index, item.value)"
                  >{{ item.label }}</li>
                </ul>
              </div>
            </Poptip>
          </template>
        </th>
      </tr>
    </thead>
  </table>
</template>
<script>

import Mixin from './mixin'
import renderHeader from './table-slot'
import Locale from '../../../mixins/locale'

export default {
  name: 'TableHead',
  mixins: [Mixin, Locale],
  components: { renderHeader },
  props: {
    columns: Array,
    fixed: String,
    isSelectAll: Boolean,
    prefixCls: String,
    columnRows: Array,
    styleObject: Object,
    columnsWidth: Object,
    fixedColumnRows: Array

  },
  data () {
    return {
      isSelectDisabled: false
    }
  },
  computed: {
    styles () {
      const style = Object.assign({}, this.styleObject)
      style.width = this.styleObject.width
      return style
    },
    headRows () {
      const isGroup = this.columnRows.length > 1
      if (isGroup) {
        return this.fixed ? this.fixedColumnRows : this.columnRows
      } else {
        return [this.columns]
      }
    }
  },
  created () {
  },
  methods: {
    selectAll (val) {
      this.$emit('checked-all', val)
    }
  }
}
</script>
