<template>
  <el-container>
    <el-aside
      width="100%"
      height="100%"
      class="originKG"
    >
      <el-card shadow="always">
        <h5 style="margin:0;display:inline;width:50px;">
          知识图谱融合预览
        </h5>
        <el-divider
          content-position="left"
          style="margin:10px"
        />
        <div class="block">
          <el-image
            :src="src"
            style="width:40%;height:50%;margin-left:30%;"
          />
        </div>
        <h5 style="color:#800000;">
          提示：新增4个实体，对应3种关系
        </h5>
        <h4 style="float:left;margin:0;">
          显示层数：
        </h4>
        <el-input-number
          size="mini"
          v-model="num1"
          style="float:left"
        />
        <h4 style="float:left;margin:0;margin-left:30px;">
          显示条数：
        </h4>
        <el-input-number
          size="mini"
          v-model="num2"
          style="float:left"
        />
        <el-button
          type="primary"
          plain
        >
          确认融合
        </el-button>
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
      num2: 10
    };
  }
};
</script>

<style lang="less" scoped>
.originKG{
  margin-left: 5px;
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
