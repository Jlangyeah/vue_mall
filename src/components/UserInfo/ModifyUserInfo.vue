<template>
  <div>
    <!-- 内容主体区域 -->
    <el-form ref="modifyFormRef" :rules="modifyformRules" :model="modifyform" label-width="80px">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="modifyform.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="modifyform.mobile"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="modifyform.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="modifyform.email"></el-input>
      </el-form-item>
      <!-- <el-form-item label="性别">
      <el-input v-model="modifyform.gender"></el-input>
    </el-form-item> -->
      <el-form-item label="身份证号" prop="identityCode">
        <el-input v-model="modifyform.identityCode"></el-input>
      </el-form-item>
      <!-- 性别 -->
      <el-form-item class="gender" label="性别" prop="gender">
        <el-radio label="MAN" v-model="modifyform.gender">男</el-radio>
        <el-radio label="WOMAN" v-model="modifyform.gender">女</el-radio>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="modifyUserInfo">确定</el-button>
    </span>
  </div>

</template>

<style lang="less" scoped>
.el-input {
  width: 40%;
}
.el-form {
  margin-left: 40px;
}
.el-button {
  margin-left: 40%;
}
</style>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        //合法邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    //检验手机号得到校验规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        //合法手机号
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    //校验身份证号的校验规则
    var checkIdentityCode = (rule, value, cb) => {
      //校验身份证的正则表达式
      const regIdentityCode = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

      if (regIdentityCode.test(value)) {
        //合法身份证号
        return cb();
      }

      cb(new Error("请输入合法的身份证号"));
    };
    return {
      // userInfoList: [],
      //修改表单的数据对象
      modifyform: {
        // userName: "",
        // password: "",
        // mobile: "",
        // identityCode: "",
        // gender: "",
        // email: "",
      },
      //修改用户信息的验证规则对象
      modifyformRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在3到10个字符之间",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在6到10个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur",
          },
        ],
        identityCode: [
          { required: true, message: "请输入身份证号", trigger: "blur" },
          {
            validator: checkIdentityCode,
            trigger: "blur",
          },
        ],
        gender: [
          {
            required: true,
            message: "请选择性别",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    //获取用户信息
    this.findUser();
  },
  methods: {
    //显示用户信息
    findUser() {
      this.$http({
        //注意不写请求方式的话默认是get
        method: "get",
        url: "/user/findUserOne",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取用户信息失败");
        // this.userInfoList = res.data.data;
        this.modifyform = res.data.data;
        console.log(this.modifyform);
        // console.log(this.userInfoList.fileName);
      });
    },
    //修改用户信息
    modifyUserInfo() {
      //表单预校验
      this.$refs.modifyFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) return;

        //发起请求
        this.$http({
          method: "put",
          url: "/user/updateUser",
          params: {
            userName: this.modifyform.userName,
            mobile: this.modifyform.mobile,
            password: this.modifyform.password,
            identityCode: this.modifyform.identityCode,
            email: this.modifyform.email,
            gender: this.modifyform.gender,
          },
          headers: {
            token: window.sessionStorage.getItem("token"),
          },
        }).then((res) => {
          // console.log(res);
          if (res.data.code != 204)
            return this.$message.error("修改用户信息失败");
          this.$message.success("修改用户信息成功");
          //延迟一秒后执行
          setTimeout(() => {
            this.$router.push("/myUserInfo");
          }, 800);
        });
      });
    },
  },
};
</script>