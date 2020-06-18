<template>
  <div class="container-my-image">
    <div class="img-btn" @click="openDialog">
      <img :src="value || defaultImageUrl" alt />
    </div>
    <el-dialog :visible.sync="dialogVisible" width="720px">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="素材库" name="list">
          <el-radio-group @change="changeCollect" v-model="filterParams.collect" size="small">
            <el-radio-button label="false">全部</el-radio-button>
            <el-radio-button label="true">收藏</el-radio-button>
          </el-radio-group>
          <div class="img-list">
            <div
              @click="selectedImage(item.url)"
              class="img-item"
              v-for="item in images"
              :key="item.id"
              :class="{selected:item.url === selectedImageUrl}"
            >
              <img :src="item.url" alt />
            </div>
          </div>
          <el-pagination
            @current-change="changePage"
            :page-size="filterParams.per_page"
            :current-page="filterParams.page"
            background
            layout="prev, pager, next"
            :total="total"
            hide-on-single-page
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="image">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            name="image"
            :headers="headers"
            :show-file-list="false"
            :on-success="uploadImageSuccess"
          >
            <img v-if="updateImageUrl" :src="updateImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import auth from "@/utils/auth.js";
import defaultImageUrl from "@/assets/default.png";
export default {
  name: "my-image",
  props: ["value"],
  data() {
    return {
      dialogVisible: false,
      activeName: "list",
      filterParams: {
        page: 1,
        per_page: 8,
        collect: false
      },
      images: [],
      total: 0,
      selectedImageUrl: null,
      headers: { Authorization: `Bearer ${auth.getUser().token}` },
      updateImageUrl: null,
      defaultImageUrl
    };
  },
  methods: {
    confirmImage() {
      if (this.activeName === "list") {
        if (!this.selectedImageUrl) return this.$message.warning("请选择图片");
        this.$emit("input", this.selectedImageUrl);

        this.dialogVisible = false;
      }
      if (this.activeName === "image") {
        if (!this.updateImageUrl) return this.$message.warning("请上传图片");
        this.$emit("input", this.updateImageUrl);

        this.dialogVisible = false;
      }
    },
    uploadImageSuccess(res) {
      this.$message.success("上传成功");
      this.updateImageUrl = res.data.url;
    },
    selectedImage(url) {
      this.selectedImageUrl = url;
    },
    openDialog() {
      this.dialogVisible = true;
      this.activeName = "list";
      this.filterParams.page = 1;
      this.filterParams.collect = false;
      this.updateImageUrl = null;
      this.selectedImageUrl = null;
      this.getImages();
    },
    async getImages() {
      const {
        data: { data }
      } = await this.$http.get("/user/images", { params: this.filterParams });
      this.images = data.results;
      this.total = data.total_count;
    },
    changePage(newPage) {
      this.filterParams.page = newPage;
      this.getImages();
    },
    changeCollect() {
      this.filterParams.page = 1;
      this.getImages();
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

.img-list {
  .img-item {
    width: 150px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-top: 10px;
    margin-right: 15px;

    &.selected {
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4) url(../assets/selected.png) no-repeat
          center / 50px;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }
  }
}

/deep/ .el-dialog__body {
  padding-bottom: 0;
}
</style>