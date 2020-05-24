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
		<home-data :homedata="homedata"></home-data>
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
		onLoad() {
			// this.homeinfo = this.userInfo
				


			
		},
		created() {
			if(this.userInfo){
				console.log(this.userInfo)
				this.homeinfo.totalnum = 0
				this.homeinfo.todaynum = 0
				this.homeinfo.userpic = this.userInfo.authorUrl
				this.homeinfo.username =this.userInfo.userName
			}
		},
		data() {
			return {
				islogin:false,
				homeinfo:{
					userpic:"",
					username:"",
					totalnum:0,
					todaynum:0,
				},
				homedata:[
					{ name:"帖子", num:0 },
					{ name:"动态", num:0 },
					{ name:"评论", num:0 },
					{ name:"收藏", num:0 },
				],
				list:[
					{ icon:"liulan",name:"浏览历史",clicktype:"",url:""},
					{ icon:"huiyuanvip",name:"韩府认证",clicktype:"",url:"" },
					{ icon:"keyboard",name:"审核历史",clicktype:"",url:"" },
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
