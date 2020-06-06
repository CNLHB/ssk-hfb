<template>
	<view>
		<!-- 话题介绍 -->
		<topic-info :item="topicInfo"></topic-info>
		<!-- tabbar切换 -->
<!-- 		<swiper-tab-head 
		:tabBars="tabBars" 
		:tabIndex="tabIndex"
		@tabtap="tabtap"
		scrollItemStyle="width:50%;"
		scrollStyle="border-bottom:0;">
		</swiper-tab-head> -->
		<!-- 列表 -->
		<view class="topic-detail-list">
			<block v-for="(item,index) in tablist" :key="index">
				<template v-if="tabIndex==index">
					<!-- 列表 -->
					<block v-for="(list,listindex) in item.list" :key="listindex">
					<index-list
					@likeOrTread="likeOrTread" 
					@opendDetail="opendDetail"
					:item="list" 
					:userInfo="userInfo"
					:index="listindex"></index-list>
						<!-- <index-list :item="list" :index="listindex"></index-list> -->
					</block>
					<!-- 上拉加载 -->
					<load-more :loadtext="item.loadtext"></load-more>
				</template>
			</block>
		</view>
		
	</view>
</template>

<script>
	import topicInfo from "../../components/topic/topic-info.vue";
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import indexList from "../../components/index/index-list.vue";
	import loadMore from "../../components/common/load-more.vue";
	import {getTopicTitleById, getTopicTitleList} from '@/api/topic-detail.js'
	import { giveLike } from '@/api/common.js'
	
	import {mapState} from 'vuex'
	export default {
		components:{
			topicInfo,
			swiperTabHead,
			indexList,
			loadMore
		},
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				topicInfo:{
						cid: 3,
						createTime: "2020-06-01T03:02:15.000+00:00",
						description: "我是话题6的描述",
						display: true,
						id: 6,
						title: "我是标题6",
						titlePic: "http://image.xquery.cn/159098136077813.jpeg",
						total: 0,
						uid: 11
				},
				tabIndex:0,
				tabBars:[
					{ name:"默认",id:"moren" },
					{ name:"最新",id:"zuixin" },
				],
				tablist:[
					{
						loadtext:"上拉加载更多",
						list:[
							// 文字
						]
					}
				]
			}
		},
		async onLoad(data){
			let info = await getTopicTitleById(data.id) 
			this.topicInfo = info
			let list = await getTopicTitleList(data.id) 
			if(list.code !== 10004){
				this.tablist[0].list = list
			}else{
				this.tablist[this.tabIndex].loadtext="没有更多数据了";
			}
		},
		// 上拉触底事件
		onReachBottom() {
			// 上拉加载
			this.loadmore();
		},
		// 监听下拉刷新 
		onPullDownRefresh(){
			this.getdata();
		},
		methods:{
			// 上拉刷新
			getdata(){
					// 关闭下拉刷新
					uni.stopPullDownRefresh();
			},
			// 上拉加载
			loadmore(){
				if(this.tablist[this.tabIndex].loadtext!="上拉加载更多"){ return; }
				// 修改状态
				this.tablist[this.tabIndex].loadtext="加载中...";
				// 获取数据
					this.tablist[this.tabIndex].loadtext="上拉加载更多";
				//this.tablist[this.tabIndex].loadtext="没有更多数据了";
			},
			// tabbar点击事件
			tabtap(index){
				this.tabIndex=index;
			},
			async likeOrTread(data){
				await giveLike(data) 
			},
			opendDetail(item){
				uni.navigateTo({
					url: '../../pages/detail/detail?id='+item.id,
				});
			}
		}
	}
</script>

<style>
	page{
		/* background-color: #F9F9F9; */
	}

</style>
