<template>
  <el-upload class="upload-demo" action="http://localhost:9000/user/upload" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :headers="header" :on-success="handleSuccess">
    <el-button size="small" type="primary">上传头像</el-button>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    <!-- <img src="//localhost:9000/img/电商.png" alt=""> -->
  </el-upload>
</template>

<script>
/*eslint-disable*/
export default {
  data() {
    return {
      header: {
        token: window.sessionStorage.getItem("token"),
      },
    };
  },
  methods: {
    //显示个人信息
    findUserOne() {
      this.$http({
        url: "/user/findUserOne",
        method: "get",
        header: {
          token: window.sessionStorage.getItem("token"),
        },
      }).then((res) => {
        console.log(res);
      });
    },
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
    handleSuccess() {
      // this.findUserOne();
      this.$message.success("上传成功");
      this.$emit("titleChanged", "子向父组件传值"); //自定义事件  传递值“子向父组件传值”
      location.reload();
    },
  },
};
</script>