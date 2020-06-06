<template>
	<view class="container-comm">
		<template v-for="item in list">
			<view class="com-item" @tap="openDatail(item)" :index="item.id">
				<user-comment :item="item"></user-comment>
			</view>
		</template>
		<no-thing v-if="list.length==0"></no-thing>
	</view>
</template>

<script>
	import userComment from '@/components/user-comment/user-comment.vue'
	import noThing from '@/components/common/no-thing.vue'
	import {getUserComm} from '@/api/user-comment.js'
	export default {
		components: {
			userComment,
			noThing
		},
		data() {
			return {
				list: [
				]
			}
		},
		async onLoad() {
			let list = await getUserComm()
			this.list = list
		},
		methods: {
			openDatail(item) {
				uni.navigateTo({
					url: "../detail/detail?id=" + item.id
				})
			}
		}
	}
</script>

<style scoped>
	.container-comm {
		background-color: #FFFFFF;
		height: 100vh;
	}

	.com-item {
		padding-bottom: 20upx;
		background-color: #f1f1f1;
	}
</style>
