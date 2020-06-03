import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'



export const getTopicTitleClass = async () => {
	let result = await axios.get("topic/title/class")
	if(Array.isArray(result)){
		return result
	}else{
		return []
	}
}
export const getTopicTitleList = async (page=1,cid='') => {
	let result = await axios.get(`topic/title?page=${1}&rows=10&cid=${cid}`)
	return result
}
