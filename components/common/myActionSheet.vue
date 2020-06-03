<template>
	
	<view class="">
		<tui-actionsheet :show="showActionSheet" 
			:tips="tips" :item-list="itemList"
			:mask-closable="maskClosable"
			 :color="color"
			:size="size"
			 :is-cancel="isCancel"
			  @click="itemClick"
			   @cancel="closeActionSheet">
		 </tui-actionsheet>
	</view>

</template>

<script>
	export default {
		props:{
			showActionSheet:{
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				maskClosable: true,
				tips: "退出登录会清除您的登录信息，确认退出吗？",
				itemList : [{
					text: "退出登录",
					color: "#E3302D"
				}],
				color: "#9a9a9a",
				size: 26,
				isCancel: true
			}
		},
		methods: {
			closeActionSheet: function() {
				this.$emit("toggleAction")
			},
			openActionSheet: function(type) {
				// switch (type) {
				// 	case 4:
				// 		tips = "";
				// 		itemList = [{
				// 			text: "点赞",
				// 			color: "#2B2B2B"
				// 		}, {
				// 			text: "评论",
				// 			color: "#2B2B2B"
				// 		}, {
				// 			text: "收藏",
				// 			color: "#2B2B2B"
				// 		}, {
				// 			text: "分享",
				// 			color: "#2B2B2B"
				// 		}]
				// 		break;
				// 	default:
				// 		break;
				// }
			},
			itemClick: function(e) {
				let index = e.index;
				console.log(index)
				this.$emit("toggleAction" ,index)
			}
		}
	}
</script>

<style scoped>
	.container {
		padding: 20rpx 0 120rpx 0;
		box-sizing: border-box;
	}
	
	.header {
		padding: 80rpx 90rpx 60rpx 90rpx;
		box-sizing: border-box;
	}
	
	.title {
		font-size: 34rpx;
		color: #333;
		font-weight: 500;
	}
	
	.sub-title {
		font-size: 24rpx;
		color: #7a7a7a;
		padding-top: 18rpx;
	}
	
	.tui-btn-box {
		width: 100%;
		padding: 10rpx 40rpx;
		box-sizing: border-box;
	}
</style>
