<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary"
               @click=" dialogVisible=true">
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <div style="padding-bottom: 20px;">
      <el-upload
        :multiple="false"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action=""
        :http-request="httpRequest"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
         选择图片
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        确认
      </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import axios from 'axios';
  // import { uploadImg, uploadBase64Img } from '../../../api/sign';
  // import lambda from './../../../lambdaCalendar';
  // const BUCKET = process.env.BUCKET;

  export default {
    name: 'EditorSlideUpload',
    props: {
      color: {
        type: String,
        default: '#1890ff'
      }
    },
    data() {
      return {
        dialogVisible: false,
        listObj: {},
        fileList: []
      };
    },
    methods: {
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess);
      },
      handleSubmit() {
        const arr = Object.keys(this.listObj).map(v => this.listObj[v]);
        if (!this.checkAllSuccess()) {
          this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!');
          return;
        }
        this.$emit('successCBK', arr);
        this.listObj = {};
        this.fileList = [];
        this.dialogVisible = false;
      },
      handleSuccess(fileUrl, file) {
        const uid = file.uid;
        const objKeyArr = Object.keys(this.listObj);
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            this.listObj[objKeyArr[i]].url = fileUrl;
            this.listObj[objKeyArr[i]].hasSuccess = true;
            return;
          }
        }
      },
      handleRemove(file) {
        console.log('handleRemove', file);
        const uid = file.uid;
        const objKeyArr = Object.keys(this.listObj);
        for (let i = 0, len = objKeyArr.length; i < len; i++) {
          if (this.listObj[objKeyArr[i]].uid === uid) {
            delete this.listObj[objKeyArr[i]];
            return;
          }
        }
      },
      beforeUpload(file) {
        const spl = file.name.split('.');
        if (['png', 'jpg', 'jpeg', 'gif'].indexOf(spl[spl.length - 1]) < 0) {
          this.$message.error('文件格式不符，请上传 jpg/png/gif 格式的文件');
          return false;
        }
        const _self = this;
        const _URL = window.URL || window.webkitURL;
        const fileName = file.uid;
        this.listObj[fileName] = {};
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = _URL.createObjectURL(file);
          img.onload = function() {
            _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height };
          };
          resolve(true);
        });
      },
      imageToBase64 (file) {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          uploadBase64Img({
            context: reader.result
          }).then(res => {
            this.handleSuccess(res.url, file);
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
      httpRequest(param) {
        // 上传腾讯云
        // var uploadBody = new FormData();
        // uploadBody.append('file', param.file);
        console.log(param.file);
        this.imageToBase64(param.file);



        // 注释之前的上传方式 AWS
        // const files = param.file;
        // lambda.getSignedURL(files).then(data => {
        //   this.url = data.url;
        //   data.url = `https://s3.cn-north-1.amazonaws.com.cn/${BUCKET}/${data.key}`;
        //   axios({
        //     method: 'put',
        //     url: this.url,
        //     data: files,
        //     headers: {
        //       'Accept': 'application/json',
        //       'Content-Type': files.type,
        //       'X-Requested-With': 'XMLHttpRequest'
        //     }
        //   }).then(res => {
        //     console.log(res);
        //     this.handleSuccess(data.url, res.config.data);
        //   }).catch(error => {
        //     console.log(error);
        //   });
        // });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .editor-slide-upload {
    margin-bottom: 20px;
    /deep/ .el-upload--picture-card {
      width: 100%;
    }
  }
</style>
