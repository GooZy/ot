<template>
  <div>
    <el-card v-if="tableData === null">
      <h1>暂无目标</h1>
    </el-card>
    <el-card class="box-card" v-for="(d, index) in tableData"
             style="margin-bottom: 10px">
      <span style="float: left; font: bold 100% arial,sans-serif;">目标{{index + 1}}: {{d.data[0].object}}</span>
      <div style="float: right; padding: 5px 0">
        <el-button type="primary" size="mini" icon="el-icon-edit" circle>添加</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
      </div>

      <el-table :data="d.data"
                border
                style="width: 100%; margin-top: 10px; margin-left: 10px"
                @cell-dblclick="cellDbClick"
                @cell-mouse-leave="cellLeave">
        <el-table-column label="关键结果" min-width="35">
          <template v-slot="scope">
            <span v-if="hitBox[scope.row.object+scope.row.key+scope.column.label]">
              <el-input type="textarea" size="small" v-model="scope.row.key"></el-input>
            </span>
            <span v-else>{{scope.row.key}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前进度" min-width="18">
          <template v-slot="scope">
            <span v-if="hitBox[scope.row.object+scope.row.key+scope.column.label]">
              <el-input-number size="small" v-model="scope.row.result" :max="scope.row.target" :min="0"></el-input-number>
            </span>
            <span v-else>{{scope.row.result}}</span>
          </template>
        </el-table-column>
        <el-table-column label="目标值" min-width="18">
          <template v-slot="scope">
            <span v-if="hitBox[scope.row.object+scope.row.key+scope.column.label]">
              <el-input size="small" v-model="scope.row.target"></el-input>
            </span>
            <span v-else>{{scope.row.target}}</span>
          </template>
        </el-table-column>
        <el-table-column label="占比(%)" min-width="18">
          <template v-slot="scope">
            <span v-if="hitBox[scope.row.object+scope.row.key+scope.column.label]">
              <el-input size="small" v-model="scope.row.weight"></el-input>
            </span>
            <span v-else>{{scope.row.weight}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="11">
          <el-button type="danger" size="mini" icon="el-icon-delete" circle></el-button>
        </el-table-column>
      </el-table>
      <span>当前总分：<b>{{scoreList[index]}}</b> (满分：100)</span>
    </el-card>
    <el-button style="float: left;" type="primary">新建</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        month: '',
        scoreList: [],
        hitBox: {},  // 判断是否修改
        tableData: [{
          data: [{
            object: '兴趣相关能力提升',
            key: '出口仁大家的日本语剩余35课完成',
            result: 10,
            target: 35,
            weight: 30
          }, {
            object: '兴趣相关能力提升',
            key: 'OT web版发布',
            result: 1,
            target: 10,
            weight: 60
          }, {
            object: '兴趣相关能力提升',
            key: '看完《百年孤独》',
            result: 6,
            target: 10,
            weight: 10
          }
          ],
        }, {
          data: [{
            object: '兴趣相关能力提升2',
            key: '出口仁大家的日本语剩余35课完成',
            result: 10,
            target: 35,
            weight: 30
          }, {
            object: '兴趣相关能力提升2',
            key: 'OT web版发布',
            result: 1,
            target: 10,
            weight: 40
          }, {
            object: '兴趣相关能力提升2',
            key: '看完《百年孤独》',
            result: 6,
            target: 10,
            weight: 30
          }],
        }]
      }
    },
    methods: {
      initData(isOldPage) {
        this.month = this.$route.query.month;
        this.tableData = null;
        this.scoreList = [];
        // 同样的页面，不需要初始化的数据
        if (!isOldPage) {
          this.hitBox = {};
        }
        let tableData = localStorage.getItem(this.month);
        tableData = JSON.parse(tableData);
        if (tableData) {
          this.tableData = tableData;
          this.updateScore(tableData);
        }
      },

      updateScore(tableData) {
        // 统计目标当前分数
        let scoreList = [];
        tableData.forEach(data => {
          let score = 0;
          data.data.forEach(each => {
            score += each.result / each.target * each.weight;
          });
          scoreList.push(score.toFixed(2));
        });
        this.scoreList = scoreList;
      },

      cellDbClick(row, column, cell, event, obj) {
        let hitKey = row.object + row.key + column.label;
        this.hitBox[hitKey] = true;
        this.initData(true);
      },
      cellLeave(row, column, cell, event) {
        this.saveData();
        this.initData();
      },
      saveData() {
        localStorage.setItem(this.month, JSON.stringify(this.tableData));
      }
    },
    created() {
      this.initData();
    },
    watch: {
      '$route': 'initData'
    }
  }
</script>