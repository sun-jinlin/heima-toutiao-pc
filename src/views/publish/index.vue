<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <my-bread>{{$route.query.id?'修改文章':"发布文章"}}</my-bread>
      </div>
      <el-form label-width="120px" ref="articleForm" :model="articleForm" :rules="articleRules">
        <el-form-item label="标题：" v-model="articleForm.title" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <quill-editor @blur="checkContent" v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：" prop="cover">
          <el-radio-group @change="articleForm.cover.images=[]" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div style="height:160px;" v-if="articleForm.cover.type=== 1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div style="height:160px;" v-if="articleForm.cover.type=== 3">
            <my-image v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <my-channel v-model=" articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="$route.query.id">
          <el-button type="success" @click="updateArticle">修改文章</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="addArticle(false)">发布文章</el-button>
          <el-button @click="addArticle(true)">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

// 导入组件配置
import { quillEditor } from "vue-quill-editor";

export default {
  name: "publish-page",
  components: { quillEditor },
  data() {
    const checkCover = (rule, value, callback) => {
      if (value.type === 1) {
        if (!value.images[0]) {
          return callback(new Error("请选择一张封面图"));
        }
      }
      if (value.type === 3) {
        if (!value.images[0] || !value.images[1] || !value.images[2]) {
          return callback(new Error("请选择三张封面图"));
        }
      }
      callback();
    };
    return {
      articleRules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          {
            min: 5,
            max: 30,
            message: "请输入5-30字符串的文章标题",
            trigger: "blur"
          }
        ],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" }
        ],
        cover: [{ validator: checkCover, trigger: "blur" }],
        channel_id: [
          { required: true, message: "请选择所属频道", trigger: "change" }
        ]
      },
      // 文章表单数据对象
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      editorOption: {
        placeholder: "请输入文章内容",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["image"]
          ]
        }
      }
    };
  },
  watch: {
    "articleForm.cover": {
      handler() {
        this.$nextTick(() => {
          this.$refs.articleForm.validateField("cover");
        });
      },
      deep: true
    },
    "$route.query.id": function() {
      if (this.$route.query.id) {
        // 填充表单
        this.getArticle();
      } else {
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        };
        setTimeout(() => {
          this.$refs.articleForm.clearValidate(["cover", "channel_id"]);
        }, 0);
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getArticle();
    }
  },
  methods: {
    updateArticle() {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          try {
            await this.$http({
              method: "put",
              url: `/articles/${this.$route.query.id}`,
              params: { draft: false },
              data: this.articleForm
            });
            this.$message.success("修改文章成功");
            this.$router.push("/article");
          } catch (e) {
            this.$message.error("修改文章失败");
          }
        }
      });
    },
    async getArticle() {
      const {
        data: { data }
      } = await this.$http.get("/articles/" + this.$route.query.id);
      this.articleForm = data;
    },
    addArticle(draft) {
      this.$refs.articleForm.validate(async valid => {
        if (valid) {
          try {
            await this.$http.post(`/articles?draft=${draft}`, this.articleForm);
            this.$message.success(draft ? "存入草稿成功" : "添加发布成功");
            this.$router.push("/article");
          } catch (e) {
            this.$message.error(draft ? "存入草稿失败" : "添加发布失败");
          }
        }
      });
    },
    checkContent() {
      this.$refs.articleForm.validateField("content");
    }
  }
};
</script>

<style lang='less' scoped>
/deep/ .ql-toolbar.ql-snow {
  padding: 0 8px;
}

/deep/ .ql-editor {
  height: 250px;
}
</style>