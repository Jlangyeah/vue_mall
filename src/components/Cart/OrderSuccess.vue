<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="2" finish-status="success">
      <el-step title="查看购物车"></el-step>
      <el-step title="确定订单信息"></el-step>
      <el-step title="成功提交订单"></el-step>
    </el-steps>
    <div class="orderBody">
      <img :src="require('../../assets/success.png')" alt="" class="success_img">
      <div class="msg">
        <div class="successTxt">订单提交成功</div>
        <div>订单编号：{{serialnumber}}</div>
        <div>应付款:<span class="money">￥{{Sumcost}}</span> </div>
        <a :href="'http://localhost:9000/alipay/pay?id='+id" @click="check">立即付款</a>
      </div>
    </div>

  </div>
</template>
 
 <script>
export default {
  created() {
    // this.check();
  },
  data() {
    return {
      timmer: null,
      payCode: null,
      //订单号
      serialnumber: this.$route.query.serialnumber,
      Sumcost: this.$route.query.Sumcost,
      id: this.$route.query.id,
    };
  },
  methods: {
    //立即付款
    pay() {
      console.log("付款");
    },
    //检测是否支付成功
    checkPay() {
      this.$http({
        url: "/alipay/check",
        method: "get",
      }).then((res) => {
        console.log(res);
        this.payCode = res.data;
      });
    },
    //轮询
    check() {
      this.$router.push("/");
      setInterval(() => {
        if (this.payCode == "200") {
          return;
        }
        setTimeout(this.checkPay, 0);
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.orderBody {
  width: 1000px;
  height: 400px;
  margin: 40px 100px 0;
  // background-color: pink;
  // line-height: 30px;
  border: 1px solid #c0c4cc;
}
.success_img {
  // box-sizing: border-box;
  padding: 20px 0 0;
  height: 100px;
  width: 100px;
  margin: 0 auto 10px;
  display: block;
}
.msg {
  text-align: center;
}
.successTxt {
  font-size: 20px;
  margin-bottom: 30px;
}
.money {
  color: rgb(230, 27, 27);
}
.btnPay {
  margin-top: 20px;
}
</style>