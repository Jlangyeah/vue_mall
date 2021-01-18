<template>
  <el-container v-if="userInfoList!=null ">
    <!-- 左侧头像 -->
    <el-aside>
      <img :src="bindIcon(userInfoList.fileName)" alt="" class="avatar">
      <div>
        <router-view></router-view>
      </div>
    </el-aside>
    <!-- 右侧文字主体 -->
    <el-main class="userInfo">
      <div><span>姓名</span>{{userInfoList.userName}}</div>
      <div>
        <span>性别</span><i v-if="userInfoList.gender=='WOMAN'">女</i>
        <i v-if="userInfoList.gender=='MAN'">男</i>
      </div>
      <div><span>手机号</span> {{userInfoList.mobile}}</div>
      <div><span>邮箱</span>{{userInfoList.email}}</div>
      <div><span>身份证号</span>{{userInfoList.identityCode}}</div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      userInfoList: [],
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
        this.userInfoList = res.data.data;
        // console.log(this.userInfoList);
        // console.log(this.userInfoList.fileName);
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
i {
  font-style: normal;
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

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
}
</style>