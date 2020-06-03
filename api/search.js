import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'



export const searchTopicList = async (page=1,search='') => {
	let result = await axios.get(`/topic/page?page=${page}&rows=50&search=${search}`)
	return result
}
