import axios from '@/config/requestConfig.js';
export const getTopicTitleList = async (page = 1, search = '') => {
	let data = await axios.get(`topic/title?page=${page}&rows=5&search=${search}`)

	return data
}
export const getTopicList = async (currentPage = 1) => {
	let data = await axios.get(`topic/att?page=${currentPage}&rows=5`)
	if (data.code==10004) {
		data = null
		return data
	}
	if (data && data.items && data.items.length)
		data.items.forEach((item) => {
			if (item.images != null && item.images!='') {
				item.images = item.images.split(",");
			} else {
				item.images = []
			}
		})
	return data
}
