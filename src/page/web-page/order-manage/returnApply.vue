<template>
<!-- 退货申请处理 -->
  <div>
    <h4>退货申请列表</h4>
    <el-card style="margin-bottom:10px">
      <div style="margin-top: 15px">
        <el-input v-model="orderCode" class="input-width" placeholder="订单编号" style="width: 250px;"></el-input>
        <el-select v-model="status" placeholder="处理状态" clearable class="input-width">
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
        <el-table :data="applyData" v-loading="dataListLoading" ref="eltable" border>
          <el-table-column label="序号"  type="index"  width="50" align="center">
          </el-table-column>
            <el-table-column label="订单编号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.orderCode}}</template>
          </el-table-column>
          <el-table-column label="申请时间" width="180" align="center">
            <template slot-scope="scope">{{formatTime(scope.row.createTime)}}</template>
          </el-table-column>
          <el-table-column label="用户账号" align="center">
            <template slot-scope="scope">{{scope.row.buyUser}}</template>
          </el-table-column>
          <el-table-column label="退款金额" width="180" align="center">
            <template slot-scope="scope">￥{{scope.row | formatReturnAmount}}</template>
          </el-table-column>
          <el-table-column label="申请状态" width="180" align="center">
            <template slot-scope="scope">{{scope.row.status }}</template>
          </el-table-column>
          <el-table-column label="处理时间" width="180" align="center">
            <template slot-scope="scope">{{scope.row.updateTime }}</template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
              size="mini"
              @click="handleViewDetail(scope.$index, scope.row)">查看详情</el-button>
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
  </div>
</template>

<script>
import { formatTime } from "../../../util/time";
export default {
  data(){
    return{
      page:0,
      totalList:0,
      pageSize:12,
      orderCode:'',
      status:'',
      statusOptions:[
        { label: '待处理', value: 0},
        { label: '退货中', value: 1},
        { label: '已完成', value: 2},
        { label: '已拒绝', value: 3}
      ],
      dataListLoading:false,
      applyData:[{}],
    }
  },
  mounted(){
    // this.getDataList('init');
  },
  methods:{
    currentChangeHandle(val){
      this.page = val;
    },
    formatTime(timestmap) {
      return formatTime(timestmap, 'YY-MM-DD hh:mm:ss');
    },
    handleViewDetail(index,row){
      this.$router.push({path:'/web-returnApplyDetail',query:{id:row.id}})
    },
    getDataList(type){
      if(type === 'init'){
        this.page = 0;
      }
      this.dataListLoading = true;
      const that = this;
      getApplyList({
        page:that.page,
        size:that.pageSize,
        orderCode:that.orderCode,
        status:that.status,
      }).then(res=>{
        if(res && res.code === 200){
          that.applyData = res.data.rows;
          that.totalList = res.data.total;
        }else{
          that.$message.error(res.msg);
        }
        that.dataListLoading = false;
      }).catch(err=>{
        that.dataListLoading = false;
      })
    },
  }
}
</script>

<style>

</style>
