<template>
	<view>
		<!-- 状态栏 -->
		<uni-status-bar bgcolor="#FFE933"></uni-status-bar>
		<!-- 关闭按钮 -->
		<view class="icon iconfont icon-guanbi" @tap="back"></view>
		<!-- 引入背景图 -->
		<image class="loginhead" src="../../static/common/loginhead.png" mode="widthFix" lazy-load></image>
		<!-- 输入框+按钮 -->
		<view class="body">
			
			<!-- 账号密码登录 -->
			<template v-if="!status">
				<input type="text" v-model="username"
				class="uni-input common-input"
				placeholder="手机号" />
				
				<view class="login-input-box">
					<input type="text" v-model="password"
					class="uni-input common-input forget-input"
					placeholder="请输入密码" />
					<view class="forget u-f-ajc login-font-color">忘记密码</view>
				</view>
			</template>
			
			
			<!-- 手机验证码登录 -->
			<template v-else>
				<view class="login-input-box">
					<view class="phone u-f-ajc">+86</view>
					<input type="text" v-model="phone"
					class="uni-input common-input phone-input"
					placeholder="手机号" />
				</view>
				<view class="login-input-box">
					<input type="text" v-model="checknum"
					class="uni-input common-input forget-input"
					placeholder="请输入验证码" />
					<view class="forget u-f-ajc login-font-color yanzhengma"
					@tap="getCheckNum">
						<view class="u-f-ajc">{{!codetime?'获取验证码':codetime+' s'}}</view>
					</view>
				</view>
			</template>
			
			
			<button class="user-set-btn" 
			:loading="loading" :class="{'user-set-btn-disable':disabled}" 
			type="primary" @tap="submit" :disabled="disabled">登录</button>
		</view>
		
		<!-- 登录状态切换 -->
		<view class="login-status u-f-ajc login-padding login-font-color" 
		@tap="changeStatus">
			{{status?'账号密码登录':'验证码登录'}}<view class="icon iconfont icon-jinru login-font-color"></view>
		</view>
		
		<!-- 第三方登陆 -->
		<view class="other-login-title u-f-ajc login-padding login-font-color">第三方登录</view>
		<other-login></other-login>
		
		<!-- 协议 -->
		<view class="login-rule u-f-ajc login-padding login-font-color">
			<!-- 注册即代表您同意<view>《韩府帮协议》</view> -->
			<navigator url="../register/register">还没账号去注册></navigator>
		</view>
		
	</view>
</template>

<script>
	import uniStatusBar from "../../components/uni-status-bar/uni-status-bar.vue";
	import otherLogin from "../../components/home/other-login.vue";
	import {webUrl} from '../../common/config.js'
	import {mapMutations} from 'vuex'
	export default {
		components:{
			uniStatusBar,
			otherLogin
		},
		data() {
			return {
				status:false,//false代表账号密码登录，true代表手机验证码登录
				disabled:true,
				loading:false,
				username:"",
				password:"",
				phone:"",
				checknum:"",
				codetime:0,
			}
		},
		watch:{
			username(val){
				this.OnBtnChange();
			},
			password(val){
				this.OnBtnChange();
			},
			phone(val){
				this.OnBtnChange();
			},
			checknum(val){
				this.OnBtnChange();
			}
		},
		methods: {
			...mapMutations(['setUserInfo']),
			// 验证手机号码
			isPhone(){
				let mPattern = /^1[34578]\d{9}$/; 
				return mPattern.test(this.phone);
			},
			// 获取验证码
			async getCheckNum(){
				if(this.codetime > 0){ return; }
				// 验证手机号合法性
				if(!this.isPhone()){
					uni.showToast({
						title: '请输入正确的手机号码',
						icon:"none"
					});
					return;
				}
				// 请求服务器，发送验证码
				let {code} =await this.$http.post('user/login/'+this.phone,)
				console.log(code)
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
			// 初始化表单
			initInput(){
				this.username='';
				this.password='';
				this.phone='';
				this.checknum='';
			},
			// 改变按钮状态
			OnBtnChange(){
				if( (this.username && this.password)||(this.phone && this.checknum) ){
					this.disabled=false; return;
				}
				this.disabled=true;
			},
			// 切换登录状态
			changeStatus(){
				this.initInput();
				this.status = !this.status;
			},
			// 返回上一步
			back(){
				uni.navigateBack({ delta: 1 });
				console.log("返回上一步")
			},
			// 提交登录
			async submit(){
				// 账号密码登录
				if(!this.status){
					console.log("提交登录")
				 let data =await this.$http.post('user/login',{
						phoneNumber: this.username,
						password: this.password
					})
					console.log(data.data)
					try{
						uni.setStorageSync('userInfo',JSON.stringify(data.data.userInfo));
						uni.setStorageSync('token',data.data.token);
					}catch(e){
						
					}
					this.setUserInfo(data.data.userInfo);
					uni.switchTab({
						url: '/pages/home/home'
					});
					return;
				}
				// 验证码登录
				// 验证手机号合法性
				if(!this.isPhone()){
					uni.showToast({
						title: '请输入正确的手机号码',
						icon:"none"
					});
					return;
				}
				this.$http.post('user/login',{
					phone: this.phone,
					code: this.checknum
				})
				console.log("提交登录")
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
