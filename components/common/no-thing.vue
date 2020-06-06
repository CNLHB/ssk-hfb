<template>
	<view class="nothing u-f-ajc animated fadeIn">
		<image src="../../static/images/toast/img_nodata.png" 
		mode="widthFix"></image>
			<text>这里什么都没有哦~</text>
	</view>
</template>

<script>
</script>

<style>
	.nothing{
		background: #FFFFFF;
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.nothing image{
		width: 50%;
		margin-left: -36upx;
	}
</style>
