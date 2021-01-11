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

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/logout',
      redirect: '/login'
    },
    {
      path: '/home',
      redirect: '/home/edit'
    },
    {
      // 登录页
      path: '/login',
      component: login
    },
    { // 首页
      path: '/home',
      component: layout,
      children: [{
        // 文本生成融合
        path: '/home/merge',
        components: {
          textinput: textinput,
          childKG: childKG,
          originKG: originKG
        }
      },
      {
        // 知识图谱编辑
        path: '/home/edit',
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
