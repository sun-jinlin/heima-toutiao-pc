<template>
  <div>
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn-nav">
        <el-radio-group v-model="resParams.collect" @change="changeCollect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button style="float:right" type="success" size="small" @click="openDialog">添加素材</el-button>
      </div>
      <div class="img-list">
        <div class="img-item" v-for="item in images" :key="item.id">
          <img :src="item.url" alt />
          <div class="img-option">
            <span
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
              @click="toggleStatus(item)"
            ></span>
            <span class="el-icon-delete" @click="delImage(item)"></span>
          </div>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="resParams.page"
        :page-size="resParams.per_page"
        @current-change="changePage"
        hide-on-single-page
      ></el-pagination>
    </el-card>
    <el-dialog title="添加素材" :visible.sync="dialogVisible" width="300px">
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        name="image"
        :headers="headers"
        :show-file-list="false"
        :on-success="uploadImageSuccess"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import auth from "@/utils/auth.js";
export default {
  name: "image-page",
  data() {
    return {
      resParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      images: [],
      total: 0,
      dialogVisible: false,
      imageUrl: "",
      headers: { Authorization: `Bearer ${auth.getUser().token}` }
    };
  },
  created() {
    this.getImages();
  },
  methods: {
    // 上传图片成功
    uploadImageSuccess(res) {
      this.$message.success("上传成功");
      this.imageUrl = res.data.url;
      window.setTimeout(() => {
        this.dialogVisible = false;
        this.getImages();
      }, 3000);
    },
    // 打开对话框
    openDialog() {
      this.dialogVisible = true;
    },
    delImage(item) {
      this.$confirm("此操作将永久删除该图片, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await this.$http.delete(`/user/images/${item.id}`);
            this.$message.success("删除图片成功");
            this.getImages();
          } catch (e) {
            this.$message.error("删除图片失败");
          }
        })
        .catch(() => {});
    },
    async toggleStatus(item) {
      try {
        const {
          data: { data }
        } = await this.$http.put(`/user/images/${item.id}`, {
          collect: !item.is_collected
        });
        this.$message.success(
          item.is_collected ? "取消收藏成功" : "添加收藏成功"
        );
        item.is_collected = data.collect;
      } catch (e) {
        this.$message.error(
          item.is_collected ? "取消收藏失败" : "添加收藏失败"
        );
      }
    },
    async getImages() {
      const {
        data: { data }
      } = await this.$http.get("/user/images", { params: this.resParams });
      //   console.log(data);
      this.images = data.results;
      this.total = data.total_count;
    },
    changeCollect() {
      this.resParams.page = 1;
      this.getImages();
    },
    changePage(newPage) {
      this.resParams.page = newPage;
      this.getImages();
    }
  }
};
</script>

<style lang="less" scoped>
.img-list {
  overflow: hidden;
  margin-bottom: 20px;
  .img-item {
    position: relative;
    margin-top: 20px;
    margin-right: 50px;
    float: left;
    width: 180px;
    height: 180px;
    border: 1px dashed #ccc;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
    .img-option {
      position: absolute;
      left: 0;
      bottom: 0;
      height: 30px;
      width: 100%;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      span {
        color: #fff;
        margin: 0 30px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>