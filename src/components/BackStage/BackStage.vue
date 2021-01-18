<template>
  <el-container>
    <el-header class="header">
      <router-link :to="{path:'/'}">
        <img src="../../assets/book.png" alt="" class="logo">
      </router-link>
      书店后台管理系统
    </el-header>
    <el-container>
      <el-aside width="200px" class="menu">
        <el-menu background-color="#23272a" text-color="#fff" active-text-color="#ffd04b" router>
          <el-menu-item index="/backStage/product">
            <i class="el-icon-s-goods"></i>
            <span slot="title">商品管理</span>
          </el-menu-item>
          <el-menu-item index="/backStage/order">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="/backStage/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
.header {
  background-color: #363b3f;
  color: #fff;
  font-size: 30px;
}
.menu {
  background-color: #23272a;
}
.el-menu {
  border-right: none;
}
.el-container {
  height: 100%;
}
.logo {
  width: 4%;
  vertical-align: middle;
}
</style>

<script>
export default {};
</script>