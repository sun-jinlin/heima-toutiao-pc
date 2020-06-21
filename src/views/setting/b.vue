<template>
  <div class="container">
    <b>我是b组件</b>
    <button @click="b2a">b传a按钮</button>
  </div>
</template>

<script>
import c from "@/views/setting/c.js";
export default {
  name: "page",
  data() {
    return {
      msg: "哈哈"
    };
  },
  methods: {
    b2a() {
      c.$emit("fn", this.msg);
    }
  }
};
</script>

<style lang='less' scoped>
</style>