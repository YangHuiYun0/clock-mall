<template>
<!-- 退货详情 -->
  <div>
     <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
      <el-card>
        <span class="font-title-medium">退货商品</span>
        <el-table
          
          class="standard-margin"
          ref="productTable"
          :data="orderReturnApply.goodsList">
          <el-table-column label="商品图片"  align="center">
            <template slot-scope="scope">
              <img style="height:80px" :src="scope.row.goodsUrl">
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <span class="font-small">{{scope.row.goodsName}}</span><br>
              <span class="font-small">品牌：{{scope.row.brandName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <span class="font-small">价格：￥{{scope.row.goodsPrice}}</span><br>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="scope">{{scope.row.buyQuantity}}</template>
          </el-table-column>
          <el-table-column label="小计" align="center">
            <template slot-scope="scope">￥{{scope.row.goodsPrice*scope.row.buyQuantity}}</template>
          </el-table-column>
        </el-table>
        <div style="float:right;margin-top:15px;margin-bottom:15px">
          <span class="font-title-medium">合计：</span>
          <span class="font-title-medium color-danger">￥{{orderReturnApply.orderAmount}}</span>
        </div>
      </el-card>
      <el-card shadow="never" class="standard-margin">
        <span class="font-title-medium">服务单信息</span>
        <div class="form-container-border">
          <el-row>
            <el-col :span="6" class="form-border form-left-bg font-small">订单单号</el-col>
            <el-col class="form-border font-small" :span="18">{{orderReturnApply.orderCode}}</el-col>
          </el-row>
           <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">用户账号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.customerLoginName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系人</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.customerName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.customerPhone}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">退货原因</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.causeName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">问题描述</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.causeDesc}}</el-col>
        </el-row>
         <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">订单金额</el-col>
          <el-col class="form-border font-small" :span="18">￥{{orderReturnApply.orderAmount}}</el-col>
        </el-row>
         <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">收货人姓名</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.receiverName}}</el-col>
        </el-row>
         <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">详细地址</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.receiverAddress}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.receiverPhone}}</el-col>
        </el-row>
         <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">处理时间</el-col>
          <el-col class="form-border font-small" :span="18">{{formatTime(orderReturnApply.updateTime)}}</el-col>
        </el-row>
        </div>
        <div style="margin-top:15px;text-align: center">
          <el-button type="primary" size="small" @click="handleUpdateStatus()">确认退货</el-button>
        </div>
      </el-card>
  </div>
</template>

<script>
import { formatTime } from "../../../util/time";
import { getOrdersInfo } from "../../../api/order-manage";
import { editOrderStatus } from "../../../api/user";
export default {
  data(){
    return{
      breadCrumbList: [{ title: '退货列表', path: '/web-returnApply' }, { title: '退货详情' }],
      id:this.$route.query.id || null,
      productList: null,
      orderReturnApply:{},
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    getData(){
      const that = this;
      getOrdersInfo(this.id).then(res => {
        if(res && res.code === 200){
          that.orderReturnApply = res.data;
        }else{
          that.$message.error(res.msg)
        }
      })
    },
    formatTime(timestmap) {
      return formatTime(timestmap, 'YY-MM-DD hh:mm:ss');
    },
    handleUpdateStatus(){
      const that = this;
      editOrderStatus(this.id,{
          status: 4
        }).then(res =>{
          if(res && res.code === 200){
            that.$message.success(res.msg);
            this.$router.push({path: '/web-returnApply'})
          }else{
            that.$message.error(res.msg)
          }
        })
    },
  }
}
</script>

<style>
 .detail-container {
    position: absolute;
    left: 0;
    right: 0;
    width: 1080px;
    padding: 35px 35px 15px 35px;
    margin: 20px auto;
  }

  .standard-margin {
    margin-top: 15px;
  }
  .form-border {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
  }

  .form-container-border {
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
    margin-top: 15px;
  }

  .form-left-bg {
    background: #F2F6FC;
  }
</style>
