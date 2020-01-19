<template>
  <div>
    <y-shelf title="个人资料" style="margin-bottom:0px"></y-shelf>
     <div class="table">
       <!-- 新增链接 -->
          <el-button type="success" class="modify-btn right-btn" size="small"
                    @click.native="updatePasswordHandle()">修改密码</el-button>
          <div class="msg-box">
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
import { editMember,getMember } from "../../../../api/member-manage";
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
      userName:'',
      name:'',
      phone:'',
      createTime:'',
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
    const that = this;
    getMember(this.id).then(res =>{
      if(res && res.code === 200){
        that.name = res.data.name;
        that.phone = res.data.phone;
        that.createTime = res.data.createTime;
        that.id = res.data.id;
        that.userName = res.data.userName;
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
  }
}
</script>

<style>
.table{
  border:1px solid #d4d4d4;
  border-radius: 8px 8px 0 0;
}
</style>
