import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'



export const userRegisterPhone = async (data) => {
	let result = await axios.post(`user/register/phone`,data,headerForm)
	return result
}
export const getCode = async (phone) => {
	axios.setLoading(true);
	let result = await axios.get('user/register/' + phone )
	axios.setLoading(false);
	return result
}
