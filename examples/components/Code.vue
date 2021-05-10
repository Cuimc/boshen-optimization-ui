<template>
  <div :class="[className]" v-highlightA v-highlightB>
<pre>
  <p v-if="title">{{title}}</p>
  <code :class="[type]">
    <slot></slot>
  </code>
</pre>
  </div>
</template>

<script>
import { oneOf } from '@/utils/assist'
/**
 * 适用于单行，多行的空格、回车等等 会被vue过滤掉，导致没有有换行
 */
export default {
  name: 'ShCode',
  props: {
    type: {
      validator (value) {
        return oneOf(value, [
          'html',
          'javascript',
          'css',
          'markdown',
          'plaintext',
          'nohighlight'
        ])
      },
      default: 'html'
    },
    title: String,
    className: String
  }
}
</script>
