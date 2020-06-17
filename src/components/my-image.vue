<template>
  <div class="container-my-image">
    <div class="img-btn" @click="openDialog">
      <img src="../assets/default.png" alt />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="720px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="list">素材件内容</el-tab-pane>
        <el-tab-pane label="上传图片" name="image">上传图片内容</el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "my-image",
  data() {
    return {
      dialogVisible: false,
      activeName: "list"
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang='less' scoped>
.container-my-image {
  display: inline-block;
  margin-top: 10px;
  margin-right: 20px;
  .img-btn {
    width: 150px;
    height: 150px;
    border: 1px dashed #ddd;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>