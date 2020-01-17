<template>
<!-- 退货详情 -->
  <div>
     <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
      <el-card>
        <span class="font-title-medium">退货商品</span>
        <el-table
          border
          class="standard-margin"
          ref="productTable"
          :data="productList">
          <el-table-column label="商品图片" width="160" align="center">
            <template slot-scope="scope">
              <img style="height:80px" :src="scope.row.goodsUrl">
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <span class="font-small">{{scope.row.goodsName}}</span><br>
              <span class="font-small">品牌：{{scope.row.productBrand}}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格/货号" width="180" align="center">
            <template slot-scope="scope">
              <span class="font-small">价格：￥{{scope.row.goodsPrice}}</span><br>
              <span class="font-small">货号：NO.{{scope.row.goodBrand}}</span>
            </template>
          </el-table-column>
          <el-table-column label="属性" width="180" align="center">
            <template slot-scope="scope">{{scope.row.productAttr}}</template>
          </el-table-column>
          <el-table-column label="数量" width="100" align="center">
            <template slot-scope="scope">{{scope.row.buyQuantity}}</template>
          </el-table-column>
          <el-table-column label="小计" width="100" align="center">
            <template slot-scope="scope">￥{{totalAmount}}</template>
          </el-table-column>
        </el-table>
        <div style="float:right;margin-top:15px;margin-bottom:15px">
          <span class="font-title-medium">合计：</span>
          <span class="font-title-medium color-danger">￥{{totalAmount}}</span>
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
            <el-col class="form-border form-left-bg font-small" :span="6">申请状态</el-col>
            <el-col class="form-border font-small" :span="18">{{formatStatus(orderReturnApply.status )}}</el-col>
          </el-row>
           <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">用户账号</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.buyUser}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系人</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.memberName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">联系电话</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.memberPhone}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">退货原因</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.causeName}}</el-col>
        </el-row>
        <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">问题描述</el-col>
          <el-col class="form-border font-small" :span="18">{{orderReturnApply.description}}</el-col>
        </el-row>
         <el-row>
          <el-col class="form-border form-left-bg font-small" :span="6">订单金额</el-col>
          <el-col class="form-border font-small" :span="18">￥{{totalAmount}}</el-col>
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
        <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===0">
          <el-button type="primary" size="small" @click="handleUpdateStatus(1)">确认退货</el-button>
          <el-button type="danger" size="small" @click="handleUpdateStatus(3)">拒绝退货</el-button>
        </div>
        <div style="margin-top:15px;text-align: center" v-show="orderReturnApply.status===1">
          <el-button type="primary" size="small" @click="handleUpdateStatus(2)">确认收货</el-button>
        </div>
      </el-card>
  </div>
</template>

<script>
import { formatTime } from "../../../util/time";
export default {
  data(){
    return{
      breadCrumbList: [{ title: '退货列表', path: '/web-returnApply' }, { title: '退货详情' }],
      productList: null,
      orderReturnApply:{
        id:'11111',
        status:0,
        memberUsername:'HDH',
        returnName:'虚修',
        returnPhone:'1436346',
        reason:'不想要',
        description:'难用',
        name:'到花覅哦豁',
        detailAddress:'厦门，嗯',
        phone:'534543'
      },
      totalAmount:'423432'
    }
  },
  methods:{
     formatTime(timestmap) {
      return formatTime(timestmap, 'YY-MM-DD hh:mm:ss');
    },
    formatStatus(status){
        if (status === 0) {
          return "待处理";
        } else if (status === 1) {
          return "退货中";
        } else if (status === 2) {
          return "已完成";
        } else {
          return "已拒绝";
        }
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
