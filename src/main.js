import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/element.js';
import './assets/css/global.css';
import './assets/icon/iconfont.css';
import VueParticles from 'vue-particles';
import axios from 'axios';
import qs from 'qs';
import ECharts from 'vue-echarts';


// 设置axios为form-data
axios.defaults.headers.post['Content-Type'] = 'application/json;';
// axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.transformRequest = [function (data) {
//   let ret = JSON.stringify(data);
//   // for (const it in data) {
//   //   ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
//   // }
//   console.log(ret)
//   return ret;
// }];

axios.interceptors.request.use(
  config => {
    if (config.method === "post") {
      let curPost = config.url.split("/")[config.url.split("/").length - 2];
      if (curPost === "upload") {
        return config; // 这里对上传文件/图片的 api 不做传参序列化处理
      } else {
         config.data = JSON.stringify(config.data);
         return config;
       }
     }
     return config;
   },
   error => {
     return Promise.reject(error);
   }
 );

// Vue.use(echarts);
// Vue.use(VueParticles);
// Vue.config.productionTip = false;
// Vue.prototype.$http = axios;
// Vue.prototype.$qs = qs;

// //配置请求的根路径
// axios.defaults.withCredentials = true;
// // Vue.prototype.$axios = axios;
// // axios.defaults.baseURL = 'http://localhost:5000/api/v1.0';
// axios.defaults.baseURL = 'http://39.100.48.36:3031/api/v1.0';
// // axios.defaults.baseURL = '/api/';

Vue.use(VueParticles);
Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;

//配置请求的根路径
axios.defaults.withCredentials = true;
// Vue.prototype.$axios = axios;
//axios.defaults.baseURL = 'http://localhost:5000/api/v1.0';
//axios.defaults.baseURL = 'http://39.100.48.36:3031/api/v1.0';
axios.defaults.baseURL = '/local_api';
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
