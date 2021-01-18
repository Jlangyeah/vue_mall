<template>
  <div>
    <!-- 页面主题区域 -->
    <el-container class="w">
      <router-view></router-view>
      <!-- 侧边栏 -->
      <el-aside>
        <div>
          <img :src="bindIcon(productInfoList.fileName)" alt="">
        </div>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <div>
          <div class="productName">{{productInfoList.name}}</div>
          <div class="description">{{productInfoList.description}}</div>
          <span class="productPrice">￥{{productInfoList.price}}</span>
          <span>库存{{productInfoList.stock}}</span>
          <br>
          <el-input-number v-model="productNum" :min="1" :max="10" label="描述文字"></el-input-number>
          <!-- <router-link :to="{path:'/common/cart'}"> -->
          <el-button type="primary" class="goCart" @click="addCart">加入购物车</el-button>
          <!-- </router-link> -->
        </div>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //是否登录
      isLogin: false,
      //用户名
      userName: "",
      //所有商品信息
      productList: [],
      //搜索框的商品名
      name: "",
      //查询商品的列表
      findProductList: [],
      //是否高亮
      isActive: false,
      //商品ID
      id: this.$route.query.goodId,
      //商品详情列表
      productInfoList: [],
      //商品数量
      productNum: 1,
    };
  },
  created() {
    //检查是否登录
    this.checkLogin();
    //商品详情
    this.productInfo();
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear();
      //跳转到登录页
      this.$router.push("/login");
    },
    //检查是否登录
    checkLogin() {
      const tokenStr = window.sessionStorage.getItem("token");
      if (tokenStr) {
        this.isLogin = true;
        this.userName =
          "欢迎回来，" + window.sessionStorage.getItem("userName");
      }
      // console.log("是否隐藏" + this.isLogin);
    },
    //根据商品名查找商品
    async findProductByName() {
      if (this.name == "") return;
      const { data: res } = await this.$http.get(
        "/product/findProductByName?name=" + this.name
      );
      if (res.code != 200) return this.$message.error("查询商品失败");
      console.log(res);
      this.findProductList = res.data;
      console.log(this.findProductList);
    },
    //商品详情
    productInfo() {
      this.$http({
        method: "get",
        url: "/product/findProudById",
        params: {
          id: this.id,
        },
      }).then((res) => {
        this.productInfoList = res.data.data;
        console.log(this.productInfoList);
      });
    },
    //绑定头像
    bindIcon(icon) {
      if (icon == null) return "//localhost:9000/img/default.jpg";
      return "//localhost:9000/img/" + icon;
    },
    //添加订单到购物车
    addCart() {
      this.$http({
        method: "post",
        url: "/cart/addCart",
        params: {
          price: this.productInfoList.price,
          productId: this.productInfoList.id,
          quantity: this.productNum,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 202) {
          if (res.data.code == 509) {
            this.$router.push("/login");
          }
          return this.$message.error(res.data.msg);
        }
        // if (res.data.code == 516) return this.$message.error(res.data.msg);
        this.$message.success(res.data.msg);
        this.$router.push("/common/cart");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.hide {
  display: none;
}

.loginBtn:hover {
  color: orangered;
  cursor: pointer;
}
.registerBtn:hover {
  color: orangered;
  cursor: pointer;
}

.logout:hover {
  color: orangered;
  cursor: pointer;
}
.order:hover {
  color: orangered;
  cursor: pointer;
}
.w {
  width: 1200px;
  margin: 0 auto;
}
.nav {
  height: 35px;
  background-color: #f6f6f6;
  font-size: 12px;
  line-height: 35px;
  span {
    margin: 0 10px;
  }

  .fr {
    float: right;
  }
}
.menu {
  border-right: none;
  height: 500px;
  div {
    width: 100%;
    height: 32px;
    background-color: #ecf5ff;
    // border-bottom: 1px solid gray;
    box-shadow: 1px 1px 5px gray;
    line-height: 32px;
    text-align: center;
    font-weight: 700;
  }
}

.el-header {
  background-color: #fff;
  display: flex;
  height: 140px !important;
  justify-content: space-between;
  align-items: center;
  color: black;
  font-size: 30px;
  // height: height * 10 !important;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
      margin-right: 10px;
    }
  }
}

.el-main {
  background-color: #e9edf1;
  margin-left: 30px;
}

.logo {
  width: 10%;
  height: 6%;
  cursor: pointer;
}
i {
  margin-right: 5px;
}

.el-container {
  top: 100px;
}
.productList {
  height: 360px;
  width: 230px;
  margin: 20px 5px 10px !important;
  display: inline-block;
  text-align: center;
  background-color: #fff;
  img {
    width: 50%;
    height: 50%;
  }
}
.productName {
  width: 590px;
  height: 56px;
  font: 700 16px Arial, "microsoft yahei";
  color: #666;
  margin-top: 10px;
  line-height: 28px;
}
.productPrice {
  font-size: 30px;
  color: red;
  margin-top: 40px;
  // margin-left: 20px;
  margin-right: 20px;
  // margin-top: 10px;
}
.txt_welcome {
  cursor: pointer;
}
.txt_welcome:hover {
  color: orangered;
}
.footer {
  background-color: #f4f4f4;
  margin-top: 100px;
}
.imgBox {
  height: 150px;
  width: 150px;
  // text-align: center;
  margin: 20px auto;
}

.addCart {
  margin: 0 auto;
  margin-top: 20px;
  font-size: 18px;
  line-height: 46px;
  background-color: #54dee9;
  // border: 1px solid blue;
  color: #fff;
  height: 46px;
  width: 150px;
}

.el-input {
  width: 400px;
  margin-left: 100px;
}
.avatar {
  height: 200px;
  width: 200px;
}
.userInfo {
  color: #555666;
}
.userInfo div span {
  text-align: right;
  display: inline-block;
  margin-bottom: 20px;
  width: 70px;
  margin-right: 20px;
}

.el-aside {
  width: 430px !important;
  height: 430px !important;
  overflow: hidden;
  border: 1px solid #eee;
}

.goCart {
  margin-top: 40px;
  margin-left: 20px;
}

.description {
  margin-bottom: 30px;
}
</style>