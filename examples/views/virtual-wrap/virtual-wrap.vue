<template>
  <div class="page">
    适用于大数据渲染，支持动态元素高度
    <p class="title">自定义渲染内容</p>
    <virtual-wrap
      style="height: 400px;box-shadow:2px 2px 20px #332E2D;"
      ref-name="virtual"
      :data-sources="lists" data-key="id">
      <template v-slot:model="{source, index}">
        <Button size="small" style="width: 100%" @click="clickItem(source)">{{`# - ${source.id}`}}</Button>
      </template>
    </virtual-wrap>
    <div v-highlightA v-highlightB>
<pre>
  <code class="html">
  &lt;template&gt;
    &lt;virtual-wrap
      style=&quot;height: 400px;box-shadow:2px 2px 20px #332E2D;&quot;
      ref-name=&quot;virtual&quot;
      :data-sources=&quot;lists&quot; data-key=&quot;id&quot;&gt;
      &lt;template v-slot:model=&quot;{source}&quot;&gt;
        &lt;Button size=&quot;small&quot; style=&quot;width: 100%&quot; @click=&quot;clickItem(source)&quot;&gt;{&#x60;# - ${source.id}&#x60;}&lt;/Button&gt;
      &lt;/template&gt;
    &lt;/virtual-wrap&gt;
  &lt;/template&gt;
    export default {
      data () {
        return {
          lists: []
        }
      },
      created () {
        this.initwrap(50000, 10)
      },
      methods: {
        initwrap (rows, col = 10, key = &#x27;id&#x27;) {
          const item = {}
          for (let v = 0; v &lt; 10; v++) {
            item[&#x60;v${v}&#x60;] = &#x60;# ${v}&#x60;
          }
          let i = 0
          while (i &lt; rows) {
            i++
            item.id = i
            // 浅拷贝啊 我去。。
            this.lists.push({
              ...item
            })
          }
        },
        clickItem (source) {
          console.log(&#x27;click-item&#x27;, source)
        }
      }
    }
  &lt;/script&gt;
  </code>
</pre>
    </div>
     <p class="title">Api</p>
    <Table :columns="aipColumn" :data="aipData" />
    <p class="title">Event</p>
    null
    <!-- <Table :columns="eventColumn" :data="eventData" /> -->
  </div>
</template>

<script>
export default {
  name: 'TestVirtualWrap',
  components: {

  },
  data () {
    return {
      lists: [],
      aipColumn: [
        {
          title: '属性',
          key: 'attribute'
        },
        {
          title: '说明',
          key: 'explain'
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
      aipData: [
        {
          attribute: 'dataSources',
          explain: '数据源',
          type: 'Array',
          default: '-'
        },
        {
          attribute: 'refName',
          explain: 'vue refs属性，用于获取组件对象',
          type: 'String',
          default: '-'
        },
        {
          attribute: 'dataKey',
          explain: '渲染数据唯一主键，保证数据唯一性',
          type: '[ Number | String ]',
          default: '-'
        },
        {
          attribute: 'rootTag',
          explain: '虚拟容器根节点，传递特殊标签 以完美适配语义化标签，遵守w3c协议',
          type: 'String',
          default: 'div'
        },
        {
          attribute: 'wrapTag',
          explain: '渲染容器的标签名，如果不传则没有标签包裹，适用于table内嵌',
          type: 'String',
          default: '-'
        },
        {
          attribute: 'v-solt:model="{source}"',
          explain: '当前渲染数据,',
          type: 'Object',
          default: '-'
        },
        {
          attribute: 'v-solt:model="{index}"',
          explain: '当前渲染数据下标,',
          type: 'Number',
          default: '-'
        }
      ]
    }
  },
  created () {
    console.time('render-end')
    this.initwrap(50000, 10)
  },
  mounted () {
    console.timeEnd('render-end')
  },
  methods: {
    initwrap (rows, col = 10, key = 'id') {
      const item = {}
      for (let v = 0; v < 10; v++) {
        item[`v${v}`] = `# ${v}`
      }
      let i = 0
      while (i < rows) {
        i++
        item.id = i
        // 浅拷贝啊 我去。。
        this.lists.push({
          ...item
        })
      }
    },
    clickItem (source) {
      console.log('click-item', source)
    }
  }
}
</script>

<style scoped lang="less">
.page {
  /**
   * 因为common.vue中有相对样式，故使用!important进行覆盖
   */
  min-height: auto !important;
  padding: 0 !important;
  border-radius: 0 !important;
  /deep/.virtual-item {
    height: 40px;
    line-height: 40px;
    background: #666;
    padding: 0 10px;
    border-bottom: 1px solid #f00;
  }
  .title {
    margin-bottom: 10px;
  }
}
</style>
