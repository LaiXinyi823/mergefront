<template>
    <el-container>
    <!-- 系统平台头部 -->
      <el-header style="background-color:white" >
        <span class="el-icon-kg">&#xe918;
        </span>
        <span style="color:#409EFF;font-size:25px;">  专业内容知识图谱编辑工具</span>
        <div class="demo-basic--circle">
          <div class="block" @click="logout()"> 
            <!-- 头像 -->
            <el-link :underline="false" icon="el-icon-user-solid">注销</el-link>
          </div>
        </div>
      </el-header>
      <el-container>
        <!-- 导航栏 -->
        <el-aside width="200px">
          <div style="background-color:#fff;height:800px;">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              background-color="white"
              text-color="black"
              active-text-color="#ffd04b"
            >
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
          </div>
          <!-- <el-menu :collapse="false" class="el-menu-vertical-demo">  
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
          </el-menu> -->
        </el-aside>
        <!-- <div class="right-content">     -->
        <el-main style="height:100%;">
          <router-view name="fusion_project" v-if="opt=='generate_project'" />
          <router-view name="annotate_project" v-if="opt=='annotate_project'" />
          <router-view name="fusion_project" v-if="opt=='fusion_project'" />
          <router-view name="mygraph" v-if="opt=='mygraph' && isRouterAlive" />
          <router-view name="mydomain" v-if="opt=='mydomain' && isRouterAlive" /> 
          <router-view name="myRawdata" v-if="opt=='myrawdata' && isRouterAlive" /> 
          <router-view name="myTripleData" v-if="opt=='myTripleData' && isRouterAlive" /> 
          <router-view name="mymodel" v-if="opt=='mymodel' && isRouterAlive" /> 
        </el-main>
        <!-- </div> -->
      </el-container>
    </el-container>
  <!-- </div> -->
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
        {'id':'1','menuName':'我的项目','icon':'el-icon-s-promotion',
        'children':[
          {'subID':'1','subName':'构建项目','subIcon':'el-icon-magic-stick','option':'generate_project'},
          {'subID':'2','subName':'标注项目','subIcon':'el-icon-edit','option':'annotate_project'},
          {'subID':'3','subName':'融合项目','subIcon':'el-icon-copy-document','option':'fusion_project'}
        ]},
        {'id':'2','menuName':'我的数据','icon':'el-icon-coin',
        'children':[
          {'subID':'1','subName':'文本数据','subIcon':'el-icon-s-grid','option':'myrawdata'},
          {'subID':'2','subName':'三元组数据','subIcon':'el-icon-s-data','option':'myTripleData'}]
        },
        {'id':'3','menuName':'我的图谱','icon':'el-icon-share',
        'children':[
          {'subID':'1','subName':'图谱管理','subIcon':'el-icon-picture','option':'mygraph'},
          {'subID':'2','subName':'领域管理','subIcon':'el-icon-s-home','option':'mydomain'}]},
        {'id':'4','menuName':'我的模型','icon':'el-icon-help',
        'children':[
          {'subID':'1','subName':'模型管理','subIcon':'el-icon-s-opportunity','option':'mymodel'},
        ]},
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

.el-icon-kg {
  color: #409EFF;
  margin-left: 1px;
  font-size: 50px;
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
  margin-right: 20px;
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
  width: 30%;
  margin-bottom: 0;
  margin-left: 10px;
}

.child-4{
  width: 50%;
  margin-bottom: 0;
  // margin-left: 100px;
}

.right-right-content2{
  width: 100%;
  margin-left: 5px;
  margin-bottom: 0;
}
</style>
