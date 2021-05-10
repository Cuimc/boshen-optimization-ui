<template>
  <div class="test-page">
    <h1>SearchHeader 搜索头部</h1>
    <h2>概述</h2>
    <p  class="tips">通过一系列配置 生成标准化搜索条件，内置Input、Cascader、Select、DatePicker、TimePicker、CascaderEasy且可以自定义渲染组件</p>
    <h2>基础用法</h2>
    <search-header :labelWidth="80" :showReset="false" :form-model="formModel1" :fetch="getFormData" />
    <search-header :labelWidth="80" :showReset="false" :form-model="formModel2" :fetch="getFormData" />
    <search-header :labelWidth="80" :showReset="false" :form-model="formModel3" :fetch="getFormData" />
    <search-header :labelWidth="80" :showReset="false" :form-model="formModel" :fetch="getFormData">
      <template #select="{model}">
        <Select v-model="model.props.value" size="small">
          <Option v-for="(city, i) in model.props.data" :key="i" :label="city.label" :value="city.value" />
        </Select>
      </template>
      <!-- <template #searchBtn>
        1111111
      </template> -->
    </search-header>
    <div v-highlightA v-highlightB>
<pre>
  <code class="html">
&lt;template&gt;
  &lt;search-header :showReset=&quot;false&quot; :form-model=&quot;formModel&quot; :fetch=&quot;getFormData&quot;&gt;
    &lt;template #select=&quot;{model}&quot;&gt;
      &lt;Select v-model=&quot;model.props.value&quot; size=&quot;small&quot;&gt;
        &lt;Option v-for=&quot;(city, i) in model.props.data&quot; :key=&quot;i&quot; :label=&quot;city.label&quot; :value=&quot;city.value&quot; /&gt;
      &lt;/Select&gt;
    &lt;/template&gt;
  &lt;/search-header&gt;
&lt;/template&gt;

&lt;script&gt;
import cityData from &#x27;./city.js&#x27;
import selectData from &#x27;./selectData&#x27;

export default {
  name: &#x27;TestSearchHeader&#x27;,
  data () {
    return {
       formModel: [
        {
          label: &#x27;用户名称&#x27;,
          key: &#x27;userName&#x27;,
          type: &#x27;Input&#x27;,
          rules: [],
          props: {
            // domPropsInnerHTML 等于v-html
            value: &#x27;db&#x27;, // 替代原有v-model，用作组件初始化显示值
            size: &#x27;small&#x27;,
            placeholder: &#x27;请输入用户名&#x27;
          },
          on: {
            // &#x27;vOn:click_native&#x27;: event =&gt; {
            //   console.log(&#x27;input-click&#x27;, event)
            // },
            &#x27;on-change&#x27;: event =&gt; {
              console.log(&#x27;input-change&#x27;, event)
            },
            &#x27;on-enter&#x27;: event =&gt; {
              console.log(&#x27;input-enter&#x27;, event)
            }
          }
        },
        {
          label: &#x27;开户时间&#x27;,
          key: &#x27;time&#x27;,
          type: &#x27;TimePicker&#x27;,
          props: {
            value: new Date(),
            size: &#x27;small&#x27;,
            placeholder: &#x27;请选择开户时间&#x27;
          },
          on: {}
        },
        {
          label: &#x27;出生地区&#x27;,
          key: &#x27;adress&#x27;,
          type: &#x27;Cascader&#x27;,
          props: {
            data: cityData,
            value: [&#x27;BeiJing&#x27;, &#x27;BeiJing&#x27;, &#x27;DongCheng&#x27;],
            size: &#x27;small&#x27;
          },
        },
        {
          label: &#x27;选择城市&#x27;,
          key: &#x27;city&#x27;,
          slot: &#x27;select&#x27;,
          props: {
            value: &#x27;xian&#x27;,
            data: selectData
          }
        },
        {
          label: &#x27;开户日期&#x27;,
          key: &#x27;date&#x27;,
          render: (h, model) =&gt; {
            return (
              &lt;DatePicker size=&quot;small&quot; v-model={model.props.value} type=&quot;date&quot; placeholder=&quot;请选择开户日期&quot; /&gt;
            )
          },
          props: {
            value: new Date()
          }
        }
      ]
    }
  },
  methods: {
    getFormData (formModel) {
      console.log(&#x27;fetch&#x27;, formModel)
    }
  }
}
&lt;/script&gt;
  </code>
</pre>
    </div>
    <h1>API</h1>
    <h2>SearchHeader props</h2>
    <Table :columns="propColumn" :data="propData"></Table>
    <br />
    <h2>SearchHeader formModel</h2>
    <Table :columns="modelColumn" :data="modelData"></Table>
    <br />
    <h2>SearchHeader slot</h2>
    <Table :columns="slotColumn" :data="slotData"></Table>
    <!-- <br />
    <h2>SearchHeader events</h2>
    <Table :columns="eventColumn" :data="eventData"></Table> -->
  </div>
</template>

<script>
import cityData from './city.js'
import selectData from './selectData'

export default {
  name: 'TestSearchHeader',
  data () {
    return {
      slotColumn: [
        {
          title: '插槽名称',
          key: 'slotName'
        },
        {
          title: '说明',
          key: 'explain'
        },
        {
          title: '作用域',
          key: 'scope'
        }
      ],
      slotData: [
        {
          slotName: 'searchBtn',
          explain: '查询按钮以及重置按钮',
          scope: '-'
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
          attribute: 'formModel',
          explain: '用于配置该显示什么组件，如何显示',
          type: 'Array',
          default: '-'
        },
        {
          attribute: 'fetch',
          explain: '点击查询按钮的回调函数，默认传递所有formModel-key组成的对象',
          type: 'Function',
          default: '-'
        },
        {
          attribute: 'showReset',
          explain: '是否显示重置按钮',
          type: 'Boolean',
          default: 'true'
        },
        {
          attribute: 'reset',
          explain: '点击重置按钮的回调函数，默认重置数据为初始值，并回调此函数',
          type: 'Function',
          default: '-'
        },
        {
          attribute: 'labelWidth',
          explain: 'label文字宽度',
          type: 'Number',
          default: '-'
        },
        {
          attribute: 'labelPosition',
          explain: 'label文字位置',
          type: 'String | left/right/top',
          default: 'right'
        },
        {
          attribute: 'formRules',
          explain: 'form表单校验规则 详情参考 https://github.com/yiminghe/async-validator',
          type: 'Object',
          default: '-'
        },
        {
          attribute: 'inline',
          explain: '行内模式，超过三个会自动换行隐藏',
          type: 'Boolen',
          default: 'true'
        }
      ],
      modelColumn: [
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
        }
      ],
      modelData: [
        {
          attribute: 'label',
          explain: '查询组件名称',
          type: 'String'
        },
        {
          attribute: 'key',
          explain: '唯一值，最后会通过fetch回调得到所有key组成的对象',
          type: 'String'
        },
        {
          attribute: 'type',
          explain: '渲染的组件名称，优先级高于slot & render',
          type: 'String | Input/Select/Cascader/DatePicker/TimePicker/CascaderEasy'
        },
        {
          attribute: 'props',
          explain: '传递给组件的属性，如Input组件的type、placeholder属性等（value === v-model、domPropsInnerHTML === v-html）',
          type: 'Object'
        },
        {
          attribute: 'on',
          explain: '用于绑定组件的事件，如Input的on-change（不含原生事件）',
          type: 'Object'
        },
        {
          attribute: 'rules',
          explain: 'form-item的校验规则，优先级高于formRules',
          type: 'Object | Array'
        },
        {
          attribute: 'slot',
          explain: '组件插槽名称，用于自定义渲染该组件',
          type: 'String'
        },
        {
          attribute: 'render',
          explain: '自定义渲染组件方法，支持jsx',
          type: 'Function'
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
        // {
        //   attribute: 'close',
        //   explain: '关闭alert时触发的事件',
        //   callBack: '-'
        // }
      ],
      formModel: [
        {
          label: '用户名',
          key: 'userName',
          type: 'Input',
          rules: [],
          props: {
            // domPropsInnerHTML 等于v-html
            value: 'db', // 替代原有v-model，用作组件初始化显示值
            size: 'small',
            placeholder: '请输入用户名'
          },
          on: {
            // 'vOn:click_native': event => {
            //   console.log('input-click', event)
            // },
            'on-change': event => {
              console.log('input-change', event)
            },
            'on-enter': event => {
              console.log('input-enter', event)
            }
          }
        },
        {
          label: '开户时间',
          key: 'time',
          type: 'TimePicker',
          props: {
            value: new Date(),
            size: 'small',
            placeholder: '请选择开户时间'
          },
          on: {}
        },
        {
          label: '地区',
          key: 'adress',
          type: 'Cascader',
          props: {
            data: cityData,
            value: ['BeiJing', 'BeiJing', 'DongCheng'],
            size: 'small'
          },
        },
        {
          label: '选择城市',
          key: 'city',
          slot: 'select',
          props: {
            value: 'xian',
            data: selectData
          }
        },
        {
          label: '日期',
          key: 'date',
          render: (h, model) => {
            return (
              <DatePicker size="small" v-model={model.props.value} type="date" placeholder="请选择开户日期" />
            )
          },
          props: {
            value: new Date()
          }
        }
      ],
      formModel1: [
        {
          label: '用户名',
          key: 'userName',
          type: 'Input',
          rules: [],
          props: {
            // domPropsInnerHTML 等于v-html
            value: 'db', // 替代原有v-model，用作组件初始化显示值
            size: 'small',
            placeholder: '请输入用户名'
          }
        },
        {
          label: '用户名',
          key: 'userName1',
          type: 'Input',
          rules: [],
          props: {
            // domPropsInnerHTML 等于v-html
            value: 'db', // 替代原有v-model，用作组件初始化显示值
            size: 'small',
            placeholder: '请输入用户名'
          }
        },
        {
          label: '用户名',
          key: 'userName2',
          type: 'Input',
          rules: [],
          props: {
            // domPropsInnerHTML 等于v-html
            value: 'db', // 替代原有v-model，用作组件初始化显示值
            size: 'small',
            placeholder: '请输入用户名'
          }
        }
      ],
      formModel2: [
        {
          label: '用户名',
          key: 'userName',
          type: 'Input',
          rules: [],
          props: {
            // domPropsInnerHTML 等于v-html
            value: 'db', // 替代原有v-model，用作组件初始化显示值
            size: 'small',
            placeholder: '请输入用户名'
          },
          on: {
            // 'vOn:click_native': event => {
            //   console.log('input-click', event)
            // },
            'on-change': event => {
              console.log('input-change', event)
            },
            'on-enter': event => {
              console.log('input-enter', event)
            }
          }
        },
        {
          label: '开户时间',
          key: 'time',
          type: 'TimePicker',
          props: {
            value: new Date(),
            size: 'small',
            placeholder: '请选择开户时间'
          },
          on: {}
        }
      ],
      formModel3: [
        {
          label: '用户名',
          key: 'userName',
          type: 'Input',
          rules: [],
          props: {
            // domPropsInnerHTML 等于v-html
            value: 'db', // 替代原有v-model，用作组件初始化显示值
            size: 'small',
            placeholder: '请输入用户名'
          },
          on: {
            // 'vOn:click_native': event => {
            //   console.log('input-click', event)
            // },
            'on-change': event => {
              console.log('input-change', event)
            },
            'on-enter': event => {
              console.log('input-enter', event)
            }
          }
        },
        {
          label: '开户时间',
          key: 'time',
          type: 'TimePicker',
          props: {
            value: new Date(),
            size: 'small',
            placeholder: '请选择开户时间'
          },
          on: {}
        },
        {
          label: '地区',
          key: 'adress',
          type: 'Cascader',
          props: {
            data: cityData,
            value: ['BeiJing', 'BeiJing', 'DongCheng'],
            size: 'small'
          },
        }
      ]
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
    getFormData (formModel) {
      console.log('fetch', formModel)
    }
  }
}
</script>

<style lang="less">
.sh-input-wrapper {
  input {
    width: 260px;
  }
}
</style>
