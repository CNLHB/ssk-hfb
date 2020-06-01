<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"><</view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎注册！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="mobile" value="" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password data-key="password" @input="inputChange" @confirm="toLogin" />
				</view>
				
			</view>
			<button class="confirm-btn" @click="toLogin" :disabled="logining">注册</button>

		</view>

	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				mobile: '',
				password: '',
				logining: false
			}
		},
		onLoad() {

		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toRegist() {
				this.$api.msg('去注册');
			},
			// 验证手机号码
			isPhone(phone) {
				let mPattern = /^1[34578]\d{9}$/;
				return mPattern.test(phone);
			},
			async formSubmit(e) {
				var me = this;
				var username = e.detail.value.username;
				if (!this.isPhone(username)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: "none"
					});
					return;
				}
				var password = e.detail.value.password;
				if (password.length < 6) {
					uni.showToast({
						title: '密码强度太低',
						icon: "none"
					});
					return
				}
				var confirmPassword = e.detail.value.confirmPassword;

				if (password != '' && password === confirmPassword) {
					let data = await this.$http.post('user/register', {
						userName: username,
						phoneNumber: username,
						confirmPassword: confirmPassword,
						password: password
					})
					console.log(data)
					if (data.status >= 400) {
						console.error("错误提示")
						uni.showToast({
							title: data.massage,
							icon: 'none',
							fail: (e) => {
								console.error(e)
							}
						})

					} else {
						console.error("跳转页面")
						uni.navigateTo({
							url: '../login/login'
						})
					}

				} else {
					uni.showToast({
						title: '两次密码不一致',
						icon: "none"
					});
				}

			}
		}

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}
	.container {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		/* padding-top: 50upx; */
		top: 40upx;
		font-size: 40upx;
		color: #303133;
	}

	.left-top-sign {
		font-size: 120upx;
		color: #f8f8f8;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: #f8f6fc;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: 24upx+2upx;
			color: #606266;
		}

		input {
			height: 60upx;
			font-size: 28upx + 2upx;
			color: #303133;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: #fa436a;
		color: #fff;
		font-size: 32upx;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: 24upx+2upx;
		color: #4399fc;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: 24upx+2upx;
		color: #606266;
		text-align: center;

		text {
			color: #4399fc;
			margin-left: 10upx;
		}
	}
</style>
