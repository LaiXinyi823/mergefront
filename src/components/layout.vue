<template>
  <div>
    <!-- 系统平台头部 -->
    <div class="header">
      <span class="el-icon-kg">&#xe918;</span>
      <h2 class="title">专业知识图谱编辑工具</h2>
      <div class="demo-basic--circle">
          <div class="block" @click="info('/home/merge')">
            <!-- 头像 -->
            <el-avatar :size="30" :src="circleUrl" ></el-avatar>
          </div>
      </div>
    </div>
    <!-- 导航栏 -->
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
            <!-- <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-share"></i>
                <span slot="title">知识图谱编辑</span>
              </template> -->
              <!-- <el-menu-item-group>
                <span slot="title">分组一</span>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group> -->
              <!-- <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <span slot="title">选项4</span>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu> -->
            <!-- </el-submenu> -->
              <el-menu-item index="/home/edit">
                <i class="el-icon-share"></i>
                <span slot="title">知识图谱编辑</span>
              </el-menu-item>
              <el-menu-item index="/home/merge">
                <i class="el-icon-edit-outline"></i>
                <span slot="title">文本生成</span>
              </el-menu-item>
          </el-menu>
          <!-- 文本生成及图谱融合-子路由 -->
          <div class="right-content">
            <div class="child-1" style="float:left;">
              <!-- 知识图谱编辑搜索模块 -->
              <router-view name="search"></router-view>
              <!-- 实体搜索结果模块 -->
              <router-view name="entityResult"></router-view>
            </div>
            <div class="child-2" style="float:left;">
              <router-view name="KG"></router-view>
            </div>
            <div class="child-3">
              <!-- 文本输入框 -->
              <router-view name="textinput"></router-view>
              <!-- 文本生成子图显示模块 -->
              <router-view name="childKG"></router-view>
            </div>
            <div class="child-4">
              <router-view name="originKG"></router-view>
            </div>
          </div>
          <!-- <div class='right-right-content2' style="float:left;"> -->
              <!-- 融合后的知识图谱显示模块 -->
              <!-- <router-view name="KG"></router-view>
              <div class='right-right-content1'> -->
                  <!-- 融合后的知识图谱显示模块 -->
                  <!-- <router-view name="originKG"></router-view>
              </div> -->
          <!-- </div> -->
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: true,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    };
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    },
    info  (path) {
      this.$router.replace(path);
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  background-color: #fff;
  height: 10%;
  padding: 0px;
  margin-left: 20px;
  margin-top: 10px;
  margin-right: 20px;
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
  left: 5%;
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
  width: 100%;
  height: 100%;
  margin-top: 10px;
  margin-left: 10px;
}

.content {
  background-color: #fff;
  width: 60%;
  height: 80%;
}

.block{
  position: absolute;
  right: 50px;
  top: 20px;
}

.right-content {
  width: 100%;
  margin-bottom: 0;
  margin-left: 10px;
}

.child-1{
  width: 15%;
  margin-bottom: 0;
  margin-left: 10px;
}

.child-2{
  width: 80%;
  height: 100%;
  margin-bottom: 0;
  margin-left: 40px;
}

.child-3{
  width: 50%;
  margin-bottom: 0;
  margin-left: 10px;
}

.child-4{
  width: 80%;
  margin-bottom: 0;
  margin-left: 10px;
}

.right-right-content2{
  width: 100%;
  margin-left: 5px;
  margin-bottom: 0;
}
</style>
