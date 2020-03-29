<template>
  <div>
        <div class="commentBox">
            <h3>发表评论</h3>
            <b v-if="type">你回复 {{name}}</b>
            <textarea name="" value="请填写评论内容" v-model="commentText"></textarea>
            <button class="btn" @click="addComment">发表</button>
            <button class="btn" @click="canelComment">取消</button>
        </div>
  </div>
</template>

<script>
export default {
    props: ['type','name'],
    data(){
        return {
            commentText:""
        }
    },
    methods:{
        addComment() {
            this.$emit("submit",this.commentText);
            this.commentText = "";
        },
        canelComment() {
            this.$emit("canel");
            this.commentText = "";
        }
    }
}

</script>
<style lang='' scoped>
</style>