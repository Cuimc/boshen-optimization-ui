import { oneOf } from '../utils/assist'
export default {
  props: {
    size: {
      validator (value) {
        return oneOf(value, ['small', 'middle', 'large'])
      },
      default () {
        return !this.$shui || this.$shui.size === ''
          ? 'large'
          : this.$shui.size
      }
    }
  },
  data () {
    return {
      // props 不能直接赋,所以进行缓存
      sizes: this.size
    }
  },
  watch: {
    size (val) {
      this.sizes = val
    },
    '$shui.size': function (val) {
      this.sizes = val.size
    }
  }
}
