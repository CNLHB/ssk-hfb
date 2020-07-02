import axios from '@/config/requestConfig.js';
import {
	headerForm
} from './common.js'



export const searchTopicList = async (page=1,search='') => {
	let result = await axios.get(`/topic/page?page=${page}&rows=50&search=${search}`)
	if(result&&result.items.length){
			 result.items.forEach((item)=>{
			 	if(item.images!=null&&item.images!=''){
			 		item.images = item.images.split(",");
			 	}else{
			 		item.images =[]
			 	}
			 	
			 })
	}
	
	return result
}
