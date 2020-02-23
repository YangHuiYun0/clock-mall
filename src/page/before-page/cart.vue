<template>
  <div class="shopping-cart">
    <y-header>
      <div slot="nav" ></div>
    </y-header>
    <div class="store-content page-cart">
      <div class="gray-box">
        <div class="title">购物清单</div>
        <div v-if="tableData.length">
          <div class="ui-cart">
             <el-table :data="tableData" v-loading="dataListLoading"
              @selection-change="handleSelectionChange" >
                <el-table-column
                  type="selection"
                  width="55"
                  align="center">
                </el-table-column>
                <el-table-column prop="" label="商品图片" align="center">
                  <template slot-scope="scope">
                    <img :src="scope.row.goodsUrl" width="60" height="80"/>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名字" align="center">
                  <template slot-scope="scope">
                    {{scope.row.goodsName}}
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="单价" align="center">
                  <template slot-scope="scope">
                    {{scope.row.goodsPrice}}
                  </template>
                </el-table-column>
                <el-table-column prop="buyCounts" label="购买数量" align="center">
                  <template slot-scope="scope">
                    <el-input-number size="mini" :min=1 step-strictly  @change="handleChange($event,scope.row)"
                    v-model="scope.row.buyCounts"></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label='小计' align="center">
                  <template slot-scope="scope">
                    {{scope.row.goodsPrice*scope.row.buyCounts}}
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-close" size="mini" circle 
                    @click="delCart(scope.row,scope.$index);"></el-button>
                  </template>
                </el-table-column>
            </el-table>
          </div>
          <div class="cart-bottom-bg fix-bottom">
            <div class="fix-bottom-inner">
              <div class="cart-bar-operation">
                <div>
                  <!-- <div class="delete-choose-goods" @click="delChecked">删除选中的商品</div> -->
                </div>
              </div>
              <div class="shipping">
                <div class="shipping-box">
                  <div class="shipping-total shipping-num"><h4
                    class="highlight">已选择 <i v-text="checkNum"></i> 件商品</h4>
                    <h5>共计 <i v-text="totalNum"></i> 件商品</h5></div>
                  <div class="shipping-total shipping-price"><h4
                    class="highlight">应付总额：<span>￥</span><i v-text="totalPrice"></i>
                  </h4>
                  </div>
                </div>
                <y-button :classStyle="checkNum > 0 && submit?'main-btn':'disabled-btn'"
                          class="big-main-btn"
                          style="margin: 0;width: 130px;height: 50px;line-height: 50px;font-size: 16px"
                          :text="checkoutNow" @btnClick="checkout"></y-button>
              </div>
            </div>
          </div>
        </div>
        <div v-else style="padding:50px">
          <div class="cart-e">
          </div>
          <p style="text-align: center;padding: 20px;color: #8d8d8d">你的购物车空空如也</p>
          <div style="text-align: center">
            <router-link to="/before-goods">
              <y-button text="现在选购" style="width: 150px;height: 40px;line-height: 38px;color: #8d8d8d"></y-button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import YHeader from '../../common/header'
import { mapMutations, mapState } from 'vuex'
import YShelf from "../../components/shelf";
import YButton  from "../../components/yButton";
import BuyNum from '../../components/buynum'
import { getCartList,editCartInfo,delCartInfo } from "../../api/before-goods";
export default {
  components:{
    YHeader,YShelf,YButton,BuyNum
  },
  data(){
    return{
      tableData:[],
      dataListLoading:false,
      checkNum:0,//勾选的数量
      totalPrice:0,//选中的价格
      checkoutNow: '现在结算',
      submit: true,
      checkoutrtList:[],
    }
  },
  mounted(){
    this.dataListLoading = true;
    getCartList().then(res =>{
      if(res && res.code === 200){
        this.tableData = res.data;
      }else{
        this.$message.error(res.msg)
      }
      this.dataListLoading = false;
    }).catch(err=>{
      this.dataListLoading = false;
    })
  },
  computed:{
    ...mapState(
      ['cartList']
    ),
     // 计算总数量
    totalNum () {
      var totalNum = 0
      this.tableData && this.tableData.forEach(item => {
        totalNum += (item.buyCounts)
      })
      return Number(totalNum)
    },

  },
  methods:{
    handleChange(currentValue,row){
      // console.log('商品id',row);
      // const type = currentValue>oldValue?'add':'sub';
      editCartInfo(row.goodsId,{
        num:currentValue
      }).then(res =>{
        if(res && res.code === 200){
          console.log(res);
          
        }
      })
    },
    handleSelectionChange(val){
      this.checkoutrtList = val;
      this.checkNum = 0;
      this.totalPrice = 0;
      val && val.forEach(item => {
        this.checkNum += item.buyCounts;
        this.totalPrice += (item.buyCounts * item.goodsPrice)
      })
    },
    checkout () {
      this.checkoutNow = '结算中...'
      this.submit = false;
      
      this.$root.checkoutrtList = this.checkoutrtList;
      // this.$store.commit('cart/CHECKOUT_INFO',this.checkoutrtList)
      this.$router.push({path: '/before-checkout'})
    },
    delCart(row,index){
      const that = this;
      this.$confirm(`确定对「 ${row.goodsName} 」进行「 删除 」操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delCartInfo(row.goodsId).then(res=>{
          if(res && res.code === 200){
            that.$message.success(`删除商品 ${row.goodsName} 成功`);
            that.tableData.splice(index, 1);
            that.$router.replace({
              path:'/refresh'
            }) ;
          }else{
            that.$message.error(res.msg)
          }
        })
      }).catch(()=>{});
    },
    //删除选中的商品
    delChecked(){},
  }
}
</script>

<style lang='scss' scoped>
.store-content {
    clear: both;
    width: 1220px;
    min-height: 600px;
    padding: 0 0 25px;
    margin: 0 auto;
    .gray-box {
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
      }
    }
    .ui-cart {
      padding-bottom: 91px;
    }
  }

  .page-cart {
    padding-top: 40px;
    .fix-bottom {
      height: 90px;
      width: 100%;
      position: absolute;
      bottom: 0;
      z-index: 1;
      background-position: center;
      background: #fdfdfd;
      background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
      background: linear-gradient(#fdfdfd, #f9f9f9);
      border-top: 1px solid #e9e9e9;
      box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);
      .cart-bottom-bg {
        height: 80px;
        /*background: url(../img/store/library/cart-wrapper-bg_4c8003c76e.jpg) repeat-x;*/
        border-top: 1px solid #D9D9D9;
        border-radius: 0 0 8px 8px;
      }
    }
    .cart-bar-operation {
      float: left;
      padding: 35px 26px;
      font-size: 12px;
    }
    .blue-checkbox-new {
      float: left;
      margin-right: 9px;
    }
    .delete-choose-goods {
      position: relative;
      margin-left: 21px;
      color: #bbb;
    }
    .shipping {
      float: right;
      padding: 20px 30px;
      margin: 0;
      box-sizing: border-box;

    }
    .shipping-box {
      display: inline-block;
      padding-top: 1px;
      margin-right: 10px;
      padding: 0;
      margin: 0;
      box-sizing: border-box;

    }
    .shipping-total {
      display: inline-block;
      border-left: 1px solid #e1e1e1;
      padding: 0 20px;
      .shipping-price {
        width: 155px;
        padding-right: 0;
      }
      &.shipping-num i {
        width: 28px;
        display: inline-block;
        text-align: center;
      }
      h4 {
        color: #323232;
        > i {
          font-size: 18px;
          font-weight: 700;
        }
        i, span {
          color: #d44d44;
        }
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      h5 {
        color: #959595;
        > i {
          font-size: 16px;
          font-weight: 700;
        }
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

    }

    .shipping-total.shipping-num {
      text-align: right;
    }
    .shipping-total:first-child {
      border: none;
    }
    .big-main-btn {
      float: right;
      height: 48px;
    }
  }

  .cart-e {
    margin: 0 auto;
    background: url("/static/images/cart-empty_@2x.png") no-repeat;
    width: 275px;
    height: 300px;
    color: #8d8d8d;
  }
</style>
