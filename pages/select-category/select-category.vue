<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="item in flist" :key="item.id" class="f-item b-b"
				
				:class="{active: item.id === currentId}" @click="tabtap(item)">
				{{item.title}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<template v-for="item in tlist" >
				<topic-list  
					:item="item" :key="item.id"></topic-list>
			</template>
			
		</scroll-view>
	</view>
</template>

<script>
	import topicList from "../../components/select-title-list/select-title-list.vue";
	import {getTopicTitleClass,getTopicTitleList} from '@/api/search-title.js'
	import {getCategory} from '@/api/add-input.js'
	import {mapMutations} from 'vuex'
	export default {
		components:{
			topicList
		},
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				flist: [],
				slist: [],
				tlist: [],
			}
		},
		onLoad(data){
			this.loadData(data.topic);
		},
		methods: {
			...mapMutations(['addCategory']),
			async loadData(topic){
				this.loadnavBars(topic)
				this.loadnItems()
			},
			async loadnavBars(topic){
				if(topic){
					 let data = await getCategory()
					this.flist = data.map(item=>{
						return {
							id:item.id,
							title:item.name
						}
					})
				}else{
					this.flist = await getTopicTitleClass()
				}
			},
			async loadnItems(cid=''){
				let {items, page:newPage} = await getTopicTitleList(1,cid)
				this.tlist = items
			},
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				
				this.loadnItems(item.id)
				this.currentId = item.id;
				let index = this.slist.findIndex(sitem=>sitem.cid === item.id);
				if(this.slist[index]){
					this.tabScrollTop = this.slist[index].top;
				}
				this.addCategory(item)
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].cid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(sid, tid){
				console.log(sid ,tid)
			},
			backSelTitle(item){
				this.addselTitle(item)
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200upx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100upx;
		font-size: 28upx;
		color: #606266;
		position: relative;
		&.active{
			color: #fa436a;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36upx;
				width: 8upx;
				background-color: #fa436a;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20upx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70upx;
		padding-top: 8upx;
		font-size: 28upx;
		color:#303133;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176upx;
		font-size: 26upx;
		color: #666;
		padding-bottom: 20upx;
		
		image{
			width: 140upx;
			height: 140upx;
		}
	}
</style>
