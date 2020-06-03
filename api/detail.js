import axios from '@/config/requestConfig.js';
export const  getTopicDetail =async (id) => {
	let detail = await axios.get('topic/detail/'+ id)
	if(detail.images==null||detail.images==''){
		detail.images = []
	}else{
		detail.images = detail.images.split(",")
	}
	return detail
}

export const  pushHistory = async (data) => {
	let detail = await axios.post('topic/history',data)
}
export const  getCommentList = async (id) => {
	let data = await axios.get('comment/'+id)
	return data
}
export const  delComment = async (id) => {
	let result = await axios.delete("comment/" + id)
	return result
}
export const  addComment = async (data) => {
	let result = await axios.post("comment",data)
	return result
}
