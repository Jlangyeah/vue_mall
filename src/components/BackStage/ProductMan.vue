<template>
  <div class="box">
    <el-table :data="productList.slice((pageNum-1)*pageSize,pageNum*pageSize)">
      <!-- <el-table-column label="图片" prop="fileName">
        <template slot-scope="scope">
          <img :src="require('../assets/img/product/'+scope.row.fileName)" alt="" class="productImg">
        </template>
      </el-table-column> -->
      <el-table-column label="商品名" prop="name" width="240px"></el-table-column>
      <el-table-column label="商品描述" prop="description" width="240px"></el-table-column>
      <el-table-column label="价格" prop="price"></el-table-column>
      <el-table-column label="库存" prop="stock"></el-table-column>
      <el-table-column label="分类1" prop="categoryleveloneId">
        <template slot-scope="scope">
          <span v-if="scope.row.categoryleveloneId==1">大学教材</span>
          <span v-else-if="scope.row.categoryleveloneId==2">名著</span>
          <span v-else-if="scope.row.categoryleveloneId==3">考证必备</span>
          <span v-else-if="scope.row.categoryleveloneId==4">考试用具</span>
        </template>
      </el-table-column>
      <el-table-column label="分类2" prop="categoryleveltwoId" width="94px">
        <template slot-scope="scope">
          <span v-if="scope.row.categoryleveltwoId==5">大一</span>
          <span v-if="scope.row.categoryleveltwoId==6">大二</span>
          <span v-if="scope.row.categoryleveltwoId==7">大三</span>
          <span v-if="scope.row.categoryleveltwoId==8">大四</span>
          <span v-if="scope.row.categoryleveltwoId==9">国内名著</span>
          <span v-if="scope.row.categoryleveltwoId==10">国外名著</span>
          <span v-if="scope.row.categoryleveltwoId==11">四六级</span>
          <span v-if="scope.row.categoryleveltwoId==12">教师资格证</span>
          <span v-if="scope.row.categoryleveltwoId==13">注册会计师</span>
          <span v-if="scope.row.categoryleveltwoId==14">四六级耳机</span>
          <span v-if="scope.row.categoryleveltwoId==15">纸张</span>
          <span v-if="scope.row.categoryleveltwoId==16">文具</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="上架商品" placement="bottom" :enterable="false">
            <el-button type="success" icon="el-icon-check" circle @click="showAddProDia"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改商品" placement="bottom" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle @click="showUpdateDia(scope.row.id,scope.row.name,scope.row.description,scope.row.price,scope.row.stock,scope.row.categoryleveloneId,scope.row.categoryleveltwoId)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="下架商品" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteProductById(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页模块 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[6, 12, 14, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 新增商品对话框 -->
    <el-dialog title="上架商品" :visible.sync="AddProdialogVisible" width="50%" @close="handleClose">
      <el-form label-width="80px" :model="editForm" ref="addRef" :rules="addRules">
        <el-form-item label="商品名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editForm.price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="editForm.stock" type="number"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <!-- 级联选择器 -->
          <el-cascader v-model="value" :options="productCategoryList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="分类1">
          <el-select v-model="editForm.categoryleveloneId" placeholder="请选择">
            <el-option v-for="item in optionsOne" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类2">
          <el-select v-model="editForm.categoryleveltwoId" placeholder="请选择">
            <el-option v-for="item in optionsTwo" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- 上传图片 -->
        <el-upload class="upload-demo" action="http://localhost:9000/admin/addProduct" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :headers="header" :data="editForm" :on-success="handleSuccess">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          <!-- <img src="//localhost:9000/img/电商.png" alt=""> -->
        </el-upload>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddProdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddPro">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改商品对话框 -->
    <el-dialog title="修改商品信息" :visible.sync="editProdialogVisible" width="50%">
      <el-form label-width="70px" :model="editForm">
        <el-form-item label="商品名" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="editForm.price"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="editForm.stock"></el-input>
        </el-form-item>
        <el-form-item label="分类1">
          <!-- <el-input v-model="editForm.categoryleveloneId"></el-input> -->
          <el-select v-model="editForm.categoryleveloneId" placeholder="请选择">
            <el-option v-for="item in optionsOne" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类2">
          <!-- <el-input v-model="editForm.categoryleveltwoId"></el-input> -->
          <el-select v-model="editForm.categoryleveltwoId" placeholder="请选择">
            <el-option v-for="item in optionsTwo" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editProdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    //显示全部商品信息
    this.findAllProduct();
    //获取商品集合
    this.productCategory();
  },
  data() {
    return {
      //当前页数
      pageNum: 1,
      //每页显示多少条数据
      pageSize: 6,
      //总共有多少条数据
      total: 1,
      //商品列表
      productList: [],
      //上架商品表单
      addProductForm: {},
      //上架商品对话框的显示与隐藏
      AddProdialogVisible: false,
      //修改商品对话框
      editProdialogVisible: false,
      //修改商品表单
      editForm: {
        categoryleveloneId: null,
        categoryleveltwoId: null,
        description: "",
        name: "",
        price: null,
        stock: null,
        id: null,
      },
      //商品分类1
      optionsOne: [
        {
          value: 1,
          label: "大学教材",
        },
        {
          value: 2,
          label: "名著",
        },
        {
          value: 3,
          label: "考证必备",
        },
        {
          value: 4,
          label: "考试用具",
        },
      ],
      //商品分类2
      optionsTwo: [
        {
          value: 5,
          label: "大一",
        },
        {
          value: 6,
          label: "大二",
        },
        {
          value: 7,
          label: "大三",
        },
        {
          value: 8,
          label: "大四",
        },
        {
          value: 9,
          label: "国内名著",
        },
        {
          value: 10,
          label: "国外名著",
        },
        {
          value: 11,
          label: "四六级",
        },
        {
          value: 12,
          label: "教师资格证",
        },
        {
          value: 13,
          label: "注册会计师",
        },
        {
          value: 14,
          label: "四六级耳机",
        },
        {
          value: 15,
          label: "纸张",
        },
        {
          value: 16,
          label: "文具",
        },
      ],
      //添加商品的验证规则对象
      addRules: {
        name: [
          {
            required: true,
            message: "请输入商品名",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "请输入价格",
            trigger: "blur",
          },
        ],
        stock: [
          {
            required: true,
            message: "请输入库存",
            trigger: "blur",
          },
        ],
        category: [
          {
            required: true,
            message: "请选择分类",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入商品描述",
            trigger: "blur",
          },
        ],
      },
      //header
      header: {
        token: window.sessionStorage.getItem("token"),
      },
      //商品集合
      productCategoryList: {},
      cateProps: {
        expandTrigger: "hover",
        label: "name",
        value: "id",
        children: "children",
      },
      value: 1,
    };
  },
  methods: {
    //监听对话框关闭事件
    handleClose() {
      this.$refs.addRef.resetFields();
    },
    //获取商品集合
    productCategory() {
      this.$http({
        url: "/productCategory/list",
        method: "get",
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200) return this.$message.erro("获取商品集合失败");
        this.productCategoryList = res.data.data;
        // console.log(this.productCategoryList);
      });
    },
    //上架商品
    addProduct() {
      this.$http({
        url: "/admin/addProduct",
        method: "post",
        params: {},
      });
    },
    //显示上架商品对话框
    showAddProDia() {
      this.AddProdialogVisible = true;
    },
    //显示全部商品信息
    findAllProduct() {
      this.$http({
        url: "/product/findAllProduct",
        method: "get",
      }).then((res) => {
        // console.log(res);
        if (res.data.code != 200)
          return this.$message.error("获取商品列表失败");
        this.productList = res.data.data;
        // console.log(this.productList);
        this.total = this.productList.length;
      });
    },
    //切换每页显示条数
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.findAllProduct();
    },
    //切换页码
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
      this.findAllProduct();
    },
    //修改商品信息
    updateProduct() {
      this.$http({
        url: "/admin/updateProduct",
        method: "put",
        params: {
          id: this.editForm.id,
          name: this.editForm.name,
          price: this.editForm.price,
          stock: this.editForm.stock,
          price: this.editForm.price,
          categoryleveloneId: this.editForm.categoryleveloneId,
          categoryleveltwoId: this.editForm.categoryleveltwoId,
          description: this.editForm.description,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 204) {
          return this.$message.error("修改商品信息失败");
        }
        this.editProdialogVisible = false;
        this.$message.success("修改商品信息成功");
        this.findAllProduct();
      });
    },
    //显示修改商品信息对话框
    showUpdateDia(
      id,
      name,
      description,
      price,
      stock,
      categoryleveloneId,
      categoryleveltwoId
    ) {
      console.log(id, name, description, price, stock);
      this.editProdialogVisible = true;
      this.editForm.id = id;
      this.editForm.name = name;
      this.editForm.description = description;
      this.editForm.price = price;
      this.editForm.stock = stock;
      this.editForm.categoryleveloneId = categoryleveloneId;
      this.editForm.categoryleveltwoId = categoryleveltwoId;
    },
    //下架商品
    async deleteProductById(id) {
      const confirmResult = await this.$confirm(
        "此操作将会永久删除该商品，是否继续",
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
        url: "/admin/deleteProductById",
        method: "delete",
        params: {
          id: id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
        if (res.data.code != 203) return this.$message.error("删除商品失败");
        this.findAllProduct();
        this.$message.success("商品下架成功");
      });
    },
    //上传图片
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleChange(value) {
      // console.log(value);
      this.editForm.categoryleveloneId = value[0];
      this.editForm.categoryleveltwoId = value[1];
    },
    //上传成功
    handleSuccess() {
      // this.AddProdialogVisible = false;
      // this.$message.success("上传成功");
    },
    //上架商品的确定按钮
    AddPro() {
      this.$refs.addRef.validate((valid) => {
        if (!valid) return;
        this.AddProdialogVisible = false;
        this.$message.success("上架成功");
        this.findAllProduct();
      });
    },
  },
};
</script>

<style lang="less" scoped>
.productImg {
  width: 70%;
}
.box {
  width: 1100px;
  margin: 20px auto 0;
  // overflow: hidden;
}
.el-form .el-input {
  width: 600px;
}
</style>

