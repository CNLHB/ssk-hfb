import axios from '@/config/requestConfig.js';

import {
	headerForm
} from './common.js'

export const userAtt = async (data) => {
	axios.setLoading(false);
	let result = await axios.post('user/active',data)
	axios.setLoading(true);
	return result
}
export const searchUserList = async (key) => {
	let result = await axios.get('user/list?search=' + key)
	if(result&&result.length){
		result = result.map((item)=>{
			return {
				id:item.id,
				userpic:item.authorUrl,
				username:item.userName,
				sex:item.gender,
				isguanzhu:item.isguanzhu
			}
		})
	}else{
		result = []
	}
	return result
}
