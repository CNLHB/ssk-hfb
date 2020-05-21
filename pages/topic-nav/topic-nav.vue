<template>
	<view>
		
		<swiper-tab-head 
		:tabBars="tabBars" 
		:tabIndex="tabIndex"
		@tabtap="tabtap">
		</swiper-tab-head>
		
		<view class="uni-tab-bar">
		<swiper class="swiper-box" 
		:style="{height:swiperheight+'px'}" 
		:current="tabIndex"
		@change="tabChange">
			<swiper-item v-for="(items,index) in newslist" :key="index"> 
				<scroll-view scroll-y class="list" @scrolltolower="loadmore(index)">
					<template v-if="items.list.length>0">
						<!-- 话题列表 -->
						<view class="topic-view">
						<block v-for="(item,index1) in items.list" :key="index1">
							<topic-list :item="item" :index="index1"></topic-list>
						</block>	
						</view>
						<!-- 上拉加载 -->
						<load-more :loadtext="items.loadtext"></load-more>
					</template>
					<template v-else>
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
	import swiperTabHead from "../../components/index/swiper-tab-head.vue";
	import noThing from "../../components/common/no-thing.vue";
	import loadMore from "../../components/common/load-more.vue";
	import topicList from "../../components/news/topic-list.vue";
	export default {
		components:{
			swiperTabHead,
			noThing,
			loadMore,
			topicList
		},
		data() {
			return {
				swiperheight:500,
				tabIndex:0,
				tabBars:[
					{ name:"关注",id:"guanzhu" },
					{ name:"推荐",id:"tuijian" },
					{ name:"体育",id:"tiyu" 	  },
					{ name:"热点",id:"redian"  },
					{ name:"财经",id:"caijing" },
					{ name:"娱乐",id:"yule"    },
				],
				newslist:[
					{
						loadtext:"上拉加载更多",
						list:[
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							}
						]
					},
					{
						loadtext:"上拉加载更多",
						list:[
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							}
						]
					},
					{
						loadtext:"上拉加载更多",
						list:[
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							},
							{
								titlepic:"../../static/demo/topicpic/13.jpeg",
								title:"话题名称",
								desc:"我是话题描述",
								totalnum:50,
								todaynum:10
							}
						]
					},
					{
						loadtext:"上拉加载更多",
						list:[]
					},
					{
						loadtext:"上拉加载更多",
						list:[]
					},
					{
						loadtext:"上拉加载更多",
						list:[]
					}
				],
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res)=> {
					let height=res.windowHeight-uni.upx2px(100)
					this.swiperheight=height;
				}
			});
		},
		methods:{
			loadmore(index){
				if(this.newslist[index].loadtext!="上拉加载更多"){ return; }
				// 修改状态
				this.newslist[index].loadtext="加载中...";
				// 获取数据
				setTimeout(()=> {
					//获取完成
					let obj={
						titlepic:"../../static/demo/topicpic/13.jpeg",
						title:"话题名称",
						desc:"我是话题描述",
						totalnum:50,
						todaynum:10
					};
					this.newslist[index].list.push(obj);
					this.newslist[index].loadtext="上拉加载更多";
				}, 1000);
				// this.newslist[index].loadtext="没有更多数据了";
			},
			// tabbar点击事件
			tabtap(index){
				this.tabIndex=index;
			},
			// 滑动事件
			tabChange(e){
				this.tabIndex=e.detail.current;
			}
		}
	}
</script>

<style>
.topic-view{
	padding: 0 20upx;
}
</style>
