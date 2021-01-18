<template>
  <div>
    <div class="tablebox">
      <el-table :data="orderList.slice((pageNum-1)*pageSize,pageNum*pageSize)" stripe :default-sort="{prop: 'updateTime', order: 'descending'}">
        <!-- <el-table-column label="数量" prop=""></el-table-column> -->
        <el-table-column label="订单修改时间" prop="updateTime" :sortable="true"></el-table-column>
        <el-table-column label="订单号" prop="serialnumber"></el-table-column>
        <el-table-column label="用户名" prop="loginName"></el-table-column>
        <el-table-column label="金额" prop="cost"></el-table-column>
        <el-table-column label="收获地址" prop="userAddress"></el-table-column>
        <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
          <el-table-column label="订单状态" prop="status" width="100px"></el-table-column>
        </el-tooltip>

        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button type="primary" v-if="scope.row.status=='未发货'" @click="updateOrdersStatus(scope.row.id)" size="mini">发货</el-button>
            <el-button type="warning" v-if="scope.row.status=='申请退款'" size="mini" @click="payback(scope.row.id)">退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页模块 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[6, 12, 14, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="orderList.length">
      </el-pagination>
    </div>

    <!-- <div class="box">
      <div class="goods">待发货 <span>{{orderCoutList.已退货}}</span>
      </div>
      <div class="collection">待收款<span>{{orderCoutList.未发货}}</span></div>
      <div class="Receiving">待收货<span>{{orderCoutList.未支付}}</span></div>
      <div class="feedback">待反馈<span>{{orderCoutList.申请退款}}</span></div>
    </div> -->

  </div>
</template>

<script>
export default {
  created() {
    //查询登录人的所有订单
    this.findAllOrders();
    //订单统计
    this.selectCount();
  },
  data() {
    return {
      //订单列表
      orderList: [],
      //每页显示多少条数据
      pageSize: 6,
      //当前页数
      pageNum: 1,
      //订单统计
      orderCoutList: [],
      //
    };
  },
  methods: {
    //显示全部订单
    findAllOrders() {
      this.$http({
        url: "/admin/findAllOrders",
        method: "get",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取订单信息失败");
        this.orderList = res.data.data;
        console.log(this.orderList);
      });
    },
    //修改订单状态
    updateOrdersStatus(id) {
      this.$http({
        url: "/admin/updateOrdersStatus",
        method: "put",
        params: {
          id: id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 204)
          return this.$message.error("修改订单状态失败");
        this.findAllOrders();
        this.$message.success("订单发货成功");
      });
    },
    //修改每页显示的多少条数据
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    //修改当前的页数
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
    },
    //退款
    async payback(id) {
      const confirmResult = await this.$confirm(
        "此操作将会退款给买家，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => {
        return err;
      });
      if (confirmResult != "confirm") {
        return this.$message.info("已经取消删除");
      }
      this.$http({
        url: "/admin/payback",
        method: "get",
        params: {
          id: id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 209) return this.$message.error("退款失败");
        this.$message.success("退款成功");
        this.findAllOrders();
      });
    },
    //订单统计
    selectCount() {
      this.$http({
        url: "/admin/selectCount",
        method: "get",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200) {
          return this.$message.error("获取订单信息失败");
        }
        this.orderCoutList = res.data.data;
        console.log(this.orderCoutList);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tablebox {
  margin: 40px;
}
.box div {
  width: 520px;
  height: 200px;
  display: inline-block;
  margin: 10px;
}

.goods {
  background-color: #eb5733;
}
.collection {
  background-color: #3eb36f;
}
.Receiving {
  background-color: #3285ff;
}
.feedback {
  background-color: #eb9437;
}
</style>

