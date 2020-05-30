<template>
	<view>
		<template v-if="userInfo&&!userInfo.id">
			<!-- 未登录 -->
			<view class="u-f-ajc">登陆韩府帮，体验更多功能</view>
			<!-- 第三方登陆 -->
			<other-login></other-login>
			<!-- 账号密码登陆 -->
			<view class="u-f-ajc" @tap="openLogin">账号密码登陆 <view class="icon iconfont icon-jinru"></view> </view>
		</template>
		<template v-else>
			<!-- 登陆 -->
			<home-info :homeinfo="homeinfo"></home-info>
		</template>
		<!-- 数据 -->
		<home-data 
			@goToSpace="goToSpace"
			:homedata="homedata"></home-data>
		<!-- 广告位 -->
		<view class="home-adv u-f-ajc animated fadeIn fast" >
			<image src="../../static/demo/demo20.jpg" mode="widthFix" lazy-load></image>
		</view>
		<!-- 功能列表 -->
		<view class="home-list">
			<block v-for="(item,index) in list" :key="index">
				<home-list-item :item="item" :index="index"></home-list-item>
			</block>
		</view>
		
		
	</view>
</template>

<script>
	import homeListItem from "../../components/home/home-list-item.vue";
	import homeInfo from "../../components/home/home-info.vue";
	import otherLogin from "../../components/home/other-login.vue";
	import homeData from "../../components/home/home-data.vue";
	import {webUrl} from '../../common/config.js'
	import {mapState} from 'vuex'
	export default {
		components:{
			homeListItem,
			homeInfo,
			otherLogin,
			homeData
		},
		computed:{
			...mapState(['userInfo'])
		},
		onShow(){
			if(this.userInfo.id){
				this.homeinfo.userpic = this.userInfo.authorUrl
				this.homeinfo.username =this.userInfo.userName
				if(!this.islogin){
					this.initDat()
				}
			}else{
				this.homedata[0].num = 0
				this.homedata[1].num = 0
				this.islogin =false
			}

		},
		created() {

		},
		async mounted() {
			this.initDat()
		},
		data() {
			return {
				islogin:false,
				homeinfo:{
					userpic: this.userInfo?this.userInfo.authorUrl:'',
					username:this.userInfo?this.userInfo.userName:"",
					totalnum:0,
					todaynum:0,
				},
				homedata:[
					// { name:"帖子", num:0 },
					{ name:"动态", num:0 },
					{ name:"评论", num:0 },
					{ name:"收藏", num:0 },
				],
				list:[
					{ icon:"liulan",name:"浏览历史",clicktype:"navigateTo",url:"../../pages/user-history/user-history"},
					{ icon:"huiyuanvip",name:"韩府认证",clicktype:"",url:"" },
					{ icon:"keyboard",name:"审核历史",clicktype:"",url:"" },
					{ icon:"dashang",name:"打赏我们",clicktype:"showImage",url:"" },
					{ icon:"weixin",name:"联系我们",clicktype:"contactme",url:"" },
				]
			};
		},
		onNavigationBarButtonTap(e) {
			if(this.userInfo.id){
				if(e.index==0){
					

					uni.navigateTo({
						url: '../user-set/user-set',
					});
				}
			}else{
				uni.showToast({
					title:"你还未登录呢",
					icon:'none'
				})
			}

		},
		methods:{
			openLogin(){
				uni.navigateTo({
					url: '../login/login'
				});
			},
			async initDat(){
				if(this.userInfo&&this.userInfo.id){
					let userAccess = await this.$http.get('user/access')
					this.homeinfo.totalnum = userAccess.allAcc
					this.homeinfo.todaynum = userAccess.dayAcc
					this.homedata[0].num = userAccess.topicCount
					this.homedata[1].num = userAccess.commCount
					this.homedata[2].num = userAccess.collCount
					this.islogin = true
				}
			},
			goToSpace(index){
						console.log(index)
						switch(index){
							
							case 0:
								uni.navigateTo({
									url:'../../pages/user-space/user-space?uid=' + this.userInfo.id
								})
								break;
							case 1:
								uni.navigateTo({
									url:'../../pages/user-space/user-space?uid=' + this.userInfo.id
								})
								break;
							case 2:
							
								uni.navigateTo({
									url:'../../pages/user-collect/user-collect?uid=' + this.userInfo.id
								})
								break;
								
						}

			}
		}
	}
</script>

<style>

.home-list{
	padding: 20upx;
}
.home-adv{
	padding: 20upx;
}
.home-adv>image{
	border-radius: 20upx;
	height: 150upx;
}
</style>
