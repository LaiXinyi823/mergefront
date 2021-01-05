import Vue from 'vue'
import VueRouter from 'vue-router'
import textinput from '@/components/textinput.vue'
import layout from '@/components/layout.vue'

Vue.use(VueRouter)

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
        name: 'merge',
        component: textinput
      }]
    }
    // {
    //   // 文本生成融合
    //   path: '/merge',
    //   name: 'merge',
    //   component: textinput
    // }
  ]
})
