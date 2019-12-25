<template>
  <div>
    <!-- 主页 -->
    <!-- 轮播图 -->
   <swipt></swipt>
  </div>
</template>

<script>
import Swipt from '../components/swipt'
export default {
  data(){
    return{
      error: false,
      
      mark: 0,
      bgOpt: {
        px: 0,
        py: 0,
        w: 0,
        h: 0
      },
      home: [],
      loading: true,
      notify: '1',
      dialogVisible: false,
      timer: ''
    }
  },
  components:{
    Swipt,
  },
  created () {
    // this.play()
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
   .banner, .banner span, .banner div {
    font-family: "Microsoft YaHei";
    transition: all .3s;
    transition-timing-function: linear;
  }

  .banner {
    cursor: pointer;
    perspective: 3000px;
    position: relative;
    z-index: 19;
    margin: 0 auto;
    width: 1220px;
    height: 500px;
  }
  .img1 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .img2 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 5px;
    left: 0;
    background-size: 95% 100%;
    border-radius: 10px;
  }

  .img3 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .a {
    z-index: 20;
    transform: translateZ(40px);
  }

  .b {
    z-index: 20;
    transform: translateZ(30px);
  }

  .c {
    transform: translateZ(0px);
  }
</style>
