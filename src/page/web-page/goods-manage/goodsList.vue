<template>
  <!-- 商品列表 -->
  <div>
     <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
      <el-row style="width: 100%">
        <el-col :span="4" class="aside">
          <div v-loading="isLoading" class="comp-tree">
		        <el-button class="comp-tr-top"
              type="primary"
              size="small"
              @click="handleAddTop">添加商品大类</el-button>
            <el-tree ref="SlotTree"
              :data="setTree"
              :props="defaultProps"
              :expand-on-click-node="false"
              highlight-current
              :node-key="NODE_KEY"
              :accordion='true'>
                <div class="comp-tr-node" slot-scope="{ node, data }">
                  <template>
                    <!-- 名称-->
                    <span class="comp-tr-node--name" @click="handleNode(node,data)">
                      {{ data.categoryName }}
                    </span>
                    <span class="comp-tr-node--btns">
                      <!-- 新增 -->
                      <!-- <el-button icon="el-icon-plus" size="mini" circle type="primary" @click="handleAdd(node, data)" v-if="!data.categoryPcode"></el-button> -->
                      <el-button icon="el-icon-edit" size="mini" circle type="info"  @click="handleEdit(node, data)"></el-button>
                      <el-button icon="el-icon-delete" size="mini" circle type="danger" @click="handleDelete(node, data)"></el-button>
                    </span>
                  </template>
                </div>
              </el-tree>
          </div>
        </el-col>
        <el-col :span="20" style="padding:10px">
          <el-card>
                <el-input v-model="name" style="width:300px" placeholder="请输入商品名称"></el-input>
                <el-button type="success" class="el-icon-search" style="text-align: right;" @click="getInfoList()">查询</el-button>
          </el-card>
          <el-card>
            <div style="margin-bottom:20px;text-align: right">
              <el-button  type="primary" class="el-icon-plus" size="small"
                        @click="addGoods(handleNodeCode)" v-if="handleNodeCode">增加商品</el-button>
            </div>
            <el-table :data="goodsData" v-loading="dataListLoading" ref="eltable" border>
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="描述：">
                      <span>{{ scope.row.goodsDesc }}</span>
                    </el-form-item>
                    <el-form-item label="创建时间：">
                      <span>{{ scope.row.createTime }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column label="序号"  type="index"  width="50" align="center">
              </el-table-column>
              <el-table-column label="商品图片" align="center" prop="goodsUrl" >
                <template slot-scope="scope">
                  <img :src="scope.row.goodsUrl" alt="" style="width:50px;height: 50px;">
                </template>
              </el-table-column>
              <el-table-column v-for="(item,index) in goodsTable"
                  :label="getDataLabel(item)"
                  :key="item" :prop="item"
                  align="center">
              </el-table-column>
              <el-table-column label="商品库存" prop="goodsInventory" align="center">
                <template slot-scope="scope">
                  <span :style="{'color':scope.row.goodsInventory < 5?'red':''}"> {{scope.row.goodsInventory}}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="status" align="center">
                <template slot-scope="scope">
                  {{scope.row.status === 1 ? '上架':'下架'}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                  <!--编辑 删除 -->
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit"  @click="addGoods(scope.row.categoryCode,scope.row.id);"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete" @click="delHandle(scope.row,scope.$index);"></i>
                  </el-tooltip>
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
        </el-col>
      </el-row>
      <el-dialog
        title="新增类别"
        :visible.sync="dialogVisible"
        :modal-append-to-body='false'
        width="30%"
        :before-close="handleClose">
        <el-form :model="nodeForm" ref="nodeForm" :rules="rules" >
          <el-form-item label="名称" prop="categoryName" >
            <el-input v-model="nodeForm.categoryName" placeholder="请输入类别名称" show-word-limit maxlength=6
                      clearable style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="categoryDesc" >
            <el-input type="textarea" :rows="3" v-model="nodeForm.categoryDesc" placeholder="请输入类别简介"
            show-word-limit maxlength=200 clearable style="width:300px"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNodeCateGory" :loading="submitLoading">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import {
  getCategoryList,
  addCategoryInfo,
  getCategoryInfo,
  delCategoryInfo,
  updateBrandInfo,
  updateCategoryInfo,
  getGoodsList,
  delGoodsInfo,
 } from "../../../api/goods-manage";
export default {
  data(){
    return{
      submitLoading:false,
      breadCrumbList: [{ title: '商品列表'}],
      isLoading: false,// 是否加载
      dialogVisible:false,
      nodeForm:{
        categoryName:'',
        categoryDesc:'',
      },
      setTree:[],
      defaultProps: {// 默认设置
				children: 'children',
				label: 'name'
      },
      NODE_KEY: 'categoryCode',// id对应字段
			MAX_LEVEL: 1,// 设定最大层级
      NODE_ID_START: 0,// 新增节点id，逐次递减
      handleNodeId:'',
      handleNodeCode:'',

      //商品列表
      goodsData:[],
      dataListLoading:false,
      goodsTable:['categoryName','goodsName','brandName','goodsPrice'],
      name:'',
      page:0,
      totalList:0,
      pageSize:5,
      rules:{
        categoryName:[
          { required: true, message: '请输入节点名称', trigger: 'blur' },
        ],
        categoryDesc:[
          { required: true, message: '请输入节点简介', trigger: 'blur' },
        ],
      },
    }
  },
  mounted(){
    this.getTreeInfo();
    this.getInfoList('init');
  },
  methods:{
    getDataLabel(type){
      const typeLabel = {
        brandName:'商品品牌',
        goodsUrl:'商品图片',
        goodsCode:'商品编号',
        categoryName:'商品类别',
        goodsName:'商品名称',
        goodsDesc:'描述',
        goodsPrice:'单价',
        createTime:'创建日期',
        updateTime:'更新日期',
        status:'发布状态',
        goodsInventory:'商品库存'
      }
      return typeLabel[type] || '';
    },
    getInfoList(type){
      if(type === 'init'){
        this.page = 0;
      }
      const that = this;
      var id = '';//所点击的节点的id
      that.dataListLoading = true;
      getGoodsList({
        page:that.page,
        size:that.pageSize,
        supplierId: that.supplier,
        goodsName:that.name,
        categoryCode: that.handleNodeCode,
      }).then(res=>{
        if(res && res.code === 200){
          that.goodsData = res.data.rows;
          that.totalList = res.data.total;
        }else{
          that.$message.error(res.msg);
        }
        that.dataListLoading = false;
      }).catch(err=>{
        that.dataListLoading = false;
      })
    },
    getTreeInfo(){
      const that = this;
      getCategoryList().then(res=>{
        if(res && res.code === 200){
          that.setTree = res.data;
        }
      }).catch()
    },
    handleDelete(_node, _data){// 删除节点
			console.log(_node, _data)
			// 判断是否存在子节点
			if(_data.children && _data.children.length !== 0){
				this.$message.error("此节点有子级，不可删除！")
				return false;
			}else{
        // 删除操作
        const that = this;
				// 二次确认
				let ConfirmFun = () => {
					this.$confirm("是否删除此节点？","提示",{
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						delCategoryInfo(_data.id).then(res=>{
              console.log('删除',res);
              if(res && res.code === 200){
                that.$nextTick(() => {
                  if(that.$refs.SlotTree){
                    that.$refs.SlotTree.remove(_data)
                    that.$message.success("删除成功！")
                  }
                })
              }else{
                that.$message.error("删除失败！")
              }
            }).catch()
					}).catch(() => {})
				}

				// 判断是否新增： 新增节点直接删除，已存在的节点要二次确认
				_data[this.NODE_KEY] < this.NODE_ID_START ? DeletOprate() : ConfirmFun()
			}
		},
		handleInput(_node, _data){// 修改节点
			console.log(_node, _data)
			// 退出编辑状态
			if(_node.isEdit){
				this.$set(_node, 'isEdit', false)
			}
		},
    handleEdit(_node, _data){// 编辑节点
      console.log(_node, _data)
      this.dialogVisible = true;
      this.nowEditNodeData = _data;
      this.nowAddPNode = _node;
      const that = this;
      getCategoryInfo(_data.id).then(res=>{
        console.log('编辑的节点',res);
        that.nodeForm = res.data;
      }).catch(err=>{
        that.$message.error(res.msg)
      })
		},
    handleAdd(_node, _data){// 新增节点
      this.closeNodeInfo();
    	// 判断层级
      if(_node.level >= this.MAX_LEVEL){
          this.$message.warning("当前已达到"+ this.MAX_LEVEL + "级，无法新增！")
          return false;
        }
      this.dialogVisible = true;
      console.log("父节点的ID",_data[this.NODE_KEY]);
      this.nodeForm.categoryPcode = _data[this.NODE_KEY];
      this.nowAddPNodeData = _data;
		},
    handleAddTop(){// 添加顶部节点
      this.closeNodeInfo();
      this.dialogVisible = true;
    },
    // 点击类别节点
    handleNode(_node, _data){
      this.handleNodeId = _data.id;
      this.handleNodeCode = _data.categoryCode;
      this.getInfoList('init');//根据点击的类别 查询列表
    },
    //清空弹窗的表单数据
    closeNodeInfo(){
      this.nodeForm.categoryName = '';
      this.nodeForm.categoryDesc = '';
      this.nodeForm.categoryCode = null;
      this.nodeForm.categoryPcode = null;
    },
    // 弹窗增加节点
    addNodeCateGory(){
      const that = this;
      that.$refs.nodeForm.validate(valid => {
        if (!valid) {
          this.$message.error('请填写完整再保存');
          return false;
        }
        that.submitLoading = true;
        if(that.nodeForm.id){
          updateCategoryInfo(that.nodeForm.id,that.nodeForm).then(res=>{
            if(res && res.code === 200){
              that.$message.success('修改商品类别成功');
            }
            that.getTreeInfo();
            that.submitLoading = false;
            that.dialogVisible = false;
          }).catch()
        }else{
          addCategoryInfo(that.nodeForm).then(res=>{
            console.log('新增的节点',res);
            if(res && res.code === 200){
              // 为新增节点赋id
              that.$message.success('新增商品类别成功');
              that.nodeForm.categoryCode = res.data; //子节点
              if(that.nodeForm.categoryPcode){
                if(!that.nowAddPNodeData.children){
                  this.$set(that.nowAddPNodeData, 'children', []); //如果这个节点没有子节点  就给他增加空的子节点数组
                }
                that.nowAddPNodeData.children.push({
                  categoryCode:res.data,
                  categoryPcode:that.nodeForm.categoryPcode,
                  categoryName:that.nodeForm.categoryName,
                })
              }else{
                that.setTree.push({
                  categoryName: that.nodeForm.categoryName,
                  categoryCode:res.data,
                  children: [],
                })
              }
              that.getTreeInfo();
            }
            if(!that.nowAddPNode.expanded){
              that.nowAddPNode.expanded = true
            }
            that.submitLoading = false;
            that.dialogVisible = false;
            that.getTreeInfo();
          }).catch(err=>{
            that.submitLoading = false;
            that.dialogVisible = false;
          })
        }

      });
    },
    // 增加商品
    addGoods(typeId,id){
      this.$router.push({
        path: '/web-goodsDetails',
        query:{id,typeId}
      });
    },
    delHandle(_row,index){
      const that = this;
      this.$confirm(`确定对「 ${_row.goodsName} 」进行「 删除 」操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsInfo(_row.id).then(res=>{
          if(res && res.code === 200){
            that.$message.success(`删除商品 ${_row.goodsName} 成功`);
            that.goodsData.splice(index, 1);
            that.totalList--;
          }else{
            that.$message.error(res.msg)
          }
        })
      }).catch(()=>{});
    },

    currentChangeHandle(val){
      this.page = val;
      this.getInfoList();
    },
    // 关闭节点弹窗
    handleClose(done) {
      this.dialogVisible = false
    },
  },
}
</script>

<style lang='scss'>
 .aside{
    border-right: 1px solid #e6e9f0;
    height: 820px;
    background-color: #FAFAFA;
  }
  .el-tree{
    background-color:transparent;
  }
	.show-btns{
		opacity: 1;
	}
	.comp-tree{
		width: 100%;
		max-width: 300px;
		max-height: 80vh;
		// overflow: auto;
		// 顶部按钮
		.comp-tr-top{
			width: 100px;
			margin-bottom: 2em;
		}
		// 自定义节点
		.comp-tr-node{
			.comp-tr-node--name{
				display: inline-block;
				line-height: 40px;
				min-height: 40px;
			}
			.comp-tr-node--btns{
				margin-left: 10px;
				opacity: 0;
				transition: opacity .1s;
				.el-button{
					transform: scale(0.8);// 缩小按钮
					& + .el-button{
						margin-left: -1px;
					}
				}
			}
		}
		// 悬浮显示按钮
		.el-tree-node__content{
			&:hover{
				.comp-tr-node--btns{
					@extend .show-btns;
				}
			}
		}
	}
  .el-tree-node__content{width: 6em;}

  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    // background-color: #f0f7ff;
    width: 6em;
     }

</style>
