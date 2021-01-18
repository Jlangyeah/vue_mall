<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="0" finish-status="success">
      <el-step title="查看购物车"></el-step>
      <el-step title="确定订单信息"></el-step>
      <el-step title="成功提交订单"></el-step>
    </el-steps>
    <!-- 购物车详情 -->
    <el-table :data="cartList" stripe :header-cell-style="{background:'#2b4b6b',color:'#fff' }" :summary-method="getSummaries" :cell-style="cellStyle" @select="seltctRow" @select-all="selectAll" empty-text="购物车空空的哦~，去看看心仪的商品吧~" v-if="hiddenCart" show-summary>
      <!-- <el-table-column type="selection">
      </el-table-column> -->
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img :src="bindIcon(scope.row.fileName)" alt="" class="info-img">
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="单价" prop="price">
        <template slot-scope="scope">
          ￥{{scope.row.price}}
        </template>
      </el-table-column>
      <el-table-column label="购买数量" prop="quantity">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.quantity" :min="1" :max="10" label="描述文字" @change="updateCartById(scope.row.quantity,scope.row.id,scope.row.price*scope.row.quantity)"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="cost">
        <template slot-scope="scope">
          ￥{{scope.row.price*scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteCartById(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部小结区域 -->
    <div style="{height:78px}">
      <div class="footer" v-if="hiddenCart">
        <!-- <span>已选商品<span class="orange-font">{{totalNUm}}</span>件</span> -->
        <!-- <span class="footer-totalCost">合计<span class="orange-font">￥{{Sum}}</span></span> -->
        <el-button type="primary" class="btnSub orange" @click="settlement">结算</el-button>
      </div>
    </div>
    <div class="clearfix"></div>
    <!-- 购物车为空时显示 -->
    <div class="cartNull" v-if="!hiddenCart">
      <div class="message">
        <i class="icon-konggouwuche iconfont "></i>
        <div>购物车空空的哦~，去看看心仪的商品吧~</div>
        <router-link :to="{path:'/home'}">
          <span>立即购物</span>
        </router-link>
      </div>
    </div>
    <!-- 推荐区域 -->
    <!-- <div v-for="(item,index) in productList" :key="item.id" class="product" v-show="index<5&&!hiddenCart">
      <img :src="require('../assets/img/product/'+item.fileName)" alt="">
      {{item.name}}
      <div class="product_price">￥{{item.price}}</div>
    </div> -->
  </div>
</template>

<script>
export default {
  created() {
    //加载购物车
    this.findAllCart();
    //全部商品信息
    this.findAllProduct();
  },
  data() {
    return {
      //商品多选框
      checked: true,
      //购物车列表
      cartList: [],
      //当前行的ID
      id: 1,
      //合计价格
      Sumcost: 0,
      Sum: null,
      //总价
      totalCost: 0,
      //总数量
      totalNUm: 0,
      //tem
      tem: 0,
      temNum: 0,
      //是否隐藏购物车
      hiddenCart: true,
      //商品列表
      productList: [],
    };
  },
  methods: {
    //绑定头像
    bindIcon(icon) {
      if (icon == null) return "//localhost:9000/img/default.jpg";
      return "//localhost:9000/img/" + icon;
    },
    //全选框勾选时触发
    selectAll(rows) {
      //取消勾选全选
      if (!rows.length) {
        this.totalCost = 0;
        this.totalNUm = 0;
        return console.log("总计" + this.totalCost + " 总数量" + this.totalNUm);
      }
      //勾选全选
      this.totalNUm = 0;
      this.totalCost = 0;
      for (var i = 0; i < rows.length; i++) {
        this.totalCost += rows[i].cost;
        this.totalNUm += rows[i].quantity;
      }
      console.log("总计" + this.totalCost + " 总数量" + this.totalNUm);
    },
    //结算按钮
    settlement() {
      if (this.cartList.length == 0)
        return this.$message.error("请加入商品到购物车");
      this.$router.push("/common/order");
    },
    //多选框勾选时候触发
    seltctRow(rows, row) {
      console.log(row.cost);
      let selected = rows.length && rows.indexOf(row) !== -1;
      // console.log(selected); // true就是选中，0或者false是取消选中
      if (!selected) {
        console.log();
        return console.log(
          "总价:" +
            (this.totalCost -= row.cost) +
            " 总数量:" +
            (this.totalNUm -= row.quantity)
        );
      }
      this.temNum = row.quantity;
      this.tem = row.cost;
      this.totalNUm += row.quantity;
      this.totalCost += row.cost;
      console.log("总价" + this.totalCost + " 总数量:" + this.totalNUm);
    },
    //当选择项发生变化时会触发该事件
    selectionChange(selection) {
      if (selection.length == 0) {
        this.totalCost -= this.tem;
        return console.log("cost:" + this.totalCost);
      }

      this.tem = selection[0].cost;
      // console.log("price:" + this.tem);
      this.totalCost += selection[0].cost;
      console.log(selection[0].cost);
      // console.log("cost:" + this.totalCost);
    },
    //购物车订单显示
    findAllCart() {
      this.$http({
        method: "get",
        url: "/cart/findAllCart",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        this.cartList = res.data.data;
        console.log(this.cartList);
        if (this.cartList.length == 0) {
          this.hiddenCart = false;
        }
      });
    },
    //删除订单
    async deleteCartById(val) {
      //弹出是否确定删除的提示
      const confirmResult = await this.$confirm(
        "此操作将永久删除该订单, 是否继续?",
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
      //调用API完成删除订单
      this.$http({
        method: "delete",
        url: "/cart/deleteCartById",
        params: {
          id: val.id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 203) return this.$message.error("删除订单失败");
        // this.$message.success("删除订单成功");
        //重新调用API 刷新表格
        this.findAllCart();
      });
    },
    //统计行
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
        } else if (index === 4) {
          const values = data.map((item) => Number(item[column.property]));
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          } else {
            sums[index] = "N/A";
          }
        } else {
          sums[index] = "--";
        }
      });
      this.Sumcost = sums[3];
      this.Sum = sums[3];
      return sums;
    },

    //给单元格的指定列设置样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return `color:red;`;
      } else {
        return "";
      }
      if (columnIndex === 3) {
        return `font-wight:700;`;
      } else {
        return "";
      }
    },
    //动态更新购物车信息
    updateCartById(num, id, cost) {
      // console.log("num" + num + "   id" + id + "  cost" + cost);
      this.$http({
        url: "/cart/updateCartById",
        method: "put",
        params: {
          cost: cost,
          id: id,
          quantity: num,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);

        //更新合计数据
        this.findAllCart();
      });
    },
    //全部商品
    findAllProduct() {
      this.$http({
        url: "/product/findAllProduct",
        method: "get",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取商品列表失败");
        this.productList = res.data.data;
        console.log(this.productList);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  width: 1200px;
  margin-top: 40px;
}
.orange {
  background-color: #f40;
  border: none;
}
.orange-font {
  color: #f40;
  font-weight: 700;
  font-size: 18px;
  padding: 0 5px;
}
.orange:hover {
  background-color: #f40;
}
.footer-totalCost {
  margin-left: 30px;
}
.el-input-number {
  width: 90px;
}
.footer {
  float: right;
  display: block;
}
.product {
  display: inline-block;
  width: 198px;
  height: 268px;
  border: 1px dashed #cacaca;
  padding: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  text-align: center;
  cursor: pointer;
}
.product:hover {
  border: 1px dashed red;
}
.product img {
  width: 160px;
  height: 160px;
  margin: 0 23px;
  margin-bottom: 20px;
  display: block;
  // margin: 0 auto;
}
.btnGo {
  margin-top: 40px;
  margin-right: 40px;
}
.btnSub {
  margin: 20px;
}
.info-img {
  width: 35%;
}
.message {
  margin-top: 100px;
  height: 100px;
  width: 1200px;
  position: absolute;
  right: 0;
  line-height: 1.5;
  span {
    color: blue;
    cursor: pointer;
  }
}
.cartNull {
  position: relative;
  width: 1200px;
  height: 400px;
  text-align: center;
  color: #333;
  font: 14px;
  // display: flex;
}
.icon-konggouwuche {
  font-size: 70px;
  color: #f40;
}
.w {
  width: 990px !important;
  margin: 0 auto;
}
</style>