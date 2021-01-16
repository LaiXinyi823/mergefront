<template>
  <div>
    <h4 style="margin-bottom:10px;">
      实体列表:
    </h4>
    <el-table
      :data="tableData"
      height="500"
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="entityName"
        label="实体名称"
        width="190"
      />
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        entityName: '深度学习'
      }, {
        entityName: '深度学习算法'
      }, {
        entityName: '深度学习框架'
      }, {
        entityName: 'DL'
      }, {
        entityName: 'deep learning'
      }, {
        entityName: '深度学习算法'
      }, {
        entityName: '深度学习算法'
      }, {
        entityName: '深度学习算法'
      }, {
        entityName: '深度学习算法'
      }, {
        entityName: '深度学习算法'
      }]
    };
  }
};
</script>

<style scoped>
</style>
