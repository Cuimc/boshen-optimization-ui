<template>
  <div id="common">
    <header class="header">
      <span style="color: #0673FC">optimization-ui</span>
    </header>
    <main class="main">
      <left-menu class="left-menu"></left-menu>
      <div class="right-content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import LeftMenu from './components/LeftMenu'
export default {
  name: 'Common',
  components: {
    LeftMenu
  },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
#common {
  line-height: 1.5;
  width: 100%;
  height: 100%;
  padding-top: 50px;
  .header {
    width: 100%;
    line-height: 50px;
    height: 50px;
    font-size: 24px;
    cursor: pointer;
    position: fixed;
    padding: 0 50px;
    top: 0px;
  }
  .main {
    background-color: rgb(247, 247, 247);
    height: calc(~"100% - 20px");
    margin:0  20px 20px 0;
    padding-left: 240px;
    .left-menu {
      width: 240px;
      font-size: 16px;
      height: calc(~"100% - 70px");
      box-sizing: border-box;
      position: fixed;
      left: 0px;
      overflow-y: auto;
    }
    .right-content {
      height: 100%;
      overflow-y: auto;
      padding: 14px;
      >* {
        background-color: #fff;
        min-height: 100%;
        padding: 14px 14px 0 14px;
        border-radius: 4px;
      }
    }
  }
}
</style>
