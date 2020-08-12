import axios from '@/config/requestConfig.js';


export const updateUserInfo = async (data) => {
	let result = await axios.put("user/info",data)
	return result
}
export const getUserInfo = async () => {
	let result = await axios.get("user/info")
	return result
}
