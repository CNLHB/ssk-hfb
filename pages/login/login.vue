<template>
	<view class="container">
		<!-- #ifndef MP -->
		<view class="tui-status-bar"></view>
		<view class="tui-header">
			<!-- <view>ThorUI组件库</view> -->
			<tui-icon name="shut" :size="52" @click="back"></tui-icon>
		</view>
		<!-- #endif -->
		<view class="tui-page-title">登录</view>
		<view class="tui-form">
			<view class="tui-view-input">
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>

						<input :adjust-position="false" :value="mobile" placeholder="请输入手机号" placeholder-class="tui-phcolor" type="number"
						 maxlength="11" @input="inputMobile" />
						<view class="tui-icon-close" v-show="mobile" @tap="clearInput(1)">
							<tui-icon name="close-fill" :size="32" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell v-if="!status" :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
						<input :adjust-position="false" :value="password" placeholder="请输入密码" :password="true" placeholder-class="tui-phcolor"
						 type="text" maxlength="36" @input="inputPwd" />
						<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
							<tui-icon name="close-fill" :size="32" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<!-- s -->
				<tui-list-cell v-if="status" :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="shield" color="#6d7a87" :size="20"></tui-icon>
						<input placeholder="请输入验证码" placeholder-class="tui-phcolor" type="text" maxlength="6" @input="inputCode" />
						<view @tap="getCheckNum" class="tui-btn-send" :class="{ 'tui-gray': isSend }" :hover-class="isSend ? '' : 'tui-opcity'"
						 :hover-stay-time="150">{{ btnSendText }}</view>
					</view>
				</tui-list-cell>
				<view  @tap="toggLogin"
				style="padding-top: 10rpx;"
				 :class="{ 'tui-gray': true }"
				 :hover-stay-time="150">{{status==false?"验证码登录":"密码登录"}}</view>
			</view>
			<view class="tui-cell-text">
				<view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="href(1)">忘记密码？</view>
				<view hover-class="tui-opcity" :hover-stay-time="150">
					没有账号？
					<text class="tui-color-primary" @tap="href(2)">注册</text>
				</view>
			</view>
			<view class="tui-btn-box">
				<tui-button @tap="submit" :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle">登录</tui-button>
			</view>
		</view>
		<view class="tui-login-way" v-if="!popupShow">
			<view hover-class="tui-opcity" :hover-stay-time="150" @tap="showOtherLogin">其他方式登录</view>
		</view>
		<tui-bottom-popup :mask="false" backgroundColor="transparent" :show="popupShow">
			<view class="tui-auth-login">
				<!-- #ifndef MP -->
				<view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150">
					<image src="/static/images/share/icon_qq.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
				<!-- #ifdef APP-PLUS || MP-WEIXIN || H5 -->
				<view class="tui-icon-platform" hover-class="tui-opcity" :hover-stay-time="150">
					<image src="/static/images/share/icon_wechat.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
				<!-- #ifndef MP -->
				<view class="tui-icon-platform" hover-class="tui-opcity" hover-stay-time="150">
					<image src="/static/images/share/icon_sina.png" class="tui-login-logo"></image>
				</view>
				<!-- #endif -->
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		sendLoginCode,
		userLogin,
		userLoginCode
	} from '@/api/login.js'
	export default {
		computed: {
			disabled: function() {
				let bool = true;
				if (this.mobile && this.password) {
					bool = false;
				}
				if (this.mobile &&this.code) {
					bool = false;
				}
				return bool;
			}
		},
		data() {
			return {
				status: false, //false代表账号密码登录，true代表手机验证码登录
				mobile: '',
				password: '',
				popupShow: false,
				code: '',
				isSend: false,
				btnSendText: '获取验证码' //倒计时格式：(60秒)
			};
		},
		onLoad(options) {
			setTimeout(() => {

			}, 0);
		},
		methods: {
			...mapMutations(['setUserInfo']),
			// 验证手机号码
			isPhone(phone) {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(phone);
			},
			back() {
				uni.switchTab({
					url: '/pages/home/home'
				});
			},
			toggLogin(){
				this.status=!this.status
			},
			inputCode(e) {
				this.code = e.detail.value;
			},
			inputMobile: function(e) {
				this.mobile = e.detail.value;
			},
			inputPwd: function(e) {
				this.password = e.detail.value;
			},
			clearInput(type) {
				if (type == 1) {
					this.mobile = '';
				} else {
					this.password = '';
				}
			},
			async getCheckNum() {
				if (this.btnSendText > 0) {
					return;
				}
				// 验证手机号合法性
				if (!this.isPhone(this.mobile)) {
					this.$http.toast("请输入正确的手机号码");
					return;
				}
				// 请求服务器，发送验证码
				let {
					code
				} = await sendLoginCode(this.mobile)
				if(code){
					this.$http.toast("验证码已发送");
				}
				this.isSend = true,
				// 发送成功，开启倒计时
				this.btnSendText = 60;
				let timer = setInterval(() => {
					this.btnSendText--;
					if (this.btnSendText < 1) {
						clearInterval(timer);
						this.btnSendText = '获取验证码';
						this.isSend = true
					}
				}, 1000);
			},
			href(type) {
				let url = '../forgetPwd/forgetPwd';
				if (type == 2) {
					url = '../register/register';
				}
				uni.navigateTo({
					url: url
				})

				// this.tui.href(url);
			},
			showOtherLogin() {
				//打开后 不再关闭
				this.popupShow = true;
			},
			// 提交登录
			async submit() {
				// 验证手机号合法性
				if (!this.isPhone(this.mobile)) {
					this.$http.toast("请输入正确的手机号码");
					return;
				}
				// 账号密码登录
				let data = {}
				if (!this.status) {
					 data = await userLogin({
						phoneNumber: this.mobile,
						password: this.password
					})

				}else{
					 data = await userLoginCode({
						phone: this.mobile,
						code: this.code
					})
				}
				if (data.status == 404) {
					this.$http.toast("账号或密码错误");
					return
				}
				try {
					uni.setStorageSync('userInfo', JSON.stringify(data.data.userInfo));
					uni.setStorageSync('token', data.data.token);
				} catch (e) {
				
				}
				this.setUserInfo(data.data.userInfo);
				uni.switchTab({
					url: '/pages/home/home'
				});
				return;
			}

			}
		}
</script>

<style lang="scss">
	.container {
		.tui-status-bar {
			width: 100%;
			height: var(--status-bar-height);
		}

		.tui-header {
			width: 100%;
			padding: 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
		}

		.tui-page-title {
			width: 100%;
			font-size: 48rpx;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 42rpx;
			padding: 40rpx;
			box-sizing: border-box;
		}

		.tui-form {
			padding-top: 50rpx;

			.tui-view-input {
				width: 100%;
				box-sizing: border-box;
				padding: 0 40rpx;

				.tui-cell-input {
					width: 100%;
					display: flex;
					align-items: center;
					padding-top: 48rpx;
					padding-bottom: $uni-spacing-col-base;

					input {
						flex: 1;
						padding-left: $uni-spacing-row-base;
					}
					.tui-btn-send {
						width: 156rpx;
						text-align: right;
						flex-shrink: 0;
						font-size: $uni-font-size-base;
						color: $uni-color-primary;
					}

					.tui-gray {
						color: $uni-text-color-placeholder;
					}
					.tui-icon-close {
						margin-left: auto;
					}
				}
			}

			.tui-cell-text {
				width: 100%;
				padding: $uni-spacing-col-lg $uni-spacing-row-lg;
				box-sizing: border-box;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.tui-color-primary {
					color: $uni-color-primary;
				}
			}

			.tui-btn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 80rpx;
			}
		}

		.tui-login-way {
			width: 100%;
			font-size: 26rpx;
			color: $uni-color-primary;
			display: flex;
			justify-content: center;
			position: fixed;
			left: 0;
			bottom: 80rpx;

			view {
				padding: 12rpx 0;
			}
		}

		.tui-auth-login {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: 80rpx;
			padding-top: 20rpx;

			.tui-icon-platform {
				width: 90rpx;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				margin-left: 40rpx;

				&::after {
					content: '';
					position: absolute;
					width: 200%;
					height: 200%;
					transform-origin: 0 0;
					transform: scale(0.5, 0.5) translateZ(0);
					box-sizing: border-box;
					left: 0;
					top: 0;
					border-radius: 180rpx;
					border: 1rpx solid $uni-text-color-placeholder;
				}
			}

			.tui-login-logo {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
</style>
