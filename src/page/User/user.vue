<template>
  <div class="layout-container">
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w">
      <div class="content">
        <div class="account-sidebar">
          <div class="avatar gray-box ">
            <div>
              <h5>上帝</h5></div>
              <!-- {{userInfo.info.username}} -->
            <div class="box-inner">
              <ul class="account-nav">
                <li v-for="(item,i) in nav" :key='i' :class="{current:item.name===title}"
                    @click="tab(item)">
                  <a href="javascript:;">{{item.name}}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="account-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import YHeader from '../../common/header'
  import { mapState } from 'vuex'
  export default {
    components: {
      YHeader
    },
    data () {
      return {
        title: '我的订单',
        nav: [
          {name: '我的订单', path: 'orderList'},
          {name: '账户资料', path: 'information'},
          {name: '收货地址', path: 'addressList'},
        ],
        editAvatar: true
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    methods: {
      tab (e) {
        this.$router.push({path: '/user/' + e.path})
      }
    },
    created () {
      let path = this.$route.path.split('/')[2]
      this.nav.forEach(item => {
        if (item.path === path) {
          this.title = item.name
        }
      })
    },
    watch: {
      $route (to) {
        let path = to.path.split('/')[2]
        this.nav.forEach(item => {
          if (item.path === path) {
            this.title = item.name
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/style/mixin";
   a{
    text-decoration:none;
  }
   ul li{
    list-style-type:none;
   }
  .w {
    padding-top: 40px;
    width: 1220px;
    margin: 0 auto;
  }

  .content {
    display: flex;
    height: 100%;
  }

  .account-sidebar {
    width: 210px;
    border-radius: 6px;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    .avatar {
      padding-top: 20px;
      border-radius: 10px;
      text-align: center;
      img {
        width: 168px;
        height: 168px;
      }
      h5 {
        font-size: 18px;
        line-height: 48px;
        font-weight: 700;
      }
    }
    .gray-box {
      overflow: hidden;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #dcdcdc;
      border-color: rgba(0,0,0,.14);
      box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
    }
    .account-nav {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      padding-top: 15px;
      li {
        position: relative;
        height: 48px;
        border-top: 1px solid #EBEBEB;
        line-height: 48px;
        font-size: 14px;
        &:hover {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }

        }
        a {
          display: block;
          color: #5079D9;
        }
        &.current {
          a {
            position: relative;
            z-index: 1;
            height: 50px;
            background-color: #98AFEE;
            line-height: 50px;
            color: #FFF;
          }
        }

      }
    }
  }

  .account-content {
    margin-left: 20px;
    flex: 1;
  }


</style>
