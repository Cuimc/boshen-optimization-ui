# 大数据量渲染Table -- virtual-wrap

支持万级数据渲染

## 功能

1. 支持纵向虚拟滚动
2. 支持横向虚拟滚动
3. 支持v-solt.model(作用域插槽)

## 难点

1. 排序、搜索涉及大数据量检索。需提供对应算法优解（二分法查找、冒泡排序，快速排序）。  

2. 对于数组增删改尽量使用(push、pop、shift、splice、)，整体赋值会导致整个dom所依赖数据重新渲染  

3. 滚动行为处理

## 虚拟滚动核心实现

1. 通过数据源size、平均数据size、容器size计算得出显示区域，数据条数，以及预显示数据

2. 进行滚动时，动态变更显示区域显示数据，

<!-- 3. table数据采用map对象进行二维划分，第一维度为显示区域的size，如：  
```javascript
let wrapSize = 20
const souseData = {
  `1-20`: [
    {
      name: '1'
    },
    ...
  ],
  `21-40`: [
    {
      name: '21'
    },
    ...
  ]
}
``` -->

4. 使用transform:translateY || padding来模拟滚动、填充隐藏区域，对比position可以避免浏览器重绘、回流。

5. 滚动原则(区间)  
   A: 从上到下  
      a: wrap-padding-top      增加  
      b: wrap-padding-bottom   减少  
      c: row-index             增加  
      d: col-index             不变  
   B: 从左到右
      a: wrap-padding-left     增加  
      b: wrap-padding-right    减少  
      c: row-index             不变  
      d: col-index             增加  

## 组件

1. virtual-class  
虚拟滚动实体类  

2. slot  
真实滚动区域  

3. virtual  
向外暴露的真正组件  

## issues

1. 横向滚动怎么支持

2. 可以同时支持纵向和横向滚动吗

3. 嵌套虚拟组件之间的数据交互(业务数据 -- 有嵌套关系，各个组件正常传值的情况下则可正常使用)
   A: 约束固定字段进行抛出
   B:
4. 无容器tag时，监听滚动事件错误--应该是其父节点
   A: 父节点触发`scroll`事件，约定事件名称为`this.$emit('wrap-scroll', event)`
   B: 查看Table.vue,事件绑定在其div上，所以等于生成了三个虚拟容器，因为有左固定和右固定
5. table所有子元素不支持padding-margin