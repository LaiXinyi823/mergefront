import Vue from 'vue';
import VueRouter from 'vue-router';
import textinput from '@/components/textinput.vue';
import layout from '@/components/layout.vue';
import childKG from '@/components/childKG.vue';
import originKG from '@/components/originKG.vue';
import search from '@/components/search.vue';
import entityResult from '@/components/entityResult.vue';
import KG from '@/components/KG.vue';
import login from '@/components/login.vue';
import register from '@/components/register.vue';
import myProject from '@/components/myProject.vue';
import myGraph from '@/components/myGraph.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // 注销跳转
    {
      path: '/logout',
      redirect: '/login'
    },
    {
      path: '/home',
      redirect: '/home/myproject'
    },
    // 注册页
    {
      path: '/register',
      component:register
    },
    {
      // 登录页
      path: '/login',
      component: login
    },
    { // 首页
      path: '/home',
      component: layout,
      children: [
      {
        // 我的项目
        path: '/home/myproject',
        component: myProject
      },
      {
        // 我的数据
        path: '/home/mydata',
        component: myGraph
      },
      {
        // 我的图谱
        path: '/home/mygraph',
        component: myGraph
      },
      {
        // 我的模型
        path: '/home/mymodel',
        component: myGraph
      },
      {
        // 文本生成融合
        path: '/home/mergeKG',
        components: {
          textinput: textinput,
          childKG: childKG,
          originKG: originKG
        }
      },
      {
        // 知识图谱编辑
        path: '/home/editKG',
        components: {
          search: search,
          entityResult: entityResult,
          KG: KG
        }
      }
    ]
    }
  ]
});
