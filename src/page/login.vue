<template>
  <div>
    <el-card class="login-form-layout" v-if="isShowRegisterPage">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="rules"
               ref="loginForm"
               label-position="left">
        <h2 class="login-title color-main">钟表商城</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名"
                    prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-unlock">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="register" @click="goRegisterPage">
        没有账号，立即注册！
      </div>
    </el-card>
    <el-card class="login-form-layout" v-else style="width:500px">
      <el-form 
               :model="registerForm"
               :rules="rules"
               ref="registerForm"
               label-width="80px">
        <h2 class="login-title color-main">注册用户</h2>
        <el-form-item prop="name" label="姓名：">
          <el-input 
                    type="text"
                    v-model="registerForm.name"
                    placeholder="请输入姓名"
                    style="width:350px">
          </el-input>
        </el-form-item>
        <el-form-item prop="loginName" label="用户名:">
          <el-input 
                    type="text"
                    v-model="registerForm.loginName"
                    placeholder="请输入用户名"
                    style="width:350px">
          </el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机号:">
          <el-input 
                    type="text"
                    v-model="registerForm.phone"
                    placeholder="请输入手机号"
                    style="width:350px">
          </el-input>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio v-model="registerForm.sex" label='1'>男</el-radio>
          <el-radio v-model="registerForm.sex" label='2'>女</el-radio>
        </el-form-item>
         <el-form-item label="密码:" prop="firstPassword">
          <el-input 
                    :type="pwdType" 
                    v-model="registerForm.firstPassword"
                    placeholder="请输入密码"
                    style="width:350px"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="confirmPassword">
          <el-input 
                    :type="pwdType"
                    v-model="registerForm.confirmPassword"
                    placeholder="请确认密码"
                    style="width:350px"></el-input>
        </el-form-item>
          <el-button style="width: 50%;margin-left:120px" 
          type="primary" :loading="loading" @click="submitForm">确认</el-button>
      </el-form>
      <div class="register" @click="closeRegister">
        取消注册
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getLogin } from "../api/login";
  import { addMember } from "../api/member-manage";
  import { setStore, getStore, removeStore } from '../util/storage.js'
  export default {
    name: 'login',
    data() {
      const loginNameRequire = (rule,value,callback)=>{
        if(!String(this.registerForm.loginName).match(/^[0-9a-zA-Z]+$/)){
          callback(new Error ('用户名只能由英文和数字组成'))
        }else{
          callback();
        }
      }
      const phoneRequire = (rule, value, callback) => {
        if (!String(this.registerForm.phone).match(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)) {
          callback(new Error('手机号码格式不正确'));
        } else {
          callback();
        }
      }
      const validateComfirmPassword = (rule, value, callback) => {
        const msg = (!/\S/.test(value) && '确认密码不能为空') ||
          ((this.registerForm.firstPassword !== value) && '确认密码与密码输入不一致');
        if (msg) return callback(new Error(msg));
        callback();
      };
      return {
        loginForm: {
          username: '',
          password: '',
        },
        registerForm:{
          name:'',
          loginName:'',
          firstPassword:'',
          confirmPassword:'',
          phone:'',
          sex:'1',
        },
        loading:false,
        isShowRegisterPage:true,
        rules: {
          username: [
            { required: true, trigger: 'blur', message: '请输入用户名' },
          ],
          password: [
            { required: true, trigger: 'blur', message: '请输入密码' }
          ],
          name:[
            { required: true, trigger: 'blur', message: '请输入姓名' },
          ],
          loginName:[
            { required: true, trigger: 'blur', message: '请输入用户名' },
            { required: true, trigger: 'change', validator: loginNameRequire }
          ],
          phone:[
            {required: true, trigger: 'blur', message: '请输入手机号码'},
            { required: true, trigger: 'change', validator: phoneRequire }
          ],
          firstPassword:[
            { required: true, trigger: 'blur', message: '请输入密码' },
          ],
          confirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
        },
        submitLoading: false,
        pwdType: 'password',
        dialogVisible:false,
        supportDialogVisible:false
      }
    },
    created() {
      // this.loginForm.username = getCookie("username");
      // this.loginForm.password = getCookie("password");
      // if(this.loginForm.username === undefined||this.loginForm.username==null||this.loginForm.username===''){
      //   this.loginForm.username = 'admin';
      // }
      // if(this.loginForm.password === undefined||this.loginForm.password==null){
      //   this.loginForm.password = '';
      // }
    },
    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (!valid) return false;
          getLogin({
            loginName:this.loginForm.username,
            password:this.loginForm.password
          }).then(res=>{
            if(res && res.code=== 200){
              this.$message.success('登录成功');
              this.$router.push(res.data.userType?'before-main':'/web-home');
              setStore('userInfo', res.data)
            }else{
              this.$message.error(res.msg)
            }
          })
        })
      },
      goRegisterPage(){
        this.isShowRegisterPage = false;
      },
      closeRegister(){
        this.isShowRegisterPage = true;
        this.$refs.registerForm.resetFields();
      },
      submitForm(){
        const that = this;
        this.$refs['registerForm'].validate((valid) => {
          if (!valid) {
            this.$message.error('请填写完整再保存');
            return false;
          }
          that.submitLoading = true;
          addMember({
            loginName:this.registerForm.loginName,
            name:this.registerForm.name,
            password:this.registerForm.firstPassword,
            phone:this.registerForm.phone,
            sex:this.registerForm.sex,
            userType:'1',
          }).then(res =>{
            if(res && res.code === 200){
              that.$message.success('注册用户成功,立即登录');
            }else{
              that.$message.error('注册用户失败');
            }
            that.isShowRegisterPage = true;
            that.submitLoading = false;
            that.$refs.registerForm.resetFields();
          },()=>{
            that.submitLoading = false;
          })
        })
      },
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
    
  }

  .register{
    font-size: 14px;
    color: #409EFF
    /* #0a76f5; */
  }
</style>
