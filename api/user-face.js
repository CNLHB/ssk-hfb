import axios from '@/config/requestConfig.js';

export const  uploudFile = async (file) => {
	let url = await axios.uploudFile("upload/cloud",file)
	return url
}
