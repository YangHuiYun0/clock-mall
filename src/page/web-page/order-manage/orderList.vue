<template>
<!-- 订单列表 -->
  <div>
    <h4>订单列表</h4>
    <el-card style="margin-bottom:10px">
      <div class="el-card-title" style="margin-bottom:10px">搜索条件</div>
      <div class="search">
        <el-input v-model="orderCode" clearable placeholder="订单编号" style="width: 250px;"></el-input>
        <el-date-picker
          v-model="createTime"
          type="date"
          placeholder="选择订单创建日期">
        </el-date-picker>
        <el-select v-model="orderStatus" class="input-width" placeholder="全部" clearable>
          <el-option v-for="item in statusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
          </el-option>
        </el-select>
        <el-button icon="el-icon-search" class="modify-btn search-btn"
                type="success"  @click="getDataList('init')">查询</el-button>
      </div>
    </el-card>
    <el-card>
      <el-table :data="orderData" v-loading="dataListLoading" ref="eltable" border>
        <el-table-column label="序号"  type="index"  width="50" align="center">
        </el-table-column>
        <el-table-column label="订单编号" align="center" prop="orderCode" >
          <template slot-scope="scope">
            {{scope.row.orderCode}}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="购买用户" align="center" prop="buyUser" >
          <template slot-scope="scope">
            {{scope.row.buyUser}}
          </template>
        </el-table-column>
        <el-table-column label="订单金额" align="center" prop="orderAmount" >
          <template slot-scope="scope">
            ￥{{scope.row.orderAmount}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="status" >
          <template slot-scope="scope">
            {{formatStatus(scope.row.status)}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单</el-button>
            <el-button
              size="mini"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status===0">关闭订单</el-button>
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status===1">填写发货信息</el-button>
            <el-button
              size="mini"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status===2||scope.row.status===3">订单跟踪</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status===4">删除订单</el-button>
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
    </el-card>
    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      width="50%">
        <el-form :model="listItem" ref="listItem"  label-width="150px" :rules="rules">
          <el-form-item label="订单编号:">
            {{listItem.orderCode}}
          </el-form-item>
          <el-form-item label="收货人:">
            {{listItem.receiverName}}
          </el-form-item>
          <el-form-item label="手机号码:">
            {{listItem.receiverPhone}}
          </el-form-item>
          <el-form-item label="地址:">
            {{listItem.receiverAddress}}
          </el-form-item>
          <el-form-item label="快递单号:" prop="deliverySn">
            <el-input v-model="listItem.deliverySn" placeholder="快递单号" show-word-limit maxlength=25
                        clearable></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button v-if="listItem.deliverySn" type="primary" @click="formSubmit()">提 交</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatTime } from "../../../util/time";
export default {
  data(){
    const deliverySnRequire = (rule, value, callback) => {
      if (!String(this.listItem.deliverySn).match(/^[0-9a-zA-Z]*$/g)) {
        callback(new Error('快递单号只能由字母与数字组成'));
      } else {
        callback();
      }
    };
    return{
      orderCode:'',
      createTime:'',
      orderStatus:'',
      page:0,
      totalList:0,
      pageSize:12,
      dialogVisible:false,
      statusOptions: [
        { label: '待付款', value: 0},
        { label: '待发货', value: 1},
        { label: '已发货', value: 2},
        { label: '已完成', value: 3},
        { label: '已关闭', value: 4}
      ],
      dataListLoading:false,
      orderData:[{status:1}],
      listItem:[],
      rules:{
        deliverySn:[
          {required: true, message: '请输入快递单号', trigger: 'blur'},
          {required: true, trigger: 'blur', validator: deliverySnRequire}
        ]
      }
    }
  },
  mounted(){
    // this.getDataList('init');
  },
  methods:{
    formatTime(timestmap) {
      return formatTime(timestmap, 'YY-MM-DD hh:mm:ss');
    },
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
    currentChangeHandle(val){
      this.page = val;
    },
    getDataList(type){
      if(type === 'init'){
        this.page = 0;
      }
      this.dataListLoading = true;
      const that = this;
      getBrandList({
        page:that.page,
        size:that.pageSize,
        orderCode:that.orderCode,
        createTime:that.createTime,
        orderStatus:that.orderStatus,
      }).then(res=>{
        if(res && res.code === 200){
          that.orderData = res.data.rows;
          that.totalList = res.data.total;
        }else{
          that.$message.error(res.msg);
        }
        that.dataListLoading = false;
      }).catch(err=>{
        that.dataListLoading = false;
      })
    },
    // 查看订单
    handleViewOrder(index, row){
      this.$router.push({path:'/web-orderDetails',query:{id:row.id}})
    },
    // 订单发货
    handleDeliveryOrder(index, row){
      this.listItem = this.covertOrder(row);
      this.dialogVisible = true;
    },
    // 删除订单
    handleDeleteOrder(index, row){
      const that = this;
      this.$confirm(`确定对「 ${_row.name} 」进行「 删除 」操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoods(id).then(res=>{
          if(res && res.code === 200){
            that.$message.success(`删除商品 ${_row.name} 成功`);
            that.goodsData.splice(index, 1);
            that.totalList--;
          }else{
            that.$message.error(res.msg)
          }
        })
      }).catch(()=>{});
    },
    // 拼接发货信息列表
     covertOrder(order){
         let listItem={
          orderId:order.id,
          orderSn:order.orderSn,
          receiverName:order.receiverName,
          receiverPhone:order.receiverPhone,
          receiverAddress:order.receiverAddress,
          deliverySn:null
        };
        return listItem;
      },
    handleClose() {
      this.cancel();
    },
    cancel() {
      this.submitLoading = false;
      this.dataListLoading = false;
    },
    formSubmit(){
      const that = this;
      this.$refs.listItem.validate(valid => {
        if (!valid) {
          this.$message.error('请填写完整再保存');
          return false;
        }
        that.submitLoading = true;
        submitFun(that.listItem).then(res =>{
          if(res && res.code === 200){
            that.$message.success('商品发货成功');
            that.dialogVisible = false;
            that.getDataList();
          }else{
             that.$message.error(res.msg);
          }
          that.submitLoading = false;
        })
      },() => {
        that.submitLoading = false;
      });
    },
  },
}
</script>

<style>

</style>
