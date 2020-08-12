import axios from '@/config/requestConfig.js';

import {
	headerForm
} from './common.js'

export const reSetPassword = async (data) => {
	let result = await axios.put('user/password',data,headerForm)
	return result
}

