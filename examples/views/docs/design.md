# 业务组件

1. size响应式设计：因为基础ui组件使用响应式size。业务组件默认会使用sizes属性。
2. 业务项目使用时监听window.resize事件，获取屏幕宽度自行更新this.$shui.size = 'large'，即可响应式更新所有组件尺寸

## descripton
标准设计组件库

## 组件
1. TipsHeader
  desc: 用作头部信息提示
  功能: 
      a: icon切换
      b: 可关闭
2. SearchHeader  
  desc: 复合型form搜索框  
  功能:  
      a: 可折叠收起
      b: 兼容多行展示

3. Toolbar
   desc: 表格顶部操作按钮区
   功能: 
      a: 含有三类层级按钮
      b: 左右对齐，左对齐
      c: 含有select组合搜索
4. CombinationTable
  desc: 复合功能table（laoding, page）
  功能: 
      a: 刷新遮罩
      b: page分页
5. TreeSelect
   desc: 下拉框含有tree组件