<template>
<!-- 商品详情 -->
  <div>
    <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
    <el-card>
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="140px">
        <el-form-item label="商品名称:" prop="goodsName">
          <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称" show-word-limit maxlength=12
                  style="width:1000px"   clearable></el-input>
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
        <el-form-item label="商品属性:" prop="goodsAttr">
          <el-input v-model="dataForm.goodsAttr" placeholder="请输入商品属性" show-word-limit maxlength=12
                  style="width:1000px"   clearable></el-input>
        </el-form-item>
        <el-form-item label="简介描述:" prop="goodsDesc">
          <el-input v-model="dataForm.goodsDesc" placeholder="请输入商品简介描述" show-word-limit maxlength=50
                  style="width:1000px" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品展示价格:" prop="goodsPrice">
          <el-input v-model="dataForm.goodsPrice" placeholder="请输入正确的金额" show-word-limit maxlength=7
                  style="width:1000px"   clearable></el-input><span class="tip">&nbsp;&nbsp;元</span>
        </el-form-item>
        <el-form-item label="库存数量:" prop="goodsInventory">
          <el-input v-model="dataForm.goodsInventory" placeholder="0 ~ 99999" show-word-limit maxlength=5
                  style="width:1000px"   clearable></el-input><span class="tip">&nbsp;&nbsp;件</span>
        </el-form-item>
        <el-form-item label="限购数量" prop="goodsLimit">
          <el-input v-model="dataForm.goodsLimit" placeholder="0 ~ 99999" show-word-limit maxlength=5
                  style="width:1000px"   clearable></el-input><span class="tip">&nbsp;&nbsp;件</span>
        </el-form-item>
        <el-form-item label="商品图片:" prop="goodsUrl">
          <el-upload
              class="avatar-uploader"
              action ='auto'
              :show-file-list="false"
              :on-success="handlePlaySuccess"
              :before-upload="beforePlayUpload"
              :auto-upload="false">
              <img v-if="dataForm.goodsUrl" :src="dataForm.goodsUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span class="tip"> 建议尺寸</span>
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
      breadCrumbList: [{ title: '商品列表', path: '/goodsList' }, { title: '商品详情' }],
      dataForm:{
        id: this.$route.query['id'] || '',
        goodsName:'',
        status:1,
        goodsUrl:'',
        goodsDesc:'',
        goodsPrice:'',
        goodsLimit:'',
        categoryCode:'',
        goodsAttr:'',
      },
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
  },
  methods:{
    //获取商品详情
    getInfo(){
      if(this.dataForm.id){
        getGoods(that.dataForm.id).then(res=>{
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
        const submitFun = that.dataForm.id ? editGoods : addGoods;
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
    //取消
    cancelForm(){
      this.$refs.dataForm.resetFields();
      this.$router.push({
        path: '/web-goodsList',
      });
    },

    handlePlaySuccess(res, file) {
      this.dataForm.goodsUrl = res.file;
    },
    beforePlayUpload(file) {
      const isJPG = file.type === 'image/jpeg' ||  file.type === 'image/png' ;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
      this.$message.error('上传头像图片只能是 JPG/png 格式!');
      }
      if (!isLt2M) {
      this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
      //上传到后端
    uploadImg(param){
      console.log("jjjj",param);
      this.beforePlayUpload(param.file);
      this.handlePlaySuccess();
      // this.imageToBase64(param);
    },

    imageToBase64 (param) {
      var reader = new FileReader()
      reader.readAsDataURL(param.file)
      reader.onload = () => {
        uploadBase64Img({
          context: reader.result
        }).then(res => {
          this.handlePlaySuccess(res);
        }, err => {
          console.log(err);
        }).catch(err => {
          console.log(err);
        });
      }
      reader.onerror = function (error) {
        console.log('Error: ', error);
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
    border:1px dashed #8c939d;
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
