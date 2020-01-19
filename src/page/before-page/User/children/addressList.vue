<template>
  <div>
    <y-shelf title="收货地址" style="margin-bottom:0px">
      <span slot="right">
        <y-button text="添加收货地址" style="margin: 0" @btnClick="addAddress()"></y-button>
      </span>
    </y-shelf>
    <div class="table">
      <el-table :data="tableData" v-loading="dataListLoading">
        <el-table-column
          label="排序"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column prop="receiverName" label="收件人姓名" align="center">
          <template slot-scope="scope">
            {{scope.row.receiverName}}
          </template>
        </el-table-column>
        <el-table-column prop="receiverPhone" label="收件人电话" align="center">
          <template slot-scope="scope">
            {{scope.row.receiverPhone}}
          </template>
        </el-table-column>
        <el-table-column prop="receiverAddress" label="收件人地址" align="center">
          <template slot-scope="scope">
            {{scope.row.receiverAddress}}
          </template>
        </el-table-column>
        <el-table-column prop="receiverAddress" label="详细地址" align="center">
          <template slot-scope="scope">
            {{scope.row.detailAddress}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button :type="scope.row.isDefault?'danger':'info'" plain 
                        size="mini" @click="setDefault(scope.row,$index)"
                        :disabled="scope.row.isDefault?true:false">
              {{scope.row.isDefault?'默认地址':'设为默认'}}
            </el-button>
            <el-button type="primary" size="mini" @click="addAddress(scope.row,$index)">编辑</el-button>
            <el-button type="danger" size="mini" @click="delAddress(scope.row,$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page=page
        :total=listTotal
        :page-size=pageSize
        @current-change="currentChangeHandle">
      </el-pagination>
    </div>
     <el-dialog :title="!addressForm.id ? '新增地址' : '地址修改'"
             :before-close="beforeClose"
             :visible.sync="dialogVisible"
             :modal-append-to-body='false'
             width='40%'>
        <el-form :model="addressForm" ref="addressForm" :rules="rules">
          <el-form-item label="收件人名称" prop="receiverName">
            <el-input v-model="addressForm.receiverName" show-word-limit maxlength=6
                      clearable style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="收件人电话" prop="receiverPhone">
            <el-input v-model="addressForm.receiverPhone" show-word-limit maxlength=11
                      clearable style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="收件人地址" prop="selectedOptions">
            <el-cascader :options="options" 
                          v-model="addressForm.selectedOptions" 
                          @change="handleChange" 
                          style="width:300px"
                          ref='myCascader'
                          ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress" >
            <el-input type="textarea" :autosize="{ minRows: 4}" v-model="addressForm.detailAddress"
                      show-word-limit maxlength=50
                      placeholder="例如：街道、门牌号"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="formSubmit" :loading="submitLoading">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
import YShelf from '../../../../components/shelf'
import YButton from "../../../../components/yButton";
let pcas = require("../pcas/pca-code.json")

export default {
  components:{
    YShelf,YButton
  },
  data(){
    const phoneRequire = (rule, value, callback) => {
      if (!String(this.addressForm.receiverPhone).match(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)) {
        callback(new Error('手机号码格式不正确'));
      } else {
        callback();
      }
    }
    return{
      tableData:[{status:1},{status:0}],
      dataListLoading:false,
      page: 0,
      pageSize: 20,
      listTotal: 0,
      dialogVisible:false,
      submitLoading:false,
      addressForm:{
        addressId:'',
        receiverName:'',
        receiverPhone:'',
        receiverAddress:'',
        detailAddress:'',
        selectedOptions:[],
        isDefault:''//是否为默认
      },
      options: pcas,
      rules:{
        receiverName:[
          {required: true, message: '请输入收件人名称', trigger: 'blur'}
        ],
        receiverAddress:[
          {required: true, message: '请输入收件人地址', trigger: 'blur'}
        ],
        receiverPhone:[
          {required: true, message: '请输入收件人号码', trigger: 'blur'},
          { required: true, trigger: 'change', validator: phoneRequire }
        ],
        detailAddress:[
          {required: true, message: '请输入详细地址', trigger: 'blur'}
        ],
        selectedOptions:[
           {required: true, message: '请选择地址', trigger: 'blur'}
        ]
      }
    }
  },
  mounted(){
    // this.getDataList('init');
  },
  methods:{
    addAddress(row,index){
      this.dialogVisible = true;
      if(row && row.addressId){
        const that = this;
        getAddressInfo(row.addressId).then(res =>{
          if(res && res.code === 200 ){
            that.addressForm = res.body;
          }
        },()=>{

        })
      }
    },
    delAddress(row,index){
      const that = this;
      this.$confirm(`确定对该收货地址进行「 删除 」操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAddressInfo(row.addressId).then(res=>{
          if(res && res.code === 200){
            that.$message.success(`删除地址成功`);
            that.tableData.splice(index, 1);
          }else{
            that.$message.error(res.msg)
          }
        })
      }).catch(()=>{});
    },
    setDefault(row,index){
      if(row.status) return;
    },
    getDataList(type){
      if (type === 'init') {
        this.page = 0;
      }
      this.dataListLoading = true;
      getActivityList({
        page: this.page >= 1 ? this.page - 1 : this.page,
        size: this.pageSize,
      }).then(res => {
        if (res && res.code === 200) {
          this.tableData = res.body.list;
          this.listTotal = res.body.totalCount;
        }else{
          this.dataListLoading = false;
        }
      },()=>{
        this.dataListLoading = false;
      });
    },
    currentChangeHandle(val) {
      this.page = val;
      this.getDataList();
    },
    // 关闭弹窗
    beforeClose() {
      this.cancel();
    },
    cancel() {
      this.$refs.addressForm.resetFields();
      this.submitLoading = false;
      this.dialogVisible = false;
    },
    formSubmit(){
      const that = this;
      this.submitLoading = true;
      that.$refs.addressForm.validate(valid => {
        if (!valid) {
          this.$message.error('请填写完整再保存');
          return false;
        }
        const submitFun = that.addressForm.addressId ?editAddress:addAddress;
        submitFun(that.addressForm.addressId,that.addressForm).then(res=>{
          console.log('res',res);
          if(res&&res.code ===200){
            this.$message({
              type: 'success',
              message: `${that.addressForm.addressId?'修改':'增加'}成功`
            });
            that.$refs.addressForm.resetFields();
            that.getDataList();
          }else{
            this.$message.error(res.msg)
          }
          this.dialogVisible = false;
          this.submitLoading = false;
        })
      })
    },
    handleChange(value){
      this.addressForm.receiverAddress = this.$refs.myCascader.getCheckedNodes()[0].pathLabels.join('');
    }
  },
  
}
</script>

<style>
.table{
  border:1px solid #d4d4d4;
  border-radius: 8px 8px 0 0;
}
</style>
