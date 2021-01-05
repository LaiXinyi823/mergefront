<template>
  <div>
    <!-- <el-container>
        <el-button type="primary" round>生成子图</el-button>
        <el-aside width="500px" background-color=#fff>
            <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="textarea"
            class="textinput"
            >
            </el-input>
        </el-aside>
    </el-container> -->
    <el-container>
  <el-aside width="200px">Aside</el-aside>
  <el-main>Main</el-main>
</el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      textarea: ''
    }
  }
}
</script>

<style lang="less" scoped>
.textinput{
    width: 300px;
    margin-top: 0;
    margin-left: 10px;
}
</style>
