import axios from '@/config/requestConfig.js';

import {
	headerForm
} from './common.js'

export const getTopicHistory = async (data) => {
	let result = await axios.get("topic/history")
	if (result && result.length) {
		result.reverse()
	} else {
		result = []
	}
	return result
}
export const deleteHistory = async (id) => {
	axios.setLoading(false);
	let result = await axios.delete('topic/history', {
		ids: [id]
	}, headerForm);
	axios.setLoading(true);
	return result
}
