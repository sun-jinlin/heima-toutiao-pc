<template>
  <div class="container-publish">
    <el-card>
      <div slot="header">
        <my-bread>发布文章</my-bread>
      </div>
      <el-form label-width="120px">
        <el-form-item label="标题：" v-model="articleForm.title">
          <el-input placeholder="请输入文章标题" style="width:400px;"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div style="height:160px;">
            <my-image></my-image>
            <my-image></my-image>
            <my-image></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model=" articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">发布文章</el-button>
          <el-button>存为草稿</el-button>
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
    return {
      // 文章表单数据对象
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: null
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