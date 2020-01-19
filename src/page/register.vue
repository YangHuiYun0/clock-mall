<template>
  <div>
     <el-dialog title="注册用户"
             :before-close="beforeClose"
             :visible.sync="dialogVisible"
             :modal-append-to-body='false'
             width='40%'>
        <el-main>
          <el-form :model="userForm" ref="userForm" :rules="rules">
            <el-form-item label="姓名" prop="memberName">
              <el-input v-model="userForm.memberName" show-word-limit maxlength=6
                        clearable style="width:300px"></el-input>
            </el-form-item>

           </el-form>
        </el-main>
     </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      dialogVisible:false,
      userForm:{
        loginName:'',//登录名
        memberName:'',//姓名
        password:'',
        phone:'',
        userAddress:'',
        detailAddress:'',
        selectedOptions:[],
        isDefault:''//是否为默认
      },
      rules:{

      },
    }
  },
  methods:{
    beforeClose(){},
  }
}
</script>

<style>

</style>
