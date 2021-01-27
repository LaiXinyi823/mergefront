import Vue from 'vue';
import VueRouter from 'vue-router';
import textinput from '@/components/textinput.vue';
import home from '@/components/home.vue';
import childKG from '@/components/childKG.vue';
import originKG from '@/components/originKG.vue';
import search from '@/components/search.vue';
import entityResult from '@/components/entityResult.vue';
import KG from '@/components/KG.vue';
import login from '@/components/login.vue';
import register from '@/components/register.vue';
import myProject from '@/components/myProject.vue';
import myGraph from '@/components/myGraph.vue';
import myDomain from '@/components/myDomain.vue';
import graphDetail from '@/components/graphDetail.vue';

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
          myproject: myProject,
          mygraph: myGraph,
          mydomain: myDomain,
          textinput: textinput,
          childKG: childKG,
          originKG: originKG,
          search: search,
          entityResult: entityResult,
          KG:KG
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
