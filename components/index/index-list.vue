<template>
	<view class="index-list animated fadeIn fast">
		<view class="index-list1 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<image :src="item.userpic" 
				class="author"
				lazy-load></image>
				{{item.username}}
			</view>
		</view>
		<view class="index-list2" @tap="opendetail">{{item.title}}</view>
		<view class="index-list3 u-f-ajc" @tap="opendetail">
			<!-- 图片 -->
			<template v-if="item.images.length>0">
				<view :class="item.images&&item.images.length>1?'img-n':'img-1'" >
					<block v-for="(items,index1) in item.images" :key="index1">
						<image :src="items"
						lazy-load></image>
					</block>
				</view>
			</template>

			<!-- 视频 -->
			<template v-if="item.type=='vedio'">
				<!-- <view class="icon iconfont icon-bofang index-list-play"></view> -->
				<view class="index-list-playinfo">
					<!-- {{item.playnum}}次播放 -->
				</view>
				
			</template>
		</view>
		<view class="index-list4 u-f-ac u-f-jsb">
			<view class="u-f-ac">
				<view class="u-f-ac" :class="{'active':(infoNum.index==1)}"
				@tap="caozuo('ding')">
					<view class="icon iconfont icon-icon_xiaolian-mian"></view>
					{{infoNum.likeNum}}
				</view>
				<view class="u-f-ac" :class="{'active':(infoNum.index==2)}"
				@tap="caozuo('cai')">
					<view class="icon iconfont icon-kulian"></view>
					{{infoNum.treadNum}}
				</view>
			</view>
			<view class="u-f-ac">
				<view class="u-f-ac" @tap="opendetail">
					<view class="icon iconfont icon-pinglun1"></view>
					{{item.commentNum}}
				</view>
<!-- 				<view class="u-f-ac">
					<view class="icon iconfont icon-zhuanfa"></view>
					{{item.sharenum}}
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			item:Object,
			index:Number,
			userInfo:Object
		},
		data() {
			return {
				isguanzhu: false,
				infoNum:this.item.infoNum,
				topicActive:{
					uid:this.userInfo.id,
					tid:this.item.id,
					tUid: this.item.uid
					
				}
			}
		},
		onLoad() {
			this.isguanzhu=this.item.isguanzhu
			this.infoNum=this.item.infoNum
			this.topicActive.uid = this.userInfo.id
			this.topicActive.tid = this.item.id
			this.topicActive.tUid = this.item.uid

			
			
		},
		methods:{
			// 关注
			guanzhu(){
				this.isguanzhu=true;
				uni.showToast({
					title: '关注成功',
				});
			},
			
			// 顶踩
			async caozuo(type){
				if(!this.userInfo || !this.userInfo.id){
					uni.showToast({
						title:"你还未登录！或登录过有效期!",
						icon:'none'
					})
					return
				}
				
				switch (type){
					case "ding":
					if(this.infoNum.index==1){ 
					
					await this.$emit("likeOrTread",{
							...this.topicActive,
							tactive: 0
						})
						this.infoNum.likeNum--;
						this.infoNum.index=0;
						return 
						
					}
					await this.$emit("likeOrTread",{
							...this.topicActive,
							tactive: 1
						})
					this.infoNum.likeNum++;
					if(this.infoNum.index==2){
						this.infoNum.treadNum--;
					}
					this.infoNum.index=1;
						break;
					case "cai":
					
					if(this.infoNum.index==2){

						this.$http.post('/topic/active',{
							tid:this.item.id,
							uid:2,
							tactive: 0
						}).then((data)=>{
						this.infoNum.treadNum--;
						this.infoNum.index=0;
						})
						
						return  
					}

					
					this.$http.post('/topic/active',{
						tid:this.item.id,
						uid:2,
						tactive: 2
					}).then((data)=>{
						this.infoNum.treadNum++;
						if(this.infoNum.index==1){
							this.infoNum.likeNum--;
						}
						this.infoNum.index=2;
					})
						break;
				}
			},
			// 进入详情页
			opendetail(){
				uni.setStorageSync("topicDatail",JSON.stringify(this.item))
				uni.navigateTo({
					url: '../../pages/detail/detail',
				});
			}
		}
	}
</script>

<style scoped>
.index-list{
	margin: 20upx;
	border-radius: 30upx;
	background-color: #FFFFFF;
}
.index-list1>view:first-child{
	margin-left: 10px;
	color: #999999;
}
.index-list1>view:first-child image{
	width: 68upx;
	height: 68upx;
	border-radius: 100%;
	margin-right: 10upx;
}
.index-list1>view:last-child{
	
	border-radius:5upx;
	margin: 12upx 0upx 0upx 12upx;
}
.index-list2{
	padding-top: 12upx;
	font-size: 32upx;
	text-indent: 0.5em;
}
.index-list3{
	position: relative;
	  display: flex;
	  flex-wrap: wrap;
	  justify-content: flex-start;
	  padding: 0upx 10upx 0upx 10upx;
	  transform: translateX(8upx)

}
.u-f-ac .author{
	width: 68upx;
	height: 68upx;
}
.index-list3 .img-n>image{
	width: 220upx;
	height: 220upx;
	border-radius: 10upx;
	margin-right: 10upx;
	
}
.index-list4 view{
	color: #999999;
	margin: 0 10upx 0 10upx;
}
.index-list4{
	padding: 15upx 0;

}
.index-list4>view>view>view,.index-list4>view>view:first-child{
	margin-right: 10upx;
}
.index-list-play{
	position: absolute;
	font-size: 140upx;
	color: #FFFFFF;
}
.index-list-playinfo{
	position: absolute;
	background: rgba(51, 51, 51, 0.72);
	color: #FFFFFF;
	bottom: 8upx;
	right: 8upx;
	border-radius: 40upx;
	font-size: 22upx;
	padding: 0 12upx;
}
.index-list4 .active,.index-list4 .active>view{
	color: #C5F61C;
}
.img-1{
	width: 100%;
	height: 100%;
}
.img-1 image{
	border-radius: 10upx;
}
</style>
