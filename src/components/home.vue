<template>
  <div>
    <!-- 系统平台头部 -->
    <div class="header">
      <span class="el-icon-kg">&#xe918;</span>
      <h2 class="title">
        领工云知识图谱编辑工具
      </h2>
      <div class="demo-basic--circle">
        <div class="block" @click="logout()">
          <!-- 头像 -->
          <el-avatar :size="30" :src="circleUrl"/>
        </div>
      </div>
    </div>
    <!-- 导航栏 -->
    <div class="nav">
      <el-container>
        <el-menu :collapse="false" class="el-menu-vertical-demo" style="width:200px;">  
        <el-submenu :index='item.id' v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.menuName}}</span>
        </template>
          <el-menu-item v-for="subitem in item.children" :key="subitem.subID"
          :unique-opened="true" @click="show(subitem.option)" >
          <template slot="title">
            <i :class="subitem.subIcon"></i>
            <span>{{subitem.subName}}</span>
          </template>
          </el-menu-item>
        </el-submenu>
        </el-menu>
        <div class="right-content">    
          <router-view name="myproject" v-if="opt=='myproject'" />
          <router-view name="mygraph" v-if="opt=='mygraph' && isRouterAlive" />
          <router-view name="mydomain" v-if="opt=='mydomain' && isRouterAlive" />
        </div>
        <!-- 我的项目-子路由 -->
        <!-- <div v-if="opt=='myproject'" class="right-content">    
          <router-view name="myproject" />
        </div> -->
        <!-- 我的数据-子路由 -->
        <!-- <div v-if="opt=='mydata'" class="right-content">    
          <router-view name="mydata" />
        </div> -->
        <!-- 我的图谱-子路由 -->
        <!-- <div v-if="opt=='mygraph'" class="right-content">    
          <router-view name="mygraph" :visible="opt=='mygraph'"></router-view>
        </div> -->
        <!-- 知识图谱编辑-子路由 -->
        <!-- <div v-if="opt=='edit'" class="right-content">
        <div class="child-1" style="float:left;"> -->
            <!-- 知识图谱编辑搜索模块 -->
            <!-- <router-view name="search" /> -->
            <!-- 实体搜索结果模块 -->
            <!-- <router-view name="entityResult" />
          </div>
          <div class="child-2" style="float:left;">
            <router-view name="KG" />
          </div>
        </div> -->
        <!-- 文本生成及图谱融合-子路由 -->
        <!-- <div
          v-if="opt=='merge'"
          class="right-content"
        >
          <div
            class="child-3"
            style="float:left;"
          > -->
            <!-- 文本输入框 -->
            <!-- <router-view name="textinput" /> -->
            <!-- 文本生成子图显示模块 -->
            <!-- <router-view name="childKG" />
          </div>
          <div class="child-4" style="float:left;"> -->
            <!-- 待融合显示模块 -->
            <!-- <router-view name="originKG" />
          </div>
        </div> -->
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  provide (){
    return {
      reload: this.reload
    };
  },
  data () {
    return {
      isRouterAlive: true,
      isCollapse: true,
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      opt: '',
      menuList:[
        {'id':'1','menuName':'我的项目','icon':'el-icon-menu',
        'children':[
          {'subID':'1','subName':'项目管理','subIcon':'el-icon-setting','option':'myproject'}
        ]},
        {'id':'2','menuName':'我的数据','icon':'el-icon-coin',
        'children':[]},
        {'id':'3','menuName':'我的图谱','icon':'el-icon-share',
        'children':[
          {'subID':'1','subName':'图谱管理','subIcon':'el-icon-s-grid','option':'mygraph'},
          {'subID':'2','subName':'领域管理','subIcon':'el-icon-s-home','option':'mydomain'}]},
        {'id':'4','menuName':'我的模型','icon':'el-icon-help','children':[]},
      ],
      graph_list:[]
    };
  },
  methods: {
    show (option) {
      this.opt = option;
      console.log(this.opt);
    },
    async logout () {
      const res = await this.$http.delete('session');
      console.log(res);
      this.$router.push('/login');
    },
    reload (){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      });
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
  left: 80px;
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
  margin-right: 35px;
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
