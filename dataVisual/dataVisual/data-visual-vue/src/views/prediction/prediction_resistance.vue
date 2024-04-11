<template>
  <el-row>
    <!-- 弹出新增页面 -->
    <el-dialog :visible.sync="upVisible" width="600px">
      <el-card shadow="always" style="margin: 20px; border-radius: 20px;">
        <template #header>上传文件</template>
        <div style="display: flex; justify-content: center;">
        <el-upload class="upload-demo" action="" drag :auto-upload="false" :on-change="upExcel" :limit="1">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        </div>
      </el-card>
    </el-dialog>
    <!-- 表格部分 -->
    <el-row>
      <el-col :span="12" style="padding:16px 16px 0; margin-bottom:32px;">
        <div class="flex gap-4 mb-4" style="margin-bottom: 20px;">
          <el-button type="primary" style="margin-left: 50px;" plain @click="showUpExcel()">上传文件</el-button>
          <el-select v-model="algo_name" clearable placeholder="请选择算法" style="margin-left: 50px;">
            <el-option
              v-for="item in algo_list"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-input v-model="step_value" placeholder="" type="number" style="width: 200px; margin-left: 50px;">
            <template v-slot:prepend>步长设置</template>
          </el-input>
          <el-button type="primary" style="margin-left: 50px;" plain @click="runAlgo">点击运行</el-button>
        </div>
        <el-collapse>
          <el-collapse-item title="上传数据" name="1">
            <el-table :data="showData" border style="width: 100%">
              <el-table-column v-for="head in heads" :key="head" :prop="head" :label="head" />
              <el-table-column
                fixed="right"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="deleteRow(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex; justify-content: center;">
            <el-pagination background layout="prev, pager, next" style="margin: 1%;" :current-page="currentPage" :total="totalNum" :page-size="10" @current-change="showPage" />
            </div>
          </el-collapse-item>
          <el-collapse-item title="预测数据" name="2">
            <el-table :data="predShowData" border style="width: 100%">
              <el-table-column v-for="head in predHeads" :key="head" :prop="head" :label="head" />
            </el-table>
            <el-pagination background layout="prev, pager, next" style="margin: 1%;" :current-page="predCurrentPage" :total="predTotalNum" :page-size="10" @current-change="showPredPage" />
          </el-collapse-item>
        </el-collapse>
      </el-col>
      <el-col :span="12" style="padding:16px 16px 0; margin-bottom:32px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>预测数据图示</span>
          </div>
          <div id="lineChart" style="height: 400px; width: auto;" />
        </el-card>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import * as XLSX from 'xlsx'
import * as echarts from 'echarts'

export default {
  name: 'Table',
  data() {
    return {
      // 上传数据部分
      AllTableData: [
      ],
      heads: [],
      tableData: [],
      showData: [],
      currentPage: 1,
      totalNum: 0,
      upVisible: false,
      // 算法选择
      algo_name: '',
      algo_list: ['算法一', '算法二', '算法三'],
      step_value: 0,
      // 预测数据部分
      predAllTableData: [
      ],
      predHeads: [],
      predTableData: [],
      predShowData: [],
      predCurrentPage: 1,
      predTotalNum: 0
    }
  },
  methods: {
    showPage(val) {
      this.currentPage = val
      this.showData = []
      for (var i = 0; i < 10; i++) {
        var ind = (this.currentPage - 1) * 10 + i
        if (ind >= this.totalNum) {
          break
        }
        this.showData.push(this.tableData[ind])
      }
    },

    showPredPage(val) {
      this.predCurrentPage = val
      this.predShowData = []
      for (var i = 0; i < 10; i++) {
        var ind = (this.predCurrentPage - 1) * 10 + i
        if (ind >= this.predTotalNum) {
          break
        }
        this.predShowData.push(this.predTableData[ind])
      }
    },

    deleteRow(index) {
      index = (this.currentPage - 1) * 10 + index
      this.AllTableData.splice(index, 1)
      this.tableData = this.AllTableData
      this.totalNum = this.tableData.length
      if (this.totalNum % 10 === 0 & this.currentPage !== 1) {
        this.currentPage--
      }
      this.showPage(this.currentPage)
    },
    /*
    上传excel部分
    */
    showUpExcel() {
      this.upVisible = true
    },

    upExcel(e) {
      const files = e.raw
      if (files.length <= 0) {
        return false
      } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
        console.log('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }
      // 读取表格
      const fileReader = new FileReader()
      fileReader.onload = (ev) => {
        const workbook = XLSX.read(ev.target.result, {
          type: 'binary'
        })
        const wsname = workbook.SheetNames[0]
        const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname])
        // 传入后端
        const ws_data = []
        const cur_heads = []
        ws.forEach((sourceObj) => {
          for (var k in sourceObj) {
            if (!cur_heads.includes(k)) {
              cur_heads.push(k)
            }
          }
          ws_data.push(sourceObj)
        })
        // 判断写入方式
        if (this.heads.length > 0) {
          // 已有数据
          if (this.heads.toString() === cur_heads.toString()) {
            for (let i = 0; i < ws_data.length; i++) {
              this.AllTableData.push(ws_data[i])
            }
            this.tableData = this.AllTableData
            this.totalNum = this.tableData.length
            this.showPage(1)
            this.$message.success('导入成功！')
            this.upVisible = false
          } else {
            this.$message.error('两次上传的数据格式不统一！')
          }
        } else {
          // 无数据
          this.heads = cur_heads
          this.AllTableData = ws_data
          this.tableData = this.AllTableData
          this.totalNum = this.tableData.length
          this.showPage(1)
          this.$message.success('导入成功！')
          this.upVisible = false
        }
      }
      fileReader.readAsBinaryString(files)
    },

    runAlgo() {
      if (this.AllTableData.length === 0) {
        this.$message.warning('请上传数据~')
        return
      }
      if (!this.algo_name) {
        this.$message.warning('请选择算法~')
        return
      }
      if (this.step_value <= 0) {
        this.$message.warning('步长需要大于0~')
        return
      }
      // 假算法部分
      this.predAllTableData = []
      for (let i = 0; i < this.AllTableData.length; i++) {
        const data = this.AllTableData[i]
        let num = 0
        let value = 0
        for (const h in data) {
          value = value + parseFloat(data[h])
          num = num + 1
        }
        this.predAllTableData.push({ '均值': value / num, '总值': value })
      }
      this.predHeads = ['均值', '总值']
      this.predTableData = this.predAllTableData
      this.predTotalNum = this.predTableData.length
      this.showPredPage(1)
      this.plotChart()
    },

    plotChart() {
      var chartDom = document.getElementById('lineChart')
      var myChart = echarts.init(chartDom)
      // 数据预处理
      var seriesData = []
      for (var i = 0; i < this.predHeads.length; i++) {
        var data_i = []
        for (var j = 0; j < this.predAllTableData.length; j++) {
          data_i.push(this.predAllTableData[j][this.predHeads[i]])
        }
        seriesData.push({
          name: this.predHeads[i],
          type: 'line',
          // stack: 'Total',
          data: data_i
        })
      }
      // 配置
      var option = {
        title: {
          text: this.algo_name + '的预测折线图',
          subtext: '步长: ' + this.step_value
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.predHeads
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          nameLocation: 'middle'
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      }
      myChart.setOption(option)
    }
  }
}
</script>
