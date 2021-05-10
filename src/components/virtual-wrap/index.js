import VirtualWrap from './src/virtual-wrap'

VirtualWrap.install = function (Vue) {
  Vue.component(VirtualWrap.name, VirtualWrap)
}

export default VirtualWrap