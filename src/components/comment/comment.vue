<template>
  <div class="container" ref="container">

    <div class="comment"  v-for="(item,index) in comments" :key="index">
      <div class="info">
        <img class="avatar" :src="item.userImgUrl" width="36" height="36"/>
        <div class="right">
          <div class="name">{{item.userName}}</div>
          <div class="date">{{item.createTime}}</div>
        </div>
      </div>
      <div class="content">{{item.content}}</div>
      <div class="control">
        <span class="comment-reply" @click="showCommentInput(item)">
          <i class="iconfont icon-comment"></i>
          <span>回复</span>
        </span>
      </div>
      <div class="reply">
        <div class="item" v-for="(reply,index) in item.childCommentList" :key='index'>
          <div class="reply-content">
            <span class="from-name">{{reply.userName}}</span><span>: </span>
            <span class="to-name">@{{reply.replyUserName}}</span>
            <span>{{reply.content}}</span>
          </div>
          <div class="reply-bottom">
            <span>{{reply.createTime}}</span>
            <span class="reply-text" @click="showCommentInput(item, reply)">
              <i class="iconfont icon-comment"></i>
              <span>回复</span>
            </span>
          </div>
        </div>
        <div class="write-reply" v-if="item.childCommentList.length > 0" @click="showCommentInput(item)">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="showItemId === item.id">
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      placeholder="写下你的评论">
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="comment" >
        <div class="write-reply"  @click="showCommentInput()">
          <i class="el-icon-edit"></i>
          <span class="add-comment">添加新评论</span>
        </div>
        <transition name="fade">
          <div class="input-wrapper" v-if="fisrt&&fisrt1" >
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="3"
                      autofocus
                      placeholder="写下你的评论">
            </el-input>
            <div class="btn-control">
              <span class="cancel" @click="cancel">取消</span>
              <el-button class="btn" type="success" round @click="commitComment">确定</el-button>
            </div>
          </div>
        </transition>
    </div>
     
  </div>
</template>

<script>
import {addCommentInfo,getCommentList } from "../../api/goods-manage";
export default {
     props: {
      comments: {
        type: Array,
        required: true
      },
      goodsId:String,
    },
    data() {
      return {
        inputComment: '',
        showItemId: '',
        fisrt:false,
        fisrt1:false,
        parentId:'',
        replyUserId:'',
      }
    },
    methods: {
      /**
       * 点赞
       */
    //   likeClick(item) {
    //     if (item.isLike === null) {
    //       Vue.$set(item, "isLike", true);
    //       item.likeNum++
    //     } else {
    //       if (item.isLike) {
    //         item.likeNum--
    //       } else {
    //         item.likeNum++
    //       }
    //       item.isLike = !item.isLike;
    //     }
    //   },

      /**
       * 点击取消按钮
       */
      cancel() {
        this.showItemId = '';
        this.fisrt = false;
        this.fisrt1 = false;
      },

      /**
       * 提交评论
       */
      commitComment() {
        console.log(this.inputComment);
        const that = this;
        addCommentInfo({
            content:this.inputComment,
            goodsId:this.goodsId,
            pid:this.parentId || null,
            replyUserId:this.replyUserId || null,
        }).then(res => {
            console.log('评论信息',res);
            that.fisrt = false;
            that.inputComment = ''
             that.$emit('updataComment',{
                 goodsId:that.goodsId
             });
        //      that.comments.push(res.data)
        // //    that.$nextTick(()=>{
        // //        that.comments.push(res.body)
        // //    })
        //   getCommentList({
        //         goodsId:this.goodsId
        //     }).then(res => {
        //         that.$set(that,'comments',res.data)
        //         // that.comments = res.data;
        //     })

        })
      },

      /**
       * 点击评论按钮显示输入框
       * item: 当前大评论
       * reply: 当前回复的评论
       */
      showCommentInput(item, reply) {
        if (reply) {
          this.inputComment = " "
        } else {
            if(item){
                this.inputComment = ''
            }else{
              this.fisrt1 = true;
              this.parentId = '';
              this.replyUserId = '';
            }
                this.fisrt = true;
        }
        if(item){
            this.showItemId = item.id ;
            this.parentId = item.id;
            this.replyUserId = reply ? reply.userId : item.userId;  
        }

      }
    },
     created() {
      console.log('评论数据',this.comments)
      console.log('商品id',this.goodsId);
      
    }
}

</script>
<style lang='scss' scoped>
$color-main: #409EFF;
$color-success: #67C23A;
$color-warning: #E6A23C;
$color-danger: #F56C6C;
$color-info: #909399;

$text-main: #303133;
$text-normal: #606266;
$text-minor: #909399;  //次要文字
$text-placeholder: #C0C4CC;
$text-333: #333;

$border-first: #DCDFE6;
$border-second: #E4E7ED;
$border-third: #EBEEF5;
$border-fourth: #F2F6FC;
$content-bg-color: #fff;
.container {
    padding: 0 10px;
    box-sizing: border-box;
    .comment {
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-bottom: 1px solid $border-fourth;
      .info {
        display: flex;
        align-items: center;
        .avatar {
          border-radius: 50%;
        }
        .right {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          .name {
            font-size: 16px;
            color: $text-main;
            margin-bottom: 5px;
            font-weight: 500;
          }
          .date {
            font-size: 12px;
            color: $text-minor;
          }
        }
      }
      .content {
        font-size: 16px;
        color: $text-main;
        line-height: 20px;
        padding: 10px 0;
      }
      .control {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: $text-minor;
        .like {
          display: flex;
          align-items: center;
          margin-right: 20px;
          cursor: pointer;
          &.active, &:hover {
            color: $color-main;
          }
          .iconfont {
            font-size: 14px;
            margin-right: 5px;
          }
        }
        .comment-reply {
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            color: $text-333;
          }
          .iconfont {
            font-size: 16px;
            margin-right: 5px;
          }
        }

      }
      .reply {
        margin: 10px 0;
        border-left: 2px solid $border-first;
        .item {
          margin: 0 10px;
          padding: 10px 0;
          border-bottom: 1px dashed $border-third;
          .reply-content {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: $text-main;
            .from-name {
              color: $color-main;
            }
            .to-name {
              color: $color-main;
              margin-left: 5px;
              margin-right: 5px;
            }
          }
          .reply-bottom {
            display: flex;
            align-items: center;
            margin-top: 6px;
            font-size: 12px;
            color: $text-minor;
            .reply-text {
              display: flex;
              align-items: center;
              margin-left: 10px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
              .icon-comment {
                margin-right: 5px;
              }
            }
          }
        }
        .write-reply {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: $text-minor;
          padding: 10px;
          cursor: pointer;
          &:hover {
            color: $text-main;
          }
          .el-icon-edit {
            margin-right: 5px;
          }
        }
        .fade-enter-active, fade-leave-active {
          transition: opacity 0.5s;
        }
        .fade-enter, .fade-leave-to {
          opacity: 0;
        }
        .input-wrapper {
          padding: 10px;
          .gray-bg-input, .el-input__inner {
            /*background-color: #67C23A;*/
          }
          .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;
            .cancel {
              font-size: 16px;
              color: $text-normal;
              margin-right: 20px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
            }
            .confirm {
              font-size: 16px;
            }
          }
        }
      }
    }
  }

   .btn-control {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding-top: 10px;
            .cancel {
              font-size: 16px;
              color: $text-normal;
              margin-right: 20px;
              cursor: pointer;
              &:hover {
                color: $text-333;
              }
            }
            .confirm {
              font-size: 16px;
            }
          }
</style>