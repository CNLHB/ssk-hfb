<template>
	<view class="common-list u-f animated fadeIn fast">
		<view class="common-list-r">
			<view>
				<view class="u-f-ac u-f-jsb">
					<view class="common-list-l" @tap="goToUserInfo(item)">
						<image :src="item.userpic" class="com-img" lazy-load></image>
						<view class="u-f-ac dre">
							<text class="author-name">{{item.username}} </text>
							<tag-sex-age :ugender="item.ugender" :age="item.age"></tag-sex-age>
						</view>
					</view>
			<template v-if="!isme">
				<view v-if="!isguanzhu" @tap="guanzhu"
					class="icon iconfont icon-zengjia guanzhu">关注</view>
				<view v-else @tap="guanzhu"
				class="icon iconfont guanzhu">取消关注</view>
			</template>
				</view>
				<view class="common-list-r-time">{{createDate}}</view>
			</view>
			<view>{{item.title}}</view>
			<view class="u-f-ajc" :class="[ list =='list3'?'list3': 'list4']">
				<!-- 图片 -->
				<view  v-if="item.urlType=='img'" :class="item.images.length>1?'img-n':'img-1'">
					<block v-for="(pic,index) in item.images" :key="index">
						<image :src="pic" 
						lazy-load 
						@tap="imgdetail(index)"></image>
						
					</block>
				</view>
				<!-- 视频 -->
				<template v-if="item.urlType=='mp4'">
					<video :src="item.images[0]" 
					style="width: 100%;"
					controls 
					></video>
					<view class="index-list-playinfo">
						{{item.playnum}}次播放
					</view>
				</template>

			</view>
			<view class="u-f-ac u-f-jsb">
				<view>{{item.path}}</view>
				<view class="u-f-ac">
					<view class="active-comm" @tap="onCollect">
						<tui-icon :name="collect?'star-fill':'star'" :color="collect?'#FFE933':''"  :size="size" unit="upx"></tui-icon>
						<text class="active-text">{{collect?"取消收藏": "收藏"}}</text>
					</view>

				<view class="active-comm" @tap="giveLike">
					<tui-icon :name="infoNum.index==1?'agree-fill': 'agree'" :color="infoNum.index==1?'#FFE933': ''" :size="size" unit="upx"></tui-icon>
					<text class="active-text">
						{{infoNum.likeNum==0?"点赞": infoNum.likeNum}}
					</text>
				</view>
				<view class="active-comm" @tap="showComInput">
					<tui-icon name="community" :size="size" unit="upx"></tui-icon>
					<text class="active-text">{{item.commentNum==0?"评论": item.commentNum}}</text>
				</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import time from "../../common/time.js";
	import tagSexAge from "../common/tag-sex-age.vue"
	export default {
		components:{
			tagSexAge
		},
		props:{
			item:{
				type:Object
			},
			userInfo:Object,
			infoNum:Object
		},
		data() {
			return {
				isguanzhu: this.item.isguanzhu,
				list: "list3",
				size: 48,
				collect: this.item.collect,
				topicActive:{
					uid:this.userInfo.id,
					tid:this.item.id,
					tuid: this.item.uid,
					cid:this.item.cid
					
				}

			}
		},
		computed:{
			createDate(){

				let data =this.item.createTime? new Date(this.item.createTime).getTime():+new Date;
				return time.gettime.sumAge(data)
			},
			isme(){
				return 	this.userInfo.id==this.item.uid
			}
		},
		mounted(){
			console.log(this.userInfo.id,this.item)
		},
		watch:{
			'item.id':function(){
				this.isguanzhu= this.item.isguanzhu
				this.collect = this.item.collect
				this.topicActive={
					uid:this.userInfo.id,
					tid:this.item.id,
					tuid: this.item.uid,
					cid:this.item.cid
					
				}
				
			}
		},
		methods:{
			goToUserInfo(item){
				this.$emit("goToUserInfo",item)
			},
			showComInput(){
				
			},
			onCollect(){
				if(!this.userInfo.id){
					this.$http.href('../../pages/login/login')
					return 
				}
				console.log(this.topicActive)
				this.$http.post('topic/collect',{
					...this.topicActive,
					title:this.item.title,
					username:this.item.username,
					userpic:this.item.userpic
				})
				if(this.collect){
					this.$http.toast("取消收藏!")
				}else{
					this.$http.toast("收藏成功!")
				}
				this.collect = !this.collect
			},
			guanzhu(){
				if(!this.userInfo.id){
					this.$http.href('../../pages/login/login')
					return 
				}
				if(this.isguanzhu){
					this.$http.delete('/user/active',{
						fromId:this.userInfo.id,
						toId:this.item.uid
					})
					this.isguanzhu=false;
						this.$http.toast("取消关注!")
				}else{
					this.$http.post('/user/active',{
						fromId:this.userInfo.id,
						toId:this.item.uid
					})
					this.isguanzhu=true;
					this.$http.toast("关注成功!")

				}
				
			},
			showComInput(){
				if(!this.userInfo.id){
					this.$http.href('../../pages/login/login')
					return 
				}
				if(this.item.uid==this.userInfo.id){
					this.$http.toast("自己不用评论了趴！")
					return
				}
				
				this.$emit("comSubimt",this.item)
			},
			async giveLike(){
				if(!this.userInfo.id){
					this.$http.href('../../pages/login/login')
					return 
				}
				if(this.infoNum.index){
					console.log(88)
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
			imgdetail(index){
				uni.previewImage({
					current:index,
					urls:this.item.images
				})
			}
		}
	}
</script>

<style scoped>
@import "../../common/list.css";
	
.common-list-l{
	display:flex;
	
}
.common-list-l .com-img{
	width: 68upx!important;
	height: 68upx!important;
	margin-right: 20upx;
	border-radius: 50%;
}
 .author-name{
	 /* color: #000000; */
	font-weight: 700;
}
.active-comm{
	display: flex;
	align-items: center;
	margin-right: 20upx;
	color: #666666;
}
.active-text{
	margin-left: 10upx;
	font-weight: 500;
}
.dre{
	display: flex;
	flex-direction:row ;
	padding-left: 10upx;
}
.common-list-r{
	border-bottom: 0;
	
}
.common-list{
	border-bottom: 1upx solid #EEEEEE;
}
.common-list-r-time{
	padding: 20upx 0 0 10upx;
	color: #CCCCCC!important;
	font-size: 25upx;
	background: #FFFFFF!important;
}
.common-list-r>view:nth-child(1)>view:nth-child(1)>view:first-child{
	color: #999999;
	font-size: 32upx;
}

.common-list-r>view:nth-child(1)>view:nth-child(1)>view:last-child{
	background-color: #FFFFFF;
	padding: 0 10upx;
	font-size: 26upx;
}
.common-list-r .list3{
	display: flex;
	flex-direction: row;
	padding-top: 15upx;
	justify-content: space-between;
	flex-wrap: wrap;
	}
.common-list-r .list3 .img-n>image{
	width: 230upx;
	height: 230upx;
	margin-bottom: 10upx;
	border-radius: 20upx;
	margin-right: 7upx;
}
.img-1{
	width: 100%;
}
.img-1>image{
	width: 100%;
	margin-bottom: 10upx;
	border-radius: 20upx;
}
.common-list-r .list4>image{
	margin-bottom: 10upx;
	border-radius: 20upx;
}

</style>
