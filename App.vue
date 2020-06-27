<script>
    import {mapMutations} from 'vuex'
	export default {
		async onLaunch() {
			// 网路监听（用户目前断网，切换wifi）
			this.lib.NetWork.On();
			let data;
			let chatList;
			try{
				 chatList =JSON.parse(uni.getStorageSync('chatList'))
				 if(!uni.getStorageSync("fuid")){
					 uni.setStorageSync('fuid',Math.random()+"")
				 }
				 // let res ={};
				 // if(uni.getStorageSync('token')){
				 // 	res = await this.$http.post("auth/verify")
					// console.log(res)
				 // }
				 // if(res && res.status==404){
				 // 	uni.clearStorageSync('token')
				 // }else{
				 // 	if(res.data&&res.data.token){
				 // 		uni.setStorageSync('token',res.data.token)
				 // 		this.setUserInfo(res.data.userInfo)
				 // 	}
					
				 	this.setChatList(chatList||[])
				 // }
				 
			}catch(e){
			
			}

			// 更新检测
		},
		async onShow () {
			console.log('App Show')
			let res ={};
			if(uni.getStorageSync('token')){
				res = await this.$http.get("auth/verify")
				console.log(res)
			}
			if(res && res.status==404){
				uni.clearStorageSync('token')
				uni.clearStorageSync('chatList')
				this.setChatList([])
				this.setUserInfo({})
			}else{
				if(res.data&&res.data.token){
					uni.setStorageSync('token',res.data.token)
					this.setUserInfo(res.data.userInfo)
				}
								
			}

		},
		onHide: function () {
			console.log('App Hide')
		},
		methods:{
			...mapMutations(['setUserInfo','setChatList'])
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* 引入官方css库 */

	@import './common/uni.css';
	/* 引入自定义图标库 */
	@import './common/icon.css';
	/* 引入自定义图标库 */
	@import './common/ssk.css';
	/* 引入动画库 */
	@import './common/animate.css';
	/* 公共样式 */
	@import './common/common.css';
</style>
