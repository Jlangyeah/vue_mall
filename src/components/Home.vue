<template>

  <div>
    <el-container class="home_container">
      <div class="nav">
        <div class="w">
          <!-- <span>送货:四川</span> -->
          <span class="fr">
            <span class="txt_welcome" @click="jumpUserInfo">{{this.userName}}</span>
            <span :class="{hide:isLogin}">
              &nbsp;|&nbsp;
              <span class="loginBtn" @click="login">登录</span>

              &nbsp;|&nbsp;
              <span class="registerBtn" @click="register">注册</span>
            </span>
            <span :class="{hide:!isLogin}">
              &nbsp;|&nbsp;
              <router-link :to="{path:'/common/myorders'}">
                <span class="order">我的订单</span>
              </router-link>
              &nbsp;|&nbsp;
              <span @click="logout" class="logout">注销</span>
            </span>

          </span>
        </div>
      </div>
      <!-- 头部区域 -->
      <el-header>
        <div class="w">
          <img src="../assets/book.jpg" alt="" class="logo">
          <span class="header_text">邑大书店</span>
          <el-input placeholder="请输入你要查找的商品" v-model="name" @keyup.enter.native="findProductByName">
            <el-button slot="append" icon="el-icon-search" @click="findProductByName"></el-button>
          </el-input>
          <router-link :to="{path:'/common/cart'}">
            <div>
              <div class="mycart">
                <span class="count">{{count}}</span>
                <i class="icon-qicheqianlian-select-copy iconfont"></i>
                我的购物车
              </div>
              <div class="cartInfo"></div>
            </div>
          </router-link>
        </div>
      </el-header>
      <!-- 页面主题区域 -->
      <el-container class="w">
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse? '64px':'200px'">
          <div class="toggle_button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu background-color="#5d5d59" text-color="#fff" active-text-color="#f8b945" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="subitem.id+''" v-for="subitem in item.children" :key="subitem.id" @click="findProudListByType(subitem.id)">
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{subitem.name}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体区域 -->
        <el-main>
          <div class="productList" :index="item.id" v-for="item in findProductList" :key="item.id">
            <div class="imgBox">
              <!-- <img :src="require(`../assets/img/product/${item.fileName}`)" alt="" @click="selectGood(item.id)"> -->
              <img :src="bindIcon(item.fileName)" alt="" @click="selectGood(item.id)">
            </div>
            <div class="productName">{{item.name}}</div>
            <div>
              <span class="productPrice">￥{{item.price}}</span>
              <span class="productNum">库存:{{item.stock}}</span>
            </div>
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 全部商品信息 -->
    <div class="w content">
      <div class="productList" :index="item.id" v-for="item in productList" :key="item.id" @click="selectGood(item.id)">
        <div class="imgBox">
          <img :src="bindIcon(item.fileName)" alt="">
        </div>
        <div class="productName">{{item.name}}</div>
        <div>
          <span class="productPrice">￥{{item.price}}</span>
          <span class="productNum">库存:{{item.stock}}</span>
        </div>
        <!-- <div class="addCart">
          加入购物车
        </div> -->
      </div>
    </div>
    <div class="footer">
      <div class="w">
        <div class="mod_service">
          <ul>
            <li>
              <span class="iconfont icon-zhengpin"></span>
              <div class="txt">30天无忧退货</div>
            </li>
            <li>
              <span class="iconfont icon-tuihuo"></span>
              <div class="txt">满88元免邮费</div>
            </li>
            <li>
              <span class="iconfont icon-baoyou"></span>
              <div class="txt">正品保障</div>
            </li>
          </ul>
        </div>
        <div class="mod_bottom">
          <div class="bookTxt">BOOK</div>
          <div class="mod_help">
            <dl>
              <dt>售后保障</dt>
              <dd>发票保障</dd>
              <dd>售后规则</dd>
              <dd>缺货规则</dd>
            </dl>
            <dl>
              <dt>主要链接</dt>
              <dd>首页</dd>
            </dl>
            <dl>
              <dt>支付方式</dt>
              <dd>快捷支付</dd>
              <dd>支付宝</dd>
              <dd>货到付款</dd>
            </dl>
          </div>
          <div class="bookk_QR">
            <div>扫描下方二维码迎好礼</div>
            <img src="../assets/QR.png" alt="">
          </div>
        </div>
        <div></div>
      </div>
    </div>
    <!-- 回到顶部按钮 -->
    <el-backtop>UP</el-backtop>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      //字体对象
      iconObj: {
        1: "iconfont icon-daxue",
        2: "iconfont icon-tingmingzhu",
        3: "iconfont icon-kaoshi",
        4: "iconfont icon-wenju",
      },
      //是否折叠
      isCollapse: false,
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
      //header购物车的商品计数器
      count: 0,
    };
  },
  watch: {
    name(newVal, oldVal) {
      console.log(newVal, oldVal);
    },
  },
  created() {
    //左侧菜单数据
    this.getMenuList();
    //所有商品信息
    this.getProductList();
    //检查是否登录
    this.checkLogin();
    //显示购物车信息
    this.findAllCart();
  },
  methods: {
    logout() {
      //调用API
      this.$http({
        method: "post",
        url: "/user/loginout",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
      });
      //清空token
      window.sessionStorage.clear();
      //跳转到登录页
      this.$router.push("/login");
    },
    //购物车订单显示
    findAllCart() {
      this.$http({
        method: "get",
        url: "/cart/findAllCart",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        this.cartList = res.data.data;
        // console.log(this.cartList);
        this.count = res.data.data.length;
      });
    },
    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("/productCategory/list");
      // console.log(res.data);
      if (res.code != 200) return this.$message.error("获取菜单数据失败");
      this.menuList = res.data;
      // this.$message.success("获取菜单数据成功");
    },
    //点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //跳转到登录页
    login() {
      this.$router.push("/login");
    },
    //跳转到注册页
    register() {
      this.$router.push("/register");
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
    //获取所有商品信息
    async getProductList() {
      const { data: res } = await this.$http.get("/product/findAllProduct");
      // console.log(res);
      if (res.code != 200) return this.$message.error("获取商品列表失败");
      // this.$message.success("获取商品列表成功");

      this.productList = res.data;
      // console.log(this.productList);
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
      // console.log(this.findProductList.length);
    },
    //显示用户信息
    findUserOne() {
      this.$router.push("/userInfo");
      this.$http({
        //注意不写请求方式的话默认是get
        method: "get",
        url: "/user/findUserOne",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
      });
    },
    //跳转到用户信息
    jumpUserInfo() {
      this.$router.push("/userInfo");
    },
    //点击路由到商品详细信息页
    selectGood(id) {
      this.$router.push({
        path: "/common",
        query: { goodId: id },
      });
    },
    findProudListByType(id) {
      // console.log("点击了一下");
      this.$http({
        url: "/product/findProudListByType",
        method: "get",
        params: {
          id: id,
          type: "two",
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200) return this.$message("查询商品失败");
        this.findProductList = res.data.data;
        console.log(this.findProductList);
      });
    },
    //绑定头像
    bindIcon(icon) {
      if (icon == null) return "//localhost:9000/img/default.jpg";
      return "//localhost:9000/img/" + icon;
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
.el-menu {
  border-right: none;
  height: 500px;
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
.el-button {
  background: red;
}
.el-main {
  background-color: #e9edf1;
}
.count {
  background-color: #f7170d;
  color: #fff;
  padding: 0 5px;
  height: 14px;
  line-height: 14px;
  border-radius: 7px 7px 7px 0;
  position: absolute;
  left: 86px;
  top: -7px;
}
.mycart {
  width: 132px;
  height: 36px;
  border: 1px solid #eee;
  font: 12px Microsoft YaHei;
  text-align: center;
  line-height: 36px;
  margin-left: 80px;
  color: #fc002a;
  cursor: pointer;
  position: relative;
}
.mycart:hover {
  border: 1px solid #fc002a;
}
.logo {
  width: 10%;
  height: 6%;
}
i {
  margin-right: 5px;
}

.toggle_button {
  background-color: #fc002a;
  text-align: center;
  color: #fff;
  font-size: 12px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-container {
  top: 100px;
}
.productList {
  height: 300px;
  width: 230px;
  margin: 20px 5px 10px !important;
  display: inline-block;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
.productList:hover img {
  //鼠标经过图片放大
  transform: scale(1.2);
}
.productName {
  margin: 0 20px;
  margin-top: 15px;
  color: #666;
  font-size: 14px;
  line-height: 24px;
  height: 60px;
  // width: 180px;
}
.productPrice {
  font-size: 20px;
  color: red;
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  // margin-top: 10px;
}
.txt_welcome {
  cursor: pointer;
}
.txt_welcome:hover {
  color: orangered;
}
.content {
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
.mod_service {
  width: 1200px;
}
.footer {
  margin-top: 50px;
  background-color: #282828;
  height: 418px;
  color: #fff;
}
.footer ul {
  overflow: hidden;
}
.footer ul li {
  float: left;
  list-style: none;
  width: 300px;
  text-align: center;
  margin-top: 40px;
}
.footer .txt {
  margin-top: 10px;
}
.footer .iconfont {
  color: #fff;
  font-size: 70px;
}
.mod_bottom {
  overflow: hidden;
  width: 1200px;
  margin-top: 50px;
}
.mod_bottom .bookTxt {
  // background-color: pink;
  width: 300px;
  float: left;
  font-size: 40px;
  margin-left: 40px;
}
.mod_bottom .mod_help {
  width: 510px;
  float: left;
}

dl {
  list-style: none;
  float: left;
  width: 170px;
  line-height: 1.5;
}
.mod_help dt {
  font-size: 20px;
}
.mod_help dd {
  margin-left: 0;
}
.mod_help {
}
.bookk_QR {
  width: 350px;
  float: left;
}
.bookk_QR img {
  width: 40%;
}
.bookk_QR div {
  font-size: 20px;
  margin-bottom: 10px;
}
</style>