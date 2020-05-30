<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="face-wapper">
				<!-- <image src="../../static/icos/default-face.png" class="face"></image> -->
			</view>
			
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="手机" placeholder-class="graywords"/>
			</view>
			
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords"/>
			</view>
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">确认密码</label>
				<input name="confirmPassword" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords"/>
			</view>
			<button type="primary" form-type="submit" style="margin-top: 60upx;width: 90%; background-color: #FFE933;">注册</button>
		</form>
		<!-- 协议 -->
		<view class="login-rule u-f-ajc login-padding login-font-color">
			注册即代表您同意<view>《韩府帮协议》</view>
		</view>
		
	</view>
</template>


<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			// 验证手机号码
			isPhone(phone){
				let mPattern = /^1[34578]\d{9}$/; 
				return mPattern.test(phone);
			},
			async formSubmit (e) {
				var me = this;
				var username = e.detail.value.username;
				if(!this.isPhone(username)){
					uni.showToast({
						title: '请输入正确的手机号码',
						icon:"none"
					});
					return;
				}
				var password = e.detail.value.password;
				if(password.length<6){
					uni.showToast({
						title: '密码强度太低',
						icon:"none"
					});
					return
				}
				var confirmPassword = e.detail.value.confirmPassword;
				
				if(password != '' && password === confirmPassword){
					let data = await this.$http.post('user/register',{
						userName:username,
						phoneNumber:username,
						confirmPassword:confirmPassword,
						password:password
					})
					console.log(data)
					if(data.status>=400){
						console.error("错误提示")
						uni.showToast({
							title:data.massage,
							icon:'none',
							fail:(e)=>{
								console.error(e)
							}
						})
						
					}else{
						console.error("跳转页面")
						uni.navigateTo({
							url:'../login/login'
						})
					}

				}else{
					uni.showToast({
						title: '两次密码不一致',
						icon:"none"
					});
				}

			}
		}
	}
</script>

<style>
	@import url("./registLogin.css");
	.login-font-color{ color: #BBBBBB; }
	.login-padding{ padding: 20upx 0; }





</style>
