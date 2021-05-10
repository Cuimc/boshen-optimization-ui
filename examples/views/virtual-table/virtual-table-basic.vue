<template>
  <div class="page">
    <span class="title">选择行数</span>
    <Select v-model="tableRows">
      <Option v-for="(render, i) in renderRows" :key="i"
      :value="render.value"
      :label="render.label" />
    </Select>
    <span class="title">选择列数</span>
    <Select v-model="tableCols" disabled>
      <Option v-for="(render, i) in renderCols" :key="i"
      :value="render.value"
      :label="render.label" />
    </Select>
    <p class="line"></p>
    <p class="type-title"> 带有复选框的table</p>
    <virtual-table height="400" :data="tableData" :columns="tableColumn" />
  </div>
</template>

<script>

export default {
  name: 'virtual-table-basic',
  data () {
    return {
      tableRows: 50,
      renderRows: [
        {
          value: 50,
          label: '50行'
        },
        {
          value: 500,
          label: '500行'
        },
        {
          value: 2000,
          label: '2000行'
        },
        {
          value: 5000,
          label: '5000行'
        },
        {
          value: 10000,
          label: '10000行'
        },
        {
          value: 50000,
          label: '50000行'
        }
      ],
      tableCols: 10,
      renderCols: [
        {
          value: 10,
          label: '10列'
        },
        {
          value: 100,
          label: '100列'
        },
        {
          value: 1000,
          label: '1000列'
        },
        {
          value: 10000,
          label: '10000列'
        }
      ],
      tableColumn: [
        {
          type: 'index',
          width: 66,
          align: 'center',
          resizable: true
        },
        {
          type: 'selection',
          width: 66,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '年龄',
          key: 'age'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '电话',
          key: 'phone'
        },
        {
          title: '邮箱',
          key: 'mail'
        },
        {
          title: '喜好',
          key: 'like'
        },
        {
          title: '梦想',
          key: 'dream'
        },
        {
          title: '段位',
          key: 'segment'
        }
      ],
      tableData: [],
      timer: ''
    }
  },
  watch: {
    tableRows (val) {
      this.initwrap(this.tableRows)
    }
  },
  created () {
    this.initwrap(this.tableRows)
  },
  mounted () {
    this.timerCount()
  },
  updated () {
    this.timerCount()
  },
  methods: {
    initwrap (rows, key = 'id') {
      let result = []
      const item = {
        age: '20',
        address: '西安市雁塔区......',
        phone: '13201531000',
        mail: '1716775221@qq.com',
        segment: '黑铁',
        like: '撸串',
        dream: '一名优秀的画师'
      }
      let i = 0
      while (i < rows) {
        i++
        item.name = `张三 - ${i}`
        item[key] = i
        // 浅拷贝啊 我去。。
        result.push({
          ...item
        })
      }
      this.tableData = result
      this.timer = new Date().getTime()
    },
    timerCount () {
      this.$message({
        type: 'info',
        message: `渲染 ${this.tableRows} 行 + ${this.tableCols} 列 = ${new Date().getTime() - this.timer} ms`,
        duration: 5,
        closable: true
      })
    }
  }
}
</script>

<style scoped lang="less">
.page {
  .title {
    margin-right: 10px;
  }
  /deep/.sh-select {
    width: 150px;
    margin-right: 40px;
  }
  .line {
    height: 1px;
    width: 100%;
    background: #f00;
    margin: 10px 0;
  }
  .type-title {
    margin-bottom: 10px;
  }
}
</style>
