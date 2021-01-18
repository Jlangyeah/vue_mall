<template>
  <div>
    <div class="header">
      <div class="w">
        <router-link :to="{path:'/home'}">
          <img src="../assets/book.jpg" alt="">
        </router-link>
        <span>欢迎注册</span>
      </div>
    </div>
    <div class="container w">
      <img src="../assets/login.png" alt="" @click="jumpHome">
      <div class="login_box">
        <span class="register">已有账号，立即
          <router-link class="login_text" :to="{path:'/login'}">
            登录
          </router-link>
        </span>
        <!-- 注册表单 -->
        <el-form ref="registerFormRef" :model="registerForm" :rules="registerFormRules" label-width="90px" class="login_form">
          <!-- 用户名 -->
          <el-form-item label="用户名" prop="loginName">
            <el-input v-model="registerForm.loginName" prefix-icon="iconfont icon-yonghu"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="registerForm.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
          </el-form-item>
          <!-- 手机 -->
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="registerForm.mobile" type="text" prefix-icon="iconfont icon-shouji"></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerForm.email" type="text" prefix-icon="iconfont icon-svg17"></el-input>
          </el-form-item>
          <!-- 身份证号 -->
          <el-form-item label="身份证号" prop="identityCode">
            <el-input v-model="registerForm.identityCode" type="text" prefix-icon="iconfont icon-credentials_icon"></el-input>
          </el-form-item>
          <!-- 真实姓名 -->
          <el-form-item label="真实姓名" prop="userName">
            <el-input v-model="registerForm.userName" type="text" prefix-icon="iconfont icon-xingming"></el-input>
          </el-form-item>
          <!-- 性别 -->
          <div class="gender"><span><i>*</i>性别</span>:
            <el-radio label="MAN" v-model="registerForm.gender">男</el-radio>
            <el-radio label="WOMAN" v-model="registerForm.gender">女</el-radio>
          </div>
          <!-- 按钮 -->
          <el-form>
            <el-button type="primary" @click="register">立即注册</el-button>
          </el-form>
        </el-form>
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
            手机京东
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
            京东社区
          </a>
          |
          <a href="//gongyi.jd.com" target="_blank">
            京东公益
          </a>
          |
          <a target="_blank" href="//www.joybuy.com/" clstag="pageclick|keycount|20150112ABD|9">English Site</a>
        </div>
        <div class="copyright">
          Copyright&nbsp;&copy;&nbsp;2004-2020&nbsp;&nbsp;京东JD.com&nbsp;版权所有
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱的规则、
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

      if (regEmail.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    //验证身份证号的规则
    var checkIdNum = (rule, value, cb) => {
      //验证身份证号的正则表达式
      const regIdNum = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

      if (regIdNum.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的身份证号"));
    };

    //验证姓名的规则
    var checkFullName = (rule, value, cb) => {
      //验证姓名的正则表达式
      //只能输入英文和中文
      const regFullName = /^[\u4E00-\u9FA5A-Za-z]+$/;

      if (regFullName.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的姓名"));
    };
    return {
      //注册表单的数据绑定对象
      registerForm: {
        loginName: "",
        password: "123456",
        email: "315@qq.cpm",
        gender: "",
        identityCode: "445221199807164142",
        userName: "",
        mobile: "13433333333",
      },
      //注册表单的验证规则对象
      registerFormRules: {
        //验证用户名是否合法`
        loginName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
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
        //验证邮箱
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        //验证身份证号
        identityCode: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            validator: checkIdNum,
            trigger: "blur",
          },
        ],
        //验证真实姓名
        userName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" },
          {
            validator: checkFullName,
            trigger: "blur",
          },
        ],
        //验证性别
        gender: [{ required: true, message: "请输入性别", trigger: "blur" }],
        //验证手机号
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    register() {
      //表单预校验
      this.$refs.registerFormRef.validate((valid) => {
        if (!valid) return;
        //发起请求
        this.$http({
          url: "/user/register",
          method: "post",
          params: {
            email: this.registerForm.email,
            gender: this.registerForm.gender,
            identityCode: this.registerForm.identityCode,
            loginName: this.registerForm.loginName,
            mobile: this.registerForm.mobile,
            password: this.registerForm.password,
            userName: this.registerForm.userName,
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code == 201) {
            this.$message.success("注册成功");
            return this.$router.push("/login");
          }
          this.$message.error(res.data.msg);
        });
      });
    },
    //跳转到主页
    jumpHome() {
      this.$router.push("/home");
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
.login_text {
  cursor: pointer;
  color: orangered;
}
.login_container img {
  position: absolute;
  top: 10%;
  left: 10%;
}

.container {
  height: 550px;
  background-color: #f3f0f9;
  width: 100%;
}
.login_box {
  background-color: #fff;
  height: 500px;
  width: 450px;
  position: absolute;
  top: 15%;
  left: 50%;
  border-radius: 3px;
  border: 1px solid #2b4b6b;
  // a {
  //   color: reds;
  // }
}

.el-form {
  margin-top: 40px;
  margin-right: 40px;
}

.el-button {
  position: absolute;
  width: 80%;
  bottom: 10px;
  left: 60px;
}

.register {
  position: absolute;
  top: 15px;
  right: 50px;
  color: gray;
  text-decoration: none;
}
.gender {
  i {
    font-style: normal;
    color: #f56c6c;
    margin-right: 4px;
  }
  text-align: center;
  color: #606266;
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
</style>