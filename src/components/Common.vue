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
            &nbsp;|&nbsp;
            <router-link :to="{path:'/common/myorders'}">
              <span class="order">我的订单</span>
            </router-link>
            &nbsp;|&nbsp;
            <span @click="logout" class="logout">注销</span>
          </span>
        </div>
      </div>
      <!-- 头部区域 -->
      <el-header>
        <div class="w">
          <img src="../assets/book.jpg" alt="" class="logo" @click="jumpHome">
          <span class="header_text">邑大书店</span>
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="name" @keyup.enter.native="findProductByName">
            <el-button slot="append" icon="el-icon-search" @click="findProductByName"></el-button>
          </el-input>
        </div>
      </el-header>
    </el-container>
    <!-- 页面主题区域 -->
    <el-container class="w">
      <router-view></router-view>
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
      productNum: "",
    };
  },
  created() {
    //检查是否登录
    this.checkLogin();
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
      console.log(this.findProductList);
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

.logo {
  width: 10%;
  height: 6%;
  cursor: pointer;
}
i {
  margin-right: 5px;
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

.el-input {
  width: 400px;
  margin-left: 100px;
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