import axios from '@/config/requestConfig.js';

import {
	headerForm
} from './common.js'

export const userAtt = async (data) => {
	axios.setLoading(false)
	let result = await axios.post('user/active',data)
	axios.setLoading(true)
	return result
}
export const getUserAttList = async () => {
	let result = []
	axios.setLoading(false)
	let attData = await axios.get("user/att/list")
	axios.setLoading(true)
	if(attData&&attData.length){
			result = attData.map((item)=>{
				return	{
						id:item.id,
						userpic:item.authorUrl,
						username:item.userName,
						// age:21,
						sex:item.gender,
						isguanzhu:true
				}
			})
		
	}
	return result
}
export const getUserFansList = async (eachData) => {
	let result = []
	axios.setLoading(false)
	let fansData = await axios.get("user/fans/list")
	axios.setLoading(true)
	if(fansData&&fansData.length){
		result = fansData.map((item)=>{
			let isguanzhu = false;
			if(eachData&&eachData.length){
				isguanzhu = eachData.some((eItem)=>{
					return item.id ==eItem.id
				})
			}
			return	{
					id:item.id,
					userpic:item.authorUrl,
					username:item.userName,
					// age:21,
					sex:item.gender,
					isguanzhu:isguanzhu
			}
		})
	}
	console.log(result)
	
	
	return result
}
export const getUserEachList = async () => {
	let result = []
	axios.setLoading(false)
	let eachData = await axios.get("user/each/list")
	axios.setLoading(true)
	if(eachData&&eachData.length){
		result = eachData.map((item)=>{
			return	{
					id:item.id,
					userpic:item.authorUrl,
					username:item.userName,
					// age:21,
					sex:item.gender,
					isguanzhu:true
			}
		})
	}
	
	return result
}

function precessUserData(item){
	return {
		
	}
}