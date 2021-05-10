// 因部分文件夹名称与vue组件名称不对应 故手动维护配置文件
module.exports = function customName (name) {
  switch (name) {
    case 'date-picker':
      name = 'datePicker'
      break
    case 'time-picker':
      name = 'timePicker'
      break
    case 'cascader-easy':
      name = 'cascaderEasy'
      break
  }
  return `shsc-ui/lib/${name}`
}
