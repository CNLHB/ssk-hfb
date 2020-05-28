<template>
	<view>
		<template v-for="(item ,index) in list" >
				<history-list :item="item" :key="index"></history-list>
		</template>
		<load-more :loadtext="loadtext"></load-more>
	</view>
</template>

<script>
	import historyList from '../../components/history-list/history-list.vue'
		import loadMore from "../../components/common/load-more.vue";
	import {mapState} from 'vuex'
	export default {
		components: {historyList,loadMore},
		computed:{
			...mapState(['userInfo'])
		},
		data() {
			return {
				list:[],
				loadtext:''
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
			gotoTopicInfo(){
				console.log(88)
			}
		}
	}
</script>

<style>

</style>
