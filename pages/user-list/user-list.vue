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
				searchtext:'',
				cache:[],
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
		// 监听搜索框文本变化
		onNavigationBarSearchInputChanged(e){
			this.searchtext=e.text;
		},
		// 监听点击搜索按钮事件
		onNavigationBarSearchInputConfirmed(e){
			if(e.text){ 
				this.cache = this.newslist[this.tabIndex].list
				this.newslist[this.tabIndex].list = this.newslist[this.tabIndex].list.filter((item)=>{
					if(this.strSimilarity2Percent(item.username, e.text)>0){
						console.log(typeof this.strSimilarity2Percent(item.username, e.text))
						return true
					}else{
						return false
					}

				})
				}
		},
		// 监听导航按钮事件
		onNavigationBarButtonTap(e) {
			if(e.index==0){
				uni.navigateBack({
					delta: 1
				});
			}
		},
		watch:{
			'searchtext':function(searchtext,old){
				if(searchtext==''){
					this.newslist[this.tabIndex].list = this.cache 
				}

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
			},
			strSimilarity2Number: function (s, t) {
			     var n = s.length, m = t.length, d = [];
			     var i, j, s_i, t_j, cost;
			     if (n == 0) return m;
			     if (m == 0) return n;
			     for (i = 0; i <= n; i++) {
			         d[i] = [];
			         d[i][0] = i;
			     }
			     for (j = 0; j <= m; j++) {
			         d[0][j] = j;
			     }
			     for (i = 1; i <= n; i++) {
			         s_i = s.charAt(i - 1);
			         for (j = 1; j <= m; j++) {
			             t_j = t.charAt(j - 1);
			             if (s_i == t_j) {
			                 cost = 0;
			             } else {
			                 cost = 1;
			             }
			             d[i][j] = this.Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
			         }
			     }
			     return d[n][m];
			 },
			//两个字符串的相似程度，并返回相似度百分比
			 strSimilarity2Percent: function (s, t) {
			     var l = s.length > t.length ? s.length : t.length;
			     var d = this.strSimilarity2Number(s, t);
			     return (1 - d / l).toFixed(4);
			 },
			 Minimum: function (a, b, c) {
			     return a < b ? (a < c ? a : c) : (b < c ? b : c);
			 },
		}
	}
</script>

<style>

</style>
