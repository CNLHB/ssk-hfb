<template>
	<view>
		<uni-swipe-action>
			<template v-for="(item ,index) in list">
				<uni-swipe-action-item :options="options" :key="index" @onClick="onClick(item,index)">
					<history-list :item="item" :key="index" @gotoTopicInfo="gotoTopicInfo(item)">
					</history-list>
				</uni-swipe-action-item>
			</template>
			
		</uni-swipe-action>
		<no-thing v-if="list.length==0"></no-thing>
<!-- 		<view class="" @tap="showDitu">
			clikc
		</view> -->
		<load-more :loadtext="loadtext"></load-more>
	</view>
</template>

<script>
	import historyList from '../../components/history-list/history-list.vue'
	import loadMore from "../../components/common/load-more.vue";
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import {
		mapState
	} from 'vuex'
		import noThing from "../../components/common/no-thing.vue";
	import {getTopicHistory, deleteHistory} from '@/api/user-history.js'
	export default {
		components: {
			historyList,
			loadMore,
			uniSwipeAction,
			uniSwipeActionItem,
			noThing
		},
		computed: {
			...mapState(['userInfo'])
		},
		data() {
			return {
				list: [],
				loadtext: '',
				options: [
					// {
					//     text: '置顶',
					//     style: {
					//         backgroundColor: '#007aff'
					//     }
					// }, 
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			async initData() {
				if (this.userInfo.id) {
					let data = await getTopicHistory()
					if (data.length==0) {
						this.loadtext = '浏览历史为空'
					}
					 this.list = data
				}
			},
			onClick(item, index) {
				this.$http.setLoading(false);
				deleteHistory(item.id)
				this.list.splice(index, 1)
			},
			gotoTopicInfo(item) {
				uni.navigateTo({
					url: '../../pages/detail/detail?id=' + item.tid,
				});
			},
			showDitu(){
				console.log(88)
				uni.getLocation({
				    type: 'wgs84',
				    success: function (res) {
				        console.log('当前位置的经度：' + res.longitude);
				        console.log('当前位置的纬度：' + res.latitude);
				    },
					fail(e){
							console.log(e)
					},
					complete(){
						
					}
				});
				// uni.chooseLocation({
				//     success: function (res) {
				//         console.log('位置名称：' + res.name);
				//         console.log('详细地址：' + res.address);
				//         console.log('纬度：' + res.latitude);
				//         console.log('经度：' + res.longitude);
				//     }
				// });
			}
		}
	}
</script>

<style>

</style>
