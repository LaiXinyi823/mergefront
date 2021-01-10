import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/icon/iconfont.css';
import VueParticles from 'vue-particles';
import axios from 'axios';

// 设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let ret = '';
  for (const it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
  }
  return ret;
}];
Vue.use(VueParticles);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://39.100.48.36:3010/editkg/';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
