<template>
	<view class="body">
		<!-- tab切换 -->
		<swiper-tab-head 
		:tabBars="tabBars" 
		:tabIndex="tabIndex"
		@tabtap="tabtap"
		scrollItemStyle="width:33%;"
		scrollStyle="border-bottom:0;">
		</swiper-tab-head>
		
		<!-- 好友列表 -->
		<!-- <block v-for="(item,index) in list" :key="index">
			<user-list :item="item" :index="index"></user-list>
		</block> -->
		
		<view class="uni-tab-bar">
		<swiper class="swiper-box" 
		:style="{height:swiperheight+'px'}" 
		:current="tabIndex"
		@change="tabChange">
			<swiper-item v-for="(items,index) in newslist" :key="index"> 
				<scroll-view scroll-y class="list" @scrolltolower="loadmore(index)">
					<template v-if="items.list.length>0">
						<!-- 图文列表 -->
						<block v-for="(item,index1) in items.list" :key="index1">
							<user-list 
							@attActive="attActive"
							:item="item" :index="index1"></user-list>
						</block>
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
	import userList from "../../components/user-list/user-list.vue";
	import loadMore from "../../components/common/load-more.vue";
	import noThing from "../../components/common/no-thing.vue";
	import {userAtt, getUserAttList, getUserFansList,getUserEachList} from '@/api/user-list.js'
	import {mapState} from 'vuex'
	export default {
		components:{
			swiperTabHead,
			userList,
			loadMore,
			noThing
		},
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				swiperheight:500,
				tabIndex:0,
				tabBars:[
					{ name:"互关",id:"huguan",num:0 },
					{ name:"关注",id:"guanzhu",num:0 },
					{ name:"粉丝",id:"fensi",num:0 },
				],
				
				newslist:[
					{
						loadtext:"",
						list:[

						]
					},
					{
						loadtext:"",
						list:[

						]
					},
					{
						loadtext:"",
						list:[
		
						]
					}
				]
				
			};
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res)=> {
					let height=res.windowHeight-uni.upx2px(100)
					this.swiperheight=height;
				}
			});
			this.initData()
		},
		// 监听导航按钮事件
		onNavigationBarButtonTap(e) {
			if(e.index==0){
				uni.navigateBack({
					delta: 1
				});
			}
		},
		methods:{
			loadmore(index){
				// if(this.newslist[index].loadtext!="上拉加载更多"){ return; }
				// 修改状态
				this.newslist[index].loadtext="加载中...";
				// 获取数据
				// this.newslist[index].loadtext="没有更多数据了";
			},
			// tabbar点击事件
			tabtap(index){
				this.tabIndex=index;
			},
			// 滑动事件
			tabChange(e){
				this.tabIndex=e.detail.current;
			},
			async attActive(index,item){
				let data = await userAtt({
					fromId: this.userInfo.id,
					toId: item.id
				})
				if(data&&data.code==0){
					this.initData()
				}
			},
			async initData(){
				let  attData = await getUserAttList()
				let  eachData = await getUserEachList()
				let  fansData =await getUserFansList(eachData)
				this.tabBars[0].num = eachData.length
				this.tabBars[1].num = attData.length
				this.tabBars[2].num = fansData.length
				this.newslist[0].list = eachData
				this.newslist[1].list = attData
				this.newslist[2].list = fansData
			}
		}
	}
</script>

<style>

</style>
