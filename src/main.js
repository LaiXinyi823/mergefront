import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/icon/iconfont.css';
import VueParticles from 'vue-particles';
import axios from 'axios';
import qs from 'qs';
<<<<<<< HEAD
import { Message } from 'element-ui';
=======
import { Message,MessageBox } from 'element-ui';
import ECharts from 'vue-echarts';
>>>>>>> 1ed06e2347f48320175d43a0ae5d2f657c0294a2

// 设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/json;';
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = [function (data) {
  let ret = JSON.stringify(data);
  // for (const it in data) {
  //   ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
  // }
  return ret;
}];

// Vue.use(echarts);
Vue.use(Message);
Vue.use(VueParticles);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$message = Message;
<<<<<<< HEAD
=======
Vue.prototype.$prompt = MessageBox.prompt;
// Vue.prototype.$echarts = echarts;
>>>>>>> 1ed06e2347f48320175d43a0ae5d2f657c0294a2

//配置请求的根路径
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000/api/v1.0/';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
