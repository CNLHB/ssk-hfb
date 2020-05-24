export default class request {
	constructor(options) {
		//请求公共地址
		this.baseUrl = options.baseUrl || "";
		//公共文件上传请求地址
		this.fileUrl = options.fileUrl || "";
		//默认请求头
		this.headers = options.headers || {};

	}
	get(url = '', data = {}, options = {}){
		
		return this.ajax("GET",url, data, options)

	}
	post(url = '', data = {}, options = {}){
		return this.ajax("POST",url, data, options)
	}
	put(url = '', data = {}, options = {}){
		return this.ajax("PUT",url, data, options)
	}
	delete(url = '', data = {}, options = {}){
		return this.ajax("DELETE",url, data, options)
	}
	uploudFile(url, file){
		return new Promise((resolve, reject) =>{
			let  Authorization=uni.getStorageSync('token');
			uni.uploadFile({
				url:  this.baseUrl + url, //仅为示例，非真实的接口地址
				filePath: file.path,
				header:{
					Authorization
				},
				file:file,
				name: 'file',
				success: (res) => {
					resolve(res.data)
				},
		            fail: (err) => {
						console.log(err)
		                reject(err)
		            }
			})
		})

	}
	ajax(method="GET", url = '', data = {}, options = {}){
		return new Promise((resolve, reject) => {
				uni.showLoading({
					title: '加载中'
				});
				this.headers.Authorization=uni.getStorageSync('token');
		        uni.request({
		            url: this.baseUrl + url,
					data: data,
					method: method,
					dataType:"json",
					header:{
						...this.headers
					},
		            success: (res) => {
		                resolve(res.data);
		            },
		            fail: (err) => {
						console.log(err)
		                reject(err)
		            },
					complete: () => {
						uni.hideLoading();	
					}
		        });
		    })
	}
}

