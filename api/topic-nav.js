import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'



export const getTopicTitleClass = async () => {
	let result = await axios.get("topic/title/class")
	result = result.map((item)=>{
		return { name:item.title,id:item.id,page:1 }
	})
	return result
}
export const getTopicTitleList = async (page=1,cid='') => {
	let result = await axios.get(`topic/title?page=${page}&rows=10&cid=${cid}`)
	return result
}

