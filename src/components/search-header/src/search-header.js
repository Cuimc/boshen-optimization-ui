import HeaderRender from './render'
import HeaderSlot from './slot'

export default {
  name: 'SearchHeader',
  provide () {
    return {
      searchHeader: this
    }
  },
  props: {
    formModel: {
      type: Array,
      required: true
    },
    formRules: {
      type: Object,
      default: () => {
        return {}
      }
    },
    labelWidth: {
      type: Number
    },
    labelPosition: {
      type: String,
      default: 'right'
    },
    inline: {
      type: Boolean,
      default: true
    },
    fetch: {
      type: Function
    },
    showReset: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Function
    }
  },
  data () {
    return {
      resetModel: {},
      resultModel: {},
      expandForm: false
    }
  },
  watch: {
    formModel: {
      deep: true,
      handler (arr) {
        this.countModel(arr)
      }
    }
  },
  render (h) {
    const childrenNode = this.setChildNode(this.formModel)
    let operationBtn = ''
    if (childrenNode.length > 3) operationBtn = this.operationBtn()
    const formProps = {
      rules: this.formRules,
      model: this.resultModel,
      inline: this.inline,
      labelWidth: this.labelWidth,
      labelPosition: this.labelPosition
    }
    return (
      <Form
        class={`sh-search-header ${operationBtn !== '' ? 'form-item-wrap' : 'form-no-wrap'}`}
        {...{ props: formProps }} >
        {childrenNode}
        {operationBtn}
      </Form>
    )
  },
  created () {
    this.countModel()
  },
  methods: {
    countModel (arr = this.formModel) {
      arr.forEach(form => {
        /**
         * 1. 赋值根据form-item是slot || type || render
         * 2. type取当前对象
         * 3. 其余数据取外部数据
         */
        if (!this.resultModel.hasOwnProperty(form.key) || (!form.type && (form.slot || form.render))) {
          this.resultModel[form.key] = this.resetModel[form.key] = form.props.value
        }
      })
    },
    setChildNode (modelArr) {
      const isWrap = modelArr.length > 3
      return modelArr.map((model, i) => {
        return (
          <form-item
            label={model.label}
            prop={model.key}
            rules={model.rules}
            class={this.setClass(i)}
            style={i > 1 && isWrap && !this.expandForm ? { display: 'none' } : {}} >
            {this.countInner(model, i)}
            {!isWrap && i === modelArr.length - 1 && this.operationBtn(isWrap) }
          </form-item>
        )
      })
    },
    countInner (model) {
      let vnode = ''
      if (model.type) {
        let slot = ''
        switch (model.type) {
          case 'Select':
            if (!model.props || !model.props.data) throw new Error('请传递data属性，以供Select组件使用')
            slot = model.props.data.map(item => <Option value={item.value} label={item.label} disabled={item.disabled} />)
            break
        }
        /**
         * 原生事件的支持
         * 1. 使用eval()反编译生成HTML代码
         * 2. 暂时不考虑实现事件自定义，让用户使用slot或者render实现
         */
        vnode = <model.type v-model={this.resultModel[model.key]} props={model.props} on={model.on}>{slot}</model.type>
      } else if (model.slot) {
        vnode = <HeaderSlot render-model={model} />
      } else if (model.render) {
        vnode = <HeaderRender render-model={model} />
      }
      return vnode
    },
    setClass (i) {
      let result = ''
      if (i % 3 === 1) {
        result = 'form-item-center'
      } else if (i % 3 === 2) {
        result = 'form-item-right'
      }
      return result
    },
    operationBtn (showExpand = true) {
      return (
        <div class="sh-form-item-content btn-wrap">
          {
            this.$slots.searchBtn
              ? this.$slots.searchBtn
              : (
                <div slot="search-btn">
                  {this.showReset && <Button type="default" size="small" onClick={this.resetModelFn}>重置</Button>}
                  <Button type="primary" size="small" onClick={() => this.fetch(this.resultModel)}>查询</Button>
                </div>
              )
          }
          {
            !this.$slots.searchBtn && showExpand &&
              <div class="sh-expand-btn" onClick={() => { this.expandForm = !this.expandForm }}>
                {this.expandForm ? '收起' : '展开'}
                <Icon type="icon-down-bracket" size="14" class={`${this.expandForm ? 'show' : 'hidden'}-arrow arrow`} />
              </div>
          }
        </div>
      )
    },
    resetModelFn () {
      this.resultModel = this.resetModel
      if (this.reset()) this.reset()
    }
  }
}
