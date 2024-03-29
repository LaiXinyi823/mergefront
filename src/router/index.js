import Vue from 'vue';
import VueRouter from 'vue-router';
import textinput from '@/components/textinput.vue';
import home from '@/components/home.vue';
import originKG from '@/components/originKG.vue';
import search from '@/components/search.vue';
import entityResult from '@/components/entityResult.vue';
import login from '@/components/login.vue';
import register from '@/components/register.vue';
import generate_graph from '@/components/generate_graph.vue';
import my_project from '@/components/my_project.vue';
import annotate_project from '@/components/annotate_project.vue';
import fusion_project from '@/components/fusion_project.vue';
import my_graph from '@/components/my_graph.vue';
import myDomain from '@/components/myDomain.vue';
import graphDetail from '@/components/graphDetail.vue';
import labelproject from '@/components/labelproject.vue';
import myRawdata from '@/components/myRawdata.vue';
import myTripleData from '@/components/myTripleData.vue';
import QA from '@/components/QA.vue';
import myModel from '@/components/myModel.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // 注册页
    {
      path: '/register',
      component:register
    },
    {
      // 登录页
      path: '/login',
      component:login
    },
    { // 首页
      path: '/home',
      component:home,
      children:[{
        // 各菜单页
        path:'/',
        components:{
          default: home,
          generate_graph:generate_graph,
          my_project: my_project,
          annotate_project: annotate_project,
          fusion_project:fusion_project,
          my_graph: my_graph,
          mydomain: myDomain,
          textinput: textinput,
          originKG: originKG,
          search: search,
          entityResult: entityResult,
          labelproject:labelproject,
          myRawdata:myRawdata,
          myTripleData:myTripleData,
          QA:QA,
          
          mymodel:myModel
        }
      },
      {
        // 知识图谱详情页
        path:'graphDetail',
        components:{
          graphDetail:graphDetail
        }
      }
    ]
    }
  ]
});

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
