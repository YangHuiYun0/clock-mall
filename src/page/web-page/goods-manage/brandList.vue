<template>
  <!-- 品牌管理列表 -->
  <div>
    <h4>品牌管理列表</h4>
    <el-card style="margin-bottom:10px">
      <div class="el-card-title" style="margin-bottom:10px">搜索条件</div>
      <div class="search">
        <el-input v-model="brandName" clearable placeholder="品牌名称/关键字" style="width: 250px;"></el-input>
        <el-button icon="el-icon-search" class="modify-btn search-btn"
                type="success"  @click="getDataList('init')">查询</el-button>
      </div>
    </el-card>
    <el-card>
      <div style="text-align:right">
        <!-- 新增品牌 -->
        <el-button  style="margin-bottom:15px" size="small"
                type="primary"  @click="addBrand()">增加品牌</el-button>
      </div>
      <el-table :data="brandData" v-loading="dataListLoading" ref="eltable" border>
        <el-table-column label="序号"  type="index"  width="50" align="center">
        </el-table-column>
        <el-table-column v-for="(item,index) in brandTable"
            :label="getDataLabel(item)"
            :key="index" :prop="item"
            align="center">
        </el-table-column>
         <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="addBrand(scope.row.id)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="delBrand(scope.row,scope.$index)">删除
            </el-button>
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
import { getBrandList,delBrandInfo } from "../../../api/goods-manage";
export default {
  data(){
    return{
      brandName:'',
      page:0,
      totalList:0,
      pageSize:5,
      brandData:[],
      brandTable:['id','brandName','brandType','brandLetter','createTime'],
      dataListLoading:false,
    }
  },
  mounted(){
    this.getDataList('init');
  },
  methods:{
    getDataLabel(type){
      const typeLabel = {
        id:'品牌id',
        brandName:'品牌名称',
        brandSort:'品牌排序',
        brandLetter:'品牌首字母',
        brandNum:'相关商品数量',
        createTime:'创建时间',
        brandType:'品牌归属类型'
      }
      return typeLabel[type] || '';
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
        brandName: that.brandName,
      }).then(res=>{
        if(res && res.code === 200){
          that.brandData = res.data.rows;
          that.totalList = res.data.total;
        }else{
          that.$message.error(res.msg);
        }
        that.dataListLoading = false;
      }).catch(err=>{
        that.dataListLoading = false;
      })
    },
    addBrand(id){
      this.$router.push({
        path: '/web-brandDetails',
        query:{id}
      });
    },
    delBrand(_row,index){
      const that = this;
      this.$confirm(`确定对「 ${_row.brandName} 」进行「 删除 」操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delBrandInfo(_row.id).then(res=>{
          if(res && res.code === 200){
            that.$message.success(`删除商品 ${_row.brandName} 成功`);
            that.brandData.splice(index, 1);
            that.totalList--;
          }else{
            that.$message.error(res.msg)
          }
        })
      }).catch(()=>{});
    },
    currentChangeHandle(val){
      this.page = val;
      this.getDataList();
    },
  }
}
</script>

<style>

</style>
