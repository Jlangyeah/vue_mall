<template>
  <div class="w">
    <!-- 搜索框 -->
    <div class="inp">
      <el-input placeholder="请输入内容" v-model="searchName" @keyup.enter.native="findProductByName">
        <el-button type="primary" slot="append" icon="el-icon-search" @click="findProductByName"></el-button>
      </el-input>
    </div>
    <div v-for="item in productList" :key="item.id" class="productBox">

    </div>
  </div>
</template>


<script>
export default {
  created() {},
  data() {
    return {
      //搜索框的内容
      searchName: "",
      //商品列表
      productList: [],
    };
  },
  methods: {
    //搜索商品
    findProductByName() {
      this.$http({
        url: "/product/findProductByName",
        method: "get",
        params: {
          name: this.searchName,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200) return this.$message.error("搜索失败");
        this.productList = res.data.data;
        console.log(this.productList);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
  margin: 0 450px;
}
.w {
  width: 1200px;
  margin: 0 auto;
}
.el-card {
  width: 1200px;
  height: 500px;
}
.productBox {
  width: 250px;
  height: 250px;
  background-color: pink;
  display: inline-block;
  margin: 20px;
}
</style>
