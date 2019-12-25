<template>
  <div>
    <HeadTop/>
    <router-view></router-view>
  </div>
</template>

<script>
import HeadTop from "../common/header";
export default {
  components:{
    HeadTop,
  }
}
</script>

<style lang="scss" scoped>
  .main {
    min-height: calc(100vh - 454px);
    background: #ededed;
    overflow: hidden;
    width: 100%;
  }
</style>

