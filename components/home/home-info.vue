<template>
	<view class="home-info u-f-ac animated fadeIn fast" @tap="ToUserSpace">
		<image :src="homeinfo.userpic" mode="widthFix" lazy-load></image>
		<view class="u-f1">
			<view>{{homeinfo.username}}</view>
			<view>总访客 {{homeinfo.totalnum}}  今日 {{homeinfo.todaynum}}</view>
		</view>
		<view class="icon iconfont icon-jinru"></view>
	</view>
</template>

<script>
	export default {
		props:{
			homeinfo:Object
		},
		methods:{
			ToUserSpace(){
				uni.navigateTo({
					url: '../../pages/user-space/user-space',
				});
			}
		}
	}
</script>

<style scoped>
.home-info{
	padding: 20upx 40upx;
}
.home-info>image{
	flex-shrink: 0;
	width: 100upx;
	height: 100upx;
	border-radius: 100%;
	margin-right: 15upx;
}
.home-info>view:first-of-type>view:first-child{
	font-size: 32upx;
}
.home-info>view:first-of-type>view:last-child{
	color: #BBBBBB;
}
.home-info>view:last-of-type{
	height: 100%;
}

</style>
