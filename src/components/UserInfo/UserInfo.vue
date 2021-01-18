<template>

  <div>
    <el-container class="home_container">
      <div class="nav">
        <div class="w">
          <!-- <router-link :to="{path:'/home'}">
            <span>首页</span>
          </router-link> -->
          <span class="fr">
            <span class="txt_welcome" @click="jumpUserInfo">{{this.userName}}</span>
            <span :class="{hide:isLogin}">
              &nbsp;|&nbsp;
              <span class="loginBtn" @click="login">登录</span>

              &nbsp;|&nbsp;
              <span class="registerBtn" @click="register">注册</span>
            </span>
            &nbsp;|&nbsp;
            <router-link class="order" :to="{path:'/common/myorders'}">
              我的订单
            </router-link>
            &nbsp;|&nbsp;
            <span @click="logout" class="logout">注销</span>
          </span>
        </div>
      </div>
      <!-- 头部区域 -->
      <el-header>
        <div class="w">
          <img src="../../assets/book.jpg" alt="" class="logo" @click="jumpHome">
          <span class="header_text">春秋书店</span>
          <el-input placeholder="请输入内容" v-model="name" @keyup.enter.native="findProductByName">
            <el-button slot="append" icon="el-icon-search" @click="findProductByName"></el-button>
          </el-input>
        </div>
      </el-header>
    </el-container>
    <!-- 页面主题区域 -->
    <el-container class="w">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'200px'">
        <el-menu router>
          <el-menu-item index="/myUserInfo">
            <i class="el-icon-menu"></i>
            <span slot="title">个人资料</span>
          </el-menu-item>
          <el-menu-item index="/modifyUserInfo">
            <i class="el-icon-menu"></i>
            <span slot="title">修改资料</span>
          </el-menu-item>
          <el-menu-item index="/address">
            <i class="el-icon-menu"></i>
            <span slot="title">收货地址</span>
          </el-menu-item>
          <router-link :to="{path:'/backStage'}">
            <el-menu-item index="/back_stage" v-if="username=='admin'">
              <i class="el-icon-menu"></i>
              <span slot="title">管理员</span>
            </el-menu-item>
          </router-link>
        </el-menu>

      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
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
      //是否高亮
      isActive: false,
      //是否为管理员
      isAdmin: false,
      //用户名
      username: window.sessionStorage.getItem("userName"),
    };
  },
  created() {
    //检查是否登录
    this.checkLogin();
    //检查是否为管理员
    this.checkIsAdmin();
  },
  methods: {
    logout() {
      //清空token
      window.sessionStorage.clear();
      //跳转到登录页
      this.$router.push("/login");
    },
    //跳转到登录页
    login() {
      this.$router.push("/login");
    },
    //跳转到注册页
    register() {
      this.$router.push("/register");
    },
    //跳转到主页
    jumpHome() {
      this.$router.push("/home");
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
      console.log(this.findProductList.length);
    },
    //跳转到用户信息
    jumpUserInfo() {
      this.isActive = true;
      this.$router.push("/userInfo");
    },
    //跳转到修改资料
    jumpModify() {
      this.isActive = true;
      this.$router.push("/modifyUserInfo");
    },
    //检查是否为管理员
    checkIsAdmin() {
      if (window.sessionStorage.getItem("userName" == "admin")) {
        this.isAdmin = true;
      }
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
  // border: 1px solid gray;
  // box-shadow: 1px 1px 5px gray;
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
}

.logo {
  width: 10%;
  height: 6%;
  cursor: pointer;
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
  height: 360px;
  width: 230px;
  margin: 20px 5px 10px !important;
  display: inline-block;
  text-align: center;
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
  }
}
.admin {
  display: block;
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
</style>