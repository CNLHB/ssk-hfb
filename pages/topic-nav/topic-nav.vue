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
					// { name:"关注",id:"guanzhu" },
					// { name:"推荐",id:"tuijian" },
					// { name:"韩府",id:"hanfu" 	  },
					// { name:"娱乐",id:"yule"  },
					// { name:"二手",id:"ershou" },
					// { name:"周边",id:"zhoubian"    },
				],
				newslist:[
					{
						loadtext:"上拉加载更多",
						list:[
						
						]
					},
					{
						loadtext:"上拉加载更多",
						list:[
						
						]
					},
					{
						loadtext:"上拉加载更多",
						list:[
							
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
			this.initData(0)
		},
		methods:{
			async initData(index,cid){
				let tabBars = await  this.$http.get("topic/title/class")
				this.tabBars = tabBars.map((item)=>{
					return { name:item.title,id:item.id,page:1 }
				})
				await this.requestTopicTitle(index,1);

				
			},
			async requestTopicTitle(index, page=1, cid=''){
				let {items, page:newPage} = await this.$http.get(`topic/title?page=${page}&rows=10&cid=${cid}`)
				console.log(newPage)
				if(items.length == 0){
					this.tabBars[index].page = newPage
					this.newslist[index].loadtext="没有更多数据了";
					return
				}

				let newdata = items
				this.tabBars[index].page = newPage
				this.newslist[index].list = this.newslist[index].list.concat(newdata)
				this.newslist[index].loadtext="上拉加载更多";
				if(items.length < 10){
					this.newslist[index].loadtext="没有更多数据了";
				}
			},
			loadmore(index){
				if(this.newslist[index].loadtext!="上拉加载更多"){ return; }
				// 修改状态
				this.newslist[index].loadtext="加载中...";
				// 获取数据
				
				this.requestTopicTitle(index,this.tabBars[index].page+1,this.tabBars[index].id);
				// this.newslist[index].loadtext="没有更多数据了";
			},
			// tabbar点击事件
			tabtap(index){
				this.tabIndex=index;
				// this.requestTopicTitle(index,this.tabBars[index].page,this.tabBars[index].id);
				
			},
			// 滑动事件
			tabChange(e){
				this.tabIndex=e.detail.current;
				let index = this.tabIndex
				this.requestTopicTitle(index,this.tabBars[index].page,this.tabBars[index].id);
				console.log(this.tabBars[index])
			}
		}
	}
</script>

<style>
.topic-view{
	padding: 0 20upx;
}
</style>
