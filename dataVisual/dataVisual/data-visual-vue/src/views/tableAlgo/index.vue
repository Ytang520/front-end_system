<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-row :gutter="20" class="bordered-row">-->
<!--      <h2 style="color: #2d8cf0;">电极帽修磨电阻</h2>-->
<!--      <Table ref="child1" />-->
<!--    </el-row>-->
<!--    <el-row :span="10">-->
<!--      <h2 style="color: #2d8cf0;">电极帽修磨进给量</h2>-->
<!--      <Table ref="child2" />-->
<!--    </el-row>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import Table from '@/views/table/table.vue'-->

<!--export default {-->
<!--  components: {-->
<!--    Table-->
<!--  },-->

<!--  mounted() {-->
<!--    this.$refs.child1.idName = 'lineChart1'-->
<!--    this.$refs.child2.idName = 'lineChart2'-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--.bordered-row {-->
<!--  border: 1px solid #2d8cf0; /* 设置边框样式为湖蓝色 */-->
<!--  padding: 20px; /* 添加一些内边距 */-->
<!--  margin-bottom: 20px; /* 添加一些底部外边距，以便分开两个块 */-->
<!--}-->
<!--</style>-->

<template>
  <div class="app-container">
    <el-row :gutter="20" class="bordered-row">
      <h2 style="color: #2d8cf0;">电极帽修磨电阻</h2>
      <Table ref="child1" />
    </el-row>
    <el-row :span="10" class="bordered-row">
      <h2 style="color: #2d8cf0;">电极帽修磨进给量</h2>
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

<style>
.bordered-row {
  border: 1px solid #2d8cf0; /* 设置边框样式为湖蓝色 */
  padding: 20px; /* 添加一些内边距 */
  margin-bottom: 20px; /* 添加一些底部外边距，以便分开两个块 */
}
</style>
