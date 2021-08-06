<template>
  <li class="tree-item">
    <div class="item-content-wrap" @click="clickItem">
      <Icon
      v-if="hasChild(node) || (loadData && !node._load)"
      :class="['icon', node._expand ? 'rotate90-enter icon-expand' : 'rotate90-leave icon-unexpand']"
      :type="icon"
      @click.stop="expand" />
      <div v-else class="icon"></div>
      <Checkbox
        v-if="showCheckbox"
        v-model="node.checked"
        :disabled="node.disabled"
        @click.native.stop
        @on-change="checked"
        :indeterminate="node._halfelEction" />
      <div :class="['item-content', node._active ? 'tree-item-active' : '']">
        <Icon v-if="node._load === false" type="icon-loading" class="icon-load" />
        <span v-else-if="!renderTreeNode">
          <!-- 利用一个函数式组件传递renderTreeNode进行渲染 -->
          {{node.name}}
        </span>
        <Render v-else :render="renderTreeNode" :node="node" />
      </div>
    </div>
    <collapse-transition>
      <!-- <template v-if="(optimization && node._expand) || !optimization">
        <ul class="tree-wrap" v-show="node._expand">
          <Node
            v-for="(node, i) in node[childKey]"
            :key="i"
            :node="node"
            :icon="icon"
            :index="i"
            :loadData="loadData"
            :child-key="childKey"
            :common-data="commonData"
            :optimization="optimization"
            :show-checkbox="showCheckbox"
            :render-tree-node="renderTreeNode"
            @on-expand="node => emitEvent('on-expand', node)"
            @on-checked="(node, index) => emitEvent('on-checked', node, index)"
            @on-click-item="node => emitEvent('on-click-item', node)" />
        </ul>
      </template> -->
      <template v-if="optimization">
        <ul v-if="node._expand" class="tree-wrap">
          <Node
            v-for="(node, i) in node[childKey]"
            :key="i"
            :node="node"
            :icon="icon"
            :index="i"
            :loadData="loadData"
            :child-key="childKey"
            :common-data="commonData"
            :optimization="optimization"
            :show-checkbox="showCheckbox"
            :render-tree-node="renderTreeNode"
            @on-expand="node => emitEvent('on-expand', node)"
            @on-child-checked="childChecked"
            @on-checked="(node, index) => emitEvent('on-checked', node, index)"
            @on-click-item="node => emitEvent('on-click-item', node)" />
        </ul>
      </template>
      <template v-else>
        <ul class="tree-wrap" v-show="node._expand">
          <Node
            v-for="(node, i) in node[childKey]"
            :key="i"
            :node="node"
            :icon="icon"
            :index="i"
            :loadData="loadData"
            :child-key="childKey"
            :common-data="commonData"
            :optimization="optimization"
            :show-checkbox="showCheckbox"
            :render-tree-node="renderTreeNode"
            @on-expand="node => emitEvent('on-expand', node)"
            @on-child-checked="childChecked"
            @on-checked="(node, index) => emitEvent('on-checked', node, index)"
            @on-click-item="node => emitEvent('on-click-item', node)" />
        </ul>
      </template>
    </collapse-transition>
  </li>
</template>

<script>

import CollapseTransition from './collapse-transition'
import { findComponentsDownward } from '../../../utils/assist'
import Render from './render'
export default {
  name: 'Node',
  inject: ['hasChild', 'updateChecked'],
  components: {
    CollapseTransition,
    Render
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
  created () {
    // 懒加载需要同步父节点数据
    if (!this.optimization && this.node._parent && this.node._change && !this.node.disabled) {
      this.$set(this.node, 'checked', this.node._parent[this.node._parent.length - 1].checked)
      this.$set(this.node, 'change', true)
    }
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
      /**
       * 是否是末级节点
       * 1. 是：
       *     a：直接向上冒泡
       *     b：逐层更新父级节点状态
       * 2. 否：
       *     a：传递捕获找到最末级节点根据此次状态，被动更新末级所有节点状态，
       *     b：逐层更新父级节点状态
       */
      this.updateChecked(val, this.node)
      if (!this.node._change) this.$set(this.node, '_change', true)
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
      /**
       * 找出所有分支的最后一级子节点
       * 1. hasChild === false
       * 2. _parent最后一个值与其余node不同，相同的取其一即可
       */
      const lastNodes = []
      // let lastNodes = findComponentsDownward(this, 'Node').filter(last => !this.hasChild(last.node))
      findComponentsDownward(this, 'Node').forEach(last => {
        if (!this.hasChild(last.node) && !lastNodes.find(result => result.node._parent[result.node._parent.length - 1] === last.node._parent[last.node._parent.length - 1])) {
          lastNodes.push(last)
        }
      })
      lastNodes.forEach(last => last.emitEvent('on-child-checked', this.node, val))
      // max.emitEvent('on-child-checked', this.node, val)
    },
    resetState (node, target, childChecked) {
      console.log('resetState', node.name)
      const length = node[this.childKey].length
      let checked = true
      let halfelEction = false
      for (let i = length - 1; i >= 0; i--) {
        let cur = node[this.childKey][i]
        if (childChecked !== undefined && target[this.nodeKey] === node[this.nodeKey] && cur.checked !== childChecked && !cur.disabled) {
          this.$set(cur, 'checked', childChecked)
          this.updateChecked(childChecked, cur)
        }
        if (!cur.checked) checked = false
        if (cur.checked || cur._halfelEction) halfelEction = true
      }
      if (node.checked !== checked) {
        this.$set(node, 'checked', checked)
        this.updateChecked(checked, node)
      }
      this.$set(node, '_halfelEction', halfelEction && !node.checked)
    }
  }
}

</script>
