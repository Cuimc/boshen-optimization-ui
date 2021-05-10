# 大数据量渲染Table -- virtual-table
为了支持万级数据渲染，重构新的Table（秃头警告）

## 功能

1. 支持巨量数据渲染（多列、多行）
2. 支持固定列
3. 支持固定头
4. 支持拖拽行
5. 支持拖拽列
6. 支持筛选
7. 支持全选
8. 支持导出.csv
9. 支持行展开
10. 支持slot
11. 支持多级表头
12. 支持排序
13. 支持搜索                      。。。
14. 支持行、列编辑
15. 单元格合并
16. 冻结行、冻结列
17. ..

## 难点

1. 行、列编辑  
因为浏览器渲染，input、select、cascader等复杂组件时贼耗性能，所以在获取焦点时，再去渲染真实可操作组件，失去焦点时使用文本节点显示，减少dom渲染  

2. 排序、搜索涉及大数据量检索。需提供对应算法优解（二分法查找、冒泡排序，快速排序）。  

3. 对于数组增删改尽量使用(push、pop、shift、splice、)，整体赋值会导致整个dom所依赖数据重新渲染  

## 组件

1. table-header  
表头  

2. table-main  
表体  

3. table-footer  
表尾  

4. virtual-class  
虚拟滚动实体类  

5. expand-inner  
列表展开容器  

6. expand-tree  
列表展开树  

## iview || ant-design 对比 element

1. 用户:  
   a: iview支持slot、render、cloumn等方式渲染组件，灵活多用，支持场景丰富  
   b: element仅支持slot方式渲染组件，不支持函数式渲染，书写方式较为单一

2. 性能:
   a: iview需要对传入cloumn进行遍历生成table-cell，多一次循环性能较差。最佳支持数据量为200+
   b: element内部维护store数据中心应用做table-header & table-body使用  
   table-cell仅用作生成render逻辑供table-tr使用，不做渲染。减少数据监听，更贴合vue双向绑定。最佳支持数据量为500+

## issues

1. checkbox全选功能，在大数据量下会卡顿（流畅支持1000条，极限是2000）
   A: 优化选中逻辑
   B: 减少不必要的dom更新以及事件触发

2. 左侧右侧固定列表滚动会有轻微卡顿（因为左table，右table实质上是完整的table）
   A: 将固定table仅展示一固定列
   B: 优化cell渲染以及判断条件，避免dom更新

3. 暂时不支持展开table --- 因为臣妾做不到哇
   A: 采用新的tr-expand渲染方式，避免render函数渲染两个root-vnode

4. 纯文本渲染无卡顿，若是组件渲染 会明显卡顿(但是50条的卡顿与5000条卡顿几乎无异)
   A: 原有table依赖data -- columns，导致滚动时，tr-dom重新渲染 所以卡顿
   B: 部分组件使用transfer，table外的dom也同步更新，卡顿较为明显

5. Object.freeze() 冻结的是值，这时仍然可以将变量的引用替换掉，还有确保数据不会变才可以使用这个语法，如果要对数据进行修改和交互，就不适合使用冻结了

6. 针对需要保存用户自定义列的需求，table的实现采用 外部传入columns配置结合作用域插槽实现，取消render的入口

## 备注

1. table-init
   a: 计算col的宽度
   b: 计算col的reder函数以供调用
   c: 维护table内数据
2. 优化  
   a: 尽可能减少dom层级
   b: 减少vue.components
   c: 减少循环处理，尽可能使用对象访问
   d: 减少事件绑定
   e: 使用slot时，slot的组件内部更新会导致virtual-wrap重复计算
   f: 避免使用es6-Array-api，尽可能使用while || for
   g: 组件内部使用遍历过的数组，表现极为卡顿，原因暂时未知
   h: 固定列的左右table也必须使用全量数据，因为render需要整行数据。。想办法优化一下。。。