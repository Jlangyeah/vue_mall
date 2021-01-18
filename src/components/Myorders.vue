<template>
  <div>
    <el-table :data="orderList.slice((pageNum-1)*pageSize,pageNum*pageSize)" stripe :header-cell-style="{background:'#2b4b6b',color:'#fff' }" :default-sort="{prop: 'updateTime', order: 'descending'}">
      <!-- <el-table-column label="数量" prop=""></el-table-column> -->
      <el-table-column label="时间" prop="updateTime" :sortable="true"></el-table-column>
      <el-table-column label="订单号" prop="serialnumber"></el-table-column>
      <el-table-column label="价格" prop="cost"></el-table-column>
      <el-table-column label="收获地址" prop="userAddress"></el-table-column>
      <el-table-column label="订单状态" prop="status">
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.status=='已退货'">退款成功</span>
        </template> -->
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status=='已发货'||scope.row.status=='未发货'" @click="showPayBackDia(scope.row.id)" size="mini">退款</el-button>
          <el-button type="primary" v-if="scope.row.status=='未支付'" size="mini">
            <a :href="'http://localhost:9000/alipay/pay?id='+scope.row.id">支付</a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页模块 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[6, 12, 14, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="orderList.length">
    </el-pagination>
    <!-- 申请退款对话框 -->
    <el-dialog title="申请退款" :visible.sync="payBackDialogVisible" width="30%">
      <el-form :model="payBackForm" label-width="70px">
        <el-form-item label="退款原因" prop="reason">
          <el-input v-model="payBackForm.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payBackDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="payback()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    //查询登录人的所有订单
    this.findOrders();
  },
  data() {
    return {
      //订单列表
      orderList: [],
      //显示与隐藏退款对话框
      payBackDialogVisible: false,
      //退款表单
      payBackForm: {
        reason: "",
        id: 1,
      },
      //当前页
      pageNum: 1,
      //每页显示多少条数据
      pageSize: 6,
    };
  },
  methods: {
    //查询登录人的所有订单
    findOrders() {
      this.$http({
        url: "/order/findOrders",
        method: "get",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取订单信息失败");
        this.orderList = res.data.data;
        console.log(this.orderList);
      });
    },
    //申请退款
    payback() {
      this.$http({
        url: "/order/payback",
        method: "put",
        params: {
          reason: this.payBackForm.reason,
          id: this.payBackForm.id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 200) return this.$message.error("申请退款失败");
        this.payBackDialogVisible = false;
        this.$message.success("申请退款成功");
        this.findOrders();
      });
    },
    //显示申请退款对话框
    showPayBackDia(id) {
      this.payBackDialogVisible = true;
      this.payBackForm.id = id;
    },
    //修改每页显示的多少条数据
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    //修改当前的页数
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  width: 1100px;
}
</style>