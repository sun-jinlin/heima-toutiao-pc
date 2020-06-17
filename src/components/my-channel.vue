<template>
  <el-select clearable @change="changeChannel" :value="value" placeholder="请选择">
    <el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: "my-channel",
  props: ["value"],
  data() {
    return {
      channels: []
    };
  },
  created() {
    this.getChannelsOption();
  },
  methods: {
    changeChannel(channelId) {
      if (channelId === "") {
        channelId = null;
      }
      this.$emit("input", channelId);
    },
    async getChannelsOption() {
      const {
        data: { data }
      } = await this.$http.get("/channels");
      // console.log(data);
      this.channels = data.channels;
    }
  }
};
</script>

<style lang='less' scoped>
</style>