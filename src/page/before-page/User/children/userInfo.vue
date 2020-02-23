<template>
  <div>
    <y-shelf title="个人资料" style="margin-bottom:0px"></y-shelf>
     <div class="table">
       <!-- 新增链接 -->
          <el-button type="primary" class="modify-btn right-btn" size="small" style="float: right; margin-left: 10px;" 
                    @click.native="updatePasswordHandle()">修改密码</el-button>
          <div class="msg-box">
            <p >
              <!-- <b>用户头像:</b> -->
              <el-upload
                  action=""
                  :file-list="stockFileList"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
                  :auto-upload="false">  
                  <el-button size="small" type="primary">更换头像</el-button>
              </el-upload>
              <img v-if="userImgUrl" :src="userImgUrl" class="avatar-info">
              <img src="../image/titImg.png" alt="" v-else class="avatar-info">
            </p>
            <p >
              <b>用户名：</b>
              <span>{{name}}</span>
            </p>
            <p >
              <b>手机号码：</b>
              <span>{{phone}}</span>
            </p>
            <p >
              <b>创建时间：</b>
              <span>{{createTime}}</span>
            </p>
          </div>
     </div>
     <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :append-to-body="true">
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="80px">
        <el-form-item label="账号">
          <span>{{ name }}</span>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="dataForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" :loading="submitLoading">取消</el-button>
        <el-button type="primary" :loading="submitLoading"  @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import YShelf from '../../../../components/shelf'
import Cookies from 'js-cookie';
import { editMember,getMember } from "../../../../api/member-manage";
import { changeUserImg } from "../../../../api/user";
import { getLogout } from "@/api/login";
export default {
  components:{
    YShelf
  },
  data(){
    const validateComfirmPassword = (rule, value, callback) => {
      const msg = (!/\S/.test(value) && '确认密码不能为空') ||
        ((this.dataForm.newPassword !== value) && '确认密码与密码输入不一致');
      if (msg) return callback(new Error(msg));
      callback();
    };
    return{
      dialogVisible:false,
      submitLoading:false,
      stockFileList:[],
      userData:'',
      userName:'',
      name:'',
      phone:'',
      createTime:'',
      userImgUrl:'',
      dataForm:{
        password:'',
        newPassword:'',
        confirmPassword:''
      },
      rules:{
        password: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
        confirmPassword: [{ validator: validateComfirmPassword, trigger: 'blur' }]
      },
    }
  },
   mounted(){
    this.userData = Cookies.get('userData');
    this.id = this.userData.split(',')[0].split(':')[1]
    this.id =this.id.replace(/\"/g, "")
    const that = this;
    getMember(this.id).then(res =>{
      if(res && res.code === 200){
        that.name = res.data.name;
        that.phone = res.data.phone;
        that.createTime = res.data.createTime;
        that.id = res.data.id;
        that.userName = res.data.loginName;
        that.userImgUrl = res.data.userImgUrl;
      }
    })
  },
  methods:{
    updatePasswordHandle(){
      this.dialogVisible = true;
    },
     // 表单提交
    dataFormSubmit() {
      const that = this;
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          this.$message.error('请填写完整再保存');
          return false;
        }
        that.submitLoading = true;
        editMember(that.id,{
          id:that.id,
          loginName:that.userName,
          password:that.dataForm.newPassword,
        }).then(res =>{
          if(res && res.code === 200){
            that.$message.success('修改密码成功');
          }else{
            that.$message.error('修改密码失败');
          }
          that.dialogVisible = false;
          that.submitLoading = false;
          that.$refs.dataForm.resetFields();
          getLogout().then()
        },()=>{
          that.submitLoading = false;
        })
      })
    },
    handleChange(file, fileList) {
        const spl = file.name.split('.');
        var _fileSuffix = spl[spl.length - 1];
        if ( _fileSuffix !== 'png' &&  _fileSuffix !== 'jpg' ) {
            this.$message.error('文件格式不符，请上传png/jpg格式的文件');
            this.stockFileList = [];
            return false;
        }
        this.stockFileList = fileList.slice(-1);
        const that = this;
        var uploadBody = new FormData();
        uploadBody.append('file',file.raw)
        changeUserImg(uploadBody).then(res=>{
            if(res && res.code === 200){
                that.userImgUrl =  res.data.userImgUrl;
                that.$root.userIamgeUrl = res.data.userImgUrl;
                that.stockFileList = []; 
                that.$router.replace({
                  path:'/refresh'
                }) ;
            }else {
                that.$message.error(res.msg);
            }
        }).catch(err=>{
            that.$message.error(err);
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

<style lang='scss' scope>
.table{
  padding: 30px 60px;
  border:1px solid #d4d4d4;
  border-radius: 8px 8px 0 0;
}
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
  .avatar-info {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
