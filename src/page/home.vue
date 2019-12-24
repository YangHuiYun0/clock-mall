<template>
  <div>
    <HeadTop/>
    <router-view></router-view>
  </div>
</template>

<script>
import HeadTop from "../components/headTop";
export default {
  components:{
    HeadTop,
  }
}
</script>

<style>

</style>
