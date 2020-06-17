<template>
  <div class="container-article">
    <!-- 筛选 -->
    <el-card>
      <div slot="header">
        <!-- 面包屑 -->
        <my-bread>内容管理</my-bread>
      </div>
      <!-- form表单 -->
      <el-form label-width="80px" size="small">
        <!-- 单选框 -->
        <el-form-item label="状态：">
          <el-radio-group v-model="resParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 下拉框 -->
        <el-form-item label="频道： ">
          <my-channel v-model="resParams.channel_id"></my-channel>
        </el-form-item>

        <!-- 日期框 -->
        <el-form-item label="日期：">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="filterArticle">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容 -->
    <el-card style="margin-top:20px;">
      <div slot="header">根据筛选条件共查询到 {{total}} 条结果：</div>
      <!-- 表格 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" class="cover-image">
              <div slot="error" class="image-slot">
                <img src="../../assets/error.gif" alt class="cover-image" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="350px"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status===0">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag type="success" v-if="scope.row.status===2">审核通过</el-tag>
            <el-tag type="warning" v-if="scope.row.status===3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status===4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button
              type="primary"
              @click="toEdit(scope.row.id)"
              icon="el-icon-edit"
              circle
              plain
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              plain
              @click="delArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        :page-size="resParams.per_page"
        :total="total"
        :current-page="resParams.page"
        @current-change="changePage"
        layout="prev, pager, next"
        style="margin-top:20px;"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "article-page",
  data() {
    // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
    return {
      dateArr: [],
      resParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        per_page: 20
      },
      articles: [],

      total: 0
    };
  },
  created() {
    this.getArticles();
  },
  methods: {
    delArticle(id) {
      this.$confirm("此操作将永久删除该文章, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await this.$http.delete(`/articles/${id}`);
            this.$message.success("删除成功");
            this.getArticles();
          } catch (e) {
            // console.dir(e);
            this.$message.error("删除失败");
          }
        })
        .catch(() => {});
    },
    toEdit(id) {
      this.$router.push({ path: "/publish", query: { id } });
    },

    changeDate(dateArr) {
      if (dateArr) {
        this.resParams.begin_pubdate = dateArr[0];
        this.resParams.end_pubdate = dateArr[1];
      } else {
        this.resParams.begin_pubdate = null;
        this.resParams.end_pubdate = null;
      }
    },
    filterArticle() {
      this.resParams.page = 1;
      this.getArticles();
    },

    async getArticles() {
      const {
        data: { data }
      } = await this.$http.get("/articles", { params: this.resParams });
      // console.log(data);
      this.articles = data.results;
      this.total = data.total_count;
    },
    changePage(newPage) {
      this.resParams.page = newPage;
      this.getArticles();
    }
  }
};
</script>

<style lang="less" scoped>
.cover-image {
  width: 180px;
  height: 120px;
}
</style>