/**
 * 一、 Tree.vue
 *     1. 处理搜索
 *     2. 计算组件state（checked、expand每个子组件仅计算自己的状态，减少初始化计算量）
 *     3. 绑定事件event（）
 *     4. 用于处理复杂的计算逻辑
 * 二、 Node.vue
 *     1. 展示组件
 *     2. 选中、展开、激活、禁用
 *     3. slot && renderTreeNode
 *     4. 拖拽，重置、手风琴
 */

import { deepCopy } from '../../../utils/assist'
import Node from './Node.vue'
// import Node from './node'

// const treeData = [
//   {
//     id: 1,
//     name: '1',
//     checked: true, //是否选中
//     disabled: true, // 是否禁用
//     _expand: '', // 是否展开
//     _active: '', // 是否是激活状态，所有节点唯一
//     _load: false, // 是否正在远程加载
//     children: [
//       {
//         id: 2,
//         name: '1-1',
//         disabled: true,
//         expand: ''
//       }
//     ]
//   }
// ]

export default {
  name: 'BusinessTree',
  components: {
    Node
  },
  provide () {
    return {
      hasChild: this.hasChild,
      updateChecked: this.updateChecked
    }
  },
  props: {
    icon: {
      type: String,
      default: 'md-arrow-dropright' // 下拉箭头的Icon
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    nodeKey: {
      type: String,
      default: 'id' // node的唯一主键
    },
    childKey: {
      type: String,
      default: 'children' // 遍历子节点的key
    },
    optimization: { // 是否使用优化树，也就是所有节点懒加载
      type: Boolean,
      default: false
    },
    draggable: Boolean, // 是否开启拖拽
    loadData: Function, // 是否使用远程加载
    filterable: Boolean, // 是否开启搜索
    showCheckbox: Boolean, // 是否展示复选框
    renderTreeNode: Function // 自定义渲染ndoe节点
  },
  data () {
    return {
      searchVal: '',
      nodeData: [],
      commonData: { // 所有后代子组件共享的数据
        activeNode: {}, // 当前激活节点
        checkedNode: [] // 选中节点
      }
    }
  },
  computed: {
  },
  watch: {
    // 'treeData.length': {
    treeData: {
      deep: true,
      immediate: true,
      handler (arr) {
        /**
         * 先不考虑异常情况，直接赋值
         * 1. search
         * 2. loadData
         * 3. 为避免重复监听，深拷贝一次（函数等对象不能序列化）
         */
        this.initData(deepCopy(this.treeData))
      }
    }
  },
  render () {
    const { nodeData, renderTreeNode, filterable, showCheckbox, commonData, icon, childKey, nodeKey, optimization, loadData } = this
    const render = this.$scopedSlots.node
    return (
      <ul class="sh-tree">
        {
          /* 搜索框 */
          filterable && <Input v-model={this.searchVal} on-on-change={this.searchChange} />
        }
        {
          !nodeData.length < 1
            ? nodeData.map((node, i) => {
              return <Node
                class="first-item"
                icon={icon}
                node={node}
                index={i}
                loadData={loadData}
                node-key={nodeKey}
                child-key={childKey}
                common-data={commonData}
                optimization={optimization}
                show-checkbox={showCheckbox}
                on-on-expand={this.expandChange}
                on-on-checked={this.checkedChange}
                on-on-click-item={this.activeChange}
                render-tree-node={renderTreeNode || render} />
            })
            : <div class="no-data-wrap">
              数据为空
            </div>
        }
      </ul>
    )
  },
  methods: {
    hasChild (node) {
      return node[this.childKey] && node[this.childKey].length !== 0
    },
    updateChecked (val, node) {
      // 应该返回原数组数据
      !val
        ? this.commonData.checkedNode = this.commonData.checkedNode.filter(cNode => cNode[this.nodeKey] !== node[this.nodeKey])
        : this.commonData.checkedNode.push(node)
    },
    // 搜索节点
    searchChange (event) {
      console.log('searchChange', event.target.value)
      /**
       * 选中节点的问题
       * 1. 重置
       * 2. 保留
       */
    },
    expandChange (node) {
      /**
       * loadData调用回调函数
       * 1. 取消loading
       * 2. 展开子节点
       */
      if (!node._load && this.loadData) {
        if (node._load === false) return
        this.$set(node, '_load', false)
        this.loadData(node, (_node) => {
          if (_node && this.showCheckbox) {
            /**
             * 1. 因为异步节点状态导致其父级节点状态的变更
             * 2. 因为父级选中状态导致其自身选中状态的变更
             */
            let stateChange = false
            _node[this.childKey].forEach(node => {
              const stack = [node]
              while (stack.length !== 0) {
                const item = stack.pop()
                // 同步父节点信息
                if (!item._parent) item._parent = _node._parent ? [..._node._parent, item] : [_node]
                if (item.checked !== _node.checked) stateChange = true
                // 同步父节点状态
                this.$set(item, 'checked', _node.checked)
                // 选中节点
                if (item.checked) this.commonData.checkedNode.push(item)
                // 包含子节点
                if (this.hasChild(item)) {
                  item[this.childKey].forEach(child => {
                    child._parent = [...item._parent, item]
                    stack.push(child)
                  })
                }
              }
            })
            if (stateChange) {
              this.$emit('on-checked-change', {
                node: _node,
                selectedData: this.commonData.checkedNode
              })
            }
          }
          this.$set(node, '_load', true)
          this.$set(node, '_expand', !node._expand)
        })
      } else {
        this.$set(node, '_expand', !node._expand)
      }
    },
    activeChange (node) {
      this.commonData.activeNode = node
      this.$emit('on-selected-change', node)
    },
    checkedChange (node, index) {
      this.$emit('on-checked-change', {
        node: node,
        selectedData: this.commonData.checkedNode
      })
    },
    resetState (node) {
      /**
       * 思考：treeData，父节点的半选状态需要根据子节点的状态去展现，
       * 有什么思路可以最快确定所有节点自身的半选状态。
       *   1. treeData无限级嵌套
       *   2. treeData依赖变量x的展现，所以一次递归几乎不可能完成。
       *   3. 如何避免循环更新节点状态导致的性能浪费。
       * 思路：
       *   1. 递归当前Object，找出层级最高的一个节点，并且每个节点保存其父节点引用
       *   2. 根据父节点引用进行反向查找，从而确定每个父级点的状态
       *   3. 一级节点父节点即自身
       */
      const length = node._parent ? node._parent.length : 0
      for (let i = length - 1; i >= 0; i--) {
        let halfelEction = false
        let cur = node._parent[i]
        let checked = cur.checked
        cur[this.childKey].forEach(child => {
          if (child.checked || child._halfelEction) halfelEction = true
          if (!child.checked) checked = false
        })
        this.$set(cur, 'checked', checked)
        this.$set(cur, '_halfelEction', halfelEction)
        !checked
          ? this.commonData.checkedNode = this.commonData.checkedNode.filter(cNode => cNode[this.nodeKey] !== cur[this.nodeKey])
          : this.commonData.checkedNode.push(cur)
      }
    },
    initData (arr) {
      console.time('init-Data')
      if (this.showCheckbox) {
        arr.forEach(node => {
          const stack = [node]
          while (stack.length !== 0) {
            const item = stack.pop()
            // 选中节点
            if (item.checked) this.commonData.checkedNode.push(item)
            // 包含子节点
            if (this.hasChild(item)) {
              item[this.childKey].forEach(child => {
                child._parent = item._parent ? [...item._parent, item] : [item]
                stack.push(child)
              })
            }
            // 半选按钮
            if (stack.length === 0) this.resetState(item)
          }
        })
      }
      console.timeEnd('init-Data')
      // console.log(arr)
      this.nodeData = arr
    }
  }
}
