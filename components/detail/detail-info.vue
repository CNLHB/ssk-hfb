<template>
	<view class="common-list u-f animated fadeIn fast">
		<view class="common-list-r">
			<view>
				<view class="u-f-ac u-f-jsb">
					<view class="common-list-l" @tap="goToUserInfo(item)">
						<image :src="item.userpic" class="com-img" lazy-load></image>
						<view class="u-f-ac dre">
							{{item.username}} 
							<tag-sex-age :ugender="item.ugender" :age="item.age"></tag-sex-age>
						</view>
					</view>

					<view v-if="!isguanzhu" @tap="guanzhu" 
					class="icon iconfont icon-zengjia">关注</view>
				<view v-else @tap="guanzhu"
				class="icon iconfont ">取消关注</view>
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
				
				<!-- 分享 -->
<!-- 				<view class="common-list-share u-f-ac" v-if="item">
					<image :src="item.images[0]" 
					mode="widthFix" lazy-load></image>
					<view>{{item.title}}</view>
				</view> -->
			</view>
			<view class="u-f-ac u-f-jsb">
				<view>{{item.path}}</view>
				<view class="u-f-ac">
<!-- 					<view class="icon iconfont icon-zhuanfa">
					{{item.sharenum}}</view> -->
					<view class="icon iconfont icon-pinglun1">
					{{item.commentNum}}</view>
					<view class="icon iconfont icon-dianzan1">
					{{item.infoNum?item.infoNum.likeNum:0}}
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
			userInfo:Object
		},
		data() {
			return {
				isguanzhu: this.item.isguanzhu,
				list: "list3"

			}
		},
		computed:{
			createDate(){
				
				let data =this.item.createTime? new Date(this.item.createTime).getTime():+new Date;
				return time.gettime.sumAge(data)
			}
		},
		mounted(){
		},
		methods:{
			goToUserInfo(item){
				this.$emit("goToUserInfo",item)
				// uni.navigateTo({
				// 	url:'../../pages/user-space/user-space?uid='+this.item.id
				// })
			},
			guanzhu(){
				if(!this.userInfo.id){
					uni.showToast({
						title:'你还未登录!',
						icon:'none'
					})
					return 
				}
				if(this.isguanzhu){
					this.$http.delete('/user/active',{
						fromId:this.userInfo.id,
						toId:this.item.uid
					})
					this.isguanzhu=false;
					uni.showToast({
						title: '取消关注',
					});
				}else{
					this.$http.post('/user/active',{
						fromId:this.userInfo.id,
						toId:this.item.uid
					})
					this.isguanzhu=true;
					uni.showToast({
						title: '关注成功',
					});
				}
				
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
	    width: 68upx;
	    height: 68upx;
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
	padding: 15upx 0;
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
