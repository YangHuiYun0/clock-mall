<template>
<!-- 商品详情 -->
  <div>
    <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
    <el-card>
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="140px">
        <el-form-item label="商品名称:" prop="goodsName">
          <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" show-word-limit maxlength=12
                  style="width:800px"   clearable></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio v-model="dataForm.status" :label=1 >上架</el-radio>
          <el-radio v-model="dataForm.status" :label=0>下架</el-radio>
        </el-form-item>
        <el-form-item label="商品类别:" >
          <el-select v-model="dataForm.categoryCode" clearable placeholder="请选择商品类别" style="width:400px">
            <el-option
              v-for="item in goodsTypeList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.categoryCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属品牌:" >
          <el-select v-model="dataForm.brandId" clearable placeholder="请选择品牌类别" style="width:400px">
            <el-option
              v-for="item in brandTypeList"
              :key="item.id"
              :label="item.brandName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品属性:" prop="goodsAttr">
          <el-input v-model="dataForm.goodsAttr" placeholder="请输入商品属性" show-word-limit maxlength=12
                  style="width:800px"   clearable></el-input>
        </el-form-item>
        <el-form-item label="简介描述:" prop="goodsDesc">
          <el-input v-model="dataForm.goodsDesc" placeholder="请输入商品简介描述" show-word-limit maxlength=50
                  style="width:800px" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品展示价格:" prop="goodsPrice">
          <el-input v-model="dataForm.goodsPrice" placeholder="请输入正确的金额" show-word-limit maxlength=7
                  style="width:800px"   clearable></el-input><span class="tip">&nbsp;&nbsp;元</span>
        </el-form-item>
        <el-form-item label="库存数量:" prop="goodsInventory">
          <el-input v-model="dataForm.goodsInventory" placeholder="0 ~ 99999" show-word-limit maxlength=5
                  style="width:800px"   clearable></el-input><span class="tip">&nbsp;&nbsp;件</span>
        </el-form-item>
        <el-form-item label="限购数量" prop="goodsLimit">
          <el-input v-model="dataForm.goodsLimit" placeholder="0 ~ 99999" show-word-limit maxlength=5
                  style="width:800px"   clearable></el-input><span class="tip">&nbsp;&nbsp;件</span>
        </el-form-item>
        <el-form-item label="商品图片:" prop="goodsUrl">
           <el-upload
              action=""
              :file-list="stockFileList"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :before-upload="beforeUpload"
              :auto-upload="false">  
              <el-button size="small" type="primary">上传图片</el-button>
          </el-upload>
          <img v-if="dataForm.goodsUrl" :src="dataForm.goodsUrl" class="avatar">
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="submitForm" :loading="submitLoading">保存</el-button>
          <el-button type="warning" @click="cancelForm" :loading="submitLoading">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getImageUrl } from "@/api/home-set";
import { 
  addGoodsInfo,
  getGoodsInfo,
  editGoodsInfo,
  getCategoryInfo,
  getBrandList,
  getChildrenTypeInfo
 } from "../../../api/goods-manage";
export default {
  data(){
    const priceRequire = (rule, value, callback) => {
      if (!String(value).match(/^[0-9]\d*(\.[0-9]{1,2})*$/)) {
        callback(new Error('请输入最多保留 2 位小数的数值'));
      } else {
        callback();
      }
    }
    const goodsNumRequire = (rule, value, callback) => {
      if (!String(value).match(/^\+?[1-9]\d*$/)) {
        callback(new Error('请输入大于0的整数'));
      }else{
        callback();
      }
    }
    return{
      submitLoading:false,
      breadCrumbList: [{ title: '商品列表', path: '/web-goodsList' }, { title: '商品详情' }],
      stockFileList:[],
      dataForm:{
        id: this.$route.query.id || '',
        goodsName:'',
        status:1,
        goodsUrl:'',
        goodsDesc:'',
        goodsPrice:'',
        goodsLimit:'',
        categoryCode:'',
        goodsAttr:'',
      },
      goodsTypeList:[],
      brandTypeList:[],
      rules:{
        goodsName:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        categoryCode:[
          { required: true, message: '请选择商品类别', trigger: 'blur' },
        ],
        goodsAttr:[
          { required: true, message: '请输入商品属性', trigger: 'blur' },
        ],
        goodsDesc:[
          { required: true, message: '请输入商品简介描述', trigger: 'blur' },
        ],
        goodsPrice:[
          { required: true, message: '请输入商品售价', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: priceRequire }
        ],
        goodsInventory:[
          { required: true, message: '请输入商品库存量', trigger: 'blur' },
          { required: true, trigger: 'change', validator: goodsNumRequire }
        ],
        goodsLimit:[
          { required: true, message: '请输入商品限购数', trigger: 'blur' },
          { required: true, trigger: 'change', validator: goodsNumRequire }
        ],
        goodsUrl:[
          { required: true, message: '请选择商品图片', trigger: 'blur' },
        ],
      },
    }
  },
  mounted(){
    this.getInfo();
    this.getNodeTypeInfo();
    this.getBrandTypeInfo();
  },
  methods:{
    //获取商品详情
    getInfo(){
     
      if(this.dataForm.id){
        const that = this;
        getGoodsInfo(this.dataForm.id).then(res=>{
          if(res && res.code === 200){
            that.dataForm = res.data;
          }else{
            that.$message.error(res.msg)
          }
        }).catch(err=>{
          that.$message.error(err)
        })
      }
    },
    //保存-修改
    submitForm(){
      const that = this;
      that.$refs.dataForm.validate(valid => {
        if (!valid) {
          this.$message.error('请填写完整再保存');
          return false;
        }
        that.submitLoading = true;
        const submitFun = that.dataForm.id ? editGoodsInfo : addGoodsInfo;
        submitFun(that.dataForm.id,that.dataForm).then(res=>{
          console.log('res:',res);
          if(res && res.code === 200){
            that.$message.success(that.dataForm.id ? '修改成功' : '保存成功');
            that.$router.push({
              path: '/web-goodsList',
            })
          }else{
            that.$message.error(res.msg)
          }
          that.submitLoading = false;
        }).catch(err=>{
          that.$message.error(err)
          that.submitLoading = false;
        })
      });
    },
    getNodeTypeInfo(){
        var _nodeId = this.$route.query['typeId']
        const that = this;
        getChildrenTypeInfo(_nodeId).then(res=>{
          if(res && res.code === 200){
            that.goodsTypeList.push(res.data);
            that.dataForm.categoryCode = res.data.categoryCode;
          }
        })
      },

    getBrandTypeInfo(){
      const that = this;
      getBrandList({
        page:0,
        size:100,
      }).then(res=>{
        if(res && res.code === 200){
          that.brandTypeList = res.data.rows;
        }else{
          that.$message.error(res.msg);
        }
      })
    },
    //取消
    cancelForm(){
      this.$refs.dataForm.resetFields();
      this.$router.push({
        path: '/web-goodsList',
      });
    },

    handleChange(file, fileList) {
        console.log(file);
        const spl = file.name.split('.');
        var _fileSuffix = spl[spl.length - 1];
        if ( _fileSuffix !== 'png' &&  _fileSuffix !== 'jpg' ) {
            this.$message.error('文件格式不符，请上传png/jpg格式的文件');
            this.stockFileList = [];
            return false;
        }
        this.stockFileList = fileList.slice(-1);
        // 选择一个商品后 请求服务端  获取商品的数据  渲染列表
        const that = this;
        var uploadBody = new FormData();
        uploadBody.append('file',file.raw)
        that.dataListLoading = true;
        getImageUrl(uploadBody).then(res=>{
            if(res && res.code === 200){
                that.dataForm.goodsUrl =  res.data;
                that.stockFileList = [];  
            }else {
                that.$message.error(res.msg);
            }
            that.dataListLoading = false;
        }).catch(err=>{
            that.$message.error(err);
            that.dataListLoading = false;
        });
    },

    handleRemove(file, fileList) {
        this.stockFileList = fileList;
    },

    beforeUpload(file) {
        const spl = file.name.split('.');
        if (spl[spl.length - 1] !== 'png' && spl[spl.length - 1] !== 'jpeg' ) {
            this.$message.error('文件格式不符，请上传 png 格式的文件');
            this.stockFileList = [];
            return false;
        }
    },
  }
}
</script>

<style lang='scss' >
  .tip {
    color: #999999;
    font-size: 12px;
  }
  .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
   .tip {
    color: #999999;
    font-size: 12px;
  }
</style>
