import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'



export const pushMessage = async (data) => {
	axios.setLoading(false);
	let result = await axios.post("push/message",data)
	axios.setLoading(true);
	return result
}
export const createChat = async (data) => {
	let result = await axios.post('chat',data)
	return result
}

