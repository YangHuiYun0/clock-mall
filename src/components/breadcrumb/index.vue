<template>
<!-- 头部面包屑组件 -->
  <div class="bread-title">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="index" :to="{path: item.path, query: item.query}" >
        <strong v-if="item.path"> {{item.title}}</strong>
        <span v-else>{{item.title}}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: 'Breadcrumb',
    props: {
      levelList: {
        default: [],
        type: Array
      }
    },
    methods: {},
    created() {
    }
  };
</script>

<style lang="scss" scoped>
  .bread-title {
    margin-bottom: 20px;
  }
  .el-breadcrumb {
    font-size: 18px;
  }
</style>
