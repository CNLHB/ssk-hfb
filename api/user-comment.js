import axios from '@/config/requestConfig.js';
import time from '@/common/time.js'
export const  getUserComm = async () => {
	let list = await axios.get("comment/list")
	if(Array.isArray(list)){
		list = list.map(item=>{
			return	{
					id: item.id,
					username: item.username,
					userpic: item.userpic,
					topicpic: (item.topicpic!=null&&item.topicpic!='')?item.topicpic.split(",")[0]:'http://image.xquery.cn/2020eb384401aa616ba134126357_th.jpg',
					createTime: time.gettime.gettime(item.createTime),
					comment: item.comment,
					topicTitle: item.topicTitle,
					title: item.title
				}
		})
		return list
	}
	return []
}
