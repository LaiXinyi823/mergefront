<template>
  <div style="margin-top:0;">
  <h4 style="margin-top:5px;margin-bottom:10px;">请输入您想搜索的实体:</h4>
  <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
  </div>
</template>

<style>
  .el-input {
    width: 120px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
<script>
export default {
  data () {
    return {
      input1: '',
      input2: '',
      input3: '',
      select: ''
    };
  }
};
</script>
