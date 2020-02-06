<template>
  <div id="app">
    <h1>Welcome to OT!</h1>
    <el-tabs tab-position="left" style="height: 100%;" v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane v-for="(month, index) in monthList" :label="month" :name="index+''" :id="index=''">
        {{month}} ORK情况
        <router-view></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeTab: '',  // 初始显示的tab
        monthList: [],
      };
    },
    methods: {
      handleClick(tab) {
        this.$router.push({path: '/okr/' + tab.label, params: {'month': tab.label}});
      }
    },
    created() {
      this.activeTab = "1";
      this.monthList = getMonthList(2019);
    }
  }

  function getMonthList(startYear) {
    // 获取从startYear到目前为止的双月列表，格式yyyy-MM~yyyy-MM
    let fillZero = num => {
      if (num < 10) {
        return '0' + num;
      }
      return num + '';
    };
    let ret = [];
    let curMonth = new Date().getMonth() + 2;
    let curYear = new Date().getFullYear();
    if (curMonth > 12) {
      curYear += 1;
      curMonth = 1;
    }
    for (let year = curYear; year >= startYear; --year) {
      for (let month = curMonth; month > 0; month -= 2) {
        let m = Math.ceil(month / 2) * 2;
        ret.push(year + '.' + fillZero(m - 1) + '~' + year + '.' + fillZero(m));
      }
      curMonth = 12;
    }
    return ret;
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
