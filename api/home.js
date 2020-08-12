import axios from '@/config/requestConfig.js';
export const  getUserAccess =async () => {
	let data = await axios.get('user/access')

	return data
}

// export const  giveLike = async (data) => {
// 	let result = await axios.post('topic/active',data);
// 	return result
// }
