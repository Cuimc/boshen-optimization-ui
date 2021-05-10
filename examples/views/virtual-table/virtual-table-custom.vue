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
    <p class="type-title"> 自定义渲染内容的table</p>
    <virtual-table height="400" :columns="tableColumn" :data="tableData">
      <template slot-scope="{ row, index }" slot="address">
        <!-- <Select v-model="row.address">
          <Option value="西安" label="西安" />
          <Option value="武汉" label="武汉" />
          <Option value="北京" label="北京" />
        </Select> -->
        {{row.address}}
      </template>
      <template slot-scope="{ row, index }" slot="time">
        <DatePicker v-model="row.time" placeholder="选择日期" />
      </template>
      <template slot-scope="{ row, index }" slot="like">
        <Cascader v-model="row.like" :data="typeArr" placeholader="请选择类型"></Cascader>
      </template>
    </virtual-table>
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
          value: 5000,
          label: '5000行'
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
      typeArr: [
        {
          value: '1',
          label: '蔬菜',
          children: [
            {
              value: '1.1',
              label: '香菜'
            },
            {
              value: '1.2',
              label: '芹菜'
            },
            {
              value: '1.3',
              label: '大葱'
            }
          ]
        },
        {
          value: '2',
          label: '水果',
          children: [
            {
              value: '2.1',
              label: '香蕉'
            },
            {
              value: '2.2',
              label: '苹果'
            },
            {
              value: '2.3',
              label: '荔枝'
            }
          ]
        },
        {
          value: '3',
          label: '动物',
          children: [
            {
              value: '3.1',
              label: '猴子'
            },
            {
              value: '3.2',
              label: '狮子'
            },
            {
              value: '3.3',
              label: '大象'
            }

          ]
        }
      ],
      tableColumn: Object.freeze(
        [
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
            key: 'name',
            width: 150,
            tooltip: true
          },
          {
            title: '年龄',
            key: 'age',
            width: 100
          },
          {
            title: '电话',
            key: 'phone',
            width: 150
          },
          {
            title: '地址',
            key: 'address',
            slot: 'address',
            width: 200
          },
          {
            title: '时间',
            key: 'time',
            slot: 'time',
            width: 350
          },
          {
            title: '喜好',
            key: 'like',
            slot: 'like',
            width: 200
          },
          {
            title: '邮箱',
            key: 'mail',
            width: 200
          },
          {
            title: '段位',
            key: 'segment',
            minWidth: 100
          }
        ]
      ),
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
        address: '西安',
        phone: '13201531000',
        mail: '1716775221@qq.com',
        segment: '黑铁',
        like: ['1', '1.1'],
        time: new Date()
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
  /deep/.sh-cascader {
    .sh-input {
      width: 150px;
    }
  }
}
</style>
