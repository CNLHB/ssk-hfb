import axios from '@/config/requestConfig.js';

import {
	headerForm
} from './common.js'

export const bindEmail = async (data) => {
	let result = await axios.post('user/email',data,headerForm)
	return result
}

export const getEmailCode = async (email) => {
	let result = await axios.post('user/email',{
					email: email
				},headerForm)
	return result
}
