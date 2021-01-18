<template>
  <div>
    <div class="tablebox">
      <el-table :data="userList.slice((currentPage-1)*pageSize,currentPage*pageSize)" :header-cell-style="{background:'gray',color:'#fff'}">
        <el-table-column label="账号" prop="loginName"></el-table-column>
        <el-table-column label="密码" prop="password"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="性别" prop="gender">
          <template slot-scope="scope">
            <span v-if="scope.row.gender=='MAN'">男</span>
            <span v-if="scope.row.gender=='WOMAN'">女</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="身份证号" prop="identityCode"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteUserById(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="userList.length">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  created() {
    //获取全部用户信息
    this.findAllUser();
  },
  data() {
    return {
      //用户信息列表
      userList: [],
      //token
      token: window.sessionStorage.getItem("token"),
      //当前页
      currentPage: 1,
      //每页显示多少条数据
      pageSize: 5,
    };
  },
  methods: {
    //获取全部用户信息
    findAllUser() {
      this.$http({
        url: "/admin/findAllUser",
        method: "get",
        headers: {
          token: this.token,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取用户信息列表失败");
        this.userList = res.data.data;
        console.log(this.userList);
      });
    },
    //改变每页多少条数据
    handleSizeChange(newSize) {
      this.pageSize = newSize;
    },
    //改变当前页数
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
    //删除用户
    async deleteUserById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久用户，是否继续？",
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
        url: "/admin/deleteUserById",
        method: "delete",
        params: {
          id: id,
        },
        headers: {
          token: this.token,
        },
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 203) return this.$message.error("删除用户失败");
        this.findAllUser();
        this.$message.success("删除用户成功");
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tablebox {
  width: 1200px;
  margin: 20px auto 0;
}
</style>

