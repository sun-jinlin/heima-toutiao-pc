<template>
  <div class="container-setting">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px" ref="userForm" :model="userForm" :rules="userRules">
            <el-form-item label="编号：">{{userForm.id}}</el-form-item>
            <el-form-item label="手机号：">{{userForm.mobile}}</el-form-item>
            <el-form-item label="媒体名称：" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入媒体名称"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍：" prop="intro">
              <el-input type="textarea" :rows="3" v-model="userForm.intro" placeholder="请输入媒体介绍"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateUserInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :http-request="changeFile"
          >
            <img v-if="userForm.photo" :src="userForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="text">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import eventBus from "@/eventBus";
import auth from "@/utils/auth";
export default {
  name: "setting-page",

  data() {
    const checkEmail = (rule, value, callback) => {
      if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
        return callback(new Error("请输入正确的邮箱格式"));
      }
      callback();
    };
    return {
      userRules: {
        name: [
          { required: true, message: "请填写媒体名称", trigger: "blur" },
          { min: 1, max: 7, message: "请填写1-7位字符串", trigger: "blur" }
        ],
        intro: [{ required: true, message: "请填写媒体介绍", trigger: "blur" }],
        email: [
          { required: true, message: "请填写邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ]
      },
      userForm: {
        id: null,
        name: null,
        intro: null,
        email: null,
        photo: null,
        mobile: null
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async changeFile({ file }) {
      const formDate = new FormData();
      formDate.append("photo", file);
      const {
        data: { data }
      } = await this.$http.patch("/user/photo", formDate);
      this.$message.success("修改头像成功");
      this.userForm.photo = data.photo;
      eventBus.$emit("update-user-photo", data.photo);
      const localUser = auth.getUser();
      localUser.photo = data.photo;
      auth.setUser(localUser);
    },

    updateUserInfo() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          try {
            const { name, intro, email } = this.userForm;
            await this.$http.patch("/user/profile", { name, intro, email });
            this.$message.success("保存设置成功");
            eventBus.$emit("update-user-name", name);
            const localUser = auth.getUser();
            localUser.name = name;
            auth.setUser(localUser);
          } catch (e) {
            if (e.response && e.response.status === 409) {
              return this.$message.error("媒体名称已存在");
            }
            this.$message.error("保存设置失败");
          }
        }
      });
    },
    async getUserInfo() {
      const {
        data: { data }
      } = await this.$http.get("/user/profile");
      this.userForm = data;
    }
  }
};
</script>

<style lang='less' scoped>
.text {
  text-align: center;
  font-size: 12px;
}
</style>