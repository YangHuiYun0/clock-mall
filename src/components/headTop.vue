<template>
  <div>
    <div class="title">
      <div class="logo-title">
        <div class="icon"></div>
        <div class="tit1"><span>WATCH</span></div>
        <div class="tit2">钟表商城</div>
      </div>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo el-menu-custom"
        mode="horizontal"
        @select="handleSelect"
        background-color="#434343"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened>
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">购物车</el-menu-item>
        <el-submenu index="3">
          <template slot="title">订单管理</template>
          <el-menu-item index="2-1">结算订单</el-menu-item>
          <el-menu-item index="2-2">历史订单</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">个人中心</template>
          <el-menu-item index="2-1">留言评论</el-menu-item>
          <el-menu-item index="2-2">资料修改</el-menu-item>
          <el-menu-item index="2-2">登录注册</el-menu-item>
        </el-submenu>
        <el-menu-item index="5">店铺介绍</el-menu-item>
        <el-menu-item index="6">联系我们</el-menu-item>
      </el-menu>

    </div>
    
  </div>
</template>

<script>
export default {
  name:'headTop'
}
</script>

<style lang="scss" scoped>
.title{
  height: 100px;
  background-color: #434343;
  position: relative;
}
.el-menu-custom{
 position: absolute;
 bottom: 0;
 right: 10%;
 .el-menu-item{
   padding-right: 100px;
 }
}
.logo-title{
  width: 196px;
  height: 181px;
  background-color: rgb(190, 135, 68);
  position: absolute;
  left: 20%;
  .icon{
    position: absolute;
    width: 75px;
    height: 66px;
    left: 61px;
    top: 13px;
    background: url('./image/logo.png') 0 0 no-repeat {
      size: 100%;
    }
  }
  .tit1{
    position: absolute;
    text-align: center;
    top: 85px;
    left: 62px;
    color: rgb(164, 110, 45);
    font-size: 25px;
  }
  .tit2{
    position: absolute;
    top: 100px;
    font-size: 25px;
    color: rgb(170, 100, 14);
  }
}

</style>
