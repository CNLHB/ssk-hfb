<template>
	<view class="tag-sex icon iconfont"
	:class="[ugender==0?'icon-nan':'icon-nv']">
		{{age}}
	</view> 
</template>

<script>
	export default {
		props:{
			ugender:Number,
			age:Number
		}
	}
</script>

<style scoped>
.tag-sex{
	background: #007AFF;
	color: #FFFFFF;
	font-size: 23upx;
	padding: 5upx 10upx;
	margin-left: 10upx;
	border-radius:20upx;
	line-height: 22upx;
}
.icon-nv{
	background: #FF698D!important;
}
</style>
