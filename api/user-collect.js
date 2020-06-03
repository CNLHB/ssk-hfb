import axios from '@/config/requestConfig.js';

import {
	headerForm
} from './common.js'

export const getTopicCollect = async (data) => {
	let result = await axios.get("topic/collect")
	if (result && result.length) {
		result.reverse()
	} else {
		result = []
	}
	return result
}
export const deleteCollect = async (id) => {
	axios.setLoading(false);
	let result = await axios.delete('topic/collect', {
		ids: [id]
	}, headerForm);
	axios.setLoading(true);
	return result
}
