<template>
	<view class="wrap-new">
		<!-- 自定义导航栏 -->

		<news-nav-bar :tabBars="tabBars" :tabIndex="tabIndex" @change-tab="changeTab">
		</news-nav-bar>
		<tui-fab bgColor="#FFE933" :width="98" :height="98" :bottom="150" :right="50" @click="publish"></tui-fab>
		<view class="uni-tab-bar">
			<swiper class="swiper-box" :style="{height:swiperheight+'px'}" :current="tabIndex" @change="tabChange">
				<!-- 话题 -->
				<swiper-item>
					<scroll-view scroll-y class="list">
						<!-- 搜索框 -->
						<view class="search-input">
							<input class="uni-input" 
								confirm-type="search" 
								@confirm="searchTitle"
								@input="searchTitle"
								placeholder-class="icon iconfont icon-sousuo topic-search" placeholder="搜索内容" />
						</view>
						<!-- 轮播图 -->
						<swiper class="topic-swiper" :indicator-dots="true" :autoplay="true" :interval="3000" circular :duration="1000">
							<block v-for="(item,index) in topic.swiper" :key="index">
								<swiper-item>
									<image :src="item.src" mode="widthFix" lazy-load></image>
								</swiper-item>
							</block>
						</swiper>
						<!-- 热门分类 -->
						<topic-nav :nav="topic.nav"></topic-nav>
						<!-- 最近更新 -->
						<view class="topic-new">
							<view>最近更新</view>
							<block v-for="(item,index) in topic.list" :key="index">
								<topic-list :item="item" :index="index"></topic-list>
							</block>
						</view>
					</scroll-view>
				</swiper-item>
				<!-- 关注 -->
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower="loadmore()" style="margin-top: 10upx;">
						<view v-for="(item,index) in guanzhu.list" :key="index">
							<index-list 
								@opendDetail="opendDetail"
								@likeOrTread="likeOrTread" :item="item" :userInfo="userInfo" :index="index"></index-list>
						</view>
						<no-thing v-if="guanzhu.list.length==0"></no-thing>
						<!-- 上拉加载 -->
						<load-more :loadtext="guanzhu.loadtext"></load-more>
					</scroll-view>
				</swiper-item>

			
			
			</swiper>
		</view>


	</view>
</template>

<script>
	import newsNavBar from "../../components/news/news-nav-bar.vue";
	import commonList from "../../components/common/common-list.vue";
	import indexList from "../../components/index/index-list.vue";
	import loadMore from "../../components/common/load-more.vue";
	import topicNav from "../../components/news/topic-nav.vue";
	import topicList from "../../components/news/topic-list.vue";
	import noThing from '@/components/common/no-thing.vue'
	import {getTopicTitleList, getTopicList} from '@/api/news.js'
	import {giveLike} from '@/api/common.js'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			newsNavBar,
			commonList,
			loadMore,
			topicNav,
			topicList,
			indexList,
			noThing
		},
		computed: {
			...mapState(['userInfo'])
		},
		data() {
			return {
				swiperheight: 500,
				tabIndex: 0,
				tabBars: [
					{
						name: "话题",
						id: "topic"
					},{
						name: "关注",
						id: "guanzhu"
					}
				],
				guanzhu: {
					loadtext: "",
					page: 1,
					list: []
				},
				timer:undefined,
				topic: {
					swiper: [{
							src: "../../static/demo/banner1.jpg"
						},
						{
							src: "../../static/demo/banner2.jpg"
						},
						{
							src: "../../static/demo/banner3.jpg"
						},
					],
					nav: [{
							name: "最新"
						},
						{
							name: "游戏"
						},
						{
							name: "打卡"
						},
						{
							name: "韩府"
						},
						{
							name: "二手"
						},
						{
							name: "周边"
						},
					],
					list: []
				}
			};
		},
		onShow() {
			if (this.userInfo.id && this.guanzhu.list.length == 0) {
				this.requestData()
				this.guanzhu.loadtext = ""
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					let height = res.windowHeight - uni.upx2px(100)
					this.swiperheight = height;
				}
			});
			this.initTopicTitle()
			if (this.userInfo.id) {
				this.requestData()
			} else {
				this.guanzhu.loadtext = "你还未登录呢!"
			}
		},
		methods: {
			async initData() {

			},
			publish(){
				this.$http.href('../add-title/add-title')
			},
			opendDetail(item){
				uni.navigateTo({
					url: '../../pages/detail/detail?id='+item.id,
				});
			},
			async searchTitle(event){
				if(event.target.value==''){
					return
				}
				clearInterval(this.timer)
				let key = event.target.value
				if(event.type=="input"){
					this.timer = setTimeout(()=>{
						this.initTopicTitle(1,key)
					},500)
				}
				if(event.type=="confirm"){
					this.initTopicTitle(1,key)
				}

			},
			async initTopicTitle(page=1,search='') {
				
				let {items} = await getTopicTitleList(page,search)
				if(!items){
					return
				}
				this.topic.list = items.map((item) => {
					return {
						titlePic: item.titlePic,
						title: item.title,
						desc: item.description,
						total: item.total,
						todaynum: 10,
						id:item.id
					}
				})
			},
			async requestData(GoPage) {
				let currentPage = GoPage || this.guanzhu.page;
				let data;
				try {
					data = await getTopicList(currentPage)
				} catch (e) {
					console.log(e)
					return
				}
				if(data==null){
					this.guanzhu.loadtext = "没有更多数据了";
					return
				}
				let {
					page,
					items
				} = data
				if (items && items.length === 0) {
					this.guanzhu.page = page
					this.guanzhu.loadtext = "没有更多数据了";
					return
				}
				this.guanzhu.page = page
				this.guanzhu.list = this.guanzhu.list.concat(items)
				if (items && items.length < 10) {
					this.guanzhu.loadtext = "没有更多数据了";
				}
			},
			async likeOrTread(data) {
				await giveLike(data)
			},
			// 点击切换
			changeTab(index) {
				this.tabIndex = index;
			},
			// 滑动事件
			tabChange(e) {
				this.tabIndex = e.detail.current;
			},
			// 上拉加载
			loadmore() {
				console.log(this.guanzhu)
				if (this.guanzhu.loadtext != "") {
					return;
				}
				// 修改状态
				this.guanzhu.loadtext = "加载中...";
				this.requestData(this.guanzhu.page + 1)
				// 获取数据
				// this.guanzhu.loadtext="没有更多数据了";
			}

		}
	}
</script>

<style scoped>
	.head {
		height: 100upx;
		width: 100vw;
	}

	.wrap-new {
		background-color: #F9F9F9;
	}

	.search-input {
		padding: 20upx;
	}

	.search-input>input {
		background: #F4F4F4;
		border-radius: 10upx;
	}

	.topic-search {
		display: flex;
		justify-content: center;
		font-size: 27upx;
	}

	.topic-swiper {
		padding: 0 20upx 20upx 20upx;
	}

	.topic-swiper image {
		width: 100%;
		border-radius: 10upx;
	}

	.topic-new {
		padding: 20upx;
	}

	.topic-new>view:first-child {
		padding-bottom: 5upx;
		font-size: 32upx;
	}
</style>
