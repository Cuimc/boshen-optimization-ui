## 顶部搜索栏
1. 查询条件大于3个时，会隐藏最后两个条件，变为收起按钮。
2. 一行最多放置3个查询条件，超过3个进行换行。

## 入参
```javascript
const props = {
  labelWidth: Number,
  labelPosition: ['left', 'right', 'top'],
  formRules: Object,
  formModel: [
    {
      label: [String || Number],
      initValue: [String, Date, Number, Array]
      key: String, // 最后会根据俄key组成数据模型
      type: ['Input', 'Select', 'Cascader', 'DatePicker', 'TimePicker', 'CascaderEasy'],
      placeHolder: String,
      rules: {},
      // 以下属性 根据业务需求进行支持
      slot: String, // 数据绑定需要自行实现
      render: Function,
      // 以下属性 根据组件类型进行传递
      selectData: Array,
      cascaderData: Array,
      inputType: String,
      datePickerType: String,
      timePickerType: String
    }
    // ...otherComponents
  ],
  fetch: Function,
  inline: Boolean
}

const event = [
  'formChange': '', // 查询条件更改时触发
  'searchData': '' // 查询数据时触发
]

const slot = [
  'search-btn': '', // 查询按钮
  'reset-btn': '' // 重置按钮
]

const refs = [
  'search': '' // 组件的搜索方法实体，在solt时可能会用到
]

```

## 
```html
<template>
  <Form :rules="formRules" :inline="inline" :model="resultModel" :label-width="labelWidth" :label-position="labelPosition">
    <form-item
      v-for="(item, i) in formModel" :key="i"
      :label="item.label"
      :prop="item.key" >
    </form-item>
    <template v-if="item.type"></template>
    <template v-else-if="item.slot"></template>
  </Form>
</template>
```