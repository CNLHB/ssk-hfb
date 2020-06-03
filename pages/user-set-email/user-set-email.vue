<template>
	<view class="body">
		<input type="text" v-model="email"
		class="uni-input common-input"
		placeholder="输入需要绑定的邮箱" />
		

		<view class="login-input-box">
			<input type="text" v-model="password"
			class="uni-input common-input forget-input"
			placeholder="请输入验证码" />
			<view class="forget u-f-ajc login-font-color yanzhengma"
			@tap="getCheckNum">
				<view class="u-f-ajc">{{!codetime?'获取验证码':codetime+' s'}}</view>
			</view>
		</view>
		<button class="user-set-btn" 
		:loading="loading" :class="{'user-set-btn-disable':disabled}" 
		type="primary" @tap="submit" :disabled="disabled">完成</button>
		
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	import {bindEmail,getEmailCode} from '@/api/user-set-email.js'
	export default {
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				email:'',
				password:"",
				disabled:true,
				loading:false,
				codetime:0,
				
			}
		},
		mounted() {
			if(this.userInfo){
				this.email = this.userInfo.email
			}
		},
		watch:{
			email(val){
				this.change();
			},
			password(val){
				this.change();
			},
		},
		methods: {

			// 监听输入框
			change(){
				if(this.email && this.password){
					this.disabled=false;
					return;
				}
				this.disabled=true;
			},
			async getCheckNum(){
				if(this.codetime > 0){ return; }
				// 验证邮箱格式
				let ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				if(!ePattern.test(this.email)){
					uni.showToast({
						title: '请输入正确邮箱格式',
						icon:"none"
					});
					return false;
				}
				// 请求服务器，发送验证码
				let data =await  getEmailCode(this.email)
				
				console.log(data)
				// 发送成功，开启倒计时
				this.codetime=60;
				let timer=setInterval(()=>{
					this.codetime--;
					if(this.codetime < 1){
						clearInterval(timer);
						this.codetime=0;
					}
				},1000);
			},
			// 验证层
			check(){
				if(!this.email || this.email==""){
					uni.showToast({
						title: '邮箱不能为空',
						icon:"none"
					});
					return false;
				}
				
				// 验证邮箱格式
				let ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				if(!ePattern.test(this.email)){
					uni.showToast({
						title: '请输入正确邮箱格式',
						icon:"none"
					});
					return false;
				}
				
				if(!this.password || this.password==""){
					uni.showToast({
						title: '密码不能为空',
						icon:"none"
					});
					return false;
				}
				return true;
			},
			// 提交
			async submit(){
				this.loading=true; this.disabled=true;
				if(!this.check()){ this.loading=false; this.disabled=false; return; }
				// 提交服务器
				let res = await bindEmail({
					email: this.email,
					code: this.password
				})
					if(res.code==0){
						uni.showToast({
							title:"邮箱绑定成功",
							icon:'success'
						})
						uni.navigateBack({
							delta:1
						})
					}else{
						uni.showToast({
							title:"邮箱绑定失败",
							icon:'success'
						})
						return 
					}
				this.loading=false; this.disabled=false;
			}
		}
	}
</script>

<style>
@import "../../common/form.css";
.login-font-color{ color: #BBBBBB; }
.login-padding{ padding: 20upx 0; }
.icon-guanbi{
	position: fixed;
	top: 60upx;
	left: 30upx;
	font-size: 40upx;
	font-weight: bold;
	color: #332F0A;
	z-index: 100;
}
.loginhead{ width: 100%; }
.other-login-title{
	position: relative;
}
.other-login-title:before,.other-login-title:after{
	content: "";
	position: absolute;
	background: #BBBBBB;
	height: 1upx;
	width: 100upx;
	top: 50%;
}
.other-login-title:before{
	left: 25%;
}
.other-login-title:after{
	right: 25%;
}
.login-input-box{
	position: relative;
}
.login-input-box .forget-input{
	padding-right: 150upx;
}
.login-input-box .forget,.login-input-box .phone{
	position: absolute;
	top: 0;
	height: 100%;
	z-index: 100;
}
.login-input-box .forget{
	width: 150upx;
	right: 0;
}
.login-input-box .phone{
	width:100upx;
	left: 0;
	font-weight: bold;
}
.login-input-box .phone-input{
	padding-left: 100upx;
}
.yanzhengma view{
	background: #EEEEEE;
	border-radius: 10upx;
	font-size: 25upx;
	width: 150upx;
	padding: 10upx 0;
}
</style>
