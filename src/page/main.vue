<template>
  <div>
    <!-- 主页 -->
    <!-- 轮播图 -->
   <banner></banner>
   <!-- 卡片模块   --> 
   <div v-for="(item,i) in home" :key="i">
      <section class="w mt30 clearfix"  v-if="item.type === 2">
        <y-shelf :title="item.name">
          <div slot="content" class="hot">
            <mall-goods :msg="iitem" v-for="(iitem,j) in item.panelContents" :key="j"></mall-goods>
          </div>
        </y-shelf>
      </section>

      <section class="w mt30 clearfix" v-if="item.type === 3">
        <y-shelf :title="item.name">
          <div slot="content" class="floors" >
            <div class="imgbanner" v-for="(iitem,j) in item.panelContents" :key="j" v-if="iitem.type === 2 || iitem.type === 3" @click="linkTo(iitem)">
              <img v-lazy="iitem.picUrl" >
              <a class="cover-link"></a>
            </div>
            <mall-goods :msg="iitem" v-for="(iitem,j) in item.panelContents" :key="j+'key'" v-if="iitem.type != 2 && iitem.type != 3"></mall-goods>
          </div>
        </y-shelf>
      </section>
   </div>
  </div>
</template>

<script>
import banner from '../components/banner'
import YShelf from "../components/shelf"; //卡片组件
import mallGoods from "../components/mallGoods";
export default {
  components:{
    banner,
    YShelf,
    mallGoods
  },
  data(){
    return{
      error: false,
      
      mark: 0,
      bgOpt: {
        px: 0,
        py: 0,
        w: 0,
        h: 0
      },
      home: [
        {
          created: 1523766787000,
          id: 7,
          limitNum: 5,
          name: "热门商品",
          panelContents:[
            {created:1508682391000,
            id: 22,
            panelId: 1,
            goodsUrl: "https://i.loli.net/2018/07/13/5b48a7f468bf2.png",
            goodsCode: 150635087972564,//productId
            productImageBig: "https://i.loli.net/2018/07/13/5b48a7f468bf2.png",
            goodsName: "支付测试商品 IPhone X 全面屏 全面绽放",
            goodsPrice: 1,
            sortOrder: 1,
            subTitle: "此仅为支付测试商品 拍下不会发货",
            type: 0,
            updated: 1508682391000,},{},{}
          ],
          position: 0,
          remark: "",
          sortOrder: 2,
          status: 1,
          type: 2,
          updated: 1523790316000,
        },
        {
          created: null,
          id: 2,
          limitNum: 8,
          name: "官方精选",
          position: 0,
          remark: "",
          sortOrder: 3,
          status: 1,
          type: 3,
          updated: 1524108059000,
          panelContents:[
            {created: 1523794475000,
              fullUrl: "",
              id: 29,
              panelId: 2,
              picUrl: "https://resource.smartisan.com/resource/1/1220858shoujilouceng.jpg",
              picUrl2: null,
              picUrl3: null,
              productId: 150642571432843,
              productImageBig: "https://resource.smartisan.com/resource/1/1220858shoujilouceng.jpg",
              goodsName: "坚果 3",
              salePrice: 1999,
              sortOrder: 0,
              subTitle: "漂亮得不像实力派",
              type: 2,
              updated: 1524195687000
            },{},{},{},{},{}
          ]
        }
      ],
      loading: true,
      notify: '1',
      dialogVisible: false,
      timer: ''
    }
  },
  
  created () {
    // this.play()
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.activity-panel {
    width: 1220px;
    margin: 0 auto;
    .box {
      overflow: hidden;
      position: relative;
      z-index: 0;
      margin-top: 25px;
      box-sizing: border-box;
      border: 1px solid rgba(0,0,0,.14);
      border-radius: 8px;
      background: #fff;
      box-shadow: 0 3px 8px -6px rgba(0,0,0,.1);
    }
    .content {
      float: left;
      position: relative;
      box-sizing: border-box;
      width: 25%;
      height: 200px;
      text-align: center;
    }
    .content ::before{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      box-sizing: border-box;
      border-left: 1px solid #f2f2f2;
      border-left: 1px solid rgba(0,0,0,.1);
      width: 100%;
      height: 100%;
      content: "";
      pointer-events: none;
    }
    .i {
      width: 305px;
      height: 200px;
    }
    .cover-link {
      cursor: pointer;
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 4;
      background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==) repeat;
    }
    a {
      color: #5079d9;
      cursor: pointer;
      transition: all .15s ease-out;
      text-decoration: none;
    }
    a:hover {
      box-shadow: inset 0 0 38px rgba(0,0,0,.08);
      transition: all .15s ease;
    }
  }
   .banner, .banner span, .banner div {
    font-family: "Microsoft YaHei";
    transition: all .3s;
    transition-timing-function: linear;
  }

  .banner {
    cursor: pointer;
    perspective: 3000px;
    position: relative;
    z-index: 19;
    margin: 0 auto;
    width: 1220px;
    height: 500px;
  }
  .img1 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .img2 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 5px;
    left: 0;
    background-size: 95% 100%;
    border-radius: 10px;
  }

  .img3 {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 10px;
  }

  .a {
    z-index: 20;
    transform: translateZ(40px);
  }

  .b {
    z-index: 20;
    transform: translateZ(30px);
  }

  .c {
    transform: translateZ(0px);
  }
  .box {
    overflow: hidden;
    position: relative;
    z-index: 0;
    margin-top: 29px;
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, .14);
    border-radius: 8px;
    background: #fff;
    box-shadow: 0 3px 8px -6px rgba(0, 0, 0, .1);

  }

  ul.box {
    display: flex;
    li {
      flex: 1;
      img {
        display: block;
        width: 305px;
        height: 200px;
      }
    }
  }
  .mt30 {
    margin-top: 30px;
  }
  .w {
    width: 1340px;
    margin: 0 auto;
  }

  .hot {
    display: flex;
    > div {
      flex: 1;
      width: 25%;
    }
  }
  .floors {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .imgbanner {
      width: 50%;
      height: 430px; 
      .cover-link {
        cursor: pointer;
        display: block;
        position: absolute;
        top: 60px;
        left: 0;
        width: 50%;
        height: 430px; 
        z-index: 4;
        background: url(data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEHAAEALAAAAAABAAEAAAICTAEAOw==) repeat;
      }
      .cover-link:hover {
        box-shadow: inset 0 0 38px rgba(0,0,0,.08);
        transition: all .15s ease;
      }
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
</style>
