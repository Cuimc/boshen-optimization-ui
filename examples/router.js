import Vue from 'vue'
import Router from 'vue-router'
import common from './Common.vue'

Vue.use(Router)

// 解决重复导航路由报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'common',
      component: common,
      redirect: '/introduce',
      children: [
        {
          path: '/introduce',
          name: 'introduce',
          component: () => import(/* webpackChunkName: "introduce" */ './views/docs/Introduce.vue')
        },
        {
          path: '/install',
          name: 'install',
          component: () => import(/* webpackChunkName: "install" */ './views/docs/Install.vue')
        },
        {
          path: '/language',
          name: 'language',
          component: () => import(/* webpackChunkName: "language" */ './views/docs/Language.vue')
        },
        {
          path: '/custom',
          name: 'custom',
          component: () => import(/* webpackChunkName: "custom" */ './views/docs/Custom.vue')
        },
        {
          path: '/docs',
          name: 'docs',
          component: () => import(/* webpackChunkName: "docs" */ './views/docs/Docs.vue')
        },
        {
          path: '/search-header',
          name: 'search-header',
          component: () => import(/* webpackChunkName: "searchHeader" */ './views/search-header/SearchHeader.vue')
        },
        {
          path: '/virtual-wrap',
          name: 'virtual-wrap',
          component: () => import(/* webpackChunkName: "virtual-wrap" */ './views/virtual-wrap/virtual-wrap.vue')
        },
        {
          path: '/virtual-table-basic',
          name: 'virtual-table-basic',
          component: () => import(/* webpackChunkName: "virtual-table-basic" */ './views/virtual-table/virtual-table-basic.vue')
        },
        {
          path: '/virtual-table-custom',
          name: 'virtual-table-custom',
          component: () => import(/* webpackChunkName: "virtual-table-custom" */ './views/virtual-table/virtual-table-custom.vue')
        },
        {
          path: '/virtual-table-expand',
          name: 'virtual-table-expand',
          component: () => import(/* webpackChunkName: "virtual-table-expand" */ './views/virtual-table/virtual-table-expand.vue')
        },
        {
          path: '/virtual-table-fixed-column',
          name: 'virtual-table-fixed-column',
          component: () => import(/* webpackChunkName: "virtual-table-fixed-column" */ './views/virtual-table/virtual-table-fixed-column.vue')
        },
        {
          path: '/business-tree',
          name: 'business-tree',
          component: () => import(/* webpackChunkName: "businessSwitch" */ './views/business-tree/Tree.vue')
        }
      ]
    },
    {
      path: '*',
      name: '404',
      component: {
        render (h) {
          return h('div', {
            staticClass: 'flex flex-main-center',
            attrs: {
              style: 'width:100%;font-size:32px'
            }
          }, '未找到哦')
        }
      }
    }
  ]
})
