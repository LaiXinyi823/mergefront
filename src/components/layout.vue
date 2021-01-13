<template>
  <div>
    <!-- 系统平台头部 -->
    <div class="header">
      <span class="el-icon-kg">&#xe918;</span>
      <h2 class="title">
        领工云知识图谱编辑工具
      </h2>
      <div class="demo-basic--circle">
        <div
          class="block"
          @click="info('/logout')"
        >
          <!-- 头像 -->
          <el-avatar
            :size="30"
            :src="circleUrl"
          />
        </div>
      </div>
    </div>
    <!-- 导航栏 -->
    <div class="nav">
      <el-container>
        <el-menu
          :default-active="$route.path"
          :unique-opened="true"
          :collapse="false"
          class="el-menu-vertical-demo"
        >
          <el-menu-item
            index="/home/myproject"
            @click="show('/home/myproject')"
          >
            <i class="el-icon-menu" />
            <span slot="title">我的项目</span>
          </el-menu-item>
          <el-menu-item
            index="/home/mydata"
            @click="show('/home/mydata')"
          >
            <i class="el-icon-data-line" />
            <span slot="title">我的数据</span>
          </el-menu-item>
          <el-menu-item
            index="/home/mygraph"
            @click="show('/home/mygraph')"
          >
            <i class="el-icon-share" />
            <span slot="title">我的图谱</span>
          </el-menu-item>
          <!-- <el-submenu index="/home/myGraph" @click="show('/home/mygraph')"> -->
          <!-- <template slot="title"  @click="show('/home/mygraph')">
                <i class="el-icon-share"></i>
                <span>我的图谱</span>
              </template> -->
          <!-- <el-submenu>
                <template slot="title">图谱管理</template>
                <el-menu-item index="/home/editKG" @click="show('/home/editKG')">知识图谱编辑</el-menu-item>
                <el-menu-item index="/home/mergeKG" @click="show('/home/mergeKG')">文本生成</el-menu-item>
              </el-submenu> -->
          <!-- <el-submenu> -->
          <!-- <template slot="title">领域管理</template>
              </el-submenu> -->
          <!-- </el-submenu> -->
          <el-menu-item
            index="/home/myModel"
            @click="show('/home/mymodel')"
          >
            <i class="el-icon-help" />
            <span slot="title">我的模型</span>
          </el-menu-item>
        </el-menu>
        <!-- 我的项目-子路由 -->
        <div
          v-if="opt=='myproject'"
          class="right-content"
        >    
          <router-view name="myproject" />
        </div>
        <!-- 我的数据-子路由 -->
        <div
          v-if="opt=='mydata'"
          class="right-content"
        >    
          <router-view name="mydata" />
        </div>
        <!-- 我的图谱-子路由 -->
        <div
          v-if="opt=='mygraph'"
          class="right-content"
        >    
          <router-view />
        </div>
        <!-- 知识图谱编辑-子路由 -->
        <div
          v-if="opt=='edit'"
          class="right-content"
        >
          <div
            class="child-1"
            style="float:left;"
          >
            <!-- 知识图谱编辑搜索模块 -->
            <router-view name="search" />
            <!-- 实体搜索结果模块 -->
            <router-view name="entityResult" />
          </div>
          <div
            class="child-2"
            style="float:left;"
          >
            <router-view name="KG" />
          </div>
        </div>
        <!-- 文本生成及图谱融合-子路由 -->
        <div
          v-if="opt=='merge'"
          class="right-content"
        >
          <div
            class="child-3"
            style="float:left;"
          >
            <!-- 文本输入框 -->
            <router-view name="textinput" />
            <!-- 文本生成子图显示模块 -->
            <router-view name="childKG" />
          </div>
          <div
            class="child-4"
            style="float:left;"
          >
            <!-- 待融合显示模块 -->
            <router-view name="originKG" />
          </div>
        </div>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: true,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      opt: 'edit'
    };
  },
  methods: {
    info  (path) {
      this.$router.replace(path);
    },
    show (path) {
      if (path === '/home/edit') {
        this.opt = 'edit';
      } 
      else if (path === '/home/merge'){
        this.opt = 'merge';
      }
      else if (path === '/home/mygraph'){
        this.opt = 'mygraph';
      }
      else if (path === '/home/myproject'){
        this.opt = 'myproject';
      }
      else if (path === '/home/mydata'){
        this.opt = 'mydata';
      }
      console.log(this.opt);
      this.$router.push(path);
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
  width: 40%;
  margin-bottom: 0;
  margin-left: 10px;
}

.child-4{
  width: 50%;
  margin-bottom: 0;
  margin-left: 40px;
}

.right-right-content2{
  width: 100%;
  margin-left: 5px;
  margin-bottom: 0;
}
</style>
