<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumb">
            <div class="big">
              <img :src="product.goodsUrl" :alt="product.productName">
            </div>
          </div>
        </div>
      </div>
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{product.goodsName}}</h4>
          <h6 style='margin:0'>
            <span>{{product.goodsDesc}}</span>
            <span class="price">
              <em>¥</em><i>{{product.goodsPrice}}</i></span>
          </h6>
          <!-- <h6 style='margin:0'> -->
            <p style="color:#bdbdbd">库存剩余:<span>{{product.goodsInventory}}</span></p> 
            <p style="color:#bdbdbd">品牌:<span>{{product.brandName}}</span></p> 
            <p style="color:#bdbdbd">品牌类型:<span>{{product.brandType}}</span></p> 
          <!-- </h6> -->
        </div>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum" :limit="Number(product.goodsLimit)"></buy-num>
        </div>
        <div class="buy">
          <y-button text="加入购物车"
                    @btnClick="addCart(product.id,product.goodsPrice,product.goodsName,product.goodsUrl)"
                    classStyle="main-btn"
                    style="width: 145px;height: 50px;line-height: 48px"></y-button>
          <y-button text="现在购买"
                    @btnClick="checkout(product.id,product.goodsPrice,product.goodsName,product.goodsUrl)"
                    style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"></y-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
     <div class="gray-boxs">
        <div class="title">
          <h2>商品信息</h2>
        </div>
        <div>
          <div class="img-item" v-if="product.goodsCode">
            <div v-html="product.goodsCode"></div>
          </div>
          <div class="no-info" v-else>
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无详细内容数据
          </div>
        </div>
      </div>
    </div>
    <!--产品评论-->
    <div class="item-info">
     <div class="gray-boxs">
        <div class="title">
          <h2>商品评论</h2>
        </div>
        <div>
          <!-- <div class="img-item" v-if="product.goodsCode">
            <div v-html="product.goodsCode"></div>
          </div> -->
          <div class="no-info" v-if="commentData.length === 0">
            <img src="/static/images/no-data.png">
            <br>
            该商品暂无评论数据
          </div>
          <div id="comment">
            <Commemt v-if="isShowComment" :comments="commentData" :goodsId="goodsId" 
            @updataComment="updataComment()"></Commemt>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Cookies from 'js-cookie';
  import { mapMutations, mapState } from 'vuex'
  import YShelf from '../../components/shelf'
  import BuyNum from '../../components/buynum'
  import YButton from '../../components/yButton'
   import Commemt from '../../components/comment/comment'
  import { getGoodsInfo,addCommentInfo,getCommentList } from "../../api/goods-manage";
  import { joinCart } from "../../api/before-goods";
  export default {
    data () {
      return {
        isShowComment:false,
        product: {
          salePrice: 0,
          limitNum: 0,
          productId: '',
          productName: "",
          salePrice: 0,
          subTitle: "",
          brandType:'',
          brandName:'',
        },
        buyQuantity: 1,
        goodsId: '',
        commentData:[ ],
        
      }
    },
    computed: {
      ...mapState(['login', 'showMoveImg', 'showCart'])
    },
    methods: {
      ...mapMutations(['ADD_CART', 'ADD_ANIMATION', 'SHOW_CART']),
      _productDet (id) {
        getGoodsInfo(id).then(res =>{
          if(res && res.code === 200){
            console.log('商品详情',res);
            this.product = res.data;
            this.big = res.data.goodsUrl;
            this.goodsId = res.data.id;
            this.$nextTick(()=>{
              this.isShowComment = true;
            })

          }
        })
      },
      addCart (id, price, name, img) {
        if (!this.showMoveImg) {     // 动画是否在运动
            joinCart({
              buyCounts: this.buyQuantity,
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
      },
      checkout (id, price, name, img) {
        this.$root.checkoutrtList = [{
              buyCounts: this.buyQuantity,
              goodsId: id,
              goodsName: name,
              goodsPrice: price,
              goodsUrl: img,
        }];
        this.$router.push(
          {path: '/before-checkout'}
          )
      },
      editNum (num) {
        this.buyQuantity = num
      },
      updataComment(){
         getCommentList({
            goodsId:this.goodsId
          }).then(res => {
            this.commentData = res.data;
          })
      }
    },
    components: {
      YShelf, BuyNum, YButton,Commemt
    },
    created () {
      let id = this.$route.query.id;
      this._productDet(id);
      getCommentList({
        goodsId:id
      }).then(res => {
        this.commentData = res.data;
      })
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";

  .store-content {
    width: 100%;
    // min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
  }

  .gray-box {
    background: #fff;
    display: flex;
    padding: 60px;
    margin: 20px auto;
    width: 1220px;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid #dcdcdc;
    border-color: rgba(0,0,0,.14);
    box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
    .gallery-wrapper {
      .gallery {
        display: flex;
        width: 540px;
        .thumbnail {
          li:first-child {
            margin-top: 0px;
          }
          li {
            @include wh(80px);
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #f0f0f0;
            border: 1px solid rgba(0, 0, 0, .06);
            border-radius: 5px;
            cursor: pointer;
            &.on {
              padding: 10px;
              border: 3px solid #ccc;
              border: 3px solid rgba(0, 0, 0, .2);
            }
            img {
              display: block;
              @include wh(100%);
            }
          }
        }
        .thumb {
          .big {
            margin-left: 20px;
          }
          img {
            display: block;
            @include wh(340px)
          }
        }
      }
    }
    // 右边
    .banner {
      width: 450px;
      margin-left: 10px;
      h4 {
        font-size: 24px;
        line-height: 1.25;
        color: #000;
        margin-bottom: 13px;
      }
      h6 {
        font-size: 14px;
        line-height: 1.5;
        color: #bdbdbd;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sku-custom-title {
        overflow: hidden;
        padding: 8px 8px 18px 10px;
        position: relative;
      }
      .params-name {
        padding-right: 20px;
        font-size: 14px;
        color: #8d8d8d;
        line-height: 36px;
      }
      .num {
        padding: 29px 0 8px 10px;
        border-top: 1px solid #8b8989;
        display: flex;
        align-items: center;
      }
      .buy {
        position: relative;
        border-top: 1px solid #8b8989;
        padding: 30px 0 0 10px;
      }
    }
  }

  .item-info {
    padding: 10px 80px;
    .gray-boxs {
      position: relative;
      margin-bottom: 30px;
      overflow: hidden;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #dcdcdc;
      border-color: rgba(0, 0, 0, .14);
      box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);
      .title {
        padding-left: 30px;
        position: relative;
        z-index: 10;
        height: 60px;
        padding: 0 10px 0 24px;
        border-bottom: 1px solid #d4d4d4;
        border-radius: 8px 8px 0 0;
        box-shadow: rgba(0, 0, 0, .06) 0 1px 7px;
        background: #f3f3f3;
        background: -webkit-linear-gradient(#fbfbfb, #ececec);
        background: linear-gradient(#fbfbfb, #ececec);
        line-height: 60px;
        font-size: 18px;
        color: #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        h2 {
          font-size: 18px;
          font-weight: 400;
          color: #626262;
          display: inline-block;
        }
      }
    }
    .img-item {
      width: 1220px;
      // padding: 1vw;
      text-align: center;
      img {
        width: 100%;
        height: auto;
        display: block;
      }
    }
  }

  .no-info {
    padding: 200px 0;
    text-align: center;
    font-size: 30px;
  }

  .price {
    display: block;
    color: #d44d44;
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    text-align: right;
    i {
      padding-left: 2px;
      font-size: 24px;
    }
  }
</style>
