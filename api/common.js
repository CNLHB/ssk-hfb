import axios from '@/config/requestConfig.js';
 export const baseUrl=process.env.NODE_ENV === 'development'?"http://localhost:8081/api/":"http://api.hfb.xquery.cn/api/";
 export const socketBaseUrl=process.env.NODE_ENV === 'development'?"ws://localhost:8081/api/":"ws://api.hfb.xquery.cn/api/";
//可以new多个request来支持多个域名请求
//点赞功能
export const  giveLike = async (data) => {
	let result = await axios.post('topic/active',data);
	return result
}

export const  headerForm = {
	"content-type": "application/x-www-form-urlencoded"
}