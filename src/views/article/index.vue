<template>
  <div class="container-article">内容部分</div>
</template>

<script>
export default {
  name: "article-page",
  created() {
    this.$http
      .get("/articles")
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log("错误信息:", err);
      });
  }
};
</script>

<style lang="less" scoped>
</style>