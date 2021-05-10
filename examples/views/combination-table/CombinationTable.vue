<template>
  <div class="test-page">
    <h1>CombinationTable 表格栏</h1>
    <p class="tips">主要用于用户可以自定义配置table的相关属性，比如列宽调整，某一列显示与否，并且继承了table-按钮栏</p>
    <h2>基础用法</h2>
    
    <combination-table
      :data-source="tableData"
      :columns="tableColumns"
      :fetch-config="fetch"
      :save-config="save"
      :btn-model="{}" >
      <template slot-scope="{ row }" slot="address">
        <Select size="middle" transfer v-model="row.address">
          <Option value="西安" label="西安" />
          <Option value="武汉" label="武汉" />
          <Option value="北京" label="北京" />
        </Select>
      </template>
      <template slot-scope="{ row }" slot="time">
        <DatePicker size="middle"  transfer v-model="row.time" placeholder="选择日期" />
      </template>
      <template slot-scope="{ row }" slot="type">
        <Cascader size="middle" transfer v-model="row.type" :data="typeArr" placeholader="请选择类型"></Cascader>
      </template>
    </combination-table>
    <div v-highlightA v-highlightB>
<pre>
  <code class="html">
  &lt;template&gt;
    &lt;combination-table
      :data-source=&quot;tableData&quot;
      :columns=&quot;tableColumns&quot;
      :fetch-config=&quot;fetch&quot;
      :save-config=&quot;save&quot;
      :btn-model=&quot;{}&quot; &gt;
      &lt;template slot-scope=&quot;{ row }&quot; slot=&quot;address&quot;&gt;
        &lt;Select size="middle" transfer v-model=&quot;row.address&quot;&gt;
          &lt;Option value=&quot;西安&quot; label=&quot;西安&quot; /&gt;
          &lt;Option value=&quot;武汉&quot; label=&quot;武汉&quot; /&gt;
          &lt;Option value=&quot;北京&quot; label=&quot;北京&quot; /&gt;
        &lt;/Select&gt;
      &lt;/template&gt;
      &lt;template slot-scope=&quot;{ row }&quot; slot=&quot;time&quot;&gt;
        &lt;DatePicker size="middle"  transfer v-model=&quot;row.time&quot; placeholder=&quot;选择日期&quot; /&gt;
      &lt;/template&gt;
      &lt;template slot-scope=&quot;{ row }&quot; slot=&quot;type&quot;&gt;
        &lt;Cascader size="middle" transfer v-model=&quot;row.type&quot; :data=&quot;typeArr&quot; placeholader=&quot;请选择类型&quot;&gt;&lt;/Cascader&gt;
      &lt;/template&gt;
    &lt;/combination-table&gt;
  &lt;/template&gt;

  &lt;script&gt;
  export default {
    name: &#x27;TestcombinationTable&#x27;,
    data () {
      return {
        typeArr: [
          {
            value: &#x27;1&#x27;,
            label: &#x27;蔬菜&#x27;,
            children: [
              {
                value: &#x27;1.1&#x27;,
                label: &#x27;香菜&#x27;
              },
              {
                value: &#x27;1.2&#x27;,
                label: &#x27;芹菜&#x27;
              },
              {
                value: &#x27;1.3&#x27;,
                label: &#x27;大葱&#x27;
              }
            ]
          },
          {
            value: &#x27;2&#x27;,
            label: &#x27;水果&#x27;,
            children: [
              {
                value: &#x27;2.1&#x27;,
                label: &#x27;香蕉&#x27;
              },
              {
                value: &#x27;2.2&#x27;,
                label: &#x27;苹果&#x27;
              },
              {
                value: &#x27;2.3&#x27;,
                label: &#x27;荔枝&#x27;
              }
            ]
          },
          {
            value: &#x27;3&#x27;,
            label: &#x27;动物&#x27;,
            children: [
              {
                value: &#x27;3.1&#x27;,
                label: &#x27;猴子&#x27;
              },
              {
                value: &#x27;3.2&#x27;,
                label: &#x27;狮子&#x27;
              },
              {
                value: &#x27;3.3&#x27;,
                label: &#x27;大象&#x27;
              }

            ]
          }
        ],
        tableData: [
          {
            address: &#x27;西安&#x27;,
            time: &#x27;2019-9-10&#x27;,
            name: &#x27;张三&#x27;,
            age: 18,
            like: &#x27;打篮球&#x27;,
            id: &#x27;1&#x27;
          },
          {
            address: &#x27;北京&#x27;,
            time: &#x27;2019-9-11&#x27;,
            name: &#x27;张三&#x27;,
            age: 19,
            like: &#x27;打篮球&#x27;,
            id: &#x27;2&#x27;
          },
          {
            address: &#x27;武汉&#x27;,
            time: &#x27;2019-9-12&#x27;,
            name: &#x27;张三&#x27;,
            age: 20,
            like: &#x27;打篮球&#x27;,
            id: &#x27;3&#x27;
          }
        ],
        tableColumns: [
          {
            type: &#x27;index&#x27;,
            width: 66,
            align: &#x27;center&#x27;,
            _disabledChecked: true
          },
          {
            type: &#x27;selection&#x27;,
            width: 66,
            align: &#x27;center&#x27;,
            _disabledChecked: true
          },
          {
            title: &#x27;地址&#x27;,
            key: &#x27;address&#x27;,
            slot: &#x27;address&#x27;
          },
          {
            title: &#x27;时间&#x27;,
            key: &#x27;time&#x27;,
            slot: &#x27;time&#x27;
          },
          {
            title: &#x27;类别&#x27;,
            key: &#x27;type&#x27;,
            slot: &#x27;type&#x27;
          }
        ]
      }
    }
    methods: {
      fetch (columns) {
        /**
        * 1. column为当前传入的coumns
        * 2. 需要将获取的最新配置传递给table
        */
        return new Promise((resolve, reject) =&gt; {
          // this.tableColumns = columns
          resolve(columns)
        })
      },
      save (columns) {
        /**
        * 1. columns为更新的columns
        * 2. 需要在此将最新的columns传递给table
        */
        return new Promise((resolve, reject) =&gt; {
          this.tableColumns = columns
          resolve(columns)
        })
      }
    }
  }
  &lt;/script&gt;

  </code>
</pre>
    </div>
    <h5>固定列</h5>
    <combination-table
      ref="fixed"
      width="1000"
      :data-source="tableData"
      :columns="tableColumns2"
      :fetch-config="fetch2"
      :save-config="save2" >
      <template slot-scope="{ row }" slot="address">
        <Select size="middle" transfer v-model="row.address">
          <Option value="西安" label="西安" />
          <Option value="武汉" label="武汉" />
          <Option value="北京" label="北京" />
        </Select>
      </template>
      <template slot-scope="{ row }" slot="time">
        <DatePicker size="middle"  transfer v-model="row.time" placeholder="选择日期" />
      </template>
    </combination-table>
    <h5>兼容响应式</h5>
    <p class="tips">
      最少一列设置minWidth或者maxWidth,其余列设置固定宽度即可进行伸缩该列,且含有固定列，进而会动态出现横向滚动条。
    </p>
    <combination-table
      ref="fixed"
      :data-source="tableData"
      :columns="tableColumns3"
      :fetch-config="fetch3"
      :save-config="save3" >
        <template slot="importBtu">
          <Upload :actions=url >
            <div>
              <Icon style="height: 30px; line-height: 30px;padding-left: 4px"
              slot="importBtu"
              font-family="business_ui"
              type="iconimport">
                <slot name="importBtu" />
              </Icon>
            </div>
          </Upload>
        </template>
    </combination-table>

    <h5>复杂的使用操作栏</h5>
    <p class="tips">
      当前操作区域
    </p>
    <combination-table
      ref="fixed"
      :data-source="tableData"
      :columns="tableColumns3"
      :fetch-config="fetch3"
      :save-config="save3"
      :btnModel="btuns" >
        <!-- slot 目前只支持importBtu、outputBtu、refershBtu、externalBtu、settingBtu -->
        <template slot="importBtu">
          <Upload :actions=url >
            <div style="margin-right: 20px;">
              <Icon style="height: 30px; line-height: 30px;padding-left: 4px"
              slot="importBtu"
              font-family="business_ui"
              type="iconimport">
                <slot name="importBtu" />
              </Icon>
            </div>
          </Upload>
        </template>
    </combination-table>
    <div v-highlightA v-highlightB>
    <pre>
      <code class="html">
    &lt;combination-table
      ref=&quot;fixed&quot;
      :data-source=&quot;tableData&quot;
      :columns=&quot;tableColumns3&quot;
      :fetch-config=&quot;fetch3&quot;
      :save-config=&quot;save3&quot;
      :btnModel=&quot;btuns&quot; &gt;
        &lt;!-- fetch-config 和save-config方法 必须实现 --&gt;
        &lt;!-- slot 目前只支持importBtu、outputBtu、refershBtu、externalBtu、settingBtu --&gt;
        &lt;template slot=&quot;importBtu&quot;&gt;
          &lt;Upload :actions=url &gt;
            &lt;div style=&quot;margin-right: 20px;&quot;&gt;
              &lt;Icon style=&quot;height: 30px; line-height: 30px;padding-left: 4px&quot;
              slot=&quot;importBtu&quot;
              font-family=&quot;business_ui&quot;
              type=&quot;iconimport&quot;&gt;
                &lt;slot name=&quot;importBtu&quot; /&gt;
              &lt;/Icon&gt;
            &lt;/div&gt;
          &lt;/Upload&gt;
        &lt;/template&gt;
    &lt;/combination-table&gt;

      </code>
    </pre>
    </div>
    <h1>API</h1>
    <h2>CombinationTable props</h2>
    <Table :columns="propColumn" :data="propData">
    </Table>
    <h2>SearchHeader colums</h2>
    <Table :columns="columns" :data="datas"></Table>
    <h2>SearchHeader events</h2>
    <Table :columns="eventColumn" :data="eventData"></Table>
    <h2>兼容操作按钮栏的slot方法</h2>
    <Table :columns="slotColumn" :data="slotData"></Table>
  </div>
</template>

<script>
export default {
  name: 'TestcombinationTable',
  components: {

  },
  data () {
    return {
      url: 'http://testinnergateway.shuhaisc.com/business/base/attachment/fastdfs/upload',
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
      tableData: [
        {
          address: '西安',
          time: '2019-9-10',
          name: '张三',
          age: 18,
          like: '打篮球',
          id: '1'
        },
        {
          address: '北京',
          time: '2019-9-11',
          name: '张三',
          age: 19,
          like: '打篮球',
          id: '2'
        },
        {
          address: '武汉',
          time: '2019-9-12',
          name: '张三',
          age: 20,
          like: '打篮球',
          id: '3'
        }
      ],
      tableColumns: [
        {
          type: 'index',
          width: 66,
          align: 'center',
          _disabledChecked: true
        },
        {
          type: 'selection',
          width: 66,
          align: 'center',
          _disabledChecked: true
        },
        {
          title: '地址',
          key: 'address',
          slot: 'address'
        },
        {
          title: '时间',
          key: 'time',
          slot: 'time'
        },
        {
          title: '类别',
          key: 'type',
          slot: 'type'
        }
      ],
      tableColumns2: [
        {
          type: 'index',
          width: 66,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '姓名',
          key: 'name',
          width: 200
        },
        {
          title: '年龄',
          key: 'age',
          width: 200,
          sortable: true
        },
        {
          title: '爱好',
          key: 'like',
          width: 200,
          fixed: 'right'
        },
        {
          title: '地址',
          key: 'address',
          slot: 'address',
          width: 350
        },
        {
          title: '时间',
          key: 'time',
          slot: 'time',
          width: 350
        }
      ],
      tableColumns3: [
        {
          type: 'index',
          align: 'center',
          width: 68,
          title: '序号'
        },
        {
          title: '工作流',
          ellipsis: true,
          tooltip: true,
          width: 150,
          key: 'workflowName'
        },
        {
          title: '创建人',
          ellipsis: true,
          tooltip: true,
          width: 150,
          key: 'creatorName'
        },
        {
          title: '创建时间',
          ellipsis: true,
          tooltip: true,
          width: 200,
          key: 'createTime'
        },
        {
          title: '工单类型',
          ellipsis: true,
          tooltip: true,
          minWidth: 140,
          key: 'woTypeName'
        },
        {
          title: '操作',
          ellipsis: true,
          key: 'action',
          width: 200,
          fixed: 'right',
          render: (h, params) => {
            return (
              <div>
                <a
                  style={{
                    color: '#3377FF',
                    cursor: 'pointer',
                    marginRight: '40px'
                  }}
                  onClick={() => this.addOrderModelBtn(params.row)}
                >
                  编辑
                </a>
                <a
                  style={{ color: '#F05656', cursor: 'pointer' }}
                  onClick={() => this.deleteOrderTypeBtn(params.row)}
                >
                  删除
                </a>
              </div>
            )
          }
        }
      ],
      propColumn: [
        {
          title: '属性',
          key: 'attribute'
        },
        {
          title: '说明',
          key: 'explain',
          tooltip: true
        },
        {
          title: '类型',
          key: 'type',
          tooltip: true
        },
        {
          title: '默认值',
          key: 'default'
        }
      ],
      propData: [
        {
          attribute: 'dataSource',
          explain: 'table所需数据源 同原有Table的data属性',
          type: 'Array',
          default: '-'
        },
        {
          attribute: 'fetchConfig',
          explain: '查询用户自定义table的api，不传递则默认不使用此功能，该table表现则与原有table组件完全相同，入参事件均同步',
          type: 'Function',
          default: '-'
        },
        {
          attribute: 'saveConfig',
          explain: '查询用户自定义table的api',
          type: 'Function',
          default: '-'
        },
        {
          attribute: 'btnModel',
          explain: 'table头部按钮组的配置参数,传递“{}”则不显示按钮组，详情参考OperationBtus组件',
          type: 'Object',
          default: '-'
        },
        {
          attribute: '-',
          explain: '其他属性均与原有table相同包括事件响应',
          type: '-',
          default: '-'
        }
      ],
      eventColumn: [
        {
          title: '事件名称',
          key: 'attribute'
        },
        {
          title: '说明',
          key: 'explain'
        },
        {
          title: '回调参数',
          key: 'callBack'
        }
      ],
      eventData: [
        {
          attribute: 'click-btn',
          explain: '点击头部按钮事件',
          callBack: 'btn，点击对应的按钮配置参数对象'
        }
      ],
      slotColumn: [
        {
          title: 'slot名称',
          key: 'attribute'
        },
        {
          title: '说明',
          key: 'explain'
        }
      ],
      slotData: [
        {
          attribute: 'importBtu',
          explain: '导入按钮的重定义',
          callBack: ''
        },{
          attribute: 'outputBtu',
          explain: '导出按钮的重定义',
          callBack: ''
        },{
          attribute: 'refershBtu',
          explain: '刷新按钮的重定义',
          callBack: ''
        },{
          attribute: 'externalBtu',
          explain: '预留按钮的重定义',
          callBack: ''
        },{
          attribute: 'settingBtu',
          explain: '表格设置按钮的重定义',
          callBack: ''
        }
      ],
      columns: [
        {
          title: '属性',
          key: 'attribute'
        },
        {
          title: '说明',
          key: 'explain',
          tooltip: true
        },
        {
          title: '类型',
          key: 'type',
          tooltip: true
        },
        {
          title: '默认值',
          key: 'default'
        }
      ],
      datas: [
        {
          attribute: '_disabledChecked',
          explain: '该列是否禁止取消选中',
          type: 'Boolen',
          default: 'false'
        },
        {
          attribute: '_disabledFixed',
          explain: '该列是否禁止取消、设置固定列',
          type: 'Boolen',
          default: 'false'
        },
        {
          attribute: '_disabledLevel',
          explain: '该列是否禁止移动层级',
          type: 'Boolen',
          default: 'false'
        },
        {
          attribute: '_show',
          explain: '该列是否显示',
          type: 'Boolen',
          default: 'true'
        },
        {
          attribute: '...',
          explain: '其他选项与Table一致',
          type: '...',
          default: '...'
        }
      ],
      btuns: {
        insertBtu: {
          btuName: '新建', // 按钮名称
          postion: 'left', // 位置区域
          icon: '',
          fontFamily: '',
          // hide: false,
          type: 'primary', // 按钮等级
          disabled: false
          // style: { 'color': '#cccc' }
        },
        recordBtu: {
          btuName: '保存', // 按钮名称
          postion: 'left', // 位置区域
          icon: '',
          fontFamily: '',
          type: 'normal', // 按钮等级
          disabled: false
        },
        delBtu: {
          btuName: '删除', // 按钮名称
          postion: 'left', // 位置区域
          icon: '',
          fontFamily: '',
          type: 'normal', // 按钮等级
          disabled: false
        },
        importBtu: {
          slot: true,
          btuName: '导入', // 按钮名称
          postion: 'right', // 位置区域
          icon: 'iconimport',
          fontFamily: 'business_ui',
          type: 'icon', // 按钮等级
          disabled: false
        },
        outputBtu: {
          btuName: '导出', // 按钮名称
          postion: 'right', // 位置区域
          icon: 'iconexport',
          fontFamily: 'business_ui',
          type: 'icon', // 按钮等级
          disabled: false
        },
        refershBtu: {
          btuName: '刷新', // 按钮名称
          postion: 'right', // 位置区域
          icon: 'iconrefresh_',
          fontFamily: 'business_ui',
          type: 'icon', // 按钮等级
          disabled: false
        },
        settingBtu: {
          slot: true,
          btuName: '表格设置', // 按钮名称
          postion: 'right', // 位置区域
          icon: 'iconconfiguration-form',
          fontFamily: 'business_ui',
          type: 'icon', // 按钮等级
          disabled: false
        },
        businessBtus: {
          businessName: '模板管理',
          businsessList: [{
            btuName: '实习通过', // 按钮名称
            icon: '',
            fontFamily: '',
            type: 'regular', // 正常
            disabled: false
          }, {
            btuName: '转账', // 按钮名称
            icon: '',
            fontFamily: '',
            type: 'regular', // 正常
            disabled: false
          }, {
            btuName: '模板下载', // 按钮名称
            icon: '',
            fontFamily: '',
            type: 'regular', // 正常
            disabled: false
          }, {
            btuName: '模板导出', // 按钮名称
            icon: '',
            fontFamily: '',
            type: 'regular', // 正常
            disabled: false
          }]
        }// 业务按钮，超过3个放在折叠行内
      }
    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  methods: {
    fetch (columns) {
      /**
       * 1. column为当前传入的coumns
       * 2. 需要将获取的最新配置传递给table
       */
      return new Promise((resolve, reject) => {
        // this.tableColumns = columns
        resolve(columns)
      })
    },
    save (columns) {
      /**
       * 1. columns为更新的columns
       * 2. 需要在此将最新的columns传递给table
       */
      return new Promise((resolve, reject) => {
        this.tableColumns = columns
        resolve(columns)
      })
    },
    fetch2 (columns) {
      return new Promise((resolve, reject) => {
        // this.tableColumns2 = columns
        resolve(columns)
      })
    },
    save2 (columns) {
      return new Promise((resolve, reject) => {
        this.tableColumns2 = columns
        resolve(columns)
      })
    },
    fetch3 (columns) {
      return new Promise((resolve, reject) => {
        // this.tableColumns3 = columns
        resolve(columns)
      })
    },
    save3 (columns) {
      return new Promise((resolve, reject) => {
        this.tableColumns3 = columns
        resolve(columns)
      })
    }
  }
}
</script>
