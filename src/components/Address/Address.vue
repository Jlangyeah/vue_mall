<template>
  <div>
    <el-table :data="addressList.slice((pagenum-1)*pagesize,pagenum*pagesize)" stripe border :header-cell-style="{background:'#e3f2fd',color:'#666' }" empty-text="无地址信息，请添加">
      <!-- <el-table-column type="expand"></el-table-column> -->
      <el-table-column type="index" label="#" width="40px"></el-table-column>
      <!-- <el-table-column label="地址编号" prop="id"></el-table-column> -->
      <el-table-column label="收货人" prop="receive" width="100px"></el-table-column>
      <el-table-column label="手机号" prop="phone" width="140px"></el-table-column>
      <el-table-column label="地址" prop="address" width="290px"></el-table-column>
      <el-table-column label="备注" prop="remark"></el-table-column>
      <el-table-column label="操作" width="220px">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="showAddDialog">新增</el-button>
          <el-button type="primary" size="mini" @click="showEditDialog(scope.row.address,scope.row.id,scope.row.phone,scope.row.receive,scope.row.remark)">修改</el-button>
          <el-button type="danger" size="mini" @click="deleteAddressById(scope.row.id)
">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagenum" :page-sizes="[1, 2, 5, 10]" :page-size.sync="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="addressList.length">
    </el-pagination>
    <!-- 添加地址按钮 -->
    <el-button type="primary" class="btnAdd" @click="showAddDialog" v-if="addressList.length==0">添加地址</el-button>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" width="50%" :visible.sync="editDialogVisible">
      <el-form label-width="70px" :model="editForm" ref="editFormRef" :rules="editFormRules">
        <el-form-item label="收件人" prop="receive">
          <el-input v-model="editForm.receive"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="editForm.address"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="editForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible =false">取消</el-button>
        <el-button @click="updateAddress">确定</el-button>
      </span>
    </el-dialog>

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
      //当前页数
      pagenum: 1,
      //当前每页显示多少条数据
      pagesize: 5,
      total: 1,
      //地址信息列表
      addressList: [],
      //用户信息列表
      userInfoList: [],
      //控制修改地址对话框的显示与隐藏
      editDialogVisible: false,
      //控制修改地址对话框的显示与隐藏
      addDialogVisible: false,
      //修改地址表单
      editForm: {
        address: "",
        remark: "",
        receive: "",
        phone: "",
        id: 1,
      },
      //新增地址表单
      addForm: {
        address: "广东省 江门市 蓬江区 五邑大学",
        remark: "五邑大学",
        receive: "小明",
        phone: "13630265488",
      },
      //修改地址表单的验证规则对象
      editFormRules: {
        address: [
          {
            required: true,
            message: "请输入地址",
            trigger: "blur",
          },
          {
            min: 3,
            max: 100,
            message: "长度大于1字符",
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
    };
  },
  methods: {
    //显示所有地址
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
    //删除地址
    async deleteAddressById(id) {
      //   console.log(id);
      const confirmResult = await this.$confirm(
        "此操作将会永久删除该条地址，是否继续",
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
        url: "/userAddress/deleteAddressById",
        method: "delete",
        params: {
          id: id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 203) return this.$message.error("删除地址失败");
        this.$message.success("删除成功");
        this.findAllAddress();
      });
    },
    //展示修改地址的对话框
    showEditDialog(address, id, phone, receive, remark) {
      this.editForm.address = address;
      this.editForm.id = id;
      this.editForm.phone = phone;
      this.editForm.receive = receive;
      this.editForm.remark = remark;
      this.editDialogVisible = true;
    },
    //修改地址
    updateAddress() {
      //表单预校验
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        this.$http({
          url: "/userAddress/updateAddress",
          method: "put",
          params: {
            address: this.editForm.address,
            id: this.editForm.id,
            receive: this.editForm.receive,
            phone: this.editForm.phone,
            remark: this.editForm.remark,
          },
          headers: {
            token: window.sessionStorage.getItem("token"),
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code != 204) return this.$message.error("修改地址失败");
          this.$message.success("修改地址成功");
          //关闭对话框
          this.editDialogVisible = false;
          //刷新表格
          this.findAllAddress();
        });
      });
    },
    //显示新增地址对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },
    //新增地址
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
    //监听每页条数改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.pagesize = newSize;
      this.findAllAddress();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newpage);
      this.pagenum = newPage;
      this.findAllAddress();
    },
  },
};
</script>


<style lang="less" scoped>
.el-table {
  width: 1200px;
  // margin: 40px 100px;
  // margin: 0 100px;
}
.btnAdd {
  margin-top: 20px;
}
</style>