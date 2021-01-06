import Vue from 'vue';
import VueRouter from 'vue-router';
import textinput from '@/components/textinput.vue';
import layout from '@/components/layout.vue';
import childKG from '@/components/childKG.vue';
import originKG from '@/components/originKG.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
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
      }]
    }
  ]
});
