<template>
  <div class="app-container">
    <el-row :gutter="20">
      <h2>电极帽修磨电阻</h2>
      <Table ref="child1" />
    </el-row>
    <el-row :span="10">
      <h2>电极帽修磨进给量</h2>
      <Table ref="child2" />
    </el-row>
  </div>
</template>

<script>
import Table from '@/views/table/table.vue'

export default {
  components: {
    Table
  },

  mounted() {
    this.$refs.child1.idName = 'lineChart1'
    this.$refs.child2.idName = 'lineChart2'
  }
}
</script>
