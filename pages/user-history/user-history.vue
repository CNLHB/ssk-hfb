<template>
	<view>
		<uni-swipe-action>
			<template v-for="(item ,index) in list" >
				<uni-swipe-action-item :options="options" :key="index" @onClick="onClick(item,index)" >
					<history-list :item="item" :key="index"></history-list>
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
	import {mapState} from 'vuex'
	export default {
		components: {historyList,loadMore,uniSwipeAction,uniSwipeActionItem},
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				list:[],
				loadtext:'',
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
			async initData(){
				if(this.userInfo.id){
					let data = await this.$http.get("topic/history")
					if(data&&data.length){
						this.list = data.reverse()
					}else{
						this.list = []
						this.loadtext= '浏览历史为空'
					}
				}
			},
			onClick(item,index) {
				this.$http.setLoading(false);
				this.$http.delete('topic/history',{
					cids: [item.id]
				},{
					"content-type":"application/x-www-form-urlencoded"
				});
				this.$http.setLoading(true);
				this.delChatList(index)
			
			},
			gotoTopicInfo(){
				console.log(88)
			}
		}
	}
</script>

<style>

</style>
