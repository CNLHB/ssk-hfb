import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'



export const getTopicTitleById = async (id) => {
	let result = await axios.get('topic/title/'+id)
	return result
}
export const getTopicTitleList = async (id) => {
	let result = await axios.get('topic/title/list/'+id)
	if(result.code !== 10004){
		result.forEach((item)=>{
			if(item.images!=''){
				item.images = item.images.split(",");
			}else{
				item.images =[]
			}
			
		})
	}
	return result
}
