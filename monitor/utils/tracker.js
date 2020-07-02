let host = 'cn-shenzhen.log.aliyuncs.com';
let project = 'hfb-monitor'; //阿里云
let logStore = 'hfn-monitor-store';
import axios from '@/config/requestConfig.js';
// let userAgent = require('user-agent'); userAgent.parse(navigator.userAgent).name,

function getBrowser() {
	var browser = {
			msie: false,
			firefox: false,
			opera: false,
			safari: false,
			chrome: false,
			netscape: false,
			appname: 'unknown',
			version: 0
		},
		ua = window.navigator.userAgent.toLowerCase();
	if (/(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test(ua)) {
		browser[RegExp.$1] = true;
		browser.appname = RegExp.$1;
		browser.version = RegExp.$2;
	} else if (/version\D+(\d[\d.]*).*safari/.test(ua)) {
		// safari
		browser.safari = true;
		browser.appname = 'safari';
		browser.version = RegExp.$2;
	}
	return {
		appname:browser.appname,
		version:browser.version
	}
}

function getExtraData() {
	return {
		title: window.document.title,
		url: window.location.href,
		timestamp: Date.now(),
		userAgent: getBrowser().appname,
		//用户ID
	}
}
//gif图片做上传 图片速度 快没有跨域 问题，
class SendTracker {
	constructor() {
		this.url = `http://${project}.${host}/logstores/${logStore}/track`; //上报的路径
	}
	send(data = {}) {
		let extraData = getExtraData();
		let log = { ...extraData,
			...data
		};
		//对象 的值不能是数字
		for (let key in log) {
			if (typeof log[key] === 'number') {
				log[key] = `${log[key]}`;
			}
		}
		// console.log('log', log);
		let body = JSON.stringify({
			__logs__: [log]
		});
		// console.log(body)
		axios.setLoading(false)
		let count = parseInt(uni.getStorageSync("monitor"))?parseInt(uni.getStorageSync("monitor")):1
		if(count<5){
			axios.post("monitor", log)
			uni.setStorageSync("monitor",count+1)
		}else{
			
		}
		
		
		axios.setLoading(true)

	}
}
export default new SendTracker();
