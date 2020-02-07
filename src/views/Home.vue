<template>
  <div>
    <el-card class="box-card" v-for="(d, index) in tableData"
             style="margin-bottom: 10px">
      <span style="float: left; font: bold 100% arial,sans-serif;">目标{{index + 1}}: {{d.object}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
      <el-table :data="d.data"
                border
                style="width: 100%; margin-top: 10px; margin-left: 10px">
        <el-table-column
                prop="key"
                label="关键结果">
        </el-table-column>
        <el-table-column
                prop="result"
                label="当前进度">
        </el-table-column>
        <el-table-column
                prop="target"
                label="目标值">
        </el-table-column>
        <el-table-column
                prop="weight"
                label="占比(%)">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        month: '',
        tableData: [{
          object: '兴趣相关能力提升',
          data: [{
            key: '出口仁大家的日本语剩余35课完成',
            result: '10',
            target: '35',
            weight: 30
          }, {
            key: 'OT web版发布',
            result: '1',
            target: '10',
            weight: 60
          }, {
            key: '看完《百年孤独》',
            result: '6',
            target: '10',
            weight: 10
          }
          ],
        }, {
          object: '兴趣相关能力提升2',
          data: [{
            key: '出口仁大家的日本语剩余35课完成',
            result: '10',
            target: '35',
            weight: 30
          }, {
            key: 'OT web版发布',
            result: '1',
            target: '10',
            weight: 60
          }, {
            key: '看完《百年孤独》',
            result: '6',
            target: '10',
            weight: 10
          }],
        }]
      }
    },
    methods: {
      fetchData() {
        this.month = this.$route.query.month;
      }
    },
    created() {
      this.fetchData();
    },
    watch: {
      '$route': 'fetchData'
    }
  }
</script>