<template>
	<view class="index-icontainer">
		<!-- #ifdef MP-WEIXIN -->
		<view class="search-wrp">
			<view class="iconfont icon-icon_A font-x" @tap="checkIn"></view>
			<view class="iconfont icon-sousuo serach">
			</view>
			<input class="uni-input" type="text" placeholder="韩府帮" @focus="searchInfo" />
			<view class="iconfont icon-fabiao font-x" @tap="publish"></view>
		</view>
		<!-- #endif -->


		<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap">
		</swiper-tab-head>

		<view class="uni-tab-bar">
			<swiper class="swiper-box" :style="{height:swiperheight+'px'}" :current="tabIndex" @change="tabChange">
				<swiper-item v-for="(items,index) in newslist" :key="index">
					<scroll-view scroll-y class="list" @scrolltolower="loadmore(index)">
						<!-- 图文列表 -->
						<template v-if="items.list.length>0">
							<block v-for="(item,index1) in items.list" :key="index1">
									<index-list 
									@likeOrTread="likeOrTread" 
									:item="item" 
									:userInfo="userInfo"
									:index="index1"></index-list>
								</block>
							 <load-more :loadtext="items.loadtext"></load-more>
						</template>
						<template v-if="shoNo">
							<!-- 无内容默认 -->
							<no-thing></no-thing>
						</template>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>

	</view>
</template>


<script>
	import indexList from "../../components/index/index-list.vue";
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import loadMore from "../../components/common/load-more.vue";
	import noThing from "../../components/common/no-thing.vue";
	import {mapState, mapMutations} from "vuex"
	export default {
		components: {
			indexList,
			swiperTabHead,
			loadMore,
			noThing
		},
		data() {
			return {
				swiperheight: 500,
				tabIndex: 1,
				shoNo:false,
				tabBars: [
					{
						name: "推荐",
						id: "tuijian",
						page: 1
					},
					{
						name: "韩府",
						id: "hanfu",
						page: 1
					},
					{
						name: "娱乐",
						id: "yule",
						page: 1
					},
					{
						name: "二手",
						id: "ershou",
						page: 1
					},
					{
						name: "周边",
						id: "zhoubian",
						page: 1
					},
				],
				newslist: [
					{
						loadtext: "上拉加载更多",
						id: "tuijian",
						list: [
						]
					},
					{
						loadtext: "上拉加载更多",
						id: "hanfu",
						list: [
						]
					},
					{
						loadtext: "上拉加载更多",
						id: "yule",
						list: []
					},
					{
						loadtext: "上拉加载更多",
						id: "ershou",
						list: []
					},
					{
						loadtext: "上拉加载更多",
						id: "zhoubian",
						list: []
					}
				],


			}
		},
		 onLoad() {
			uni.getSystemInfo({
				success: (res) => {
					let height = res.windowHeight - uni.upx2px(100)
					this.swiperheight = height;
				}
			});
			 this.requestData()
			
		},
		// 监听搜索框点击事件
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: '../search/search',
			});
		},
		// 监听原生标题导航按钮点击事件
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 1:
					// 打开发布页面
					uni.navigateTo({
						url: '../add-input/add-input',
					});
				case 0:
					uni.showToast({
						title: '签到成功',
					});

					break;
			}
		},
		computed:{
		...mapState(['userInfo'])
		},
		methods: {
			async requestData(GoPage,Gotype){
				let currentPage = GoPage || this.tabBars[this.tabIndex].page;
				let type = Gotype || this.tabBars[this.tabIndex].id;
				let data;
				try{

					data = await this.$http.get(`/topic/page?page=${currentPage}&type=${type}&rows=10`)
				}catch(e){
					console.log(e)
					return 
				}
				
				let {page,items} = data
				if(items&&items.length ===0){
					this.newslist[this.tabIndex].loadtext="没有更多数据了";
					return 
				}
				items.forEach((item)=>{
					if(item.images!=''){
						item.images = item.images.split(",");
					}else{
						item.images =[]
					}
					
				})
				console.log(items);
				this.tabBars[this.tabIndex].page=page
				
				this.newslist[this.tabIndex].list=this.newslist[this.tabIndex].list.concat(items)
				
			},
			async likeOrTread(data){
				await this.$http.post('/topic/active',data);
			},
			checkIn() {
				console.log("checkIn")
				uni.showToast({
					title: '签到成功',
				});
			},
			// 上拉加载
			publish() {
				console.log("publish")
				// 打开发布页面
				uni.navigateTo({
					url: '../add-input/add-input',
				})
			},
			searchInfo() {
				console.log("searchInfo")
				uni.navigateTo({
					url: '../search/search',
				});
			},

			loadmore(index) {
				if (this.newslist[index].loadtext != "上拉加载更多") {
					return;
				}
				// 修改状态
				this.newslist[index].loadtext = "加载中...";
				// 获取数据
				this.requestData(this.tabBars[this.tabIndex].page+1)
				
				
				
			},
			// tabbar点击事件
			tabtap(index) {
				this.tabIndex = index;
			},
			// 滑动事件
			tabChange(e) {
				this.tabIndex = e.detail.current;
				this.requestData(this.tabBars[this.tabIndex].page,this.tabBars[this.tabIndex].id)
			}
		},
	}
</script>

<style scoped>
	.search-wrp {
		display: flex;
		position: relative;
		background: #FFFFFF;
		justify-content: space-between;
		height: 80upx;
		align-items: center;
		padding: 8upx 16upx 0 16upx;
	}

	.index-icontainer {
		background-color: #F9F9F9;
	}

	.font-x {
		font-size: 22px;
	}

	.uni-input {
		background: #F9F9F9;
		text-align: center;
		margin-right: 10px;
		margin-left: 10px;
	}

	.serach {
		position: absolute;
		top: 10upx;
		left: 280upx;
		font-size: 20px;
	}
</style>
