<template>
	<view>
		<uni-swipe-action>
			<template v-for="(item ,index) in list">
				<uni-swipe-action-item :options="options" :key="index" @onClick="onClick(item,index)">
					<history-list :item="item" :key="index" @gotoTopicInfo="gotoTopicInfo"></history-list>
				</uni-swipe-action-item>
			</template>

		</uni-swipe-action>

		<load-more :loadtext="loadtext"></load-more>
	</view>
</template>

<script>
	import historyList from '../../components/history-list/history-list.vue'
	import loadMore from "../../components/common/load-more.vue";
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import {getTopicCollect, deleteCollect} from '@/api/user-collect.js'
	import {
		mapState
	} from 'vuex'
	export default {
		components: {
			historyList,
			loadMore,
			uniSwipeAction,
			uniSwipeActionItem
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
					let data =await getTopicCollect()
					if( data.length==0){
						this.loadtext = '收藏为空'
						return
					}
					this.list = data

				}
			},
			onClick(item, index) {
				deleteCollect(item.id)
				this.list.splice(index, 1)
			},
			gotoTopicInfo(item) {
				uni.navigateTo({
					url: '../../pages/detail/detail?id=' + item.tid,
				});
			}
		}
	}
</script>

<style>

</style>
