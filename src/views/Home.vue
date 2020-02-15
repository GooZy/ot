<template>
  <div>
    <el-card v-if="tableData === null || tableData.length === 0">
      <h1>暂无目标</h1>
    </el-card>
    <el-card class="box-card" v-for="(d, index) in tableData"
             style="margin-bottom: 10px">
      <span style="float: left; font: bold 100% arial,sans-serif;">目标{{index + 1}}: {{d.object}}</span>
      <div style="float: right; padding: 5px 0">
        <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="modifyObject(index)"></el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteTable(index)"></el-button>
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
        <el-table-column :label="fixLabel" min-width="18">
          <template v-slot="scope">
            <span v-if="hitBox[scope.row.object+scope.row.key+scope.column.label]">
              <el-input size="small" v-model="scope.row.weight"></el-input>
            </span>
            <span v-else-if="hitBox[scope.row.object+scope.row.key+scope.column.label] === false">
              <el-input size="small" v-model="scope.row.weight" disabled></el-input>
            </span>
            <span v-else>{{scope.row.weight}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="11">
          <template v-slot="scope">
            <el-button type="danger" size="mini" icon="el-icon-delete" circle
                       @click="deleteRow(scope.row.object + scope.row.key, index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col>
        <div class="el-table-add-row" style="width: 99.2%;" @click="preAddKey(index)"><span>+ 添加</span></div>
      </el-col>
      <span>当前总分：<b>{{scoreList[index]}}</b> (满分：100)</span>
    </el-card>
    <el-button style="float: left;" type="primary" @click="newObject">新建目标</el-button>

    <el-dialog title="新建关键结果" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form">
        <el-form-item label="关键结果"
                      prop="key"
                      :rules="[
                        { required: true, message: '关键结果不能为空'}
                      ]">
          <el-input v-model="form.key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="目标值"
                      prop="target"
                      :rules="[
                        { required: true, message: '目标值不能为空'},
                        { type: 'number', message: '目标值必须为数字值'}
                      ]">
          <el-input v-model.number="form.target" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewKey('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        month: '',
        scoreList: [],
        hitBox: {},  // 判断是否修改
        fixLabel: '占比(%)',  // 需要固定的格子标签
        form: {},
        editData: false,
        dialogFormVisible: false,
        tableData: [{
          object: '兴趣相关能力提升',
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
          object: '兴趣相关能力提升2',
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
        this.tableData = [];
        this.scoreList = [];
        this.form = {
          key: '',
          target: 0,
          index: -1,
        };
        this.dialogFormVisible = false;
        // 同样的页面，不需要初始化的数据
        if (!isOldPage) {
          this.hitBox = {};
          this.editData = false;
        }
        let tableData = localStorage.getItem(this.month);
        tableData = JSON.parse(tableData);
        if (tableData && tableData.length !== 0) {
          this.tableData = tableData;
          this.preUpdate(tableData);
        }
      },

      preUpdate(tableData) {
        // 初始化相关数据
        // 统计目标当前分数
        let scoreList = [];
        tableData.forEach(data => {
          let score = 0;
          if (data.data.length !== 0) {
            data.data.forEach(each => {
              score += each.result / each.target * each.weight;
            });
            let lastData = data.data[data.data.length - 1];
            this.hitBox[lastData.object + lastData.key + this.fixLabel] = false;
          }
          if (isNaN(score)) {score = 0}
          scoreList.push(score.toFixed(2));
        });
        this.scoreList = scoreList;
      },

      cellDbClick(row, column) {
        let hitKey = row.object + row.key + column.label;
        // 略过不可更改格子
        if (!isNaN(this.hitBox[hitKey])) {
          return;
        }
        this.hitBox[hitKey] = true;
        this.editData = true;
        this.initData(true);
      },
      cellLeave(row, column) {
        if (this.editData) {
          if (this.formatData(row, column)) {
            this.saveData();
          }
          this.initData();
        }
      },
      saveData() {
        localStorage.setItem(this.month, JSON.stringify(this.tableData));
        this.sendMsg('数据保存成功', 'success', 1000);
      },
      formatData(row, column) {
        let orgData = localStorage.getItem(this.month);
        if (orgData === JSON.stringify(this.tableData)) {
          return false;
        }
        orgData = JSON.parse(orgData);
        // 校验数据，且对字符串解析为数字
        for (let i = 0; i < this.tableData.length; i++) {
          let data = this.tableData[i].data;
          for (let j = 0; j < data.length; j++) {
            let d = data[j];
            // 校验类型
            if (typeof(d.target) !== 'number') {
              if (parseInt(d.target).toString() !== d.target) {
                this.sendMsg('请输入整数', 'error', 1500);
                return false;
              }
              d.target = parseInt(d.target);
            }
            if (typeof(d.weight) !== 'number') {
              if (parseInt(d.weight).toString() !== d.weight) {
                this.sendMsg('请输入整数', 'error', 1500);
                return false;
              }
              d.weight = parseInt(d.weight);
            }
            if (d.target < d.result) {
              this.sendMsg('目标值不得小于当前进度', 'error', 1500);
              return false;
            }
            if (d.weight > 100) {
              this.sendMsg('占比最高为100', 'error', 1500);
              return false;
            }
            // 保证最后一列百分比和为100
            if (column.label === this.fixLabel && d.object === row.object && d.key === row.key) {
              let dl = orgData[i].data.length - 1;
              let max = orgData[i].data[j].weight + orgData[i].data[dl].weight;
              if (d.weight > max) {
                d.weight = max;
              }
              data[dl].weight = max - d.weight;
            }
            // 关键结果不能相同
            for (let k = 0; k < data.length; k++) {
              let d2 = data[k];
              if (k === j) {continue}
              if (d2.key === d.key) {
                this.sendMsg('关键结果不能相同', 'error', 1500);
                return false;
              }
            }
          }
        }
        return true;
      },
      deleteRow(indexKey) {
        this.$confirm('将要删除当前关键结果, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tableData[i].data.length; j++) {
              let data = this.tableData[i].data;
              let d = data[j];
              if (d.object + d.key === indexKey) {
                // 剩一个关键结果时，直接删除
                if (data.length !== 1) {
                  if (j === data.length - 1) {
                    data[data.length - 2].weight += data[j].weight;
                  } else {
                    data[data.length - 1].weight += data[j].weight;
                  }
                }
                data.splice(j, 1);
              }
            }
          }
          this.saveData();
          this.initData();
        }).catch(() => {});
      },
      deleteTable(tableIndex) {
        this.$confirm('将要删除当前目标, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(tableIndex, 1);
          this.saveData();
          this.initData();
        }).catch(() => {});
      },
      modifyObject(index) {
        this.$prompt('', '修改目标', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if (this.isEmpty(value)) {
            this.sendMsg("目标不能为空", "error", 1500);
            return
          }
          this.tableData[index].object = value;
          this.tableData[index].forEach(each => {
            each.data.object = value;
          });
          this.saveData();
          this.initData();
        }).catch(() => {});
      },
      newObject() {
        this.$prompt('', '新建目标', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if (this.isEmpty(value)) {
            this.sendMsg("目标不能为空", "error", 1500);
            return
          }
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].object === value) {
              this.sendMsg("已经设定过相同的目标", "error", 1500);
              return
            }
          }
          this.tableData.push({object: value, data: []});
          this.saveData();
          this.initData();
        }).catch(() => {});
      },
      preAddKey(index) {
        // 为了传递index
        this.dialogFormVisible = true;
        this.form.index = index;
      },
      addNewKey(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false;
            if (this.isEmpty(this.form.key)) {
              this.sendMsg("关键结果不能为空", "error", 1500);
              return
            }
            let data = this.tableData[this.form.index].data;
            for (let i = 0; i < data.length; i++) {
              if (data[i].key === this.form.key) {
                this.sendMsg('关键结果不能相同', 'error', 1500);
                return
              }
            }
            let weight = 0;
            if (data.length === 0) {
              weight = 100;
            }
            data.push({
              object: this.tableData[this.form.index].object,
              key: this.form.key,
              result: 0,
              target: this.form.target,
              weight: weight,
            });
            this.saveData();
            this.initData();
          } else {
            this.sendMsg('未通过校验', 'error', 1500);
            return false;
          }
        });
      },

      // 工具方法
      isEmpty(str) {
        return str === null || str.replace(/ /g, "").length === 0;
      },
      sendMsg(msg, level, time) {
        this.$message({
          message: msg,
          type: level,
          duration: time,
        });
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

<style>
  .el-table-add-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
  }
</style>