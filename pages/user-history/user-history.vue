<template>
	<view>
		<template v-for="(item ,index) in list" >
				<history-list :item="item" :key="index"></history-list>
		</template>
		
	</view>
</template>

<script>
	import historyList from '../../components/history-list/history-list.vue'
	export default {
		components: {historyList},
		data() {
			return {
				list:[]
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			async initData(){
				let data = await this.$http.get("topic/history")
				if(data&&data.length){
					this.list = data.reverse()
				}else{
					this.list = []
				}
				
				console.log(data)
			},
			gotoTopicInfo(){
				console.log(88)
			}
		}
	}
</script>

<style>

</style>
