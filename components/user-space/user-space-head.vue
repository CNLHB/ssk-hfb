<template>
	<view class="user-space-head u-f-ajc">
		<image :src="getBgImg" mode="widthFix" lazy-load @tap.stop="changBgImg"></image>
		<view class="user-space-head-info u-f-ajc u-f-column">
			<image :src="userinfo.userpic" mode="widthFix" lazy-load></image>
			<view class="user-space-margin u-f-ac">
				{{userinfo.username}} 
				<tag-sex-age :sex="userinfo.sex">
				</tag-sex-age> 
			</view>
			<view 
				v-if="userinfo.id==userinfo.currentId"
				@tap="goToInfo"
				class="icon iconfont user-space-head-btn user-space-margin"
			>
				编辑资料
			</view>
			<view
				v-else
				class="icon iconfont user-space-head-btn user-space-margin" :class="[isguanzhu?'active':'icon-zengjia']" @tap.stop="guanzhu">
				{{isguanzhu?'已关注':'关注'}}
			</view>
			
		</view>
	</view>
</template>

<script>
	import tagSexAge from "../common/tag-sex-age.vue";
	export default {
		components:{
			tagSexAge
		},
		props:{
			userinfo:Object,
			},
		data() {
			return {
			}
		},
		computed:{
			getBgImg(){
				return "../../static/bgimg/"+this.userinfo.bgimg+".jpg";
			},
			isguanzhu(){

				return this.userinfo.isguanzhu
			}
		},
		methods:{
			// 切换背景
			changBgImg(){
				let no = parseInt(this.userinfo.bgimg);
				this.userinfo.bgimg = no<4 ? ++no : 1;
			},
			// 关注
			async guanzhu(){
				if(this.userinfo.currentId==-1){
					uni.showToast({
						title:"你还未登录!或登录已过期!",
						icon:'none'
					})
				}
				let data =await this.$http.post('user/active',{
					fromId:this.userinfo.currentId,
					toId: this.userinfo.id
				})
				if(data.code==0){
					await this.$emit("userActive")
				}else{
					uni.showToast({
						title:"操作失败!",
						icon:'none'
					})
				}
			},
			goToInfo(){
				uni.navigateTo({
					url:'../../pages/user-set-userinfo/user-set-userinfo'
				})
			}
		}
	}
</script>

<style scoped>
.user-space-head{
	position: relative;
	height: 500upx;
	overflow: hidden;
}
.user-space-head>image{
	width: 100%;
}
.user-space-head-info{
	position: absolute;
	top: 150upx;
}
.user-space-head-info>image{
	width: 150upx;
	height: 150upx;
	border-radius: 100%;
}
.user-space-head-info>view:first-of-type{
	color: #FFFFFF;
	font-size: 35upx;
	font-weight: bold;
	text-shadow: 2upx 2upx 10upx #333333;
}
.user-space-head-btn{
	background: #FFE933;
	color: #333333;
	border: 1upx solid #FFE933;
	padding: 0 15upx;
	border-radius: 10upx;
	font-size: 28upx;
}
.active{
	background:none;
	color: #FFFFFF;
	border: 1upx solid #FFFFFF;
}
</style>
