<template>
  <div>
    <y-shelf title="订单列表" style="margin-bottom:0px">
    </y-shelf>
    <div class="table">
      <el-table :data="tableData" v-loading="dataListLoading">
        <!-- <el-table-column type="expand">
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
        </el-table-column> -->
        <el-table-column type="expand" >
          <template slot-scope="scope">
            <el-table :data="scope.row.goodsList">
              <el-table-column label="商品图片"  align="center" width="170">
                <template slot-scope="scope">
                  <img :src="scope.row.goodsUrl" width="80px"/>
                </template>
              </el-table-column>
              <el-table-column label="商品名称" align="center" prop="goodsName" >
                <template slot-scope="scope">
                  {{scope.row.goodsName}}
                </template>
              </el-table-column>
              <el-table-column label="价格" align="center" prop="goodsPrice" >
                <template slot-scope="scope">
                  {{scope.row.goodsPrice}}
                </template>
              </el-table-column>
              <el-table-column label="购买数量" align="center" prop="buyQuantity" >
                <template slot-scope="scope">
                  {{scope.row.buyQuantity}}
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" >
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center" prop="orderCode" >
          <template slot-scope="scope">
            {{scope.row.orderCode}}
          </template>
        </el-table-column>
         <el-table-column label="收货人姓名" align="center" prop="receiverName" >
          <template slot-scope="scope">
            {{scope.row.receiverName}}
          </template>
        </el-table-column>
         <el-table-column label="收货地址" align="center" prop="receiverAddress" >
          <template slot-scope="scope">
            {{scope.row.receiverAddress}}
          </template>
        </el-table-column>
         <el-table-column label="收货人电话" align="center" prop="receiverPhone" >
          <template slot-scope="scope">
            {{scope.row.receiverPhone}}
          </template>
        </el-table-column>
        <el-table-column label="实付总价" align="center" prop="orderAmount" >
          <template slot-scope="scope">
            {{scope.row.orderAmount}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="status" >
          <template slot-scope="scope">
            <el-tag
              :key="scope.row.id"
              class="el-tag el-tag--dark"
              :class="[{
                'el-tag--danger': scope.row.status === 0,
                'el-tag--success': scope.row.status === 1,
                'el-tag--info': scope.row.status === 2,
                'el-tag--warning': scope.row.status === 3,
                'el-tag--info': scope.row.status === 4,
              }]"
              effect="plain">
              {{ setOrderStatus(scope.row.status)}}
            </el-tag>
          </template>
        </el-table-column>
          <el-table-column label="操作" align="center" width="270">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="getOrder(scope.row,scope.$index)" v-if="scope.row.status<3">{{setBtnType(scope.row.status)}}</el-button>
              <el-button type="danger" size="mini" @click="delOrder(scope.row,scope.$index)" v-if="scope.row.status == 2 || scope.row.status==4">删除订单</el-button>
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
        <el-dialog
          title="填写退货原因"
          :visible.sync="dialogVisible"
          :before-close="beforeClose"
          width="50%">
          <el-form :model="refundMsg" ref="refundMsg"  label-width="120px">
             <el-form-item label="退货原因:" >
              <el-select v-model="refundMsg.causeId" placeholder="请选择退货原因" style="width:300px">
                <el-option
                  v-for="item in causeDataList"
                  :key="item.id"
                  :label="item.causeName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述:" prop="causeDesc">
                <el-input type="textarea" :autosize="{ minRows: 4}" v-model="refundMsg.causeDesc"
                    placeholder="请输入描述"  clearable maxlength=30 show-word-limit></el-input>
            </el-form-item>
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="formSubmit()" :loading="submitLoading">提 交</el-button>
          </el-form>          
        </el-dialog>
    </div>
  </div>
</template>

<script>
import YShelf from '../../../../components/shelf'
import YButton from "../../../../components/yButton";
import { getMyOrdersList,editOrderStatus,delOrderInfo } from "../../../../api/user";
import { getSaleCauseList,setRefundCause } from "../../../../api/order-manage";
export default {
  components:{
    YShelf,YButton
  },
  data(){
    return{
      page:0,
      totalList:0,
      pageSize:10,
      tableData:[],
      orderTable:['goodsName','goodsPrice','buyQuantity','status'],
      dataListLoading:false,
      dialogVisible:false,
      submitLoading:false,
      refundMsg:{},
      causeDataList:[],
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
        status:'订单状态'
      }
      return typeLabel[type] || '';
    },
    // 获取列表详情
    getDateList(){
      const that = this;
      getMyOrdersList({
        page:that.page,
        size:that.pageSize,
      }).then(res =>{
        if(res && res.code === 200){
          that.tableData = res.data.rows;
          that.totalList = res.data.total;
        }
      })

    },
    // 删除订单
    delOrder(row,index){
      const that = this;
      this.$confirm(`确定对该订单进行「 删除 」操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delOrderInfo(row.id).then(res=>{
          if(res && res.code === 200){
            that.$message.success(`删除订单成功`);
            that.getDateList('init');
          }else{
            that.$message.error(res.msg)
          }
        })
      }).catch(()=>{});
    },
    // 现在付款
    getOrder(row,index){
      if(row.status === 0){
        this.$message.success('已提交催单申请');
        return;
      }else if(row.status === 1){
        // 确认收货
        editOrderStatus(row.id,{
          status: 2
        }).then(res =>{
          if(res && res.code === 200){
            this.$message.success(res.msg);
            this.getDateList('init');
          }else{
            this.$message.error(res.msg)
          }
        })
      }else if (row.status === 2){
        this.dialogVisible = true;
        const that= this;
        this.refundMsg.id = row.id;
        getSaleCauseList({
          page:0,
          size:20,
        }).then(res =>{
          if(res && res.code === 200){
            that.causeDataList = res.data.rows;
          }else{
            that.$message.error(res.msg);
          }
        })
      }
    },

    formSubmit(){
      const that = this;
      that.submitLoading = true;
      setRefundCause(this.refundMsg.id,{
        causeId:this.refundMsg.causeId,
        causeDesc:this.refundMsg.causeDesc,
      }).then(res =>{
        if(res &&res.code === 200){
          that.$message.success('退货申请提交成功')
          that.getDateList('init');
        }else{
          that.$message.error(res.msg)
        }
        that.dialogVisible = false;
        that.submitLoading = false;
      }).catch(err=>{
        that.dialogVisible = false;
        that.submitLoading = false;
      })
    },
    beforeClose(){
      this.dialogVisible = false;
      this.refundMsg = {};
    },
    cancel(){
      this.dialogVisible = false;
      this.refundMsg = {};
    },
    currentChangeHandle(val){
      this.page = val;
      this.getDateList();
    },
    setOrderStatus(_status){
      switch (_status) {
        case 0:
          return '未发货'
          break;
        case 1:
          return '已发货'
          break;
        case 2:
          return '已完成'
          break;
        case 3:
          return '退款中'
          break;
        case 4:
          return '已退款'
          break;
        default:
          break;
      }
    },
    setBtnType(_status){
       switch (_status) {
        case 0:
          return '催单'
          break;
        case 1:
          return '确认收货'
          break;
        case 2:
          return '退货'
          break;
        default:
          break;
      }
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
