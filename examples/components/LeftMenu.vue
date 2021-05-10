<template>
  <Menu
    @on-select="goRoute"
    :active-name="activeName" >
    <template v-for="(group, i) in menuList">
      <Submenu :name="group.text" v-if="group.children && group.children.length > 0" :key="i">
        <template slot="title">
          {{group.text}}
        </template>
        <MenuItem v-for="(item, v) in group.children" :key="v" :name="item.url">
          <Icon :type="item.icon" />
          {{item.text}}
        </MenuItem>
      </Submenu>
      <MenuItem v-else :name="group.url" :key="i">
        <Icon :type="group.icon" />
        {{group.text}}
      </MenuItem>
    </template>
  </Menu>
</template>

<script>
export default {
  name: 'LeftMenu',
  data () {
    return {
      menuList: [
        {
          text: '介绍',
          url: '/introduce'
        },
        {
          text: '安装',
          url: '/install'
        },
        {
          text: '国际化',
          url: '/language'
        },
        {
          text: '定制主题',
          url: '/custom'
        },
        {
          text: '更新日志',
          url: '/docs'
        },
        {
          text: '布局',
          children: [
            {
              text: 'SearchHeader 搜索栏',
              icon: '',
              url: '/search-header'
            },
            {
              text: 'VirtualWrap 虚拟滚动容器',
              icon: '',
              url: '/virtual-wrap'
            }
          ]
        },
        {
          text: '基础增强',
          children: [
            {
              text: '标准Tree',
              icon: '',
              url: '/business-tree'
            }
          ],
        },
        {
          text: '大数据表格',
          children: [
            {
              text: '基本使用',
              icon: '',
              url: '/virtual-table-basic'
            },
            {
              text: '可展开',
              icon: '',
              url: '/virtual-table-expand'
            },
            {
              text: '自定义',
              icon: '',
              url: '/virtual-table-custom'
            },
            {
              text: '固定列',
              icon: '',
              url: '/virtual-table-fixed-column'
            }
          ]
        }
      ],
      activeName: ''
    }
  },
  watch: {
    $route () {
      this.activeName = this.$route.fullPath
    }
  },
  created () {
    this.activeName = this.$route.fullPath
  },
  methods: {
    goRoute (route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped lang="less">
.menv {
  height: 100%;
}
</style>
