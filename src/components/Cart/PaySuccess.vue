<template>
  <div class="box">
    <img src="../../assets/paysuccess.png" alt="" class="payimg">
    <br>
    支付成功
    <router-link :to="{path:'/'}">
      <div class="btn">
        <el-button>返回首页</el-button>
      </div>
    </router-link>

  </div>
</template>

<script>
export default {};
</script>
<style lang="less" scoped>
.payimg {
  width: 15%;
}
.box {
  box-sizing: border-box;
  width: 1000px;
  height: 400px;
  border: 4px solid blue;
  margin: 0 auto;
  text-align: center;
  padding-top: 60px;
  color: orangered;
}
.payTxt {
  text-align: center;
}
.btn {
  margin-top: 30px;
}
</style>

