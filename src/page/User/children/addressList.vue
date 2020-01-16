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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
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
             width='500px'>
        <el-form :model="addressForm" ref="addressForm" :rules="rules">
          <el-form-item label="收件人名称" prop="receiverName">
            <el-input v-model="addressForm.receiverName" show-word-limit maxlength=6
                      clearable style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="收件人电话" prop="receiverPhone">
            <el-input v-model="addressForm.receiverPhone" show-word-limit maxlength=11
                      clearable style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="收件人地址" prop="receiverAddress">
            <el-input v-model="addressForm.receiverAddress" show-word-limit maxlength=25
                      clearable style="width:300px"></el-input>
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
import YShelf from '../../../components/shelf'
import YButton from "../../../components/yButton";
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
      tableData:[],
      dataListLoading:false,
      page: 0,
      pageSize: 20,
      listTotal: 0,
      dialogVisible:false,
      submitLoading:false,
      addressForm:{
        id:'',
        receiverName:'',
        receiverPhone:'',
        receiverAddress:'',
      },
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
      }
    }
  },
  mounted(){
    // this.getDataList('init');
  },
  methods:{
    addAddress(row,index){
      this.dialogVisible = true;
      if(row && row.id){
        const that = this;
        getAddressInfo(row.id).then(res =>{
          if(res && res.code === 200 ){
            that.addressForm = res.body;
          }
        },()=>{

        })
      }
    },
    delAddress(row,index){},
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
        const submitFun = that.addressForm.id ?editAddress:addAddress;
        submitFun(that.addressForm.id,that.addressForm).then(res=>{
          console.log('res',res);
          if(res&&res.code ===200){
            this.$message({
              type: 'success',
              message: `${that.addressForm.id?'修改':'增加'}成功`
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
  },
  
}
</script>

<style>
.table{
  border:1px solid #d4d4d4;
  border-radius: 8px 8px 0 0;
}
</style>
