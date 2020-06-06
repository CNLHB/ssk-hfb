<template>
	<view class="container">
		<view class="tui-page-title">找回密码</view>
		<view class="tui-form">
			<view class="tui-view-input">
				<tui-list-cell :hover="false" :lineLeft="false" backgroundColor="transparent">
					<view class="tui-cell-input">
						<tui-icon name="mobile" color="#6d7a87" :size="20"></tui-icon>
						<input :value="mobile" placeholder="请输入手机号" placeholder-class="tui-phcolor" type="number" maxlength="11" @input="inputMobile" />
						<view class="tui-icon-close" v-show="mobile" @tap="clearInput(1)">
							<tui-icon name="close-fill" :size="32" color="#bfbfbf"></tui-icon>
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
						<input :value="password" placeholder="请输入新密码" :password="true" placeholder-class="tui-phcolor" type="text"
						 maxlength="40" @input="inputPwd" />
						<view class="tui-icon-close" v-show="password" @tap="clearInput(2)">
							<tui-icon name="close-fill" :size="32" color="#bfbfbf"></tui-icon>
						</view>
					</view>
				</tui-list-cell>
			</view>
			<view class="tui-btn-box">
				<tui-button @tap="forgetPassword" :disabledGray="true" :disabled="disabled" :shadow="true" shape="circle">确认修改</tui-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {sendForgetCode,forgetPwd} from '@/api/forgetPwd.js'
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
			// 验证手机号码
			isPhone() {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(this.mobile);
			},
			// 获取验证码
			async getCheckNum() {
				if (this.btnSendText > 0) {
					return;
				}
				// 验证手机号合法性
				if (!this.isPhone()) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: "none"
					});
					return;
				}
				// 请求服务器，发送验证码
				let {
					code
				} = await sendForgetCode(this.mobile)
				console.log(code)
				// 发送成功，开启倒计时
				this.btnSendText = 60;
				let timer = setInterval(() => {
					this.btnSendText--;
					if (this.btnSendText < 1) {
						clearInterval(timer);
						this.btnSendText = "获取验证码";
					}
				}, 1000);
			},
			async forgetPassword(){
				let data = await forgetPwd({
					phone: this.mobile,
					password: this.password,
					code: this.code,
				})
				if (data.status == 404) {
					uni.showToast({
						title: '账号或密码错误！',
						icon: 'none'

					})
					return
				}
				uni.showToast({
					title: '密码修改成功',
					icon:'none'
				})
				uni.navigateBack()
			}
				
		}
	};
</script>

<style lang="scss">
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

			.tui-btn-box {
				width: 100%;
				padding: 0 $uni-spacing-row-lg;
				box-sizing: border-box;
				margin-top: 80rpx;
			}
		}
	}
</style>
