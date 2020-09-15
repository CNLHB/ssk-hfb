<template>
	<view class="item">
		{{item.value}}
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => ({
					value: 1
				})
			}
		},
	}
</script>

<style>
</style>
