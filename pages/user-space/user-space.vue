<template>
	<view>
		<!-- 背景图 + 用户基本信息 -->
		<user-space-head 
			@userActive="userActive"
			:userinfo="info"></user-space-head>
		<!-- 统计 -->
		<view class="user-space-data">
			<home-data :homedata="spacedata"></home-data>
		</view>
		<view style="height: 20upx; background: #F4F4F4;"></view>
		<!-- tab导航 -->
		<swiper-tab-head 
		:tabBars="tabBars" 
		:tabIndex="tabIndex"
		@tabtap="tabtap"
		scrollItemStyle="width:33.33%;"
		scrollStyle="border-bottom:0;">
		</swiper-tab-head>
		<view style="margin-bottom: 5upx;"></view>
		<template v-if="tabIndex==0">
			<!-- 主页 -->
			<user-space-userinfo 
				:userinfo="info"
				:authInfo="userInfo"
				></user-space-userinfo>
		</template>

		<template v-if="tabIndex==1">
			<!-- 话题列表 -->
			<view class="topic-view">
			<block v-for="(list,index1) in titleList" :key="index1">
				<topic-list :item="list" :index="index1"></topic-list>
			</block>	
			</view>
		</template>
		<template v-if="tabIndex==2">
			<!-- 列表 -->
			<view class="topic-list">
			<block v-for="(list,listindex) in topicList" :key="listindex">
				<card @gotoTopic="gotoTopic" :cardinfo="list" :index="listindex"></card>
			</block>
			</view>
			<!-- 上拉加载 -->
		</template>

		<!-- 操作菜单 -->
		<user-space-popup :show="show" 
		@hide="togleShow"
		@lahei="lahei"
		@beizhu="beizhu"></user-space-popup>
		
	</view>
</template>

<script>
	import userSpaceHead from "../../components/user-space/user-space-head.vue";
	import homeData from "../../components/home/home-data.vue";
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import userSpaceUserinfo from "../../components/user-space/user-space-userinfo.vue";
	import commonList from "../../components/common/common-list.vue";
	import card from '../../components/list-card/list-card.vue'
	import loadMore from "../../components/common/load-more.vue";
	import userSpacePopup from "../../components/user-space/user-space-popup.vue";
	import {mapMutations, mapState} from 'vuex'
	import topicList from "../../components/news/topic-list.vue";
	import time from '../../common/time.js'
	import {saveUserAccess,getUserWillinfo,getTopicListByUid,getTopicTitleByUid} from '@/api/user-space.js'
	export default {
		components:{
			userSpaceHead,
			homeData,
			swiperTabHead,
			userSpaceUserinfo,
			commonList,
			loadMore,
			userSpacePopup,
			card,
			topicList		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(data) {
			this.info.id = data.uid
			this.initData(data.uid)
			if(data.uid!=this.userInfo.id){
				saveUserAccess({
					fromId:this.userInfo.id?this.userInfo.id:(+new Date+"").slice(5),
					toId: data.uid
				})
			}
		},
		data() {
			return {
				show:false,
				info:{
					currentId: -1,
					bgimg:1,
					userpic:"",
					username:"",
					sex:0,
					age:0,
					isguanzhu:0,
					regtime:+new Date,
					id:0,
					job:"",
					path:"",
				},
				topicList:[],
				titleList:[],
				spacedata:[
					{ name:"获赞", num:0 },
					{ name:"关注", num:0 },
					{ name:"粉丝", num:0 },
				],
				tabIndex:0,
				tabBars:[
					{ name:"主页",id:"zhuye" },
					{ name:"话题",id:"huati" },
					{ name:"动态",id:"dongtai" },
				],
				tablist:[ {},
					{
						loadtext:"",
						list:[
						]
					},
					{
						loadtext:"",
						// 上拉加载更多
						list:[
						]
					},
				]
			}
		},
		// 上拉触底事件
		onReachBottom() {
			// 上拉加载
			this.loadmore();
		},
		onNavigationBarButtonTap(e) {
			if(e.index==0){ this.togleShow(); }
		},
		methods: {
			async initData(id){
				let {code,data} = await getUserWillinfo(id);
				let topicList = await getTopicListByUid(id);
				let topicTitleList = await getTopicTitleByUid(id);
				
				if(Array.isArray(topicTitleList)){
					this.titleList = topicTitleList
				}
				this.topicList = topicList
				if(code==0&&data){
				this.spacedata[0].num = data.likeNum>=1000?(data.likeNum/1000)+"k":data.likeNum
				this.spacedata[1].num = data.attNum
				this.spacedata[2].num = data.fansNum
				let currentId = this.userInfo.id
				this.info.currentId = currentId;
				this.info.userpic = data.userPic;
				this.info.username = data.userName;
				this.info.sex = data.gender;
				this.info.isguanzhu = data.isguanzhu;
				this.info.regtime = data.createTime;
				this.info.id = data.id;
				this.info.job = data.job==null ?"未知" :data.job
				this.info.path = data.path==null?"未知":data.path

				}
				
			},
			userActive(){
				this.info.isguanzhu = !this.info.isguanzhu
			},
			gotoTopic(index){
				let topicDetail = this.topicList[index];
				uni.navigateTo({
					url: '../../pages/detail/detail?id='+topicDetail.id,
				});
			},
			// 操作菜单显示隐藏
			togleShow(){
				this.show=!this.show;
			},
			// 私信
			lahei(){
				console.log("私信")
				if(this.info.id==this.userInfo.id){
					return
				}
				this.togleShow();
				uni.navigateTo({
					url: '../../pages/user-chat/user-chat?fid='+this.info.id
				});
			},
			// 备注
			beizhu(){
				console.log("备注")
				this.togleShow()
			},
			// 上拉加载更多
			loadmore(){
				if(this.tablist[this.tabIndex].loadtext!="上拉加载更多"){ return; }
				// 修改状态
				this.tablist[this.tabIndex].loadtext="加载中...";
				// 获取数据
				// this.tablist[this.tabIndex].loadtext="没有更多数据了";
			},
			tabtap(index){
				this.tabIndex=index;
			},
		}
	}
</script>

<style>
.user-space-margin{
	margin: 10upx 10upx 0  10upx;
}
.topic-view{
	padding: 20upx;
}
.topic-list{
	box-sizing: border-box;
	background-color: #F9F9F9;
	padding: 5upx 20upx 0 30upx;
}
.user-space-data{
	background: #FFFFFF;
	position: relative;
	z-index: 10;
	border-top-left-radius: 20upx;
	border-top-right-radius: 20upx;
	margin-top: -15upx;
}

</style>
