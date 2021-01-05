<template>
  <div class="header">
    <span class="el-icon-kg">&#xe918;</span>
    <h2 class="title">专业知识图谱编辑工具</h2>

    <div class="nav">
      <el-container>
          <el-menu router
            :default-active="$route.path"
            :unique-opened="true"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :collapse="false"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-share"></i>
                <span slot="title">知识图谱编辑</span>
              </template>
              <el-menu-item-group>
                <span slot="title">分组一</span>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <span slot="title">选项4</span>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
              <el-menu-item index="/home/merge">
                <i class="el-icon-edit-outline"></i>
                <span slot="title">文本生成</span>
              </el-menu-item>
          </el-menu>
        <router-view></router-view>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: true
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    goTo (path) {
      this.$router.replace(path)
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  background-color: #fff;
  height: 8%;
  padding: 0px;
  margin-left: 15px;
  margin-top: 10px;
  margin-right: 10px;
}

.el-icon-kg {
  color: #1e90ff;
  margin-left: 1px;
  font-size: 50px;
}

.title {
  font-family: "Microsoft YaHei";
  color: #1e90ff;
  position: absolute;
  left: 60px;
  top: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  top: 0;
  width: 250px;
  min-height: 700px;
  margin-left: 10px;
}

.nav {
  position: absolute;
  height: 100%;
  margin-top: 20px;
  margin-left: 0;
}

.content {
  background-color: #fff;
  width: 60%;
  height: 80%;
}
</style>
