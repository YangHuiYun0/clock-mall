<template>
<!-- 商品展示页面 -->
    <div class="goods">
      <!-- 头部选择块 -->
        <div class="nav">
            <div class="w">
                <a  :class="{active:sortType===1}" @click="reset()">综合排序</a>
                <a  @click="sortByPrice(1)" :class="{active:sortType===2}">价格从低到高</a>
                <a  @click="sortByPrice(2)" :class="{active:sortType===3}">价格从高到低</a>
                <div class="price-interval">
                <input type="number" class="input" placeholder="价格" v-model="min">
                <span style="margin: 0 5px"> - </span>
                <input type="number" placeholder="价格" v-model="max" style="margin-right:20px">
                 <el-select v-model="goodsType" clearable  placeholder="商品类别">
                    <el-option
                    v-for="item in goodsTypeList"
                    :key="item.categoryCode"
                    :label="item.categoryName"
                    :value="item.categoryCode">
                    </el-option>
                </el-select>
                <y-button text="确定" classStyle="main-btn" @btnClick="reset" style="margin-left: 10px;"></y-button>
                </div>
            </div>
        </div>
        <div v-loading="loading" element-loading-text="加载中..." style="min-height: 35vw;">
            <div class="img-item" v-if="!noResult">
                <!--商品-->
                <div class="goods-box w">
                    <mall-goods v-for="(item,i) in goods" :key="i" :msg="item"></mall-goods>
                </div>
                <el-pagination
                  background
                  layout="total, prev, pager, next"
                  :current-page=currentPage
                  :total=total
                  :page-size=pageSize
                  @current-change="currentChangeHandle">
                </el-pagination>
            </div>
            <div class="no-info" v-if="noResult">
                <div class="no-data">
                <img src="/static/images/no-search.png">
                <br> 抱歉！暂时还没有商品
                </div>
                <section class="section">
                <y-shelf :title="recommendPanel.name">
                    <div slot="content" class="recommend">
                    <mall-goods :msg="item" v-for="(item,i) in recommendPanel.panelContents" :key="i"></mall-goods>
                    </div>
                </y-shelf>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import YShelf from "../../components/shelf"; //卡片组件
import mallGoods from "../../components/mallGoods";
import YButton  from "../../components/yButton";
import { getAllGoodsList } from "../../api/before-goods";
import { getCategoryList } from "../../api/goods-manage";

export default {
    components:{
        YShelf,mallGoods,YButton
    },
    data(){
        return{
            goods: [],
            noResult: false,
            error: false,
            min: '',
            max: '',
            goodsType:'',
            loading: false,
            timer: null,
            sortType: 1,
            windowHeight: null,
            windowWidth: null,
            recommendPanel: [],
            sort: 0,
            currentPage: 0,
            total: 30,
            pageSize: 12,
            desc:this.$route.query.key || '',//根据商品查询
            goodsTypeList:[],
        }
    },
    mounted(){
        this._getAllGoods();
        this.getTreeInfo();
    },
    watch:{
        $route: function(to, from) {
            if (to.query.key !== from.query.key) {
                this._getAllGoods(to.query.key);
            }
        },
        desc:function(newVal,oldVal){
            if(newVal !== oldVal){
                this._getAllGoods();
            }
        },
    },
    methods:{

        //改变页数
        handleSizeChange (val) {
            this.pageSize = val
            this._getAllGoods()
            this.loading = true
        },
    // 默认排序
        reset () {
            this.sortType = 1;
            this.sort = 0;
            this.currentPage = 1;
            this.loading = true;
            this._getAllGoods();
        },
        // 改变当前页
        handleCurrentChange (val) {
            this.currentPage = val
            this._getAllGoods()
            this.loading = true
        },
        // 价格排序
        sortByPrice (v) {
            v === 1 ? this.sortType = 2 : this.sortType = 3
            this.sort = v
            this.currentPage = 1
            this.loading = true
            this._getAllGoods()
        },
        _getAllGoods (_key) {
            if(_key){
               this.desc = _key;
            }
            let cid = this.$route.query.cid
            if (this.min !== '') {
            this.min = Math.floor(this.min)
            }
            if (this.max !== '') {
            this.max = Math.floor(this.max)
            }
            let params = {
                page: this.currentPage,
                size: this.pageSize,
                sortType: this.sort,
                amountStart: this.min,
                amountEnd: this.max,
                desc: this.desc,
                categoryCode: this.goodsType,
            }
            getAllGoodsList(params).then(res => {
              if (res && res.code === 200) {
                this.total = res.data.total;
                this.goods = res.data.rows;
                this.noResult = false;
                if (this.total === 0) {
                  this.noResult = true
                }
                this.error = false
              } else {
                this.error = true
              }
              this.loading = false
            })
        },

        getTreeInfo(){
            const that = this;
            getCategoryList().then(res=>{
                if(res && res.code === 200){
                that.goodsTypeList = res.data;
                }
            }).catch()
        },

      currentChangeHandle(val){
        this.currentPage = val;
        this._getAllGoods();
      },
    }
}

</script>
<style lang='scss' scoped>
    @import "../../assets/style/mixin";
    @import "../../assets/style/theme";
    a{
        text-decoration:none;
    }
    ul li{
        list-style-type:none;
    }
    .nav {
        height: 60px;
        line-height: 60px;
        > div {
        display: flex;
        align-items: center;
        a {
            padding: 0 15px;
            height: 100%;
            @extend %block-center;
            font-size: 12px;
            color: #999;
            &.active {
            color: #5683EA;
            }
            &:hover {
            color: #5683EA;
            }
        }
        input {
            @include wh(80px, 30px);
            border: 1px solid #ccc;
        }
        input + input {
            margin-left: 10px;
        }
        }
        .price-interval {
            padding: 0 15px;
            @extend %block-center;
            input[type=number] {
                border: 1px solid #ccc;
                text-align: center;
                // background: none;
                border-radius: 5px;
            }
        }
    }
    .w{
        width: 1340px;
        margin: 0 auto;
    }
    .img-item{
        display: flex;
        flex-direction: column;
    }
    .goods-box {
    > div {
      float: left;
      border: 1px solid #efefef;
    }
  }
    .no-info {
        padding: 100px 0;
        text-align: center;
        font-size: 30px;
        display: flex;
        flex-direction: column;
        .no-data{
        align-self: center;
        }
    }
    .el-pagination{
        align-self: flex-end;
        margin: 3vw 10vw 2vw;
    }

    .section {
        padding-top: 8vw;
        margin-bottom: -5vw;
        width: 1218px;
        align-self: center;
    }

    .recommend {
        display: flex;
        > div {
        flex: 1;
        width: 25%;
        }
    }
</style>
