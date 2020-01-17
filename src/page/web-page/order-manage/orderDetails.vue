<template>
  <!-- 订单详情页 -->
  <div>
    <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
    <el-card>
       <div class="operate-container">
          <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
          <span class="color-danger">当前订单状态：{{formatStatus(order.status )}}</span>
       </div>
       <div style="margin-top: 20px">
          <i class="el-icon-s-opportunity"></i>
          <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">订单编号</el-col>
          <el-col :span="6" class="table-cell-title">快递单号</el-col>
          <el-col :span="6" class="table-cell-title">用户账号</el-col>
          <el-col :span="6" class="table-cell-title">订单状态</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.orderCode}}</el-col>
          <el-col :span="6" class="table-cell">暂无</el-col>
          <el-col :span="6" class="table-cell">{{order.buyUser}}</el-col>
          <el-col :span="6" class="table-cell">{{formatStatus(order.status )}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <i class="el-icon-user-solid"></i>
        <span class="font-small">收货人信息</span>
      </div>
       <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">收货人</el-col>
          <el-col :span="8" class="table-cell-title">手机号码</el-col>
          <el-col :span="8" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.receiverName}}</el-col>
          <el-col :span="8" class="table-cell">{{order.receiverPhone}}</el-col>
          <el-col :span="8" class="table-cell">{{order.receiverAddress}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <i class="el-icon-s-order"></i>
       <span class="font-small">商品信息</span>
      </div>
       <el-table
        ref="orderItemTable"
        :data="order.orderItemList"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.goodsUrl" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.goodsName}}</p>
            <p>品牌：{{scope.row.goodBrand}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.goodsPrice}}</p>
            <p>货号：{{scope.row.goodsCode}}</p>
          </template>
        </el-table-column>
        <el-table-column label="属性" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productAttr | formatProductAttr}}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.buyQuantity}}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.goodsPrice*scope.row.buyQuantity}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.totalAmount}}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      breadCrumbList: [{ title: '订单列表', path: '/web-orderList' }, { title: '订单详情' }],
      order: {},
    }
  },
  methods:{
    formatStatus(value) {
      if (value === 1) {
        return '待发货';
      } else if (value === 2) {
        return '已发货';
      } else if (value === 3) {
        return '已完成';
      } else if (value === 4) {
        return '已关闭';
      } else if (value === 5) {
        return '无效订单';
      } else {
        return '待付款';
      }
    },
  }
}
</script>

<style lang='scss'>
  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }
  .color-danger{
    color: #f56c6c;
  }
  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>
