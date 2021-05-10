import VirtualTable from './src/virtual-table.vue'


VirtualTable.install = function (Vue) {
  Vue.component(VirtualTable.name, VirtualTable)
}

export default VirtualTable
