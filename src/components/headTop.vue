<template>
  <div>
    <div class="title">
      <div class="logo-title">
        <i>&nbsp;</i>小路知道
        <p>WATCH</p>
      </div>
      <div class="menu">
        <el-menu
          class="el-menu-demo el-menu-custom"
          mode="horizontal"
          @select="handleSelect"
          background-color="#434343"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          default-active="/main">
          <el-menu-item index="/main">首页</el-menu-item>
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
      <span>
        <el-link icon="el-icon-user" style="font-size: 14px;color:#fff">登录</el-link>
        <el-link icon="el-icon-warning-outline" style="font-size: 14px;color:#fff">退出</el-link>
      </span>
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
  display: flex;
  span{
    position: absolute;
    right: 50px;
    
  }
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
  width: 300px;
  height: 100px;
  margin-left: 100px;
  font-family: '楷体';
  font-size: 38px;
  color: rgb(190,135,68);
  line-height: 80px;
  p{
    font-size: 18px;
    padding: 0;
    margin-top: -50px;
    height: 30px;
    color: rgb(150, 118, 80);
    text-align: center
  }
}

</style>
