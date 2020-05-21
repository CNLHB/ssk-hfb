import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 挂载全局方法
import config from "./common/config.js"
Vue.prototype.config=config
import $http from './config/requestConfig.js';
Vue.prototype.$http = $http;
import lib from "./common/lib.js"
Vue.prototype.lib=lib


App.mpType = 'app'

const app = new Vue({
    ...App,
	config,
	lib,
})
app.$mount()
