<template>
  <div>
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w" style="padding-top: 40px;">
      <y-shelf title="收货信息" style="margin-bottom:0px">
      </y-shelf>
     </div>

  </div>
</template>

<script>
import YHeader from '../../common/header'
import { mapMutations, mapState } from 'vuex'
import YShelf from "../../components/shelf";
import YButton  from "../../components/yButton";
export default {
  components:{
    YHeader,YShelf,YButton
  },
}
</script>

<style>

</style>
