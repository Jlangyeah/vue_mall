<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="1" finish-status="success">
      <el-step title="查看购物车"></el-step>
      <el-step title="确定订单信息"></el-step>
      <el-step title="成功提交订单"></el-step>
    </el-steps>
    <!-- 订单列表区域 -->
    <el-table :data="cartList" stripe :header-cell-style="{background:'#2b4b6b',color:'#fff' }" show-summary :summary-method="getSummaries" :cell-style="cellStyle">
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
      <el-table-column label="数量" prop="quantity">
        <template slot-scope="scope">
          {{scope.row.quantity}}
        </template>
      </el-table-column>
      <el-table-column label="小计" prop="cost">
        <template slot-scope="scope">
          ￥{{scope.row.quantity*scope.row.price}}
        </template>
      </el-table-column>
    </el-table>
    <div class="header-wrapper" v-if="selectAddress.address.length!=0">
      选择收货地址
    </div>
    <!-- 收货地址选择区域 -->
    <div :class="isSelect?'addrssBox selectImg':'addrssBox'" v-for="item in addressList" :key="item.id" @click="selectBox(item.address,item.remark)">
      <div class="remark">{{item.remark}}</div>
      <div>{{item.address}}</div>
    </div>
    <div v-if="addressList.length==0">
      <el-button @click="showAddDialog">添加收货地址</el-button>
    </div>
    <router-link :to="{path:'/common/address'}" v-show="addressList.length!=0">
      <div class="manage-link">管理收货地址</div>
    </router-link>
    <!-- <div class=" addTxt">
        {{selectAddress.remark}}<br>
        {{selectAddress.address}}<br>
      </div> -->

    <!-- 订单小计区域 -->
    <div class="box-shadow">
      <div><span class="Bold">实付款：</span>￥<span class="replay--price">{{Sumcost}}</span></div>
      <div><span class="Bold">寄送至：</span>{{selectAddress.address}}</div>
      <div><span class="Bold">收货人：</span>{{userList.userName}} {{userList.mobile}}</div>
    </div>
    <!-- 按钮区域 -->
    <router-link :to="{path:'./cart'}">
      <el-button type="info">返回购物车</el-button>
    </router-link>
    <el-button type="primary" class="btnSub" @click="addOrder">提交订单</el-button>

    <!-- 新增地址的对话框 -->
    <el-dialog title="新增地址" :visible.sync="addDialogVisible">
      <el-form label-width="70px" :model="addForm" ref="addFormRef" :rules="addFormRules">
        <el-form-item label="收货人" prop="receive">
          <el-input v-model="addForm.receive"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button @click="addAddress">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.findAllAddress();
    this.findAllCart();
    this.findUserOne();
  },
  data() {
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      //新增地址表单
      addForm: {
        address: "广东省 江门市 蓬江区 五邑大学",
        remark: "五邑大学",
        receive: "小明",
        phone: "13630265488",
      },
      //新增地址表单的验证规则对象
      addFormRules: {
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          },
        ],
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
        receive: [
          {
            required: true,
            message: "请输入收货人",
            trigger: "blur",
          },
        ],
      },
      // 地址列表
      addressList: [],
      //选中的地址
      selectAddress: {
        address: "",
        remark: "",
      },
      //是否选中
      isSelect: false,
      //购物车列表
      cartList: [],
      //购物车总金额
      Sumcost: 0,
      //用户信息列表
      userList: [],
      //控制添加地址对话框显示与隐藏
      addDialogVisible: false,
    };
  },
  methods: {
    //添加地址
    addAddress() {
      this.$refs.addFormRef.validate((valid) => {
        console.log(valid);
        if (!valid) return;
        this.$http({
          url: "/userAddress/addAddress",
          method: "post",
          params: {
            address: this.addForm.address,
            remark: this.addForm.remark,
            phone: this.addForm.phone,
            receive: this.addForm.receive,
          },
          headers: {
            token: window.sessionStorage.getItem("token"),
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code != 202) return this.$message.error("新增地址失败");
          this.$message.success("新增地址成功");
          //关闭对话框
          this.addDialogVisible = false;
          //刷新表格
          this.findAllAddress();
        });
      });
    },
    //显示添加地址对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },
    //绑定头像
    bindIcon(icon) {
      if (icon == null) return "//localhost:9000/img/default.jpg";
      return "//localhost:9000/img/" + icon;
    },
    //显示地址信息
    findAllAddress() {
      this.$http({
        url: "/userAddress/findAllAddress",
        method: "get",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取地址信息失败");
        this.addressList = res.data.data;
        // console.log(this.addressList);
      });
    },
    //选择地址
    selectBox(address, remark) {
      this.selectAddress.address = address;
      this.selectAddress.remark = remark;
      this.isSelect = true;
    },
    //显示购物车
    findAllCart() {
      this.$http({
        url: "/cart/findAllCart",
        method: "get",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取购物车信息失败");
        this.cartList = res.data.data;
        // console.log(this.cartList);
      });
    },
    //列求和
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
        } else if (index === 4 || index == 3) {
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
      this.Sumcost = sums[4];
      return sums;
    },
    //给单元格的指定列设置样式
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2 || columnIndex === 4) {
        return `color:red;`;
      } else {
        return "";
      }
    },
    //显示个人信息
    findUserOne() {
      this.$http({
        url: "/user/findUserOne",
        method: "get",
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取用户信息失败");
        this.userList = res.data.data;
        // console.log(this.userList);
      });
    },
    //提交订单
    addOrder() {
      if (this.selectAddress.address.length == 0) {
        return this.$message.error("地址不能为空");
      }
      this.$http({
        url: "/order/addOrder",
        method: "post",
        params: {
          cost: this.Sumcost,
          userAddress: this.selectAddress.address,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 202) return this.$message.error("提交订单失败");
        this.$router.push({
          path: "/common/orderSuccess",
          query: {
            serialnumber: res.data.data.serialnumber,
            Sumcost: this.Sumcost,
            id: res.data.data.id,
          },
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
// * {
//   margin: 20px;
//   // padding: 20px;
// }
.btnSub {
  margin-left: 20px;
  background-color: rgb(255, 0, 54);
  border: 1px solid rgb(255, 0, 54);
}
.btnSub:hover {
  background-color: rgb(221, 26, 68) !important;
  border: 1px solid rgb(255, 0, 54);
}
.Bold {
  font-weight: 700;
  color: #333;
}
.header-wrapper {
  line-height: 25px;
  color: #333;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 15px;
}
.addrssBox {
  // margin: 15px 15px;
  margin-right: 10px;
  margin-top: 5px;
  display: inline-block;
  height: 80px;
  width: 180px;
  border: 1px solid blue;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  line-height: 1.5;
  padding: 11px 10px;
  overflow: hidden;
  div {
    margin-right: 3px;
  }
}
.el-steps {
  width: 1200px;
}
.addrssBox:hover {
  border: cadetblue 1px solid;
}
.info-img {
  width: 35%;
}

.remark {
  border-bottom: 1px solid #f2f2f2;
  padding-bottom: 5px;
  margin-bottom: 5px;
}

.addTxt {
  border-bottom: 1px solid #b2d1ff;
}
.el-breadcrumb {
  // margin-top: 40px;
  background-color: orange;
  height: 40px;
  width: 791px;
  line-height: 40px;
}
.manage-link {
  margin-top: 20px;
  color: #c97;
}
.box-shadow {
  width: 273px;
  height: 96px;
  border: 2px solid #ff5000;
  font-size: 16px;
  padding: 10px 10px;
  margin-top: 15px;
  line-height: 1.5;
  // float: right;
  display: block;
  margin-bottom: 10px;
}
.replay--price {
  font: 700 26px tahoma;
  color: rgb(255, 80, 0);
}
</style>