<template>
	<view class="user-list u-f-ac animated fadeIn fast" @tap.stop="gotoInfo(item)">
		<image :src="item.userpic" mode="widthFix" lazy-load></image>
		<view >
			<view>{{item.username}}</view>
			<view class="wrap">
				{{item.title}}
			</view>
		</view>
		<view class="icon iconfont icon-jinru u-f-ajc" 
			></view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number
		},
		methods:{
			gotoInfo(item){
				console.log(item)
				this.$emit('gotoTopicInfo',item)
			}
		}
	}
</script>

<style scoped>
.user-list{
	margin: 0 20upx; 
	padding: 20upx 0;
	height: 110upx;
	border-bottom: 1upx solid #EEEEEE;
}
.wrap{
	width: 500upx;
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap
}
.user-list>image{
	width: 100upx!important;
	height: 100upx!important;
	border-radius: 100%;
	margin-right: 20upx;
	flex-shrink: 0;
}
.user-list>view:first-of-type{
	flex: 1;
}
.user-list>view:first-of-type>view:first-child{
	font-size: 35upx;
}
.user-list>view:last-of-type{
	width: 80upx;
	color:#CCCCCC;
}
.icon-zengjia1{
	width: 100upx;
	color: #F8791B!important;
}
</style>
