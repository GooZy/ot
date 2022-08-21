<template>
  <div id="app">
    <h1>Welcome to OT!</h1>
    <el-tabs tab-position="left" style="height: 100%;" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="(month, index) in monthList" :label="month" :name="index+''" :id="index=''">
        {{month}} ORK情况一览
      </el-tab-pane>
      <router-view></router-view>
    </el-tabs>
  </div>
</template>

<script>
  import { getMonthList } from '../static/js/tool';
  export default {
    data() {
      return {
        activeTab: '',  // 初始显示的tab
        monthList: [],
      };
    },
    methods: {
      handleClick(tab) {
        // 捕获异常，忽略每一次跳转同样url产生的报错
        this.$router.push({path: '/okr/', query: {'month': tab.label}}).catch(() => {});
      }
    },
    created() {
      this.activeTab = "1";
      this.monthList = getMonthList(2020);
      let activeMonth = this.monthList[this.activeTab];
      this.$router.push({path: '/okr/', query: {'month': activeMonth}}).catch(() => {});
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
