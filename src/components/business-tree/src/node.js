/**
 * 一、 使用优化树
 *     1. 父组件初始化时计算所有节点数据的状态
 *     2. 每个节点更新，统一由父组件计算维护
 *     3. 使用woker计算，不阻塞ui渲染
 * 二、 节点checked不关联
 *     1. 节点checked更新时，不再关联状态，仅变更组件自身状态
 *     2. 将半选也视为选中即可实现，子节点选中关联父节点选中
 */

import CollapseTransition from './collapse-transition'
import { findComponentsDownward } from '../../../utils/assist'

export default {
  name: 'Node',
  inject: ['hasChild'],
  components: {
    CollapseTransition
  },
  props: {
    icon: String,
    node: Object,
    index: Number,
    nodeKey: String,
    childKey: String,
    loadData: Function,
    commonData: Object,
    optimization: Boolean,
    showCheckbox: Boolean,
    renderTreeNode: Function
  },
  data () {
    return {

    }
  },
  computed: {
    // firstNode () {
    //   return this.$parent.$options.name === 'Tree'
    // }
  },
  render () {
    const { node, icon, childKey, nodeKey, showCheckbox, commonData, optimization, loadData, renderTreeNode } = this
    return (
      <li class="tree-item">
        <div class="item-content-wrap" on-click={this.clickItem}>
          {
            // 由于无法知道最后一个节点是否需要加载数据，所以会先展示下拉箭头，点击之后即会消失
            this.hasChild(node) || (loadData && !node._load)
              ? <Icon
                type={icon}
                class={['icon', node._expand ? 'rotate90-enter icon-expand' : 'rotate90-leave icon-unexpand']}
                vOn:click_native_stop={() => {}}
                on-click={this.expand} />
              : <div class="icon"></div>
          }
          {
            showCheckbox && <Checkbox
              v-model={node.checked}
              disabled={node.disabled}
              vOn:click_native_stop={() => {}}
              on-on-change={this.checked}
              indeterminate={node._halfelEction} />
          }
          <div class={['item-content', node._active ? 'tree-item-active' : '']}>
            {
              node._load === false
                ? <Icon type="ios-sync" class="icon-load"/>
                : !renderTreeNode ? node.name : renderTreeNode(node)
            }
          </div>
        </div>
        {
          <collapse-transition>
            {
              // ((node._expand && optimization) || !optimization) &&
              node._expand &&
                <ul class={['tree-wrap']}>
                  {
                    node[childKey] && node[childKey].map((child, i) => {
                      return (
                        <Node
                          node={child}
                          icon={icon}
                          index={i}
                          loadData={loadData}
                          node-key={nodeKey}
                          child-key={childKey}
                          common-data={commonData}
                          optimization={optimization}
                          show-checkbox={showCheckbox}
                          on-on-expand={node => this.emitEvent('on-expand', node)}
                          on-on-click-item={node => this.emitEvent('on-click-item', node)}
                          on-on-checked={(node, index) => this.emitEvent('on-checked', node, index)}
                          on-on-child-checked={(target, val) => this.childChecked(target, val)}
                          render-tree-node={renderTreeNode} />
                      )
                    })
                  }
                </ul>
            }
          </collapse-transition>
        }
      </li>
    )
  },
  methods: {
    emitEvent () {
      this.$emit(...arguments)
      // this.firstNode
      //   ? this.$emit(node, event)
      //   : this.$parent.emitEvent(node, event)
    },
    expand () {
      // 交给根组件去处理相关逻辑
      // this.$set(this.node, '_expand', !this.node._expand)
      this.emitEvent('on-expand', this.node)
    },
    checked (val) {
      /**
       * 根据自身的状态不同，向上 && 向下发送事件不同，根据事件类别，减少计算量(考虑子节点含有禁用)
       * 0. 自身是半选 ---- 被动
       *    a: 子级更新，才会导致父级变更为半选的状态
       * 1. 自身是选中 ---- 主动
       *    a: 根据平级所有节点选中状态，判断是否向上发送被动选中事件
       *    b: 向下发送被动选中事件
       * 2. 自身是选中 ---- 被动
       *    a: 重置半选状态
       * 3. 自身是取消 ---- 主动
       *    a: 向上发送半选事件
       * 4. 自身是取消 ---- 被动
       *    a: 重置半选状态
       */
      // !val
      //   ? this.commonData.checkedNode = this.commonData.checkedNode.filter(cNode => cNode[this.nodeKey] !== this.node[this.nodeKey])
      //   : this.commonData.checkedNode.push(this.node)
      // this.node._halfelEction && this.$set(this.node, '_halfelEction', false)
      /**
       * 是否是末级节点
       * 1. 是：
       *     a：直接向上冒泡
       *     b：逐层更新父级节点状态
       * 2. 否：
       *     a：传递捕获找到最末级节点根据此次状态，被动更新末级所有节点状态，
       *     b：逐层更新父级节点状态
       */
      if (this.hasChild(this.node)) {
        this.parentChecked(val)
      } else {
        this.emitEvent('on-child-checked')
      }
      this.emitEvent('on-checked', this.node, this.index)
    },
    clickItem () {
      const lastActiveNode = this.commonData.activeNode
      if (lastActiveNode._active) this.$set(lastActiveNode, '_active', false)
      this.$set(this.node, '_active', !this.node._active)
      this.emitEvent('on-click-item', this.node)
    },
    // 子节点触发的事件
    childChecked (target, val) {
      this.resetState(this.node, target, val)
      this.emitEvent('on-child-checked', target, val)
    },
    // 父节点触发的事件
    parentChecked (val) {
      // 找出最后一个子组件
      let lastNode = findComponentsDownward(this, 'Node')
      // findComponentsDownward(this, 'Node').forEach(child => {
      //   let stack = [child]
      //   while (stack.length !== 0) {
      //     const item = stack.pop()
      //     const nextNode = findComponentsDownward(item, 'Node')
      //     if (nextNode) stack.push(...nextNode)
      //     if (stack.length === 0) lastNode = lastNode.push(item)
      //   }
      // })
      let max = lastNode[0]
      for (let i = 0; i < lastNode.length; i++) {
        let cur = lastNode[i]
        if (cur.node._parent.length > max.node._parent.length) {
          max = cur
        }
      }
      // console.log('parentChecked', max)
      if (!max) max = this
      if (!max.node.disabled) this.$set(max.node, 'checked', val)
      max.emitEvent('on-child-checked', this.node, val)
    },
    resetState (node, target, childChecked) {
      console.log(node.name)
      const length = node[this.childKey].length
      let checked = true
      let halfelEction = false
      for (let i = length - 1; i >= 0; i--) {
        let cur = node[this.childKey][i]
        if (childChecked !== undefined && target[this.nodeKey] === node[this.nodeKey] && !cur.disabled) this.$set(cur, 'checked', childChecked)
        if (!cur.checked) checked = false
        if (cur.checked || cur._halfelEction) halfelEction = true
      }
      if (node.checked !== checked) {
        this.$set(node, 'checked', checked)
        !checked
          ? this.commonData.checkedNode = this.commonData.checkedNode.filter(cNode => cNode[this.nodeKey] !== node[this.nodeKey])
          : this.commonData.checkedNode.push(node)
      }
      this.$set(node, '_halfelEction', halfelEction && !node.checked)
    }
  }
}
