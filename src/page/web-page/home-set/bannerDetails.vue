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
                        action=""
                        :file-list="stockFileList"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :before-upload="beforeUpload"
                        :auto-upload="false">  
                        <el-button size="small" type="primary">上传图片</el-button>
                    </el-upload>
                    <img v-if="dataForm.bannerUrl" :src="dataForm.bannerUrl" class="avatar">
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

import { 
    getImageUrl,
    getBannerInfo,
    addBannerInfo,
    editBannerInfo,
} from "../../../api/home-set";
export default {
    data(){
        const sortRequire = (rule, value, callback) => {
            if (!String(this.dataForm.sort).match(/^\+?[1-9]\d*$/)) {
                callback(new Error('请输入大于0的整数'));
            }else{
                callback();
            }
        }
        return{
            breadCrumbList: [{ title: '首页轮播图列表', path: '/web-bannerList' }, { title: '轮播图详情' }],
            submitLoading:false,
            stockFileList:[],
            dataForm:{
                id:this.$route.query.id || '',
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
        this.getInfo();
    },
    methods:{
        getInfo(){
            const that = this;
            if(that.dataForm.id){
            getBannerInfo(that.dataForm.id).then(res=>{
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
            const submitFun = that.dataForm.id ? editBannerInfo : addBannerInfo;
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
                    that.dataForm.bannerUrl =  res.data;
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
<style lang='scss'>
 .el-upload {
    // border:1px dashed #8c939d;
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