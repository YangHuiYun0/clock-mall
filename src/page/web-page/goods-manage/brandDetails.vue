<template>
  <!-- 品牌详情 -->
  <div>
    <Breadcrumb :level-list="breadCrumbList"></Breadcrumb>
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="140px">
      <el-card>
        <el-form-item label="品牌名称：" prop="brandName">
            <el-input v-model="dataForm.brandName" placeholder="请输入品牌名称" show-word-limit 
            maxlength=12  clearable style="width:400px"></el-input>
        </el-form-item>
         <el-form-item label="品牌首字母：" prop="brandLetter">
            <el-input v-model="dataForm.brandLetter" placeholder="A" show-word-limit 
            maxlength=1  clearable style="width:100px"></el-input>
        </el-form-item>
         <el-form-item label="品牌归属类型：" prop="brandType">
             <el-select v-model="dataForm.brandType" :clearable='false' >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
        </el-form-item>
         <el-form-item>
          <el-button type="success" @click="submitForm" :loading="submitLoading">保存</el-button>
          <el-button type="warning" @click="cancelForm" :loading="submitLoading">取消</el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { getBrandInfo,addBrandInfo,updateBrandInfo } from "../../../api/goods-manage";
export default {
  data(){
    const letterRequire = (rule, value, callback) => {
      if (!String(this.dataForm.brandLetter).match(/^[A-Z]*$/g)) {
        callback(new Error('品牌首字母只能为大写字母'));
      }else{
        callback();
      }
    }
    return{
      submitLoading:false,
      breadCrumbList: [{ title: '品牌管理列表', path: '/web-brandList' }, { title: '品牌详情' }],
      dataForm:{
        id:this.$route.query.id || '',
        brandName:'',
        brandLetter:'',
        brandType:'年轻潮牌',
      },
      rules:{
        brandName:[
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
        ],
        brandLetter:[
          { required: true, message: '请输入品牌首字母', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: letterRequire }
        ],
      },
      typeList:[
        {value:'1',label:'顶级品牌'},
        {value:'2',label:'奢华品牌'},
        {value:'3',label:'高级品牌'},
        {value:'4',label:'轻奢时尚'},
        {value:'5',label:'年轻潮牌'},
        {value:'6',label:'智能手表'},
      ]
    }
  },
  mounted(){
    this.getInfo();
  },
  methods:{
    // 初始化
    getInfo(){
      const that = this;
        if(that.dataForm.id){
          getBrandInfo(that.dataForm.id).then(res=>{
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
    //保存修改
      submitForm(){
        const that = this;
        that.$refs.dataForm.validate(valid => {
          if (!valid) {
            this.$message.error('请填写完整再保存');
            return false;
          }
          that.submitLoading = true;
          const submitFun = that.dataForm.id ? updateBrandInfo : addBrandInfo;
          submitFun(that.dataForm.id,that.dataForm).then(res=>{
            console.log('res:',res);
            if(res && res.code === 200){
              that.$message.success(that.dataForm.id ? '修改成功' : '保存成功');
              that.$router.push({
                path: '/web-brandList',
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
        this.stockFileList = [];
        this.$router.push({
          path: '/web-brandList',
        });
      },
  }
}
</script>

<style>

</style>
