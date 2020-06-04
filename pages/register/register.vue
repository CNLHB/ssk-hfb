<template>
	<view class="container">
		<view class="tui-status-bar"></view>
		<view class="tui-header">
			<!-- <view>ThorUI组件库</view> -->
			<tui-icon name="shut" :size="26" @click="back"></tui-icon>
		</view>
		<view class="tui-page-title">注册</view>
		<view class="tui-form">
			<view class="tui-view-input">
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>
						<input :value="mobile" placeholder="请输入手机号" placeholder-class="tui-phcolor" type="number" maxlength="11" @input="inputMobile" />
						<view class="tui-icon-close" v-show="mobile" @tap="clearInput(1)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="shield" color="#6d7a87" :size="20"></tui-icon>
						<input placeholder="请输入验证码" placeholder-class="tui-phcolor" type="text" maxlength="6" @input="inputCode" />
						<view @tap="getCheckNum" class="tui-btn-send" :class="{ 'tui-gray': isSend }" :hover-class="isSend ? '' : 'tui-opcity'"
						 :hover-stay-time="150">{{ btnSendText }}</view>
					</view>
				</tui-list-cell>
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="pwd" color="#6d7a87" :size="20"></tui-icon>
						<input :value="password" placeholder="请输入密码" :password="true" placeholder-class="tui-phcolor" type="text"
						 maxlength="40" @input="inputPwd" />
						<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
							<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
			</view>
			<view class="tui-btn-box">
				<tui-button @tap="toLogin" :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle">注册</tui-button>
			</view>
			<view class="tui-cell-text">
				注册代表同意
				<view class="tui-color-primary" hover-class="tui-opcity" :hover-stay-time="150" @tap="protocol">韩府帮用户服务协议、隐私政策</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userRegisterPhone,
		getCode
	} from '@/api/register.js'
	import {
		mapMutations
	} from 'vuex';
	export default {
		computed: {
			disabled: function() {
				let bool = true;
				if (this.mobile && this.code && this.password) {
					bool = false;
				}
				return bool;
			}
		},
		data() {
			return {
				mobile: '',
				password: '',
				code: '',
				isSend: false,
				btnSendText: '获取验证码' //倒计时格式：(60秒)
			};
		},
		methods: {
			// 验证手机号码
			isPhone(phone) {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(phone);
			},
			back() {
				uni.navigateBack();
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
			protocol() {
				this.tui.href("/pages/doc/protocol/protocol")
			},
			async getCheckNum() {
				if (this.btnSendText > 0) {
					return;
				}
				// 验证手机号合法性
				if (!this.isPhone(this.mobile)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: "none"
					});
					return;
				}
				// 请求服务器，发送验证码
				let {
					code
				} = await getCode(this.mobile)
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
			async toLogin() {
				if (!this.isPhone(this.mobile)) {
					uni.showToast({
						title: "请输入正确的手机号",
						icon: "none"
					});
					return
				}
				let data = await userRegisterPhone({
					phone: this.mobile,
					code: this.code,
					password: this.password
				})
				if (!data || (data && data.code == 10004)) {
					let msg = data.message
					uni.showToast({
						title: msg,
						icon: "none"
					});
					return
				}
				uni.redirectTo({
					url: '../login/login'
				})
				return;
			},
		}
	};
</script>

<style lang="scss" scoped>
	.container {
		.tui-page-title {
			width: 100%;
			font-size: 48rpx;
			font-weight: bold;
			color: $uni-text-color;
			line-height: 42rpx;
			padding: 110rpx 40rpx 40rpx 40rpx;
			box-sizing: border-box;
		}
		.tui-header {
			width: 100%;
			padding: 40rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
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

					.tui-icon-close {
						margin-left: auto;
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
				}
			}

			.tui-cell-text {
				width: 100%;
				padding: 40rpx $uni-spacing-row-lg;
				box-sizing: border-box;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
				display: flex;
				align-items: center;

				.tui-color-primary {
					color: $uni-color-primary;
					padding-left: $uni-spacing-row-sm;
				}
			}

			.tui-btn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 80rpx;
			}
		}
	}
</style>
