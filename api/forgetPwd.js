import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'
export const sendForgetCode = async (phone) => {
	let data = await axios.get('user/forget/' + phone)

	return data
}

export const forgetPwd = async (data) => {
	let result = await axios.post('user/forget/code', data, headerForm);
	return result
}
