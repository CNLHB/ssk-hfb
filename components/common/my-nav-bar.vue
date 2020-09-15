<template>
		<tui-navigation-bar backgroundColor="255,255,255" :isFixed="false" :isOpcity="false">
			<view class="tui-content-box">
				<view class="tui-avatar-box" @tap="skipToSearch(1)">
					<tui-icon name="signin" color="#FFE933" :size="64"></tui-icon>
				</view>
				<view class="tui-search-box" @tap="skipToSearch(2)">
					<tui-icon name="search-2" :size="36" color="#bfbfbf"></tui-icon>
					<view class="tui-search-text">请输入搜索关键字</view>
				</view>
				<view class="tui-notice-box" @tap="skipToSearch(3)">
					<tui-icon name="add" color="#FFE933" :size="64"></tui-icon>
					<!-- <tui-badge type="danger" absolute :scaleRatio="0.8" top="16rpx">1</tui-badge> -->
				</view>
			</view>
		</tui-navigation-bar>
</template>

<script>
	//实际使用需要传入上传地址，以及上传接口返回数据进行调整组件
	export default {
		data() {
			return {
				top: 0, //标题图标距离顶部距离
				opcity: 0,
				scrollTop: 0.5
			}
		},
		methods: {
			initNavigation(e) {
				this.opcity = e.opcity;
				this.top = e.top;
			},
			opcityChange(e) {
				this.opcity = e.opcity;
			},
			back() {
				uni.navigateBack();
			},
			async skipToSearch(index) {
				switch(index){
					case 1:
						this.$emit("signIn")
					break;
					case 2:
						this.$http.href("../../pages/search/search",false)
					break;
					case 3:
						this.$http.href("../../pages/add-input/add-input")
					break;
				}
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},

	}
</script>

<style>
	page {
		background-color: #fff;

	}
	.container {
		box-sizing: border-box;
		position: relative;
	}

	.header {
		padding: 80upx 90upx 0 90upx;
		box-sizing: border-box;
	}

	.title {
		font-size: 34upx;
		color: #333;
		font-weight: 500;
	}

	.sub-title {
		font-size: 24upx;
		color: #7a7a7a;
		padding-top: 18upx;
	}



	.tui-title {
		width: 100%;
		padding: 50upx 30upx 30upx;
		box-sizing: border-box;
		font-weight: bold;
	}

	.tui-header-bg {
		width: 100%;
		margin: 0;
	}

	.tui-header-img {
		width: 100%;
		height: 440upx;
		display: block;
	}

	.tui-header-icon {
		width: 100%;
		position: fixed;
		top: 0;
		padding: 0 12upx;
		display: flex;
		align-items: center;
		height: 64upx;
		transform: translateZ(0);
		z-index: 99999;
		box-sizing: border-box;
	}

	.tui-content-box {
		width: 100%;
		height: 88upx;
		padding: 0 30upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-avatar-box {
		width: 60upx;
		height: 60upx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.tui-avatar {
		width: 56upx;
		height: 56upx;
		border-radius: 50%;
	}

	.tui-search-box {
		width: 100%;
		height: 64upx;
		margin: 0 28upx;
		border-radius: 36upx;
		font-size: 14px;
		background-color: #f1f1f1;
		padding: 0 24upx;
		box-sizing: border-box;
		color: #bfbfbf;
		display: flex;
		align-items: center;
	}

	.tui-bg-white {
		background-color: #ffffff !important;
	}

	.tui-search-text {
		padding-left: 10upx;
	}

	.tui-notice-box {
		position: relative;
		flex-shrink: 0;
		font-size: 44upx;
		color: #fff;
	}
</style>
