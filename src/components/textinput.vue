<template>
  <el-container>
    <el-aside width="500px">
      <el-card shadow="always">
        <h5 style="margin:0;display:inline;width:50px;">
          输入文本
        </h5>
        <el-divider
          content-position="left"
          style="margin:15px"
        />
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入待生成知识图谱的文本内容"
          v-model="textarea"
          class="textinput"
        />
        <!-- <el-popconfirm
            confirm-button-text='好的'
            cancel-button-text='不用了'
            icon="el-icon-info"
            icon-color="red"
            title="确定重置吗？"
            >
            <el-button slot="reference" style=“float:left;font-size:12px;margin-top:10px;”>重置</el-button>
            </el-popconfirm> -->
        <el-button
          type="primary"
          plain
        >
          确认生成
        </el-button>
      </el-card>
    </el-aside>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      textarea: ''
    };
  }
};
</script>

<style lang="less" scoped>
// 文本输入框样式
.textinput {
  width: 450px;
  margin-top: 0;
  margin-left: 5px;
  margin-right: 5px;
}

// el-button 按钮样式
.el-button--primary {
  font-size: 12px;
  margin-left: 80%;
  margin-top: 10px;
}

.el-button--button{
  font-size: 12px;
  margin-left: 80%;
  margin-top: 10px;
}
</style>
