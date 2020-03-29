<template>
  <div>
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w" style="padding-top: 40px;">
      <y-shelf title="收货信息" style="margin-bottom:0px">
        <div slot="content">
          <ul class="address-item-list clearfix">
            <li v-for="(item,i) in addList"
                :key="i"
                class="address pr"
                :class="{checked:id === item.id}"
                @click="chooseAddress(item.id, item.receiverName, item.receiverPhone, item.receiverAddress)">
           <span v-if="id === item.id" class="pa">
             <svg viewBox="0 0 1473 1024" width="17.34375" height="12">
             <path
               d="M1388.020 57.589c-15.543-15.787-37.146-25.569-61.033-25.569s-45.491 9.782-61.023 25.558l-716.054 723.618-370.578-374.571c-15.551-15.769-37.151-25.537-61.033-25.537s-45.482 9.768-61.024 25.527c-15.661 15.865-25.327 37.661-25.327 61.715 0 24.053 9.667 45.849 25.327 61.715l431.659 436.343c15.523 15.814 37.124 25.615 61.014 25.615s45.491-9.802 61.001-25.602l777.069-785.403c15.624-15.868 25.271-37.66 25.271-61.705s-9.647-45.837-25.282-61.717M1388.020 57.589z"
               fill="#6A8FE5" p-id="1025">
               </path>
             </svg>
             </span>
              <p>收货人: {{item.receiverName}} {{item.isDefault ? '(默认地址)' : ''}}</p>
              <p class="street-name ellipsis">收货地址: {{item.receiverAddress}}</p>
              <p>手机号码: {{item.receiverPhone}}</p>
            </li>
          </ul>
        </div>
      </y-shelf>
      <y-shelf title="订单列表" style="margin-bottom:0px;margin-top:10px;">
      </y-shelf>
       <div class="table">
          <el-table :data="cartList" v-loading="dataListLoading">
            <el-table-column label="商品图片" prop="goodsUrl" align="center" width="170">
              <template slot-scope="scope">
                <img :src="scope.row.goodsUrl" width="80px"/>
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
                {{scope.row.buyCounts}}
                <!-- <el-input-number size="mini" :min=1 step-strictly
                v-model="scope.row.buyCounts"></el-input-number> -->
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label='小计' align="center">
              <template slot-scope="scope">
                {{scope.row.goodsPrice*scope.row.buyCounts}}
              </template>
            </el-table-column>
          </el-table>
       </div>
      <div class="cart-bottom-bg fix-bottom">
        <div class="fix-bottom-inner">
          <div class="shipping">
            <div class="shipping-box" style="padding: 0 40px;">
              <div class="shipping-total shipping-price"><h4
                class="highlight">应付总额：<em>￥{{checkPrice}}</em>
              </h4>
              </div>
            </div>
            <y-button class="big-main-btn"
                      :classStyle="submit?'disabled-btn':'main-btn'"
                      style="margin: 0;width: 130px;height: 50px;line-height: 50px;font-size: 16px"
                      :text="submitOrder"
                      @btnClick="_submitOrder">
            </y-button>
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
import { getAddressList,submitOrdersInfo,submitPayInfo} from "../../api/user";
export default {
  components:{
    YHeader,YShelf,YButton
  },
  data(){
    return{
      addList:[],
      receiverAddress:'',
      receiverPhone:'',
      id:'',
      receiverName:'',
      // 订单列表
      cartList:[],
      submitOrder: '去支付',
      orderTotal: 0,
      submit: false,
      dataListLoading:false,
    }
  },
  computed: {
    btnHighlight () {
      let msg = this.msg
      return msg.userName && msg.tel && msg.streetName
    },
      // 选中的总价格
    checkPrice () {
      let totalPrice = 0
      this.cartList && this.cartList.forEach(item => {
        totalPrice += (item.goodsPrice * item.buyCounts)
      })
      this.orderTotal = totalPrice
      return totalPrice
    },
  },

  mounted(){
    this.cartList =this.$root.checkoutrtList;
    // console.log('checkoutList',checkoutList);
    this.getAddressInfo();
    // this.getSettleGoodsInfo();
  },
  methods:{
    getAddressInfo(){
      const that = this;
      getAddressList().then(res=>{
        if(res&& res.code === 200){
          that.addList = res.data;
          that.id = res.data[0].id;
        }
      },()=>{})
    },
    getSettleGoodsInfo(){
      this.dataListLoading = true;
      getOrdersList().then(res =>{
        if(res && res.code === 200){
          that.cartList = res.body;
        }
        this.dataListLoading = false;
      },err =>{
        this.dataListLoading = false;
      })
    },
    // 选择地址
    chooseAddress (id, receiverName, receiverPhone, receiverAddress) {
      this.id = id
      this.receiverName = receiverName
      this.receiverPhone = receiverPhone
      this.receiverAddress = receiverAddress
    },
    //新增地址  跳到地址页
    updateAddress(){
      this.$router.push({path: '/user/before-addressList'})
    },

    //获取订单列表具体信息
    getOrdersInfo(){
      let itemIds = '';
      this.cartList.forEach(item => {
        console.log("数据",item);
        itemIds = itemIds+item.goodsId+'-'+item.buyCounts+','
      });
      return itemIds
    },
    _submitOrder () {
      this.submitOrder = '支付中...'
      this.submit = true
      var array = []
      if (!this.id) {
        this.$message.error('请选择收货地址')
        this.submitOrder = '去支付'
        this.submit = false
        return
      }
      if (this.cartList.length === 0) {
        this.$message.error('非法操作')
        this.submitOrder = '去支付'
        this.submit = false
        return
      }
      let itemIds = this.getOrdersInfo();
      let params = {
        addressId: this.id,
        itemIds: itemIds
      }

      // 跳转支付
      submitPayInfo(params).then(res => {
        console.log('支付信息',res)
        const div = document.createElement('div');
        div.innerHTML = res;
        document.body.appendChild(div);
        document.forms[0].submit();
      })
      // 去支付 
      // submitOrdersInfo(params).then(res => {
      //   if (res && res.code === 200) {
      //     this.$message.success('购买成功');
      //     this.$router.push({path: '/user/before-orderList'})
      //   } else {
      //     this.$message.error(res.message)
      //     this.submitOrder = '去支付'
      //     this.submit = false
      //   }
      // })
    },
  }
}
</script>

<style lang='scss' scoped>
 .w {
    width: 1340px;
    margin: 0 auto;
  }
 // 收货地址
  .address-item-list {
    padding: 30px 13px 0;
    .address {
      padding: 19px 14px 0 19px;
      p {
        line-height: 26px;
      }
    }
    li.checked {
      border-color: #6A8FE5;
      position: relative;
      background: #fff;
      .pa {
        right: 15px;
        top: 18px;
      }
      &:hover {
        background: #fff;
      }
    }
    li {
      position: relative;
      overflow: hidden;
      float: left;
      width: 276px;
      height: 158px;
      margin: 0 0 30px 16px;
      border: 1px solid #E5E5E5;
      border-radius: 3px;
      background: #FAFAFA;
      line-height: 14px;
      text-align: left;
      word-wrap: break-word;
      word-break: normal;
      color: #626262;
      cursor: pointer;
      -moz-user-select: -moz-none;
      -webkit-user-select: none;
      -o-user-select: none;
      user-select: none;
      &:hover {
        background: #F2F2F2;
        .operation-section {
          visibility: visible;
          transform: translate(0, 0);
        }
      }
      &.add-address-item {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        p {
          margin-top: 5px;
        }
      }
      .operation-section {
        visibility: hidden;
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 28px;
        background: #E1E1E1;
        border-top: 1px solid #E1E1E1;
        transition: all .2s ease;
        transform: translate(0, 29px);
        border-top: 1px solid #E1E1E1;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 11;
        span {
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          &:hover {
            background: #F2F2F2;
          }
        }

        span + span {
          border-left: 1px solid #E1E1E1;
        }

      }
    }
  }
  .table{
    border:1px solid #d4d4d4;
    border-radius: 8px 8px 0 0;
  }
   .fix-bottom {
    height: 90px;
    width: 100%;
    z-index: 1;
    background-position: center;
    background: #fdfdfd;
    background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
    background: linear-gradient(#fdfdfd, #f9f9f9);
    border-top: 1px solid #e9e9e9;
    box-shadow: 0 -3px 8px rgba(0, 0, 0, .04);
    border: 1px solid #d4d4d4;
    .cart-bottom-bg {
      height: 80px;
      border-top: 1px solid #D9D9D9;
      border-radius: 0 0 8px 8px;
    }
    .fix-bottom-inner {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .shipping {
      display: flex;
      align-items: center;
      margin-right: 50px;
    }
    em {
      display: inline-block;
      position: relative;
      top: 3px;
      margin-top: -4px;
      font-size: 24px;
      color: #d44d44;
      font-weight: 700;
    }
  }
</style>
