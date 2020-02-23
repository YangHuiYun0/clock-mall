<template>
  <div>
    <header class="navbar-wrapper">
      <div class="navbar navbar-fixed-top">
        <div class="container-fluid cl">
          <span class="title">钟表商城管理后台</span>
          <div class="tit1">
            <el-dropdown class="user"  @command="handleCommand">
              <span class="el-dropdown-link">
                admin<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item command ='userInfo'>个人中心</el-dropdown-item> -->
                <el-dropdown-item command = 'exit'>退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span class="el-icon-s-shop" style="margin-left:50px" @click="goBlack">返回商城</span>
          </div>
        </div>
      </div>
    </header>
    <el-row style="width:100%">
      <el-col :span=6>
        <aside class="aside">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color='#eeeeee'
            :unique-opened	='true' router theme="dark">
            <el-menu-item index="/web-home">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-film"></i>
                <span>首页内容展示管理</span>
              </template>
                <el-menu-item index="/web-bannerList">首页轮播图管理</el-menu-item>
                <!-- <el-menu-item index="1-2">首页官方推荐管理</el-menu-item> -->
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-shop"></i>
                <span>商品管理</span>
              </template>
                <el-menu-item index="/web-goodsList">商品列表</el-menu-item>
                <el-menu-item index="/web-brandList">品牌管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>
                <el-menu-item index="/web-orderList">订单列表</el-menu-item>
                <el-menu-item index="/web-returnApply">退货申请处理</el-menu-item>
                <el-menu-item index="/web-saleSetList">退货原因设置</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>会员管理</span>
              </template>
                <el-menu-item index="/web-memberList">会员列表</el-menu-item>
            </el-submenu>
          </el-menu>
        </aside>
      </el-col>
      <el-col :span=18 style="margin-left: 220px;width:82%">
        <div class="content">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getLogout } from "@/api/login";
export default {
  methods:{
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {

    },
    handleCommand(command){
      if(command === 'exit'){
        this.$message.success('退出成功');
				getLogout().then()
      }
    },
    goBlack(){
      getLogout().then()
      this.$router.push('/before-main')
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar-wrapper{
  height: 45px;
}
.navbar{
  background: #2d6dcc;
}
.navbar-fixed-top{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
}
.container-fluid{
  padding-right: 100px;
  padding-left: 50px;
  margin: 10px auto;
  color: #fff;
  display:flex;
  justify-content: space-between;
}
.cl{
  zoom: 1;
}
.title{
  font-size: 18px;
  margin-left: 50px;
}
.tit1{
  .user{
    color: #fff;
    font-size: 16px;
  }
}
.aside{
  position: fixed;
  z-index: 1030;
  width: 200px!important;
  height: 100vh;
  border: 1px solid rgba(238,238,238,0.98);
  background-color:  rgba(238,238,238,0.98);
}
.content{
  // margin-left: 220px;
  // margin-top: 5px;
  padding: 10px;
}

</style>
