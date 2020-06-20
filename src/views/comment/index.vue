<template>
  <div class="container-comment">
    <el-card>
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <el-table :data="comments">
        <el-table-column label="文章标题" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':"关闭"}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="success"
              @click="toggleStatus(scope.row)"
              v-if="scope.row.comment_status===false"
            >打开评论</el-button>
            <el-button
              type="danger"
              @click="toggleStatus(scope.row)"
              v-if="scope.row.comment_status===true"
            >关闭评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px;"
        @current-change="changePage"
        :current-page="resParams.page"
        :page-size="resParams.per_page"
        background
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "comment-page",
  data() {
    return {
      comments: [],
      total: 0,
      resParams: {
        page: 1,
        per_page: 20,
        response_type: "comment"
      }
    };
  },
  created() {
    this.getComments();
  },
  methods: {
    toggleStatus(row) {
      // console.log(row);
      const text1 = "此操作会开启该文章的评论功能，您确认吗？";
      const text2 =
        "此操作会关闭该文章的评论功能，关闭后用户将无法对该文章进行评论，您确认吗？";
      this.$confirm(row.comment_status ? text2 : text1, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            const {
              data: { data }
            } = await this.$http.put(`/comments/status?article_id=${row.id}`, {
              allow_comment: !row.comment_status
            });
            this.$message.success(
              data.allow_comment ? "打开评论成功" : "关闭评论成功"
            );
            row.comment_status = data.allow_comment;
          } catch (e) {
            this.$message.error("操作失败");
          }
        })

        .catch();
    },
    changePage(newPage) {
      this.resParams.page = newPage;
      this.getComments();
    },
    async getComments() {
      const {
        data: { data }
      } = await this.$http.get("/articles", { params: this.resParams });
      // console.log(data);
      this.comments = data.results;
      this.total = data.total_count;
    }
  }
};
</script>

<style lang='less' scoped>
</style>