<template>
	<view class="container"> 
		<view class="item-list">
			<view class="author-wrap">
				<image class="anthor-pic" :src="item.userpic" lazy-load></image>
				<text class="author-name">{{item.username}}</text>
			</view>
			<view style="color: #007AFF;">
				<template v-for="title in item.lable">
					#{{title.title}}# 
				</template>
			</view>  
			<view class="topic-text">
				{{item.title}}
			</view>
			<template v-if="item.urlType=='img'">
				<view v-if="item.images&&item.images.length>1" class="image-view-n">
						<block v-for="(items,index1) in item.images" :key="index1">
							<image :src="items"
							lazy-load></image>
						</block>
				</view>
				<view v-else-if="item.images.length==1" class="image-view-1">
					<image :src="item.images[0]"
					lazy-load mode="aspectFit"></image>
				</view>
		</template>

			
			<view class="topic-active">
				<view class="active-comm">
					<tui-icon name="share" :size="size" unit="upx"></tui-icon>
					<text class="active-text">分享</text>
				</view>
				<view class="active-comm" @tap="opendetail">
					<tui-icon name="community" :size="size" unit="upx"></tui-icon>
					<text class="active-text">{{item.commentNum==0?"评论": item.commentNum}}</text>
				</view>
				<view class="active-comm" @tap="giveLike">
					<tui-icon :name="infoNum.index==1?'agree-fill': 'agree'" :color="infoNum.index==1?'red': ''" :size="size" unit="upx"></tui-icon>
					<text class="active-text">
						{{infoNum.likeNum==0?"点赞": infoNum.likeNum}}
						</text>
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
		props:{
			item:Object,
			index:Number,
			userInfo:Object
		},
		data() {
			return {
				isguanzhu: this.item.isguanzhu,
				collect: this.item.collect,
				infoNum:this.item.infoNum,
				size: 24,
				topicActive:{
					uid:this.userInfo.id,
					tid:this.item.id,
					tuid: this.item.uid,
					cid:this.item.cid
					
				}
			}
		},
		methods: {
			async giveLike(){
				if(this.infoNum.index){
					this.infoNum.likeNum--
					await this.$emit("likeOrTread",{
							...this.topicActive,
							tactive: 0
						})
				}else{
					this.infoNum.likeNum++
					await this.$emit("likeOrTread",{
							...this.topicActive,
							tactive: 1
						})
				}
				this.infoNum.index = !this.infoNum.index
			},
			opendetail(){
				this.$emit("opendDetail",this.item)
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
	justify-content: flex-start;
}

</style>
