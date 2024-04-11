<template>
  <el-row>
    <!-- 弹出新增页面 -->
    <el-dialog :visible.sync="upVisible" width="600px">
      <el-card shadow="always" style="margin: 20px; border-radius: 20px;">
        <template #header>上传文件</template>
        <el-upload class="upload-demo" action="" drag :auto-upload="false" :on-change="upExcel" :limit="1">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </el-card>
    </el-dialog>
    <!-- 表格部分 -->
    <el-row>
      <el-col :span="12" style="padding:16px 16px 0; margin-bottom:32px;">
        <div class="flex gap-4 mb-4" style="margin-bottom: 20px;">
          <el-button type="primary" style="margin-left: 100px;" plain @click="showUpExcel()">上传文件</el-button>
          <download-excel class="export-excel-wrapper" :data="AllTableData" name="filename.xls" style="display: contents;">
            <el-button type="primary" style="margin-left: 100px;" plain>导出excel</el-button>
          </download-excel>
        </div>
        <el-table :data="showData" border style="width: 100%">
          <el-table-column v-for="head in heads" :prop="head" :label="head" :key="head" />
        </el-table>
        <el-pagination background layout="prev, pager, next" style="margin: 1%;" @current-change="showPage" :current-page="currentPage" :total="totalNum" :page-size="10" />
      </el-col>
      <el-col :span="12" style="padding:16px 16px 0; margin-bottom:32px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>数据图示</span>
          </div>
          <div :id="idName"  style="height: 400px; width: auto;">
          </div>
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
      listLoading: true,
      column: [
        {
          type: 'index',
          label: '序号',
          width: 80
        },
        {
          prop: 'A',
          label: 'A'
        },
        {
          prop: 'B',
          label: 'B'
        },
        {
          prop: 'C',
          label: 'C'
        },
        {
          prop: 'D',
          label: 'D'
        }
      ],
      AllTableData: [
      ],
      heads: [],
      selectList: [],
      tableData: [],
      showData: [],
      searchName: '',
      currentPage: 1,
      totalNum: 0,
      upVisible: false,
      idName: ''
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
        this.heads = []
        ws.forEach((sourceObj) => {
          for (var k in sourceObj) {
            if (!this.heads.includes(k)) {
              this.heads.push(k)
            }
          }
          ws_data.push(sourceObj)
        })
        this.AllTableData = ws_data
        this.tableData = this.AllTableData
        this.totalNum = this.tableData.length
        this.showPage(1)
        this.$message.success('导入成功！')
        this.upVisible = false
        this.plotChart()
      }
      fileReader.readAsBinaryString(files)
    },

    plotChart() {
      var chartDom = document.getElementById(this.idName)
      var myChart = echarts.init(chartDom)
      // 数据预处理
      var seriesData = []
      for (var i = 0; i < this.heads.length; i++) {
        var data_i = []
        for (var j = 0; j < this.AllTableData.length; j++) {
          data_i.push(this.AllTableData[j][this.heads[i]])
        }
        seriesData.push({
          name: this.heads[i],
          type: 'line',
          // stack: 'Total',
          data: data_i
        })
      }
      // 配置
      var option = {
        title: {
          text: '折线图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.heads
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
