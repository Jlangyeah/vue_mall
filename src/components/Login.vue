<template>

  <div>
    <div class="header">
      <div class="w">
        <img src="../assets/book.jpg" alt="" @click="jumpHome">
        <span>欢迎登录</span>
      </div>
    </div>
    <div class="container w">
      <!-- <img src="../assets/login.png" alt=""> -->
      <div class="content">
        <div class="login_box">
          <span class="register" @click="register">注册</span>
          <!-- 登录表单 -->
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="80px" class="login_form">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="loginName">
              <el-input v-model="loginForm.loginName" prefix-icon="iconfont icon-yonghu"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-mima" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
            <!-- 按钮 -->
            <el-form>
              <el-button type="primary" @click="login">登录</el-button>
            </el-form>
          </el-form>
        </div>
      </div>

    </div>

    <div class="w">
      <div id="footer-2013">
        <div class="links">
          <a rel="nofollow" target="_blank" href="//about.jd.com/">
            关于我们
          </a>
          |
          <a rel="nofollow" target="_blank" href="//www.jd.com/contact/">
            联系我们
          </a>
          |
          <a rel="nofollow" target="_blank" href="//zhaopin.jd.com/">
            人才招聘
          </a>
          |
          <a rel="nofollow" target="_blank" href="//lai.jd.com/">
            商家入驻
          </a>
          |
          <a rel="nofollow" target="_blank" href="//jzt.jd.com/">
            广告服务
          </a>
          |
          <a rel="nofollow" target="_blank" href="//app.jd.com/">
            手机拼夕夕
          </a>
          |
          <a target="_blank" href="//club.jd.com/links.aspx">
            友情链接
          </a>
          |
          <a target="_blank" href="//media.jd.com/">
            销售联盟
          </a>
          |
          <a href="//pro.jd.com/mall/active/3WA2zN8wkwc9fL9TxAJXHh5Nj79u/index.html" target="_blank">
            拼夕夕社区
          </a>
          |
          <a href="//gongyi.jd.com" target="_blank">
            拼夕夕公益
          </a>
          |
          <a target="_blank" href="//www.joybuy.com/" clstag="pageclick|keycount|20150112ABD|9">English Site</a>
        </div>
        <div class="copyright">
          Copyright&nbsp;&copy;&nbsp;2020-2021&nbsp;&nbsp;拼夕夕.com&nbsp;版权所有
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //登录表单的数据绑定对象
      loginForm: {
        loginName: "admin",
        password: "123123",
      },
      //登录表单的验证规则对象
      loginFormRules: {
        //验证用户名是否合法`
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          // {
          //   min: 3,
          //   max: 12,
          //   message: "长度在 3 到 12 个字符",
          //   trigger: "blur",
          // },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/user/login?loginName=" +
            this.loginForm.loginName +
            "&password=" +
            this.loginForm.password
        );
        console.log(res);
        if (res.code != 200)
          return this.$message.error("登录失败，用户名或者密码错误");
        this.$message.success("登录成功");
        //1.将登录成功之后的token保存到sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        window.sessionStorage.setItem("userName", this.loginForm.loginName);
        if (window.sessionStorage.getItem("userName") == "admin") {
          return this.$router.push("/backStage");
        }
        //通过编程式导航跳到后台主页
        this.$router.push("/home");
      });
    },
    register() {
      this.$router.push("/register");
    },
    //跳转到主页
    jumpHome() {
      this.$router.push("/home");
    },
    //输入框回车
    onSubmit() {
      console.log("1");
      this.login();
    },
  },
};
</script>

<style lang="less" scoped>
.w {
  width: 990px;
  margin: 0 auto;
}
.header {
  height: 80px;
  width: 100%;
  background-color: #fff;
  img {
    // height: 6%;
    width: 6%;
    // margin-top: 20px;
    vertical-align: middle;
    cursor: pointer;
  }
  span {
    font-size: 28px;
    line-height: 80px;
    margin-left: 15px;
  }
}

.login_container img {
  position: absolute;
  top: 10%;
  left: 10%;
}

.container {
  height: 575px;
  background-color: #f3f0f9;
  width: 100%;
}
.login_box {
  background-color: #fff;
  height: 300px;
  width: 450px;
  position: absolute;
  top: 25%;
  left: 35%;
  border-radius: 3px;
  border: 1px solid #2b4b6b;
  // opacity: 0.4;
}

.el-form {
  margin-top: 80px;
  margin-right: 40px;
}

.el-button {
  position: absolute;
  width: 80%;
  bottom: 40px;
  left: 60px;
}

.register {
  position: absolute;
  top: 30px;
  right: 50px;
  color: gray;
  text-decoration: none;
  cursor: pointer;
}
.register:hover {
  color: orangered;
}

#footer-2013 {
  // background-color: pink;
  margin-top: 15px;
  text-align: center;
  font-size: 12px;
  a {
    margin: 0 10px;
    text-decoration: none;
    color: #666;
  }

  .copyright {
    margin: 10px 0;
  }
}
.content {
  background: url(https://cdn.pixabay.com/photo/2015/11/19/21/11/knowledge-1052014_1280.jpg)
    no-repeat;
  height: 100%;
}
</style>  