<template>
  <div class="container-fans">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fans-list">
            <div class="fans-item" v-for="item in fansList" :key="item.id.toString()">
              <el-avatar :size="80" :src="item.photo"></el-avatar>
              <p>{{item.name}}</p>
              <el-button type="primary" plain size="mini">+关注</el-button>
            </div>
          </div>
          <el-pagination
            background
            @current-change="changePage"
            :current-page="resParams.page"
            :page-size="resParams.per_page"
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="chart">
          <div ref="dom" style="width:600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "fans-page",
  data() {
    return {
      activeName: "chart",
      total: 0,
      fansList: [],
      resParams: {
        page: 1,
        per_page: 24
      }
    };
  },
  created() {
    this.getFans();
  },
  mounted() {
    this.initBar();
  },
  methods: {
    async initBar() {
      const myChart = echarts.init(this.$refs.dom);
      const option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      };
      try {
        const {
          data: { data }
        } = await this.$http.get("/statistics/followers");
        const arr1 = [];
        const arr2 = [];
        // console.log(data);
        for (let key in data.age) {
          arr1.push(key);
          arr2.push(data.age[key]);
        }
        option.xAxis[0].data = arr1;
        option.series[0].data = arr2;
        myChart.setOption(option);
      } catch (e) {
        this.$message.error("网络不好，请刷新试试");
      }
    },
    changePage(newPage) {
      this.resParams.page = newPage;
      this.getFans();
    },
    async getFans() {
      const {
        data: { data }
      } = await this.$http.get("/followers", { params: this.resParams });
      // console.log(data);
      this.fansList = data.results;
      this.total = data.total_count;
    }
  }
};
</script>

<style lang='less' scoped>
.fans-list {
  .fans-item {
    width: 100px;
    height: 150px;
    text-align: center;
    border: 1px dashed #ddd;
    padding-top: 5px;
    display: inline-block;
    margin-right: 50px;
    margin-bottom: 20px;
    p {
      margin: 5px 0;
      font-size: 14px;
    }
  }
}
</style>