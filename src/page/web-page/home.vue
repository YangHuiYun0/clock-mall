<template>
  <div>
    <h4 id="page-title">我的首页</h4>
    <el-card style="margin-bottom:10px">
      <div class="row">
        <el-row>
          <el-col :span="12" v-for="(item, index) in dataList" :key="index">
             <div class="data-item">
              <div class="icon-title"
                :class="`icon-title title${item.type}`">
                <i :class="{
                  'el-icon-user-solid':item.type === 1,
                  'el-icon-s-goods':item.type === 2,
                  'el-icon-shopping-cart-full':item.type === 3,
                  'el-icon-s-data':item.type === 4,
                }" ></i> 
              </div>
              <div class="value">
                <h1 class="count">{{item.dataNum}}</h1>
                <p>{{item.dataName}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <el-card>
      <div class="overview-layout">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="out-border">
              <div class="layout-title">商品总览</div>
              <div style="padding: 40px">
                <el-row>
                  <el-col :span="8" class="color-danger overview-item-value">{{dataInfo.saleGoodsCount}}</el-col>
                  <el-col :span="8" class="color-danger overview-item-value">{{dataInfo.unSaleGoodsCount}}</el-col>         
                  <el-col :span="8" class="color-danger overview-item-value">{{dataInfo.goodsCount}}</el-col>
                </el-row>
                <el-row class="font-medium">
                  <el-col :span="8" class="overview-item-title">已上架</el-col>
                  <el-col :span="8" class="overview-item-title">已下架</el-col>
                  <el-col :span="8" class="overview-item-title">全部商品</el-col>
                </el-row>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="out-border">
              <div class="layout-title">用户总览</div>
              <div style="padding: 40px">
                <el-row>
                  <el-col :span="8" class="color-danger overview-item-value">{{dataInfo.todayUserCount}}</el-col>
                  <el-col :span="8" class="color-danger overview-item-value">{{dataInfo.monthUserCount}}</el-col>
                  <el-col :span="8" class="color-danger overview-item-value">{{dataInfo.userCount}}</el-col>
                </el-row>
                <el-row class="font-medium">
                  <el-col :span="8" class="overview-item-title">今日新增</el-col>
                  <el-col :span="8" class="overview-item-title">本月新增</el-col>
                  <el-col :span="8" class="overview-item-title">会员总数</el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

  </div>
</template>

<script>
import { getHomeInfo } from "../../api/login";
export default {
  data(){
    return{
      dataList:[
        {type:1,dataNum:0,dataName:'用户总数'},
        {type:2,dataNum:0,dataName:'商品总数'},
        {type:3,dataNum:0,dataName:'订单总数'},
        {type:4,dataNum:0,dataName:'退款订单总数'},
      ],
      dataInfo:{},
    }
  },
  mounted(){
    this.getDataInfo();
  },
  methods:{
    getDataInfo(){
      const that = this;
      getHomeInfo().then(res => {
        if(res && res.code === 200){
          console.log(res);
          that.dataList[0].dataNum = res.data.userCount;
          that.dataList[1].dataNum = res.data.goodsCount;
          that.dataList[2].dataNum = res.data.orderCount;
          that.dataList[3].dataNum = res.data.cancelOrderCount;
          that.dataInfo = res.data;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .row{
    padding: -15px 0;
  }
  .data-item{
    margin: 0 15px 20px;
    border: 1px solid #f1f2f7;
    height: 101px;
    display: flex;
    .icon-title{
      background: #6ccac9;
      width: 35%;
      padding: 15px 15px;
      border-radius: 4px 0px 0px 4px;
      color: #fff;
      font-size: 54px;
      text-align: center;
    } 
    .title1{
      background: #6ccac9;
    }
    .title2{
      background: #ff6c60;
    }
    .title3{
      background: #f8d347;
    }
    .title4{
      background: #6ccac9;
    }
    .value{
      text-align: center;
      width: 63%;
      margin-top: 14px;
      .count{
        margin: 0;
        padding: 0;
        color: #c6cad6;
      }
      p{
        margin: 0;
        padding: 0;
        color: #c6cad6;
      }
    }
  }
  .overview-layout {
    margin-top: 20px;
  }
  .out-border {
    border: 1px solid #DCDFE6;
  }
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }
  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }
  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }
  .color-danger {
    color: #f56c6c;
  }
</style>>

