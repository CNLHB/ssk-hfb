import axios from '@/config/requestConfig.js';
// 获取分类列表
export const  getCategory =async () => {
	let data = await axios.get('category/list')
	return data
}
// 图片上传
export const  uploudFile = async (file) => {
	let url = await axios.uploudFile("upload/cloud",file)
	return url
}
export const  addTopic = async (data) => {
	let result = await axios.post("topic",data)
	return result
}