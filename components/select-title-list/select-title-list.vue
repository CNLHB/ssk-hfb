<template>
	<view class="topic-list u-f animated fadeIn fast" @tap="opendetail">
		<image :src="item.titlePic" lazy-load></image>
		<view>
			<view>#{{item.title}}#</view>
			<view>{{item.description}}</view>
			<view>动态 {{item.total}} 今日 {{item.todaynum}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number
		},
		methods:{
			opendetail(){
				this.$emit("backAdd",this.item)
			}
		}
	}
</script>

<style scoped>
.topic-list{
	padding: 20upx 0;
	border-bottom: 1upx solid #EEEEEE;
}
.topic-list image{
	width: 150upx;
	height: 150upx;
	border-radius:10upx;
	margin-right: 20upx;
}
.topic-list>view>view{
	color: #A4A4A4;
}
.topic-list>view>view:first-child{
	color: #333333;
	font-size: 32upx;
}
</style>
