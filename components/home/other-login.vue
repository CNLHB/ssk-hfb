<template>
	<view class="other-login u-f-ac">
		<block v-for="(item,index) in providerList" :key="index">
			<view class="u-f-ajc u-f1" @tap="tologin(item)">
				<view class="icon iconfont u-f-ajc" 
				:class="['icon-'+item.icon]"></view>
			</view>
		</block>
		
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				providerList: []
			}
		},
		created() {
			console.log(11)
			this.getLoginAuth();
		},
		onReady() {
			
		},
		methods:{
			...mapMutations(['setUserInfo']),
			// 获取当前登录渠道
			getLoginAuth(){
				uni.getProvider({
					service: 'oauth',
					success: (result) => {
						this.providerList = result.provider.map((value) => {
							let providerName = '';
							let icon='';
							switch (value) {
								case 'weixin':
									providerName = '微信登录';
									icon='weixin';
									break;
								case 'qq':
									providerName = 'QQ登录';
									icon='QQ';
									break;
								case 'sinaweibo':
									providerName = '新浪微博登录';
									icon='xinlangweibo';
									
									break;
							}
								return {
									name: providerName,
									icon:icon,
									id: value
								}
						});
						this.providerList = this.providerList.filter((item, index)=>{
						if(item.icon == ''){
							return false
						}else{
							return true
						}
						
					})
					},
					fail: (error) => {
						console.log('获取登录通道失败', error);
					}
				});
			},
			// 登录
			tologin(provider) {
				console.log(provider.id)
				uni.login({
					provider: provider.id,
					success: (res) => {
						uni.getUserInfo({
						  provider:provider.id,
						  success: async (infoRes)=> {
							  let obj = {
							  								  
							  }
							  if(provider.id=="qq"){
								  obj={
									 userName:infoRes.userInfo.nickName,
									 openId:infoRes.userInfo.openId,
									 gender:  infoRes.userInfo.gender=="男"?0:1,
									 authorUrl: infoRes.userInfo.figureurl_qq_2, 
								  }
							  }
							  if(provider.id=="weixin"){
								  obj={
									 userName:infoRes.userInfo.nickName,
									 openId:infoRes.userInfo.openId,
									 gender: infoRes.userInfo.gender==1?0:1,
									 authorUrl: infoRes.userInfo.avatarUrl, 
								  }
							  }
							  if(provider.id=="sinaweibo"){
								  obj={
									 userName:infoRes.userInfo.nickName,
									 openId:infoRes.userInfo.id,
									 gender: infoRes.userInfo.gender=="m"?0:1,
									 authorUrl: infoRes.userInfo.cover_image_phone, 
								  }
							  }
							  
							  
							  let data = await this.$http.post('user/auth/login',obj)
							  if(data.status>=400){
							  	uni.showToast({
							  		title: data.massage,
							  		icon:"none"
							  	});
							  }
							  try{
								this.setUserInfo(data.data.userInfo);
							  	uni.setStorageSync('userInfo',JSON.stringify(data.data.userInfo));
							  	uni.setStorageSync('token',data.data.token);
								this.$emit("goToToHome")
							  }catch(e){
							  	
							  }
							  // console.log( infoRes.userInfo);
						  }
						});
						
						// 更新保存在 store 中的登录状态
						console.log('登录成功，保存到本地存储，修改当前用户登录状态')
					},
					fail: (err) => {
						uni.showToast({
							title:"三方登录失败!",
							icon:'none'
						})
						console.log('login fail:', err);
					}
				});
			}
		}
	}
</script>

<style>
.other-login{
	padding: 20upx 80upx;
}
.other-login>view>view{
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	font-size: 55upx;
	color: #FFFFFF;
}
.other-login .icon-QQ{
	background: #2CAEFC;
}
.other-login .icon-weixin{
	background: #2BD19B;
}
.other-login .icon-xinlangweibo{
	background: #FC7729;
}
</style>
