<template>
  <div class="container">
    <b>我是a组件</b>
    <div>{{msg}}</div>
  </div>
</template>

<script>
import c from "@/views/setting/c.js";
export default {
  name: "page",
  data() {
    return {
      msg: null
    };
  },
  created() {
    c.$on("fn", data => {
      this.msg = data;
    });
  }
};
</script>

<style lang='less' scoped>
</style>