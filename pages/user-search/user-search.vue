<template>
	<view>
		<!-- 图文列表 -->
		<block v-for="(item,index1) in list" :key="index1">
			<user-list 
			@attActive="attActive"
			:item="item" :index="index1"></user-list>
		</block>
	</view>
</template>

<script>
	import userList from "../../components/user-list/user-list.vue";
	import {mapState} from 'vuex'
		import {userAtt, searchUserList} from '@/api/user-search.js'
	export default {
		comments: {
			userList
		},
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				issearch: false,
				loadtext: "",
				list: [
						],
				searchtext: "",
				page: 0,
		
			};
		},
		// 监听原生标题导航按钮点击事件(取消按钮)
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				uni.navigateBack({
					delta: 2
				});
			}
		},
		// 监听搜索框文本变化
		onNavigationBarSearchInputChanged(e) {
			this.searchtext = e.text;
		},
		// 监听点击搜索按钮事件
		onNavigationBarSearchInputConfirmed(e) {
			if (e.text) {
				this.getdata(e.text);
				console.log(e.text)
			}
		},
		// 监听页面触底事件
		onReachBottom() {
			this.loadmore();
		},
		// 监听下拉刷新
		onPullDownRefresh() {
			this.getdata();
			uni.stopPullDownRefresh();
		},
		methods: {
			async attActive(index,item){
				let data = await userAtt({
					fromId: this.userInfo.id,
					toId: item.id
				})
				if(data&&data.code==0){
					this.list[index].isguanzhu = !this.list[index].isguanzhu
				}
			},
			// 搜索事件
			async getdata(text) {
				// 请求服务器 post keyword:this.searchtext
				let data = await searchUserList(text)
				this.list = data
				console.log(data)

			},
			// 上拉加载
			loadmore() {
				if (this.loadtext != "上拉加载更多") {
					return;
				}
				// 修改状态
				this.loadtext = "加载中...";
				// 获取数据
				this.getdata()

			}
		},
	}
</script>

<style>

</style>
