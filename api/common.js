import axios from '@/config/requestConfig.js';
//点赞功能
export const  giveLike = async (data) => {
	let result = await axios.post('topic/active',data);
	return result
}

export const  headerForm = {
	"content-type": "application/x-www-form-urlencoded"
}