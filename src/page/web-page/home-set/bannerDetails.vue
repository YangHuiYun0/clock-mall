<template>
<!-- 轮播页详情 -->
    <div>
        <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="140px">
            <el-card>
                <el-form-item label="轮播图名称" prop="bannerName">
                    <el-input v-model="dataForm.bannerName" placeholder="请输入轮播图名称" show-word-limit 
                    maxlength=12  clearable style="width:400px"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-radio v-model="dataForm.status" :label=1 >启用</el-radio>
                    <el-radio v-model="dataForm.status" :label=0>停用</el-radio>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="dataForm.sort" placeholder="请输入排序" show-word-limit 
                    maxlength=9  clearable style="width:400px"></el-input>
                </el-form-item>
                <el-form-item label="轮播图图片" prop="bannerUrl" ref="bannerUrl">
                    <el-upload
                        class="avatar-uploader"
                        action ='auto'
                        :show-file-list="false"
                        :on-success="handlePlaySuccess"
                        :before-upload="beforePlayUpload"
                        :auto-upload="false">
                        <img v-if="dataForm.imageUrl" :src="dataForm.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="轮播图图片" prop="bannerUrl" ref="bannerUrl">
                    <el-upload
                    class="avatar-uploader"
                    action="auto"
                    :http-request="uploadImg"
                    :show-file-list="false"
                    :on-success="handlePlaySuccess"
                    :before-upload="beforePlayUpload">
                    <img v-if="dataForm.bannerUrl" :src="dataForm.bannerUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">建议尺寸750 * 750px</div>
                    </el-upload>
                </el-form-item>
            </el-card>
            <el-card style="margin-top:20px">
                <el-form-item>
                    <el-button type="success" @click="submitForm" :loading="submitLoading">保存</el-button>
                    <el-button type="warning" @click="cancelForm" :loading="submitLoading">取消</el-button>
                </el-form-item>
            </el-card>
        </el-form>
    </div>
</template>

<script>
// import uploadimg from "../../../components/uploadImg/index";
export default {
    // components:{
    //     uploadimg
    // },
    data(){
        const sortRequire = (rule, value, callback) => {
            if (!String(this.dataForm.sort).match(/^\+?[1-9]\d*$/)) {
                callback(new Error('请输入大于0的整数'));
            }else{
                callback();
            }
        }
        return{
            breadCrumbList: [{ title: '首页轮播图列表', path: '/bannerList' }, { title: '轮播图详情' }],
            submitLoading:false,
            dataForm:{
                id:'',
                bannerName:'',
                bannerUrl:'',
                sort:'',
                status: 0, //1:启用  0：停用
            },
            rules:{
                bannerName:[
                    { required: true, message: '请输入轮播图名称', trigger: 'blur' },
                ],
                sort:[
                    { required: true, message: '请输入轮播图排序', trigger: 'blur' },
                    { required: true, trigger: 'change', validator: sortRequire }
                ],
            },
       }
    },
    mounted(){
        // this.getInfo();
    },
    methods:{
        getInfo(){
            const that = this;
            if(that.dataForm.id){
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
        submitForm(){
            const that = this;
            that.$refs.dataForm.validate(valid => {
            if (!valid) {
                this.$message.error('请填写完整再保存');
                return false;
            }
            that.submitLoading = true;
            const submitFun = that.dataForm.id ? editBanner : addBanner;
            submitFun(that.dataForm.id,that.dataForm).then(res=>{
                console.log('res:',res);
                if(res && res.code === 200){
                that.$message.success(that.dataForm.id ? '修改成功' : '保存成功');
                that.$router.push({
                    path: '/web-bannerList',
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
        cancelForm(){
            this.$refs.dataForm.resetFields();
            this.$router.push({
            path: '/web-bannerList',
            });
        },

        handlePlaySuccess(res, file) {
            this.dataForm.imageUrl = res.file;
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
<style lang='scss'>
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
</style>