<template>
    <div>
    <el-container>
      <el-aside width="95%" height="100%" class="originKG">
        <el-card shadow="always">
          <h4 style="margin:0;display:inline;width:50px;">关联图谱如下：</h4>
          <el-divider content-position="left" style="margin:10px"></el-divider>
          <h4 style="float:left;margin-top:5px;">筛选实体间的关系:</h4>
          <el-select v-model="value" placeholder="请选择" style="float:left;margin-left:10px;width:150px;font-size:20px;">
            <el-option
            v-for="item in options"
            height=15
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-check" style="float:left;" circle></el-button>
          <div class="block">
            <el-image :src="src" style="width:40%;height:50%;margin-left:18%;"></el-image>
          </div>
        </el-card>
      </el-aside>
    </el-container>
    </div>
</template>

<script>
export default {
  data () {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      options: [{
        value: '选项1',
        label: '同指关系'
      }, {
        value: '选项2',
        label: '应用关系'
      }, {
        value: '选项3',
        label: '对比关系'
      }],
      value: ''
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

.block{
  height:50%;
}
</style>
