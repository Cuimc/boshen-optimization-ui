import BusinessTree from './src/tree'

BusinessTree.install = function (Vue) {
  Vue.component(BusinessTree.name, BusinessTree)
}

export default BusinessTree
