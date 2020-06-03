<template>
	<view class="container"> 
<!-- 		<my-action-sheet :showActionSheet="showActionSheet" @toggleAction="toggleAction"></my-action-sheet>
		<button type="default" @click="showActive">show</button> -->
		<view class="item-list">
			<view class="author-wrap">
				<image class="anthor-pic" src="../../static/bgimg/1.jpg"></image>
				<text class="author-name">雪山很美</text>
			</view>
			<view style="color: #007AFF;">
				<template v-for="title in [1,2,3]">
					#{{title.title}}# &nbsp
				</template>
			</view> 
			<view class="topic-text">
				186ahlnio asailnfUI开始
			</view>
			<view class="image-view-n">
				<image src="../../static/bgimg/1.jpg"  class="img-1"></image>
				<image src="../../static/common/loginhead.png" ></image>
				<image src="../../static/common/loginhead.png" ></image>
				<image src="../../static/common/contactme.jpg"></image>
				<image src="../../static/common/contactme.jpg"></image>
				<image src="../../static/common/loginhead.png" ></image>
			</view>
			<view class="topic-active">
				<text>
					<tui-icon name="share"></tui-icon>分享
				</text>
				<text>
					<tui-icon name="community"></tui-icon>评论
				</text>
				<text>
					<tui-icon name="agree"></tui-icon>点赞
				</text>
			</view>
		</view>
		<view class="item-list">
		<view class="">232</view>
		<view class="image-view-1">
			<image src="../../static/common/loginhead.png" mode=""></image>
		</view>
		</view>
		<view class="item-list">
			<view class="">gas无敌gas键盘【爱sssssssssssssssssssss思放</view>
			<image src="../../static/common/contactme.jpg" mode="aspectFill"></image>
			<image src="../../static/common/contactme.jpg" mode="aspectFit"></image>
			<image src="../news/leetcodeHot100.png" mode="aspectFit"></image>
		</view>
		<view class="item-list">
				<view class="">gas	盘【爱思放爱思放</view> 
	<image src="../../static/bgimg/1.jpg"  mode="aspectFit"></image>
		<image src="../../static/bgimg/1.jpg"  mode="aspectFill"></image>
		</view>
	</view>
</template>

<script>
	import myActionSheet from '@/components/common/myActionSheet.vue'
	import uniFav from '@/components/uni-fav/uni-fav.vue'
	export default {
		components:{
			myActionSheet,
			uniFav
		},
		data() {
			return {
				showActionSheet:false
			}
		},
		methods: {
			showActive(){
				this.showActionSheet = true
			},
			toggleAction(index){
				this.showActionSheet = false
			}
		}
	}
</script>

<style scoped>
.container{
	display: flex;
	box-sizing: border-box;
	width: 100vw;
	align-items: center;
	flex-direction: column;
	background-color: #F9F9F9;
	padding: 0 20upx ;
}
.author-wrap{
	display: flex;
	height: 90upx;
	/* justify-content: center; */
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
}

.topic-active{
	display: flex;
	justify-content: space-between;
}
</style>
