<template>
  <el-container class="layout">
    <el-aside :width="isOpen?'200px':'64px'">
      <div class="logo" :class="{logo_mini:!isOpen}"></div>
      <el-menu
        :default-active="$route.path"
        background-color="#002233"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none;"
        :collapse="!isOpen"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/welcome">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/image">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <span
          class="icon"
          :class="{'el-icon-s-fold':isOpen,'el-icon-s-unfold':!isOpen}"
          @click="toggleAside()"
        ></span>
        <span class="text">江苏传智播客科技教育有限公司</span>
        <el-dropdown class="my-dropdown" @command="clickItem">
          <span>
            <img :src="userInfo.photo" class="hade" alt />
            <span class="name">{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-setting" command="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import auth from "@/utils/auth";
export default {
  name: "layout",
  data() {
    return {
      isOpen: true,
      userInfo: {
        photo: "",
        name: ""
      }
    };
  },
  created() {
    const { photo, name } = auth.getUser();
    this.userInfo = { photo, name };
  },
  methods: {
    toggleAside() {
      this.isOpen = !this.isOpen;
    },
    setting() {
      this.$router.push("/setting");
    },
    logout() {
      if (confirm("你确定退出吗")) {
        auth.removeUser();
        this.$router.push("/login");
      }
    },
    clickItem(command) {
      this[command]();
    }
  }
};
</script>

<style lang="less" scoped>
.layout {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  .el-aside {
    background-color: #002233;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../assets/logo_admin.png) no-repeat center / 140px
        auto;
    }
    .logo_mini {
      width: 64px;
      background-image: url(../assets/logo_admin_01.png);
      background-size: 36px auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 24px;
      vertical-align: middle;
    }
    .text {
      vertical-align: middle;
      margin-left: 10px;
    }
    .my-dropdown {
      float: right;
      .hade {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .name {
        font-weight: bold;
        color: #333;
        margin: auto 10px;
        vertical-align: middle;
      }
    }
  }
}
</style>