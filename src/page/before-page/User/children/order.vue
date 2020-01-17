<template>
  <div>
    <y-shelf title="订单列表" style="margin-bottom:0px">
    </y-shelf>
    <div class="table">
      <el-table :data="tableData" v-loading="dataListLoading">
        <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单号:">
              <span>{{ scope.row.orderCode }}</span>
            </el-form-item>
            <el-form-item label="时间:">
              <span>{{ scope.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="收件人姓名:">
              <span>{{ scope.row.receiverName }}</span>
            </el-form-item>
            <el-form-item label="收件人电话:">
              <span>{{ scope.row.receiverPhone }}</span>
            </el-form-item>
            <el-form-item label="收件地址:">
              <span>{{ scope.row.receiverAddress }}</span>
            </el-form-item>
          </el-form>
        </template>
        </el-table-column>
        <el-table-column
          label="排序"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column label="商品图片" prop="goodsUrl" align="center" width="170">
          <template slot-scope="scope">
            <img :src="scope.row.goodsUrl" width="80px"/>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in orderTable"
              :label="getDataLabel(item)"
              :key="index" :prop="item"
              align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" width="270">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="getOrder(scope.row,$index)">现在付款</el-button>
              <el-button type="danger" size="mini" @click="delOrder(scope.row,$index)">删除订单</el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page=page
          :total=totalList
          :page-size=pageSize
          @current-change="currentChangeHandle">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import YShelf from '../../../../components/shelf'
import YButton from "../../../../components/yButton";
export default {
  components:{
    YShelf,YButton
  },
  data(){
    return{
      page:0,
      totalList:0,
      pageSize:10,
      tableData:[{}],
      orderTable:['goodsName','goodsPrice','buyQuantity','stutas'],
      dataListLoading:false,
    }
  },
  mounted(){
    this.getDateList('init');
  },
  methods:{
    getDataLabel(type){
      const typeLabel = {
        goodsName:'商品名称',
        createTime:'时间',
        orderCode:'订单号',
        goodsPrice:'单价',
        buyQuantity:'数量',
        orderAmount:'实付金额',
        receiverName:'收件人姓名',
        receiverPhone:'收件人电话',
        receiverAddress:'收件地址',
        stutas:'订单状态'
      }
      return typeLabel[type] || '';
    },
    // 获取列表详情
    getDateList(){

    },
    // 删除订单
    delOrder(row,index){},
    // 现在付款
    getOrder(row,index){},
    currentChangeHandle(val){
      this.page = val;
      this.getDateList();
    },
  }
}
</script>

<style>
.table{
  border:1px solid #d4d4d4;
  border-radius: 8px 8px 0 0;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
