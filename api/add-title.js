import axios from '@/config/requestConfig.js';
export const getCategory = async () => {
	let data = await axios.get('/category/list')
	return data
}

export const uploudFile = async (file) => {
	let url = await axios.uploudFile("/upload/cloud", file)
	return url
}
export const addTopicTitle = async (data) => {
	let result = await axios.post("topic/title", data)
	return result
}
