<template>
  <el-container>
      <el-aside width="95%" height="100%" class="originKG">
        <el-card shadow="always">
          <h5 style="margin:0;display:inline;width:50px;">知识图谱融合预览</h5>
          <el-divider content-position="left" style="margin:10px"></el-divider>
          <div class="block">
            <el-image :src="src" style="width:40%;margin-left:30%;"></el-image>
          </div>
          <h5 style="color:#800000;">提示：新增4个实体，对应3种关系</h5>
          层数：<el-input-number size="mini" v-model="num4"></el-input-number>
          <el-button type="primary" plain >确认融合</el-button>
        </el-card>
      </el-aside>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      num1: 1,
      num2: 1,
      num3: 1,
      num4: 1
    };
  }
};
</script>

<style lang="less" scoped>
.originKG{
  margin-top:0px;
  height:100%;
}
// el-button 按钮样式
.el-button--primary {
  font-size: 12px;
  margin-left: 80%;
  margin-top: 10px;
}
</style>
