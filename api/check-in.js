import axios from '@/config/requestConfig.js';
export const  getSignList = async () => {
	let list = await axios.get("user/signin")
	return list
}
export const  saveSign = async (data) => {
	let result = await axios.post("user/signin",data)
	return result
}