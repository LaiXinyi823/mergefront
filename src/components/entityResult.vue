<template>
    <div>
      <h4 style="margin-bottom:10px;">实体列表:</h4>
      <el-table
      :data="tableData"
      height="500"
      border
      style="width: 100%;">
      <el-table-column
      prop="entityName"
      label="实体名称"
      width="190">
      </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        entityName: '2016-05-03'
      }, {
        entityName: '2016-05-02'
      }, {
        entityName: '2016-05-04'
      }, {
        entityName: '2016-05-01'
      }, {
        entityName: '2016-05-08'
      }, {
        entityName: '2016-05-06'
      }, {
        entityName: '2016-05-06'
      }, {
        entityName: '2016-05-06'
      }, {
        entityName: '2016-05-06'
      }, {
        entityName: '2016-05-07'
      }]
    };
  }
};
</script>

<style scoped>
</style>
