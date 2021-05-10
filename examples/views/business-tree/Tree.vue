<template>
  <div class="test-page">
    <h1>Tree 树形控件</h1>
    <p>用清晰的层级结构展示信息，可展开或折叠。</p>
    <h2>基础用法，配合loadData，可实现异步加载节点</h2>
    <div class="test-tree">
      <!-- <business-tree
        draggable
        :loadData="loadData"
        showCheckbox
        :treeData="treeData"
        :search="searchVal"
        @on-drop="dropNode"
        @on-selected-change="clickNode"
        @on-checked-change="clickCheckbox">
          <template #node="node">
            {{node.name}}
          </template>
      </business-tree> -->
      <business-tree
        draggable
        :loadData="loadData"
        showCheckbox
        :treeData="treeData"
        :search="searchVal"
        :render-tree-node="renderTreeNode"
        @on-drop="dropNode"
        @on-selected-change="clickNode"
        @on-checked-change="clickCheckbox" />
    </div>
    <i class="tips">最基本的用法，展示可勾选，可选中，禁用，可拖拽，默认展开等功能。</i>
    <div v-highlightA v-highlightB>
<pre>
  <code>
&lt;template&gt;
  &lt;Tree 
    ref=&quot;tree&quot;
    draggable
    :loadData=&quot;loadData&quot;
    showCheckbox
    :treeData=&quot;treeData&quot;
    :search=&quot;searchVal&quot;
    @on-drop=&quot;dropNode&quot;
    @on-selected-change=&quot;clickNode&quot;
    @on-checked-change=&quot;clickCheckbox&quot; /&gt;
  &lt;/template&gt;
&lt;script&gt;
import { treeData } from &#x27;./treeData&#x27;

export default {
  name: &#x27;TestTree&#x27;,
  data () {
    return {
      treeData: treeData
    }
  },
  methods: {
    loadData (node, resolve) {
      if (node.id === 12) {
        setTimeout(() =&gt; {
          // childKey === children
            node.children.push({
            name: &#x27;我是新加的&#x27;,
            id: &#x27;110000&#x27;,
            _load: true
          })
          resolve(node)
        }, 1500)
      } else {
        resolve()
      }
    },
    clickNode (node) {
      console.log(&#x27;clickNode&#x27;, node)
    },
    clickCheckbox ({ node, selectedData }) {
      console.log(&#x27;clickCheckbox&#x27;, node, selectedData)
    },
    dropNode ({ index, parentNode, targetNode, callback }) {
      console.log(&#x27;dropNode&#x27;, index, parentNode, targetNode, callback)
      callback(index, targetNode)
    }
  }
}
&lt;/script&gt;
  </code>
</pre>
    </div>
    <br>
    <h2>API</h2>
    <br>
    <p>Tree props</p>
    <br>
    <Table :columns="tableColumn" :data="tableData"></Table>
    <br>
    <p>Tree events</p>
    <br>
    <Table :columns="tableColumn1" :data="tableData1"></Table>
  </div>

</template>

<script>
import { treeData } from './treeData'
// import {makeTree} from './treeData'

export default {
  name: 'TestTree',
  data () {
    return {
      tableColumn: [
        {
          title: '属性',
          key: 'attribute'
        },
        {
          title: '说明',
          key: 'explain',
          width: 350
        },
        {
          title: '类型',
          key: 'type'
        },
        {
          title: '默认值',
          key: 'default'
        }
      ],
      tableColumn1: [
        {
          title: '事件名',
          key: 'event'
        },
        {
          title: '说明',
          key: 'type'
        },
        {
          title: '返回值',
          key: 'callback'
        }
      ],
      tableData: [
        {
          attribute: 'treeData',
          explain: '可嵌套的节点属性的数组，生成 tree 的数据',
          type: 'Array',
          default: '[ ]'
        },
        {
          attribute: 'showCheckbox',
          explain: '是否支持选中',
          type: 'Boolean',
          default: 'false'
        },
        {
          attribute: 'searchVal',
          explain: '搜索树结构，搜索结果平级展示',
          type: 'String | Number',
          default: '-'
        },
        {
          attribute: 'loadData',
          explain: '异步加载节点的回调',
          type: 'Function',
          default: '-'
        },
        {
          attribute: 'draggable',
          explain: '是否允许拖拽',
          type: 'Boolean',
          default: 'false'
        }
      ],
      tableData1: [
        {
          event: 'on-select-change',
          type: '节点点击响应事件',
          callback: 'params: [node: 当前节点信息]'
        },
        {
          event: 'dragover.prevent.stop && drop.prevent.stop',
          type: '节点拖拽响应事件',
          callback: 'params: [object: 当前节点信息]'
        },
        {
          event: 'on-checkbox-change',
          type: '节点选中状态事件',
          callback: 'params: [node: 当前节点, array: 所有选中节点]'
        }
      ],
      defaultNode: '',
      searchVal: '',
      treeData: treeData
    }
  },
  methods: {
    loadData (node, resolve) {
      if (node.id === 12) {
        setTimeout(() => {
          // childKey === children
            node.children.push({
            name: '我是新加的',
            id: '110000',
            _load: true
          })
          resolve(node)
        }, 1500)
      } else {
        resolve()
      }
    },
    clickNode (node) {
      console.log('clickNode', node)
    },
    clickCheckbox ({ node, selectedData }) {
      console.log('clickCheckbox', node, selectedData)
    },
    dropNode ({ index, parentNode, targetNode, callback }) {
      console.log('dropNode', index, parentNode, targetNode, callback)
      callback(index, targetNode)
    },
    renderTreeNode (node) {
      // console.log(node)
      return node.name
    }
  }
}
</script>
<style scoped>
  .test-tree {
    width: 300px;
    height: 400px;
    overflow: auto;
  }
</style>
