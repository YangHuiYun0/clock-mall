<template>
<!-- 会员列表 -->
  <div>
    <h4>会员列表</h4>
    <el-card style="margin-bottom:10px">
      <div class="el-card-title" style="margin-bottom:10px">搜索条件</div>
        <div class="search">
        <el-input v-model="name" style="width:200px" placeholder="请输入姓名"></el-input>
        <el-input v-model="phone" style="width:200px" placeholder="请输入手机号码"></el-input>
        <el-button type="info" style="text-align: right;"  @click="getDataList('init')" >查询</el-button>
      </div>
    </el-card>
     <el-card>
      <el-table :data="memberData" v-loading="dataListLoading" ref="eltable" border>
        <el-table-column label="序号"  type="index"  width="50" align="center">
        </el-table-column>
        <el-table-column label="会员姓名" align="center" prop="name" >
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="登录名" align="center" prop="loginName" >
          <template slot-scope="scope">
            {{scope.row.loginName}}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createTime" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" align="center">
          <template slot-scope="scope">
            {{scope.row.phone}}
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
import { getmemberList } from "../../../api/member-manage";
import { formatTime } from "../../../util/time";
export default {
  data(){
    return{
      name:'',
      phone:'',
      page:0,
      totalList:0,
      pageSize:12,
      memberData:[],
      dataListLoading:false,
    }
  },
  mounted(){
    this.getDataList('init');
  },
  methods:{
    formatTime(timestmap) {
      return formatTime(timestmap, 'YY-MM-DD hh:mm:ss');
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
      getmemberList({
        page:that.page,
        size:that.pageSize,
        name:that.name,
        phone:that.phone,
      }).then(res=>{
        if(res && res.code === 200){
          that.memberData = res.data.rows;
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
