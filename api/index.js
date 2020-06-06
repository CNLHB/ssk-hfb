import axios from '@/config/requestConfig.js';
export const  getTopicList =async (currentPage=1,type="hanfu") => {
	let data = await axios.get(`topic/page?page=${currentPage}&type=${type}&rows=5`)
	 if(data&&data.items.length){
		 data.items.forEach((item)=>{
		 	if(item.images!=null&&item.images!=''){
		 		item.images = item.images.split(",");
		 	}else{
		 		item.images =[]
		 	}
		 	
		 })
	 }

	return data
}
