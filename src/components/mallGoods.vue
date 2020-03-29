<template>
<!-- 每个商品的模块 -->
  <div class="good-item">
    <div style="">
      <div class="good-img">
        <a @click="openProduct(msg.id)">
          <img :src="msg.goodsUrl">
        </a>
      </div>
      <h6 class="good-title" v-html="msg.goodsName">{{msg.goodsName}}</h6>
      <h3 class="sub-title ellipsis">{{msg.goodsDesc}}</h3>
      <div class="good-price pr">
        <div class="ds pa">
          <a @click="openProduct(msg.id)">
            <y-button text="查看详情" style="margin: 0 5px"></y-button>
          </a>
          <y-button text="加入购物车"
                    style="margin: 0 5px"
                    @btnClick="addCart(msg.id,msg.goodsPrice,msg.goodsName,msg.goodsUrl)"
                    classStyle="main-btn"
          ></y-button>
        </div>
        <p><span style="font-size:14px">￥</span>{{Number(msg.goodsPrice).toFixed(2)}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import YButton from '../components/yButton'
  import { joinCart } from '../api/before-goods'
  import { mapMutations, mapState } from 'vuex'
  import { getStore } from '../util/storage'
  export default {
    props: {
      msg:''
    },
    data () {
      return {
        
      }
    },
    mounted(){
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      openProduct (id) {
         this.$router.push({
           path:'before-goodsDetails',
           query:{id},
         })
      },
      addCart (id, price, name, img) {
        if (!this.showMoveImg) {     // 动画是否在运动
            joinCart({
              buyCounts: 1,
              goodsId: id,
              goodsName: name,
              goodsPrice: price,
              goodsUrl: img,
            }).then(res =>{
              if(res && res.code === 200){
                this.$message.success('加入购物车成功');
              }else{
                 this.$message.error(res.msg)
              }
            })
          // 加入购物车动画
          var dom = event.target
          // 获取点击的坐标
          let elLeft = dom.getBoundingClientRect().left + (dom.offsetWidth / 2)
          let elTop = dom.getBoundingClientRect().top + (dom.offsetHeight / 2)
          // 需要触发
          this.ADD_ANIMATION({moveShow: true, elLeft: elLeft, elTop: elTop, img: img})
          if (!this.showCart) {
            this.SHOW_CART({showCart: true})
          }
        }
      }
    },

    // mounted () {
    // },
    components: {
      YButton
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/mixin";
  @import "../assets/style/theme";

  .good-item {
    background: #fff;
    width: 24%;
    transition: all .5s;
    height: 430px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
      .good-price p {
        display: none;
      }
      .ds {
        display: flex;
      }
    }
    .ds {
      @extend %block-center;
      width: 100%;
      display: none;
    }

    .good-img {
      img {
        margin: 50px auto 10px;
        @include wh(206px);
        display: block;
      }
    }
    .good-price {
      margin: 15px 0;
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #d44d44;
      font-family: Arial;
      font-size: 18px;
      font-weight: 700;
    }
    .good-title {
      line-height: 1.2;
      font-size: 16px;
      color: #424242;
      margin: 0 auto;
      padding: 0 14px;
      text-align: center;
      overflow: hidden;
    }
    h3 {
      text-align: center;
      line-height: 1.2;
      font-size: 12px;
      color: #d0d0d0;
      padding: 10px;
    }

  }
</style>
