<template>
	<view class="container"> 
		<view class="item-list">
			<view class="author-wrap">
				<image class="anthor-pic" src="../../static/bgimg/1.jpg"></image>
				<text class="author-name">雪山很美</text>
			</view>
			<view style="color: #007AFF;">
				<template v-for="title in [1,2,3]">
					#{{title.title}}# 
				</template>
			</view> 
			<view class="topic-text">
				186ahlnio asailnfUI开始
			</view>
			<view class="image-view-n">
				<image src="../../static/common/loginhead.png" ></image>
				<image src="../../static/common/loginhead.png" ></image>
				<image src="../../static/common/contactme.jpg"></image>
				<image src="../../static/common/contactme.jpg"></image>
				<image src="../../static/common/loginhead.png" ></image>
				<image src="http://image.xquery.cn/15911519519236C7536E8-7294-48CE-9F87-B395B0E4EE76.jpeg" ></image>
				
			</view>
			<view class="topic-active">
				<view class="active-comm">
					<tui-icon name="share" size="24"></tui-icon>
					<text class="active-text">分享</text>
				</view>
				<view class="active-comm">
					<tui-icon name="community" size="24"></tui-icon>
					<text class="active-text">评论</text>
				</view>
				<view class="active-comm">
					<tui-icon name="agree-fill" color="red" size="24"></tui-icon>
					<text class="active-text">点赞</text>
				</view>
			</view>
		</view>

		</view>


	</view>
</template>

<script>
	import uniFav from '@/components/uni-fav/uni-fav.vue'
	export default {
		components:{
			uniFav
		},
		data() {
			return {
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
.container{
	display: flex;
	box-sizing: border-box;
	width: 100vw;
	height: 100vh;
	align-items: center;
	flex-direction: column;
	background-color: #F9F9F9;
	padding: 0 20upx ;
}
.author-wrap{
	display: flex;
	height: 90upx;
	align-items: center;
	overflow: hidden;
}
.anthor-pic{
	width: 60upx;
	height: 60upx;
	margin-right: 20upx;
	border-radius: 50%;
	
}
.topic-text{
	margin-bottom: 10upx;
}
.topic-active{
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 20upx;
	height: 100upx;
	line-height: 100upx;
}
.active-comm{
	display: flex;
	align-items: center;
	color: #666666;
}
.active-text{
	margin-left: 10upx;
}
.author-wrap .author-name{
	font-weight: 700;
}

.item-list{
	background-color: #FFFFFF;
	box-sizing: border-box;
	width: 100%;
	min-height: 300upx;
	border-radius: 20upx;
	margin-bottom: 25upx;
	padding: 14upx;
}
.image-view-n{
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.image-view-n >image{
	width: 220upx;
	height: 220upx;
	border-radius: 10upx;
	/* margin-right: 10upx; */
	margin-bottom: 10upx;
}

.image-view-1{
	display: flex;
	justify-content: start;
}

</style>
