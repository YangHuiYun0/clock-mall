<template>
<!-- 首页轮播图管理 -->
  <div>
    <h3 id="page-title">首页轮播图列表</h3>
    <el-card>
      <div style="margin-bottom:20px">
        <el-button  type="primary" class="el-icon-plus" size="small"
                  @click="addBanner()">增加轮播图</el-button><span class="tip">&nbsp;&nbsp;最多5条</span>
      </div>
      <el-table :data="bannerData" v-loading="dataListLoading" ref="eltable">
        <el-table-column label="序号"  type="index"  width="50" align="center">
        </el-table-column>
        <el-table-column label="轮播图名字" align="center" prop="bannerName" >
          <template slot-scope="scope">
            {{scope.row.bannerName}}
          </template>
        </el-table-column>
        <el-table-column label="轮播图" align="center" prop="bannerUrl" >
          <template slot-scope="scope">
            <img :src="scope.row.bannerUrl" alt="" style="width:50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" >
          <template slot-scope="scope">
            {{scope.row.sort}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" >
          <template slot-scope="scope">
             <el-tag
              :key="scope.row.id"
              class="el-tag el-tag--dark"
              :class="[{
                'el-tag--danger': scope.row.status === 0,
                'el-tag--success': scope.row.status === 1,
              }]"
              effect="plain">
              {{scope.row.status===1?'启用':'停用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope"> 
            <!--编辑 删除 -->
            <i class="el-icon-edit"  @click="addBanner(scope.row.id);"></i> 
            <i class="el-icon-delete" @click="delBanner(scope.row.id,scope.row.name,scope.$index);"></i>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { getBannerList, } from "../../../api/home-set";
export default {
  data(){
    return{
      breadCrumbList: [{ title: '首页轮播图列表'}],
      dataListLoading:false,
      bannerData:[{bannerName:'劳伦手表',bannerUrl:'',sort:'1',status:1}],
      parentName:'首页轮播图管理'
    }
  },
  mounted(){
    this.getInfo();
  },
  methods:{
    // 获取列表信息
    getInfo(){
      const that = this;
      this.dataListLoading = true;
      getBannerList({page:0,size:50}).then(res=>{
        if(res && res.code === 200){
          that.bannerData = res.data.rows;
        }else{
          that.$message.error(res.msg)
        }
        that.dataListLoading = false;
      }).catch(err=>{
        that.dataListLoading = false;
      })
    },
    // 增加、修改轮播图
    addBanner(id){
      this.$router.push({
        path: '/web-bannerDetails',
        query:{id,parentName:this.parentName}
      });
    },
    //删除轮播图
    delBanner(id,name,index){
      const that = this;
      this.$confirm(`确定对「 ${name} 」进行「 删除 」操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBanner(id).then(res=>{
          if(res && res.code === 200){
            that.$message.success(`删除轮播图 ${name} 成功`);
            that.bannerData.splice(index, 1);
          }else{
            that.$message.error(res.msg)
          }
        })
      }).catch(()=>{});
    },
  }
}

</script>
<style lang='scss' scoped>
  .tip {
    color: #999999;
    font-size: 12px;
  }
</style>